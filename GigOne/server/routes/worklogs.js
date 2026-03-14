const router  = require("express").Router();
const auth    = require("../middleware/auth"); // protect these routes
const { getWorkLogs, addWorkLog } = require("../controllers/worklogsController");

// GET  /api/worklogs  →  get all work logs (protected)
router.get("/", auth, getWorkLogs);

// POST /api/worklogs  →  add a new work log (protected)
router.post("/", auth, addWorkLog);

module.exports = router;
