const router  = require("express").Router();
const multer  = require("multer");
const auth    = require("../middleware/auth");
const { transcribe, getContext, startChat, reply, replyText } = require("../controllers/chatController");

// Multer config — saves audio to temp uploads/ folder
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `audio-${Date.now()}.${ext}`);
  },
});
const upload = multer({ storage });

// POST /api/chat/start
// Start a new check-in session → returns AI greeting
router.post("/start", auth, startChat);

// POST /api/chat/reply
// Send voice reply → transcribe → sentiment → AI follow-up → advance flow
router.post("/reply", auth, upload.single("audio"), reply);

// POST /api/chat/reply-text
// Send text reply (for testing without mic) → sentiment → AI follow-up
router.post("/reply-text", auth, replyText);

// POST /api/chat/transcribe (legacy)
router.post("/transcribe", auth, upload.single("audio"), transcribe);

// GET /api/chat/context
router.get("/context", auth, getContext);

module.exports = router;
