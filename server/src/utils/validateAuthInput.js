const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

module.exports = { validateSignupInput, validateLoginInput };
