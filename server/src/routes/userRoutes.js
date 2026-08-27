const express = require("express");
const {
  saveDestination,
  unsaveDestination,
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.post("/save-destination/:destId", requireAuth, saveDestination);
router.delete("/save-destination/:destId", requireAuth, unsaveDestination);

router.get("/profile", requireAuth, getProfile);
router.put("/profile", requireAuth, updateProfile);
router.put("/change-password", requireAuth, changePassword);

module.exports = router;
