async function getWeather(req, res, next) {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request", errors: ["lat and lng are required"] });
    }

    if (!process.env.OPENWEATHER_API_KEY) {
      return res
        .status(502)
        .json({ success: false, message: "Weather service not configured" });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
    const response = await fetch(url);
    const body = await response.json();

    if (!response.ok) {
      return res
        .status(502)
        .json({ success: false, message: body.message || "Weather service error" });
    }

    res.json({
      success: true,
      data: {
        temperature: body.main?.temp,
        condition: body.weather?.[0]?.main,
        description: body.weather?.[0]?.description,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getWeather };
