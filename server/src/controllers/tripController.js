const Trip = require("../models/Trip");

async function createTrip(req, res, next) {
  try {
    const { client_id, itinerary } = req.body;
    const errors = [];
    if (!client_id) errors.push("client_id is required");
    if (!Array.isArray(itinerary) || itinerary.length === 0) {
      errors.push("itinerary must be a non-empty array");
    }
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Invalid request", errors });
    }

    const trip = await Trip.create(req.body);
    res.status(201).json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
}

async function listTrips(req, res, next) {
  try {
    const { client_id } = req.query;
    if (!client_id) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request", errors: ["client_id is required"] });
    }

    const trips = await Trip.find({ client_id }).sort({ created_at: -1 });
    res.json({ success: true, data: trips });
  } catch (err) {
    next(err);
  }
}

async function deleteTrip(req, res, next) {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }
    res.json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
}

module.exports = { createTrip, listTrips, deleteTrip };
