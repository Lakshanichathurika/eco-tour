function errorHandler(err, req, res, next) {
  if (err.name === "CastError") {
    return res.status(404).json({ success: false, message: "Destination not found" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ success: false, message: err.message });
  }
  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
}

module.exports = errorHandler;
