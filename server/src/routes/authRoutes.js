const express = require("express");
const { signup, login, getMe } = require("../controllers/authController");
const requireAuth = require("../middleware/requireAuth");
const authLimiter = require("../middleware/authLimiter");

const router = express.Router();

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.get("/me", requireAuth, getMe);

module.exports = router;
