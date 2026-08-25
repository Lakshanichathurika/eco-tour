const { VEHICLE_RATES } = require("./costCalculator");

const BUDGETS = ["low", "medium", "high"];
const INTERESTS = ["wildlife", "hiking", "culture", "beach"];
const SEASONS = ["Dec-Mar", "Apr-Sep", "Year-round", "Oct-Nov", "no_preference"];
const VEHICLE_TYPES = Object.keys(VEHICLE_RATES);

function validateRecommendationInput(body) {
  const errors = [];
  const { budget, duration, interests, travelSeason, vehicle_type } = body || {};

  if (!BUDGETS.includes(budget)) {
    errors.push(`budget must be one of: ${BUDGETS.join(", ")}`);
  }

  if (!Number.isInteger(duration) || duration < 1 || duration > 30) {
    errors.push("duration must be an integer between 1 and 30");
  }

  if (!Array.isArray(interests) || interests.length === 0) {
    errors.push(`interests must include at least one of: ${INTERESTS.join(", ")}`);
  } else if (!interests.every((i) => INTERESTS.includes(i))) {
    errors.push(`interests must only contain: ${INTERESTS.join(", ")}`);
  }

  if (travelSeason !== undefined && !SEASONS.includes(travelSeason)) {
    errors.push(`travelSeason must be one of: ${SEASONS.join(", ")}`);
  }

  if (vehicle_type !== undefined && !VEHICLE_TYPES.includes(vehicle_type)) {
    errors.push(`vehicle_type must be one of: ${VEHICLE_TYPES.join(", ")}`);
  }

  return { valid: errors.length === 0, errors };
}

module.exports = validateRecommendationInput;
