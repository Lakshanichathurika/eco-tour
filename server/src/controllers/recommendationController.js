const Destination = require("../models/Destination");
const { toDestinationDTO } = require("./destinationController");
const validateRecommendationInput = require("../utils/validateRecommendationInput");
const { rankDestinations, buildItinerary, getMonthsInRange } = require("../services/recommendationEngine");
const { calculateTotalDistanceKm, calculateTransportCost } = require("../utils/costCalculator");

async function postRecommendations(req, res, next) {
  try {
    const { valid, errors } = validateRecommendationInput(req.body);
    if (!valid) {
      return res.status(400).json({ success: false, message: "Invalid request", errors });
    }

    const {
      budget,
      duration: requestedDuration,
      interests,
      travelStartDate,
      travelEndDate,
      vehicle_type = "car",
      travelers = 1,
    } = req.body;

    // If a date range is given, duration is derived from it (days inclusive) and
    // season scoring uses every month the range spans. Otherwise, fall back to
    // the explicit duration and score against today's single-day "month" — the
    // date picker replaced the old "no preference" dropdown option, so every
    // request now gets some season scoring rather than skipping it.
    let duration = requestedDuration;
    let monthsInRange;
    if (travelStartDate && travelEndDate) {
      const start = new Date(travelStartDate);
      const end = new Date(travelEndDate);
      duration = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
      monthsInRange = getMonthsInRange(start, end);
    } else {
      const today = new Date();
      monthsInRange = getMonthsInRange(today, today);
    }

    const userInput = { budget, duration, interests, monthsInRange, vehicle_type, travelers };
    const echoedInput = {
      budget,
      duration,
      interests,
      travelStartDate: travelStartDate || null,
      travelEndDate: travelEndDate || null,
      vehicle_type,
      travelers,
    };

    const allDestinations = await Destination.find();
    const dtos = allDestinations.map(toDestinationDTO);

    const recommendations = rankDestinations(dtos, userInput);
    const itinerary = buildItinerary(recommendations, duration);

    // Per-stop travelers-aware cost, computed here rather than inside
    // buildItinerary() — that function's rules are individually unit-tested for
    // the dissertation, so its signature/logic stays untouched; buildItinerary()
    // only contributes the raw entry_fee_per_person_lkr/shared_group_cost_lkr
    // fields per stop, and this is where they're combined with travelers.
    const itineraryWithCosts = itinerary.map((stop) => ({
      ...stop,
      destination_total_cost_lkr:
        stop.entry_fee_per_person_lkr * travelers + stop.shared_group_cost_lkr,
    }));

    const total_places = itineraryWithCosts.length;
    const total_estimated_cost_lkr = itineraryWithCosts.reduce(
      (sum, stop) => sum + stop.destination_total_cost_lkr,
      0
    );

    // Straight-line (haversine) distance — the itinerary has no road-network
    // sequencing to draw on, and real road distance is only available client-side
    // via the Directions API after the map loads. Kept separate from
    // total_estimated_cost_lkr (destination entry/activity costs), not merged.
    const total_distance_km = calculateTotalDistanceKm(itineraryWithCosts);
    const estimated_transport_cost_lkr = calculateTransportCost(
      total_distance_km,
      vehicle_type,
      travelers
    );

    res.json({
      success: true,
      input: echoedInput,
      recommendations,
      itinerary: itineraryWithCosts,
      total_places,
      total_estimated_cost_lkr,
      total_distance_km,
      estimated_transport_cost_lkr,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { postRecommendations };
