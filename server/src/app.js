const express = require("express");
const path = require("path");
const cors = require("cors");
const destinationRoutes = require("./routes/destinationRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const placesRoutes = require("./routes/placesRoutes");
const tripRoutes = require("./routes/tripRoutes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Render (and similar hosts) sit behind a reverse proxy — without this,
// req.protocol always reports "http" even for real https:// requests, which
// would leak into any URL built from it (e.g. destination image URLs).
app.set("trust proxy", true);

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

// Destination images are downloaded once into public/images at seed time
// and served locally rather than hotlinked, since hotlinking upload.wikimedia.org
// directly from <img> tags triggered intermittent rate-limit failures (HTTP 429 /
// ERR_BLOCKED_BY_ORB) during testing.
app.use("/images", express.static(path.join(__dirname, "..", "public", "images")));

app.use("/api/destinations", destinationRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/trips", tripRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
