const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validateSignupInput, validateLoginInput } = require("../utils/validateAuthInput");

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = "7d";

// Never include the password hash in anything sent back to the client.
function toPublicUser(doc) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    bio: doc.bio,
    profilePicture: doc.profilePicture,
    createdAt: doc.createdAt,
  };
}

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

async function signup(req, res, next) {
  try {
    const { valid, errors } = validateSignupInput(req.body);
    if (!valid) {
      return res.status(400).json({ success: false, message: "Invalid request", errors });
    }

    const { name, email, password } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: toPublicUser(user),
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { valid, errors } = validateLoginInput(req.body);
    if (!valid) {
      return res.status(400).json({ success: false, message: "Invalid request", errors });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    // Same generic message whether the email doesn't exist or the password is
    // wrong — deliberate, so this endpoint can't be used to enumerate which
    // emails are registered.
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = signToken(user._id.toString());
    res.json({
      success: true,
      message: "Logged in successfully",
      data: { token, user: toPublicUser(user) },
    });
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login, getMe, toPublicUser };
