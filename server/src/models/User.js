const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  // Always a bcrypt hash — never a plain-text password.
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  bio: { type: String, default: "" },
  // Base64 data URL of an uploaded image — no S3/Cloudinary in this app.
  profilePicture: { type: String, default: "" },
  savedDestinations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Destination" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
