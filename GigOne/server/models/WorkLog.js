const mongoose = require("mongoose");

const workLogSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  platform: { type: String, enum: ["Uber", "Swiggy", "Rapido", "Other"], required: true },
  hours:    { type: Number, required: true },
  date:     { type: Date, default: Date.now },
  notes:    { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("WorkLog", workLogSchema);
