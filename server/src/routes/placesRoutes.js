const express = require("express");
const { getNearbyPlaces } = require("../controllers/placesController");

const router = express.Router();

router.get("/nearby", getNearbyPlaces);

module.exports = router;
