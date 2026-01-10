const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { onboardingRequired } = require("../middleware/onboarding.middleware");

const {
  generateQuiz,
  submitQuiz
} = require("../controllers/quiz.controller");

router.post("/generate", protect, generateQuiz);
router.post("/submit", protect, submitQuiz);

module.exports = router;
