const bcrypt = require("bcrypt");
const User = require("../models/User");
const Destination = require("../models/Destination");
const { toPublicUser } = require("./authController");
const {
  validateProfileInput,
  validateChangePasswordInput,
} = require("../utils/validateAuthInput");

const SALT_ROUNDS = 10;

async function saveDestination(req, res, next) {
  try {
    const { destId } = req.params;
    // A malformed id 404s via the existing global CastError handler, but a
    // well-formed, nonexistent one wouldn't — $addToSet alone would happily
    // store a dangling reference. Confirming the destination is real first.
    const destination = await Destination.findById(destId);
    if (!destination) {
      return res.status(404).json({ success: false, message: "Destination not found" });
    }

    // $addToSet is idempotent — saving an already-saved destination is a
    // no-op, not a duplicate/error.
    await User.findByIdAndUpdate(req.userId, { $addToSet: { savedDestinations: destId } });
    res.json({ success: true, message: "Destination saved" });
  } catch (err) {
    next(err);
  }
}

async function unsaveDestination(req, res, next) {
  try {
    const { destId } = req.params;
    // $pull is idempotent — removing something not in the list is a no-op,
    // not an error.
    await User.findByIdAndUpdate(req.userId, { $pull: { savedDestinations: destId } });
    res.json({ success: true, message: "Destination removed" });
  } catch (err) {
    next(err);
  }
}

async function getProfile(req, res, next) {
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

async function updateProfile(req, res, next) {
  try {
    const { valid, errors } = validateProfileInput(req.body);
    if (!valid) {
      return res.status(400).json({ success: false, message: "Invalid request", errors });
    }

    const { name, email, phone, bio, profilePicture } = req.body;

    if (email !== undefined) {
      const existing = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: req.userId },
      });
      if (existing) {
        return res.status(409).json({ success: false, message: "Email already in use" });
      }
    }

    const update = {};
    if (name !== undefined) update.name = name;
    if (email !== undefined) update.email = email.toLowerCase();
    if (phone !== undefined) update.phone = phone;
    if (bio !== undefined) update.bio = bio;
    if (profilePicture !== undefined) update.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(req.userId, update, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Profile updated successfully", data: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    const { valid, errors } = validateChangePasswordInput(req.body);
    if (!valid) {
      return res.status(400).json({ success: false, message: "Invalid request", errors });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const passwordMatches = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await user.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  saveDestination,
  unsaveDestination,
  getProfile,
  updateProfile,
  changePassword,
};
