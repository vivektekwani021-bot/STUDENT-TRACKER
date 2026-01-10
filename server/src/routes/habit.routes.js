const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const {
    getHabits,
    createHabit,
    markHabit
} = require("../controllers/habit.controller");

router.use(protect);

router.get("/", getHabits);
router.post("/", createHabit);
router.post("/:id/mark", markHabit);

module.exports = router;
