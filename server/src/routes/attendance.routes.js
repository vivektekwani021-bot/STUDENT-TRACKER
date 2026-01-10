const express = require("express");
const router = express.Router();

const {
  markSchoolAttendance,
  markSubjectAttendance,
  getAttendance
} = require("../controllers/attendance.controller");

const { protect } = require("../middleware/auth.middleware");
const {
  schoolOnly,
  collegeOnly
} = require("../middleware/role.middleware");
const { onboardingRequired } = require("../middleware/onboarding.middleware");

// SCHOOL
router.post(
  "/school",
  protect,
  markSchoolAttendance
);

// COLLEGE
router.post(
  "/college",
  protect,
  markSubjectAttendance
);

// SHARED GET
router.get("/", protect, getAttendance);

module.exports = router;
