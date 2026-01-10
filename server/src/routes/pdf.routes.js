const express = require("express");
const router = express.Router();

const { downloadNotesPDF } = require("../controllers/pdf.controller");
const { protect } = require("../middleware/auth.middleware");
const { onboardingRequired } = require("../middleware/onboarding.middleware");

router.post(
  "/notes",
  protect,
  downloadNotesPDF
);

module.exports = router;
