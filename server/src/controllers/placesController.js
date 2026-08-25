function buildNearbySearchUrl({ lat, lng, keyword, type }) {
  const params = new URLSearchParams({
    location: `${lat},${lng}`,
    radius: "5000",
    key: process.env.GOOGLE_PLACES_API_KEY,
  });
  if (keyword) params.set("keyword", keyword);
  if (type) params.set("type", type);
  return `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params.toString()}`;
}

// Each category is fetched independently and degrades to [] on a Places-side
// error (e.g. ZERO_RESULTS vs a real failure) rather than failing the whole
// request — one flaky category shouldn't hide the other.
async function fetchPlaces(options) {
  try {
    const response = await fetch(buildNearbySearchUrl(options));
    const body = await response.json();
    if (body.status !== "OK" && body.status !== "ZERO_RESULTS") {
      // A real API failure (e.g. REQUEST_DENIED) looks identical to "no results"
      // from the frontend's point of view unless it's logged here.
      console.error(
        `Places API error (keyword=${options.keyword}, type=${options.type}): ${body.status} - ${body.error_message || ""}`
      );
      return [];
    }
    return (body.results || []).slice(0, 3).map((place) => ({
      name: place.name,
      rating: place.rating ?? null,
      location: place.geometry?.location,
    }));
  } catch {
    return [];
  }
}

async function getNearbyPlaces(req, res, next) {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request", errors: ["lat and lng are required"] });
    }

    if (!process.env.GOOGLE_PLACES_API_KEY) {
      return res
        .status(502)
        .json({ success: false, message: "Places service not configured" });
    }

    const [food, accommodation] = await Promise.all([
      fetchPlaces({ lat, lng, keyword: "restaurant" }),
      fetchPlaces({ lat, lng, keyword: "eco lodge", type: "lodging" }),
    ]);

    res.json({ success: true, data: { food, accommodation } });
  } catch (err) {
    next(err);
  }
}

module.exports = { getNearbyPlaces };
