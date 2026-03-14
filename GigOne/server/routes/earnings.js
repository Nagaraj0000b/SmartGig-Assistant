const router  = require("express").Router();
const auth    = require("../middleware/auth"); // protect these routes
const { getEarnings, addEarning } = require("../controllers/earningsController");

// GET  /api/earnings  →  get all earnings (protected)
router.get("/", auth, getEarnings);

// POST /api/earnings  →  add a new entry (protected)
router.post("/", auth, addEarning);

module.exports = router;
