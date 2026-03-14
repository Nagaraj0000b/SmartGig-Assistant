const { transcribeAudio } = require("../services/groqService");
const { analyzeSentiment } = require("../services/geminiService");
const { getWeatherContext } = require("../services/weatherService");
const { getTraffic } = require("../services/trafficService");
const { generateGreeting, processChatTurn, getNextStep } = require("../services/conversationService");
const Conversation = require("../models/Conversation");
const fs = require("fs");

// ─── GET /api/chat/context?lat=...&lon=... ──────────────────
// Returns weather + traffic data for the user's location
const getContext = async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ message: "lat and lon are required" });
  }
  try {
    const [weather, traffic] = await Promise.all([
      getWeatherContext(lat, lon),
      getTraffic(lat, lon),
    ]);
    res.json({ weather, traffic });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── POST /api/chat/start ───────────────────────────────────
// Starts a new check-in session: creates a Conversation doc and returns greeting
const startChat = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch user name from DB
    const User = require("../models/User");
    const user = await User.findById(userId);
    const userName = user?.name || "buddy";

    // Generate greeting with user's name
    const greeting = await generateGreeting(userName);

    // Create a new conversation in DB
    const conversation = await Conversation.create({
      userId,
      step: "mood", // after greeting, we wait for mood reply
      messages: [{ role: "assistant", text: greeting }],
    });

    res.json({
      conversationId: conversation._id,
      step: "mood",
      reply: greeting,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── POST /api/chat/reply ───────────────────────────────────
// Receives audio → transcribes → analyzes sentiment → generates follow-up
// Follows the structured flow: mood → platform → earnings → hours → summary
const reply = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No audio file received" });
  }

  const filePath = req.file.path;
  const { conversationId, lat, lon } = req.body;

  if (!conversationId) {
    return res.status(400).json({ message: "conversationId is required" });
  }

  try {
    // 1. Find the conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    console.time("⏱️ Total Reply Time");

    // 2. Run Transcription and Weather Fetch in PARALLEL
    console.time("🟢 Groq + Weather Parallel");
    const [transcription, weather] = await Promise.all([
      transcribeAudio(filePath),
      (lat && lon) ? getWeatherContext(lat, lon).catch(err => {
        console.warn("Weather fetch failed:", err.message);
        return null;
      }) : Promise.resolve(null)
    ]);
    console.timeEnd("🟢 Groq + Weather Parallel");

    let context = weather ? { weather } : null;
    const currentStep = conversation.step;

    // 3. Generate AI reply, Sentiment, and Extracted Data in ONE single hit
    console.time("🤖 Unified AI Generation");
    const { sentiment, reply: aiReply, extractedValue } = await processChatTurn(
      currentStep,
      transcription,
      conversation.messages, // pass full history
      context // Pass the live weather context
    );
    console.timeEnd("🤖 Unified AI Generation");

    // 4. Save user message to conversation (now that we have the fused sentiment)
    conversation.messages.push({
      role: "user",
      text: transcription,
      sentiment,
    });
    console.timeEnd("⏱️ Total Reply Time");

    // 6. Save extracted data if any
    if (extractedValue !== null) {
      const stepToField = {
        platform: "platform",
        earnings: "earnings",
        hours: "hours",
      };
      const field = stepToField[currentStep];
      if (field) {
        conversation.extractedData = conversation.extractedData || {};
        conversation.extractedData[field] = extractedValue;
      }
    }

    // 7. Save AI reply to conversation
    conversation.messages.push({
      role: "assistant",
      text: aiReply,
    });

    // 8. Advance to next step
    const nextStep = getNextStep(currentStep);
    conversation.step = nextStep;
    await conversation.save();

    // 9. Return response to frontend
    res.json({
      conversationId: conversation._id,
      transcription,
      sentiment,
      reply: aiReply,
      step: nextStep,
      extractedData: conversation.extractedData,
      isComplete: nextStep === "done",
    });
  } catch (err) {
    console.error("🚨 CHAT CONTROLLER REPLAY ERROR:", err);
    res.status(500).json({ message: err.message, stack: err.stack });
  } finally {
    fs.unlink(filePath, () => {}); // cleanup temp audio file
  }
};

// ─── POST /api/chat/reply-text ──────────────────────────────
// Same as /reply but accepts text instead of audio (for testing)
const replyText = async (req, res) => {
  const { conversationId, text } = req.body;

  if (!conversationId || !text) {
    return res.status(400).json({ message: "conversationId and text are required" });
  }

  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Analyze sentiment
    const sentiment = await analyzeSentiment(text);

    // Save user message
    conversation.messages.push({ role: "user", text, sentiment });

    // Generate step-aware reply
    const currentStep = conversation.step;
    const { reply: aiReply, extractedValue } = await generateReply(
      currentStep, text, sentiment, conversation.messages
    );

    // Save extracted data
    if (extractedValue !== null) {
      const field = { platform: "platform", earnings: "earnings", hours: "hours" }[currentStep];
      if (field) {
        conversation.extractedData = conversation.extractedData || {};
        conversation.extractedData[field] = extractedValue;
      }
    }

    // Save AI reply + advance step
    conversation.messages.push({ role: "assistant", text: aiReply });
    const nextStep = getNextStep(currentStep);
    conversation.step = nextStep;
    await conversation.save();

    res.json({
      conversationId: conversation._id,
      transcription: text,
      sentiment,
      reply: aiReply,
      step: nextStep,
      extractedData: conversation.extractedData,
      isComplete: nextStep === "done",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── POST /api/chat/transcribe (legacy — kept for backward compat) ──
const transcribe = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No audio file received" });
  }
  const filePath = req.file.path;
  try {
    const transcription = await transcribeAudio(filePath);
    const sentiment = await analyzeSentiment(transcription);
    res.json({ transcription, sentiment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    fs.unlink(filePath, () => {});
  }
};

module.exports = { transcribe, getContext, startChat, reply, replyText };
