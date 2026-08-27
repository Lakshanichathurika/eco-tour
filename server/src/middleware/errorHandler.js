function errorHandler(err, req, res, next) {
  if (err.name === "CastError") {
    return res.status(404).json({ success: false, message: "Destination not found" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ success: false, message: err.message });
  }
  // Mongo duplicate-key error — generic, since this handler is shared across
  // every resource (Destination.slug also has a unique index); which field
  // conflicted is reported without guessing which resource it belongs to.
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "value";
    return res.status(409).json({ success: false, message: `This ${field} is already in use` });
  }
  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
}

module.exports = errorHandler;
