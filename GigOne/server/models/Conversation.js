const mongoose = require("mongoose");

// Each message in a conversation turn
const messageSchema = new mongoose.Schema({
  role:      { type: String, enum: ["user", "assistant"], required: true },
  text:      { type: String, required: true },
  sentiment: {
    mood:       String,   // "happy", "stressed", "tired", etc.
    score:      Number,   // -1.0 to 1.0
    summary:    String,
    suggestion: String,
  },
}, { timestamps: true });

// One conversation per user per check-in session
const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  // Tracks where the user is in the structured check-in flow
  step: {
    type: String,
    enum: ["greeting", "mood", "platform", "earnings", "hours", "summary", "done"],
    default: "greeting",
  },
  // Structured data extracted from user replies during the flow
  extractedData: {
    platform: String,     // "uber", "swiggy", "rapido"
    earnings: Number,     // e.g. 1200
    hours:    Number,     // e.g. 5
  },
  messages: [messageSchema],
}, { timestamps: true });

module.exports = mongoose.model("Conversation", conversationSchema);
