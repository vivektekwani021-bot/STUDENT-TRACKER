const Habit = require("../models/Habit.model");

const sameDate = (d1, d2) =>
    new Date(d1).toDateString() === new Date(d2).toDateString();

// Get user habits
exports.getHabits = async (req, res) => {
    try {
        const habits = await Habit.find({ user: req.user._id });
        res.status(200).json({ success: true, habits });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new habit
exports.createHabit = async (req, res) => {
    try {
        const { title, description, reminderTime } = req.body;
        const habit = await Habit.create({
            user: req.user._id,
            title,
            description,
            reminderTime
        });
        res.status(201).json({ success: true, habit });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark habit as completed for today (toggle)
exports.markHabit = async (req, res) => {
    try {
        const { id } = req.params;
        const { date } = req.body; // usually "today"
        const targetDate = new Date(date || Date.now());

        const habit = await Habit.findOne({ _id: id, user: req.user._id });
        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        const completedIndex = habit.completedDates.findIndex(d =>
            sameDate(d, targetDate)
        );

        if (completedIndex !== -1) {
            // Unmark
            habit.completedDates.splice(completedIndex, 1);
            // Simple streak logic: recalculating streak accurately requires iterating all dates
            // For simplicity here, we assume if you unmark today, streak goes down by 1 if it was > 0
            if (habit.streak > 0) habit.streak -= 1;
        } else {
            // Mark
            habit.completedDates.push(targetDate);
            habit.streak += 1;
        }

        await habit.save();
        res.status(200).json({ success: true, habit });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
