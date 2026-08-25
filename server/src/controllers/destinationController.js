const Destination = require("../models/Destination");

// Single shared DTO transform so every endpoint returns the same shape.
// name->title, region->location, imageUrl->image match the fields the
// existing frontend components already expect; activity_type is emitted
// both raw (for the rule engine) and Title Case as `type` (for the
// existing filter dropdown in Destination.jsx).
function toDestinationDTO(doc) {
  const titleCaseType =
    doc.activity_type.charAt(0).toUpperCase() + doc.activity_type.slice(1);

  return {
    id: doc._id.toString(),
    slug: doc.slug,
    title: doc.name,
    location: doc.region,
    type: titleCaseType,
    activity_type: doc.activity_type,
    secondary_activities: doc.secondary_activities,
    description: doc.description,
    image: doc.imageUrl,
    coordinates: doc.coordinates,
    environmental_sensitivity: doc.environmental_sensitivity,
    best_season: doc.best_season,
    best_season_detail: doc.best_season_detail,
    min_recommended_days: doc.min_recommended_days,
    budget_tier: doc.budget_tier,
    conservation_notes: doc.conservation_notes,
    source: doc.source,
    estimated_cost_lkr: doc.estimated_cost_lkr,
  };
}

async function listDestinations(req, res, next) {
  try {
    const destinations = await Destination.find().sort({ name: 1 });
    const data = destinations.map(toDestinationDTO);
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
}

async function getDestinationById(req, res, next) {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: "Destination not found" });
    }
    res.json({ success: true, data: toDestinationDTO(destination) });
  } catch (err) {
    next(err);
  }
}

module.exports = { listDestinations, getDestinationById, toDestinationDTO };
