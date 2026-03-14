const mongoose = require("mongoose");

const earningsSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  platform: { type: String, enum: ["Uber", "Swiggy", "Rapido", "Other"], required: true },
  amount:   { type: Number, required: true },
  hours:    { type: Number, required: true },
  date:     { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("EarningsEntry", earningsSchema);
