const mongoose = require("mongoose");

const ACTIVITY_TYPES = ["wildlife", "hiking", "culture", "beach"];
const SEASONS = ["Dec-Mar", "Apr-Sep", "Year-round", "Oct-Nov"];
const SENSITIVITY_LEVELS = ["low", "medium", "high"];
const BUDGET_TIERS = ["low", "medium", "high"];

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    region: { type: String, required: true, trim: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    activity_type: { type: String, required: true, enum: ACTIVITY_TYPES },
    secondary_activities: { type: [String], enum: ACTIVITY_TYPES, default: [] },
    environmental_sensitivity: { type: String, required: true, enum: SENSITIVITY_LEVELS },
    best_season: { type: String, required: true, enum: SEASONS },
    best_season_detail: { type: String, default: "" },
    min_recommended_days: { type: Number, required: true, min: 1, max: 14 },
    budget_tier: { type: String, required: true, enum: BUDGET_TIERS },
    conservation_notes: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    source: { type: String, default: "" },
    estimated_cost_lkr: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Destination", destinationSchema);
module.exports.ACTIVITY_TYPES = ACTIVITY_TYPES;
module.exports.SEASONS = SEASONS;
module.exports.SENSITIVITY_LEVELS = SENSITIVITY_LEVELS;
module.exports.BUDGET_TIERS = BUDGET_TIERS;
