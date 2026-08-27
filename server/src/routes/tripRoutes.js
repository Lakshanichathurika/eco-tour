const express = require("express");
const {
  createTrip,
  listTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} = require("../controllers/tripController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.post("/", requireAuth, createTrip);
router.get("/", requireAuth, listTrips);
router.get("/:id", requireAuth, getTripById);
router.put("/:id", requireAuth, updateTrip);
router.delete("/:id", requireAuth, deleteTrip);

module.exports = router;
