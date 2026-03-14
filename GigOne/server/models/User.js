const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  passwordHash: { type: String }, // Optional for Google Auth / Legacy users
  googleId:     { type: String }, // NEW: Track users who sign up via Google
  role:         { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
