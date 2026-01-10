const mongoose = require("mongoose");

const daySchema = new mongoose.Schema({
  dayNumber: Number,
  title: String,
  tasks: [String],
  completed: {
    type: Boolean,
    default: false
  },
  date: Date // assigned calendar date
});

const roadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: String, // e.g. "7-Day Binary Search Roadmap"

    startDate: Date,

    currentDay: {
      type: Number,
      default: 1
    },

    days: [daySchema],

    backlog: [
      {
        dayNumber: Number,
        tasks: [String]
      }
    ],

    completed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Roadmap", roadmapSchema);
