async function getNearbyRestStops(req, res, next) {
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

    const url =
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
      `?location=${lat},${lng}&radius=5000&keyword=restaurant&key=${process.env.GOOGLE_PLACES_API_KEY}`;
    const response = await fetch(url);
    const body = await response.json();

    if (body.status !== "OK" && body.status !== "ZERO_RESULTS") {
      return res
        .status(502)
        .json({ success: false, message: body.error_message || `Places service error (${body.status})` });
    }

    const data = (body.results || []).slice(0, 3).map((place) => ({
      name: place.name,
      rating: place.rating ?? null,
      location: place.geometry?.location,
    }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getNearbyRestStops };
