const express = require("express");
const { saveDestination, unsaveDestination } = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.post("/save-destination/:destId", requireAuth, saveDestination);
router.delete("/save-destination/:destId", requireAuth, unsaveDestination);

module.exports = router;
