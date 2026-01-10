const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const {
  createRoadmap,
  completeToday,
  clearBacklog
} = require("../controllers/roadmap.controller");

router.post("/", protect, createRoadmap);
router.post("/complete", protect, completeToday);
router.post("/backlog/clear", protect, clearBacklog);

module.exports = router;
