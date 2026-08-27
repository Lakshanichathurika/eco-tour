const Trip = require("../models/Trip");
const User = require("../models/User");
const { toDestinationDTO, getBackendBaseUrl } = require("./destinationController");

async function getDashboard(req, res, next) {
  try {
    const userId = req.userId;
    const todayISO = new Date().toISOString().slice(0, 10);

    // Sorting/filtering preferences.travelStartDate lexicographically is safe
    // because it's always stored as a YYYY-MM-DD string, which sorts
    // identically to chronological order.
    const [totalTrips, upcomingTrips, recentTrips, user] = await Promise.all([
      Trip.countDocuments({ userId }),
      Trip.find({ userId, "preferences.travelStartDate": { $gte: todayISO } })
        .sort({ "preferences.travelStartDate": 1 })
        .limit(3),
      Trip.find({ userId }).sort({ created_at: -1 }).limit(3),
      User.findById(userId).populate("savedDestinations"),
    ]);

    const baseUrl = getBackendBaseUrl(req);
    const savedDestinations = (user?.savedDestinations || []).map((d) =>
      toDestinationDTO(d, baseUrl)
    );

    res.json({
      success: true,
      data: {
        totalTrips,
        upcomingTrips,
        nextTrip: upcomingTrips[0] || null,
        savedDestinations,
        recentTrips,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboard };
