const express = require("express");
const path = require("path");
const cors = require("cors");
const destinationRoutes = require("./routes/destinationRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

// Destination images are downloaded once into public/images at seed time
// and served locally rather than hotlinked, since hotlinking upload.wikimedia.org
// directly from <img> tags triggered intermittent rate-limit failures (HTTP 429 /
// ERR_BLOCKED_BY_ORB) during testing.
app.use("/images", express.static(path.join(__dirname, "..", "public", "images")));

app.use("/api/destinations", destinationRoutes);
app.use("/api/recommendations", recommendationRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
