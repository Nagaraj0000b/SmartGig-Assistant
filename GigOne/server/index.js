const express   = require("express");
const cors      = require("cors");
const dotenv    = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();  // load .env variables
connectDB();      // connect to MongoDB

const app = express();

app.use(cors());           // allow frontend to call this API
app.use(express.json());   // parse incoming JSON requests

// Initialize Passport
const passport = require("passport");
require("./config/passport"); // Load Google Strategy configuration
app.use(passport.initialize());

// Mount all routes
app.use("/api/auth",     require("./routes/auth"));      // /api/auth/register, /api/auth/login
app.use("/api/earnings", require("./routes/earnings"));  // /api/earnings
app.use("/api/worklogs", require("./routes/worklogs"));  // /api/worklogs
app.use("/api/chat", require("./routes/chat")); // Voice chat route


// Health check
app.get("/", (req, res) => {
  res.json({ message: "GigOne API is running 🚀" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
