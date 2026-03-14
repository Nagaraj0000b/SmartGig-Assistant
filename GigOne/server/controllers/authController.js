const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const User   = require("../models/User");

// Helper: generate JWT
const generateToken = (user) => {
  // Contains the user's ID and role inside it
  // Expires in 7 days
  // Is signed with your secret key so it can't be faked
  return jwt.sign(
    { userId: user._id, role: user.role }, // payload inside the token
    process.env.JWT_SECRET,                // secret key from .env
    { expiresIn: "7d" }
  );
};

// POST /api/auth/register
const register = async (req, res) => {
  // 1. Check if email already exists → if yes, block it
  // 2. Hash the password (bcrypt turns "1234" into a scrambled string)
  // 3. Save the new user to MongoDB
  // 4. Return a token + basic user info

  const { name, email, password } = req.body; // get data from request
  try {
    const exists = await User.findOne({ email }); // check DB for existing email
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10); // 10 = salt rounds (security level)
    const user = await User.create({ name, email, passwordHash }); // save to DB

    res.status(201).json({
      token: generateToken(user), // send token back to frontend
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  // 1. Find user by email → if not found, block it
  // 2. Compare entered password with stored hash
  // 3. If it matches → return a fresh token + user info

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }); // look up user in DB
    if (!user) return res.status(400).json({ message: "User not found" });

    // Handle legacy users that don't have passwordHash
    if (!user.passwordHash) {
      return res.status(400).json({ message: "Legacy account structure detected. Please sign up again." });
    }

    const valid = await bcrypt.compare(password, user.passwordHash); // compare plain vs hashed
    if (!valid) return res.status(400).json({ message: "Wrong password" });

    res.json({
      token: generateToken(user), // send fresh token
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login }; // expose both functions to routes
