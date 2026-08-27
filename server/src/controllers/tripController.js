const Trip = require("../models/Trip");

const MAX_NOTES_LENGTH = 2000;

// Shared ownership check used by getTripById/updateTrip/deleteTrip: 404 if the
// trip doesn't exist at all, 403 if it exists but belongs to a different
// user. userId always comes from the verified JWT (req.userId), never from
// request input.
async function findOwnedTrip(id, userId) {
  const trip = await Trip.findById(id);
  if (!trip) return { trip: null, status: 404, message: "Trip not found" };
  if (trip.userId.toString() !== userId) {
    return { trip: null, status: 403, message: "You don't have access to this trip" };
  }
  return { trip, status: 200, message: null };
}

async function createTrip(req, res, next) {
  try {
    const { itinerary } = req.body;
    if (!Array.isArray(itinerary) || itinerary.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
        errors: ["itinerary must be a non-empty array"],
      });
    }

    // userId always comes from the verified JWT (requireAuth), never from the
    // request body — a client-supplied userId would let one user create
    // trips under another user's identity.
    const trip = await Trip.create({ ...req.body, userId: req.userId });
    res.status(201).json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
}

async function listTrips(req, res, next) {
  try {
    const trips = await Trip.find({ userId: req.userId }).sort({ created_at: -1 });
    res.json({ success: true, data: trips });
  } catch (err) {
    next(err);
  }
}

async function getTripById(req, res, next) {
  try {
    const { trip, status, message } = await findOwnedTrip(req.params.id, req.userId);
    if (!trip) {
      return res.status(status).json({ success: false, message });
    }
    res.json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
}

async function updateTrip(req, res, next) {
  try {
    const { trip, status, message } = await findOwnedTrip(req.params.id, req.userId);
    if (!trip) {
      return res.status(status).json({ success: false, message });
    }

    const { notes } = req.body;
    if (notes !== undefined) {
      if (typeof notes !== "string" || notes.length > MAX_NOTES_LENGTH) {
        return res.status(400).json({
          success: false,
          message: "Invalid request",
          errors: [`notes must be a string up to ${MAX_NOTES_LENGTH} characters`],
        });
      }
      trip.notes = notes;
      await trip.save();
    }

    res.json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
}

async function deleteTrip(req, res, next) {
  try {
    const { trip, status, message } = await findOwnedTrip(req.params.id, req.userId);
    if (!trip) {
      return res.status(status).json({ success: false, message });
    }

    await Trip.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
}

module.exports = { createTrip, listTrips, getTripById, updateTrip, deleteTrip };
