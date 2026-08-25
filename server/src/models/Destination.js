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
    // entry_fee_per_person_lkr scales with each traveler (park/site ticket).
    // shared_group_cost_lkr is paid once per group regardless of group size
    // (jeep/boat charter, guide fee).
    entry_fee_per_person_lkr: { type: Number, required: true, min: 0 },
    shared_group_cost_lkr: { type: Number, required: true, min: 0 },
    cost_breakdown: { type: String, default: "" },
  },
  { timestamps: true }
);

// Backward-compat reference only (the "1 traveler" total) — not stored, not used
// by any real calculation. Real cost math uses the two fields above directly.
destinationSchema.virtual("estimated_cost_lkr").get(function () {
  return this.entry_fee_per_person_lkr + this.shared_group_cost_lkr;
});
destinationSchema.set("toJSON", { virtuals: true });
destinationSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Destination", destinationSchema);
module.exports.ACTIVITY_TYPES = ACTIVITY_TYPES;
module.exports.SEASONS = SEASONS;
module.exports.SENSITIVITY_LEVELS = SENSITIVITY_LEVELS;
module.exports.BUDGET_TIERS = BUDGET_TIERS;
