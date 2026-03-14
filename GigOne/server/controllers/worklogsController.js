const WorkLog = require("../models/WorkLog"); // the worklogs DB model

// GET /api/worklogs  →  fetch all work logs for this user
const getWorkLogs = async (req, res) => {
  try {
    // find only THIS user's logs, newest first
    const logs = await WorkLog.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(logs); // send array to frontend
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/worklogs  →  add a new work log entry
const addWorkLog = async (req, res) => {
  const { platform, hours, date, notes } = req.body; // data from frontend
  try {
    // userId from token, not body (secure)
    const log = await WorkLog.create({
      userId: req.user.userId,
      platform,
      hours,
      date,
      notes,
    });
    res.status(201).json(log); // 201 = Created
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getWorkLogs, addWorkLog }; // expose to routes
