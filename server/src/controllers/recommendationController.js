const Destination = require("../models/Destination");
const { toDestinationDTO } = require("./destinationController");
const validateRecommendationInput = require("../utils/validateRecommendationInput");
const { rankDestinations, buildItinerary } = require("../services/recommendationEngine");
const { calculateTotalDistanceKm, calculateTransportCost } = require("../utils/costCalculator");

async function postRecommendations(req, res, next) {
  try {
    const { valid, errors } = validateRecommendationInput(req.body);
    if (!valid) {
      return res.status(400).json({ success: false, message: "Invalid request", errors });
    }

    const { budget, duration, interests, travelSeason = "no_preference", vehicle_type = "car" } = req.body;
    const userInput = { budget, duration, interests, travelSeason, vehicle_type };

    const allDestinations = await Destination.find();
    const dtos = allDestinations.map(toDestinationDTO);

    const recommendations = rankDestinations(dtos, userInput);
    const itinerary = buildItinerary(recommendations, duration);

    const total_places = itinerary.length;
    const total_estimated_cost_lkr = itinerary.reduce(
      (sum, stop) => sum + stop.estimated_cost_lkr,
      0
    );

    // Straight-line (haversine) distance — the itinerary has no road-network
    // sequencing to draw on, and real road distance is only available client-side
    // via the Directions API after the map loads. Kept separate from
    // total_estimated_cost_lkr (destination entry/activity costs), not merged.
    const total_distance_km = calculateTotalDistanceKm(itinerary);
    const estimated_transport_cost_lkr = calculateTransportCost(total_distance_km, vehicle_type);

    res.json({
      success: true,
      input: userInput,
      recommendations,
      itinerary,
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
