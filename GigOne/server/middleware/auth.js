const jwt = require("jsonwebtoken");



// It asks for token .  
// If token is valid it tells routes who it is and allow routing
// Else blocked 

module.exports = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, unauthorized" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role }
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
