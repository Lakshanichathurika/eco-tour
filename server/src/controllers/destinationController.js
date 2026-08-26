const Destination = require("../models/Destination");

// Resolves the backend's own public base URL for building absolute image
// links. BACKEND_BASE_URL (set explicitly in production, e.g. Render) takes
// priority: req.protocol only reflects the real public https:// scheme behind
// a reverse proxy if Express trusts it, and relying on that alone risks
// mixed-content-blocked http:// image URLs. The request-derived fallback is
// only really trustworthy for local dev, where there's no proxy in the way.
function getBackendBaseUrl(req) {
  return (process.env.BACKEND_BASE_URL || `${req.protocol}://${req.get("host")}`).replace(
    /\/$/,
    ""
  );
}

// Stored imageUrl values may be a relative path ("/images/x.jpg", the current
// convention) or a stale absolute URL baked in before this fix (e.g. an old
// "http://localhost:5001/..." value from before seed data was migrated) —
// either way, strip any origin and rebuild against the current environment's
// real base URL, so old and new records both resolve correctly everywhere
// without requiring an immediate re-seed.
function buildImageUrl(storedPath, baseUrl) {
  if (!storedPath) return storedPath;
  const relativePath = storedPath.replace(/^https?:\/\/[^/]+/i, "");
  return `${baseUrl}${relativePath}`;
}

// Single shared DTO transform so every endpoint returns the same shape.
// name->title, region->location, imageUrl->image match the fields the
// existing frontend components already expect; activity_type is emitted
// both raw (for the rule engine) and Title Case as `type` (for the
// existing filter dropdown in Destination.jsx).
function toDestinationDTO(doc, baseUrl) {
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
    image: buildImageUrl(doc.imageUrl, baseUrl),
    coordinates: doc.coordinates,
    environmental_sensitivity: doc.environmental_sensitivity,
    best_season: doc.best_season,
    best_season_detail: doc.best_season_detail,
    min_recommended_days: doc.min_recommended_days,
    budget_tier: doc.budget_tier,
    conservation_notes: doc.conservation_notes,
    source: doc.source,
    entry_fee_per_person_lkr: doc.entry_fee_per_person_lkr,
    shared_group_cost_lkr: doc.shared_group_cost_lkr,
    estimated_cost_lkr: doc.estimated_cost_lkr, // virtual: entry+shared, 1-traveler reference
    cost_breakdown: doc.cost_breakdown,
  };
}

async function listDestinations(req, res, next) {
  try {
    const baseUrl = getBackendBaseUrl(req);
    const destinations = await Destination.find().sort({ name: 1 });
    const data = destinations.map((d) => toDestinationDTO(d, baseUrl));
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
    res.json({ success: true, data: toDestinationDTO(destination, getBackendBaseUrl(req)) });
  } catch (err) {
    next(err);
  }
}

module.exports = { listDestinations, getDestinationById, toDestinationDTO, getBackendBaseUrl };
