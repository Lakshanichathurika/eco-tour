const Destination = require("../models/Destination");
const { toDestinationDTO } = require("./destinationController");
const validateRecommendationInput = require("../utils/validateRecommendationInput");
const { rankDestinations, buildItinerary } = require("../services/recommendationEngine");

async function postRecommendations(req, res, next) {
  try {
    const { valid, errors } = validateRecommendationInput(req.body);
    if (!valid) {
      return res.status(400).json({ success: false, message: "Invalid request", errors });
    }

    const { budget, duration, interests, travelSeason = "no_preference" } = req.body;
    const userInput = { budget, duration, interests, travelSeason };

    const allDestinations = await Destination.find();
    const dtos = allDestinations.map(toDestinationDTO);

    const recommendations = rankDestinations(dtos, userInput);
    const itinerary = buildItinerary(recommendations, duration);

    const total_places = itinerary.length;
    const total_estimated_cost_lkr = itinerary.reduce(
      (sum, stop) => sum + stop.estimated_cost_lkr,
      0
    );

    res.json({
      success: true,
      input: userInput,
      recommendations,
      itinerary,
      total_places,
      total_estimated_cost_lkr,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { postRecommendations };
