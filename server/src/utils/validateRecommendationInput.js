const { VEHICLE_RATES } = require("./costCalculator");

const BUDGETS = ["low", "medium", "high"];
const INTERESTS = ["wildlife", "hiking", "culture", "beach"];
const VEHICLE_TYPES = Object.keys(VEHICLE_RATES);

function validateRecommendationInput(body) {
  const errors = [];
  const { budget, duration, interests, travelStartDate, travelEndDate, vehicle_type, travelers } =
    body || {};

  if (!BUDGETS.includes(budget)) {
    errors.push(`budget must be one of: ${BUDGETS.join(", ")}`);
  }

  const hasDateRange = travelStartDate !== undefined || travelEndDate !== undefined;
  if (hasDateRange) {
    if (!travelStartDate || !travelEndDate) {
      errors.push("travelStartDate and travelEndDate must both be provided together");
    } else {
      const start = new Date(travelStartDate);
      const end = new Date(travelEndDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        errors.push("travelStartDate/travelEndDate must be valid dates");
      } else if (end < start) {
        errors.push("travelEndDate must be on or after travelStartDate");
      } else if (Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1 > 30) {
        errors.push("travel date range must be 30 days or fewer");
      }
    }
  } else if (!Number.isInteger(duration) || duration < 1 || duration > 30) {
    errors.push(
      "duration must be an integer between 1 and 30 (or provide travelStartDate/travelEndDate)"
    );
  }

  if (!Array.isArray(interests) || interests.length === 0) {
    errors.push(`interests must include at least one of: ${INTERESTS.join(", ")}`);
  } else if (!interests.every((i) => INTERESTS.includes(i))) {
    errors.push(`interests must only contain: ${INTERESTS.join(", ")}`);
  }

  if (vehicle_type !== undefined && !VEHICLE_TYPES.includes(vehicle_type)) {
    errors.push(`vehicle_type must be one of: ${VEHICLE_TYPES.join(", ")}`);
  }

  if (travelers !== undefined && (!Number.isInteger(travelers) || travelers < 1)) {
    errors.push("travelers must be an integer of at least 1");
  }

  return { valid: errors.length === 0, errors };
}

module.exports = validateRecommendationInput;
