const express = require("express");
const { createTrip, listTrips, deleteTrip } = require("../controllers/tripController");

const router = express.Router();

router.post("/", createTrip);
router.get("/", listTrips);
router.delete("/:id", deleteTrip);

module.exports = router;
