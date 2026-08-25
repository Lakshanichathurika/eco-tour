const express = require("express");
const { postRecommendations } = require("../controllers/recommendationController");

const router = express.Router();

router.post("/", postRecommendations);

module.exports = router;
