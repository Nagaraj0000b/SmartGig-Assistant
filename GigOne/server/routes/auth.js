const router = require("express").Router(); // mini express app for this route group
const { register, login } = require("../controllers/authController"); // import controllers

// POST /api/auth/register  →  create a new user
router.post("/register", register);

// POST /api/auth/login  →  login and get token
router.post("/login", login);

// ==========================================
// GOOGLE OAUTH ROUTES
// ==========================================
const passport = require("passport");
const jwt = require("jsonwebtoken");

// 1. Send the user to Google to sign in
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// 2. Google redirects back here with the user's profile
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    // If successful, passport attaches the user to req.user
    const user = req.user;

    // Generate our JWT token for them 
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Redirect them back to our frontend React app with the token in the URL URL
    // so the React app can grab it and save it to LocalStorage
    res.redirect(`http://localhost:5173/user/dashboard?token=${token}&user=${encodeURIComponent(JSON.stringify({ id: user._id, name: user.name, role: user.role }))}`);
  }
);

module.exports = router;
