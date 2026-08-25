const express = require("express");
const { getNearbyRestStops } = require("../controllers/placesController");

const router = express.Router();

router.get("/nearby", getNearbyRestStops);

module.exports = router;
