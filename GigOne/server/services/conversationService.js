// Step-aware conversational AI engine
// Guides the worker through a structured check-in flow:
// greeting → mood → platform → earnings → hours → summary

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

// ─── Step definitions ──────────────────────────────────────────
// Each step has a prompt goal and what data to extract from the reply

const STEP_CONFIG = {
  greeting: {
    goal: "Greet the worker warmly. Ask how their day was. Be casual and friendly.",
    nextStep: "mood",
    extract: null, // nothing to extract yet
  },
  mood: {
    goal: "The worker just told you about their day. Acknowledge their feelings based on the sentiment. Then ask which platform they worked on today (Uber, Swiggy, Rapido, etc).",
    nextStep: "platform",
    extract: null,
  },
  platform: {
    goal: "The worker mentioned their platform. Acknowledge it, then ask how much they earned today.",
    nextStep: "earnings",
    extract: "platform", // extract platform name
  },
  earnings: {
    goal: "The worker told you their earnings. React appropriately (celebrate if good, encourage if low). Then ask how many hours they worked.",
    nextStep: "hours",
    extract: "earnings", // extract earnings amount
  },
  hours: {
    goal: "The worker told you their hours. Now wrap up — give a brief summary of their day and one smart suggestion for tomorrow (consider weather/traffic if available).",
    nextStep: "summary",
    extract: "hours", // extract hours worked
  },
  summary: {
    goal: "The check-in is complete. Give a motivational closing message. Keep it short and sweet.",
    nextStep: "done",
    extract: null,
  },
};

/**
 * Generate a greeting message to start a new check-in session.
 * Called when user first opens the chat or starts a new session.
 *
 * @param {object} [context] - Optional { weather, traffic } data
 * @returns {Promise<string>} - Opening greeting text
 */
const generateGreeting = async (userName = "buddy", context = null) => {
  let contextBlock = "";
  if (context?.weather?.current) {
    const w = context.weather.current;
    contextBlock = `\nCurrent weather: ${w.condition}, ${w.temp}°C.`;
  }

  const prompt = `
You are an AI companion for Indian gig economy workers.
Personality: warm, supportive, casual Hinglish (Hindi + English mix).
${contextBlock}

The worker's name is "${userName}".
Generate a SHORT greeting (1-2 sentences) to start a daily check-in.
Use their name naturally. Ask how their day was. Be warm and natural.

CRITICAL RULES:
- ALWAYS use secular, universally inclusive greetings (e.g., "Hello", "Hi", "Hey", "Namaste", "Adab").
- NEVER use religion-specific greetings (like "Ram Ram", "Jai Shri Ram", "Assalamu Alaikum", etc.) to guarantee the app is welcoming to all Indians.
- Do NOT use any emojis.
- Return ONLY the greeting text, no quotes, no labels.
  `.trim();

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};

/**
 * Process the entire chat turn in ONE SINGLE Gemini API call.
 * This analyzes sentiment, generates the reply, and extracts data simultaneously 
 * via structured JSON output to completely eliminate multi-call latency.
 */
const processChatTurn = async (currentStep, userText, recentMessages = [], context = null) => {
  const stepConfig = STEP_CONFIG[currentStep];
  if (!stepConfig) {
    throw new Error(`Unknown conversation step: ${currentStep}`);
  }

  // Build conversation history
  const historyBlock = recentMessages
    .slice(-6)
    .map((m) => `${m.role === "user" ? "Worker" : "Assistant"}: ${m.text}`)
    .join("\n");

  // Build context block
  let contextBlock = "";
  if (context) {
    if (context.weather?.current) {
      const w = context.weather.current;
      contextBlock += `\nWeather: ${w.condition}, ${w.temp}°C, feels like ${w.feels_like}°C.`;
    }
    if (context.weather?.tomorrow) {
      const t = context.weather.tomorrow;
      contextBlock += `\nTomorrow's weather: ${t.condition}, ${t.temp}°C.`;
    }
    if (context.traffic) {
      const t = context.traffic;
      contextBlock += `\nTraffic: ${t.traffic_level} (${t.congestion_percent}% congestion).`;
    }
  }

  const prompt = `
You are an AI companion for Indian gig economy workers.
Personality:
- Warm, supportive, like a trusted friend
- Casual Hinglish (Hindi + English mix) — short, natural sentences
- Keep replies SHORT — 1-2 sentences max
- Do NOT use any emojis under any circumstances

Context:
${contextBlock}

Conversation so far:
${historyBlock}

Worker just said: "${userText}"

YOUR GOAL FOR THIS REPLY: ${stepConfig.goal}
${stepConfig.extract ? `\nYou also need to extract: "${stepConfig.extract}" from the worker's text.` : ''}

Analyze the text and return ONLY a valid JSON object matching this exact schema:
{
  "sentiment": {
    "mood": "happy|neutral|stressed|frustrated|tired|excited",
    "score": <number from -1.0 to 1.0>,
    "summary": "1 short sentence about their emotion",
    "suggestion": "1 short helpful tip"
  },
  "reply": "Your Hinglish response to the worker",
  "extractedValue": <extracted ${stepConfig.extract || 'null'} as a number or string, or null if not found/needed>
}
Do NOT include any markdown code blocks, backticks, or other text.
  `.trim();

  console.time("⚡ Unified Gemini Call");
  const result = await model.generateContent(prompt);
  let raw = result.response.text().trim();
  console.timeEnd("⚡ Unified Gemini Call");

  // Strip possible markdown
  if (raw.startsWith('\`\`\`json')) {
    raw = raw.replace('\`\`\`json', '').replace('\`\`\`', '').trim();
  } else if (raw.startsWith('\`\`\`')) {
    raw = raw.replace('\`\`\`', '').replace('\`\`\`', '').trim();
  }

  try {
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    console.error("JSON parse error from Gemini:", err, raw);
    return {
      sentiment: { mood: "neutral", score: 0 },
      reply: "Got it.",
      extractedValue: null
    };
  }
};

/**
 * Get the next step after the current one.
 */
const getNextStep = (currentStep) => {
  return STEP_CONFIG[currentStep]?.nextStep || "done";
};

module.exports = { generateGreeting, processChatTurn, getNextStep, STEP_CONFIG };
