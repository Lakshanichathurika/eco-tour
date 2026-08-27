const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  // Always a bcrypt hash — never a plain-text password.
  password: { type: String, required: true },
  savedDestinations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Destination" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
