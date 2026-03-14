const EarningsEntry = require("../models/EarningsEntry"); // the earnings DB model

// GET /api/earnings  →  fetch all entries for this user
const getEarnings = async (req, res) => {
  try {
    // find only THIS user's entries, newest first
    const entries = await EarningsEntry.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(entries); // send the array back to frontend
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/earnings  →  add a new earnings entry
const addEarning = async (req, res) => {
  const { platform, amount, hours, date } = req.body; // get data sent from frontend
  try {
    // userId comes from the JWT token (set by auth middleware) — not from the body
    const entry = await EarningsEntry.create({
      userId: req.user.userId, // auto-attached by auth middleware
      platform,
      amount,
      hours,
      date,
    });
    res.status(201).json(entry); // 201 = Created, send saved entry back
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getEarnings, addEarning }; // expose to routes
