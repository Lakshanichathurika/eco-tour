const User = require("../models/User");
const Destination = require("../models/Destination");

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

module.exports = { saveDestination, unsaveDestination };
