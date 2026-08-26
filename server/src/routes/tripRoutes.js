const express = require("express");
const { createTrip, listTrips, getTripById, deleteTrip } = require("../controllers/tripController");

const router = express.Router();

router.post("/", createTrip);
router.get("/", listTrips);
router.get("/:id", getTripById);
router.delete("/:id", deleteTrip);

module.exports = router;
