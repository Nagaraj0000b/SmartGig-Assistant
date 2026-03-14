// for sentimental analysis

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

const analyzeSentiment = async (text) => {
  const prompt = `
You are an emotional intelligence engine for a gig worker companion app.

Analyze the following text spoken by a gig worker (Uber/Swiggy/Rapido driver) and return a JSON object with:
1. "mood" — one of: "happy", "neutral", "stressed", "frustrated", "tired", "excited"
2. "score" — a number from -1.0 (very negative) to 1.0 (very positive)
3. "summary" — one sentence describing how the worker is feeling
4. "suggestion" — one short, friendly, actionable tip for the worker based on their mood

Return ONLY valid JSON. No markdown, no explanation.

Text: "${text}"
  `;

  const result = await model.generateContent(prompt);
  const raw = result.response.text().trim();

  // Strip markdown code fences if Gemini wraps it
  const cleaned = raw.replace(/^```json\n?/, "").replace(/\n?```$/, "");
  return JSON.parse(cleaned);
};

module.exports = { analyzeSentiment };
