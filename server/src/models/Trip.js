const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  preferences: {
    budget: String,
    duration: Number,
    interests: [String],
    travelStartDate: String,
    travelEndDate: String,
    vehicle_type: String,
    travelers: Number,
  },
  itinerary: { type: Array, required: true },
  total_estimated_cost_lkr: Number,
  estimated_transport_cost_lkr: Number,
  total_distance_km: Number,
  // Free-text personal note the owner can attach/edit after saving — the only
  // field PUT /api/trips/:id updates (the generated itinerary itself isn't
  // something a user hand-edits).
  notes: { type: String, default: "" },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Trip", tripSchema);
