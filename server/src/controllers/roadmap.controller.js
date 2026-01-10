const Roadmap = require("../models/Roadmap.model");

// Create roadmap
exports.createRoadmap = async (req, res) => {
  const { title, days } = req.body;

  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  const roadmapDays = days.map((day, index) => ({
    dayNumber: index + 1,
    title: day.title,
    tasks: day.tasks,
    date: new Date(startDate.getTime() + index * 86400000)
  }));

  const roadmap = await Roadmap.create({
    user: req.user._id,
    title,
    startDate,
    days: roadmapDays
  });

  res.status(201).json(roadmap);
};

exports.completeToday = async (req, res) => {
  const roadmap = await Roadmap.findOne({ user: req.user._id });

  if (!roadmap || roadmap.completed) {
    return res.status(400).json({ message: "No active roadmap" });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentDayObj = roadmap.days.find(
    d => d.dayNumber === roadmap.currentDay
  );

  // 🔴 Missed day → backlog
  if (today > currentDayObj.date) {
    roadmap.backlog.push({
      dayNumber: currentDayObj.dayNumber,
      tasks: currentDayObj.tasks
    });

    roadmap.currentDay += 1;
    await roadmap.save();

    return res.status(400).json({
      message: "Day missed. Task moved to backlog."
    });
  }

  // ✅ Complete day
  currentDayObj.completed = true;
  roadmap.currentDay += 1;

  if (roadmap.currentDay > roadmap.days.length) {
    roadmap.completed = true;
  }

  await roadmap.save();

  res.json({
    success: true,
    message: "Day completed 🎉",
    nextDay: roadmap.currentDay
  });
};

exports.clearBacklog = async (req, res) => {
  const roadmap = await Roadmap.findOne({ user: req.user._id });

  if (roadmap.backlog.length === 0) {
    return res.status(400).json({ message: "No backlog" });
  }

  roadmap.backlog.shift(); // FIFO
  await roadmap.save();

  res.json({
    success: true,
    message: "Backlog cleared ✅"
  });
};
