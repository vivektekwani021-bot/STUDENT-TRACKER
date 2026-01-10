const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: String,
        streak: {
            type: Number,
            default: 0
        },
        completedDates: [
            {
                type: Date
            }
        ],
        reminderTime: String // HH:MM format
    },
    { timestamps: true }
);

module.exports = mongoose.model("Habit", habitSchema);
