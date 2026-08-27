const rateLimit = require("express-rate-limit");

// Basic brute-force protection on signup/login only (not applied globally).
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per IP per window, across signup + login combined
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts, please try again later" },
});

module.exports = authLimiter;
