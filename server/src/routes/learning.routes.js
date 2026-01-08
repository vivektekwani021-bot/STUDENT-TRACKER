const express = require("express");
const router = express.Router();

const { markTopicLearned } = require("../controllers/learning.controller");
const { protect } = require("../middleware/auth.middleware");
const { onboardingRequired } = require("../middleware/onboarding.middleware");
const { getLearningContent } = require("../controllers/learning.controller");



// router.post(
//   "/content",
//   protect,
//   onboardingRequired,

//   getLearningContent
// );

// router.post(
//   "/complete",
//   protect,
//   onboardingRequired,
//   markTopicLearned,
  
// );
// 🔓 PUBLIC — AI learning content
// 🔐 PROTECTED — AI learning content
router.post(
  "/content",
  protect,           // ✅ Ye middleware req.user._id provide karega
//   onboardingRequired, 
  getLearningContent
);

// 🔐 PROTECTED — progress / tracking
router.post(
  "/complete",
  protect,
  onboardingRequired,
  markTopicLearned,
  getLearningContent
);


module.exports = router;
