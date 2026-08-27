const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// base64 inflates a file by ~4/3 — this caps the encoded string at roughly
// what a ~1MB original image produces.
const MAX_PROFILE_PICTURE_LENGTH = 1_400_000;

function validateSignupInput(body) {
  const errors = [];
  const { name, email, password } = body || {};

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("name is required");
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.push("a valid email is required");
  }

  if (!password || typeof password !== "string" || password.length < 8) {
    errors.push("password must be at least 8 characters");
  }

  return { valid: errors.length === 0, errors };
}

function validateLoginInput(body) {
  const errors = [];
  const { email, password } = body || {};

  if (!email) errors.push("email is required");
  if (!password) errors.push("password is required");

  return { valid: errors.length === 0, errors };
}

function validateProfileInput(body) {
  const errors = [];
  const { name, email, phone, bio, profilePicture } = body || {};

  if (name !== undefined && (typeof name !== "string" || name.trim().length === 0)) {
    errors.push("name cannot be empty");
  }

  if (email !== undefined && !EMAIL_REGEX.test(email)) {
    errors.push("a valid email is required");
  }

  if (phone !== undefined && typeof phone !== "string") {
    errors.push("phone must be a string");
  }

  if (bio !== undefined && typeof bio !== "string") {
    errors.push("bio must be a string");
  }

  if (profilePicture !== undefined && profilePicture !== "") {
    if (typeof profilePicture !== "string") {
      errors.push("profilePicture must be a string");
    } else if (profilePicture.length > MAX_PROFILE_PICTURE_LENGTH) {
      errors.push("profile picture is too large (max ~1MB)");
    }
  }

  return { valid: errors.length === 0, errors };
}

function validateChangePasswordInput(body) {
  const errors = [];
  const { currentPassword, newPassword } = body || {};

  if (!currentPassword) errors.push("currentPassword is required");
  if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
    errors.push("newPassword must be at least 8 characters");
  }

  return { valid: errors.length === 0, errors };
}

module.exports = {
  validateSignupInput,
  validateLoginInput,
  validateProfileInput,
  validateChangePasswordInput,
};
