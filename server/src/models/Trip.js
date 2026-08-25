const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  client_id: { type: String, required: true, index: true },
  preferences: {
    budget: String,
    duration: Number,
    interests: [String],
    travelSeason: String,
    vehicle_type: String,
    travelers: Number,
  },
  itinerary: { type: Array, required: true },
  total_estimated_cost_lkr: Number,
  estimated_transport_cost_lkr: Number,
  total_distance_km: Number,
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Trip", tripSchema);
