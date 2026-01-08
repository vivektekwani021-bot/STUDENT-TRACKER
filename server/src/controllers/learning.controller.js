const User = require("../models/User.model");
//const User = require("../models/User.model");
const { generateExplanation } = require("../services/ai.service");
const { getYouTubeVideos } = require("../services/youtube.service");

exports.getLearningContent = async (req, res) => {
  try {
    const { topic, prompt } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const user = await User.findById(req.user._id);

    const explanation = await generateExplanation({
      topic,
      prompt,
      level: user.educationLevel
    });

   const videos = await getYouTubeVideos(topic);

     return res.status(200).json({
      success: true,
      topic,
      explanation,
      videos
      
    });
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
};

// Mark topic as learned (Phase 1)
exports.markTopicLearned = async (req, res) => {
  try {
    const { topicName, quizScore, studyTime } = req.body;

    const user = await User.findById(req.user._id);

    // prevent duplicate topic same day
    const alreadyLearned = user.learningHistory.some(
      (item) =>
        item.topicName === topicName &&
        new Date(item.completedAt).toDateString() ===
          new Date().toDateString()
    );

    if (alreadyLearned) {
      return res.status(403).json({
        message: "Topic already marked as learned today"
      });
    }

    let masteryStatus = "Average";
    if (quizScore >= 70) masteryStatus = "Strong";
    else if (quizScore < 60) masteryStatus = "Weak";

    // update weak topics
    if (masteryStatus === "Weak") {
      if (!user.weakTopics.includes(topicName)) {
        user.weakTopics.push(topicName);
      }
    }

    user.learningHistory.push({
      topicName,
      quizScore,
      masteryStatus
    });

    user.totalStudyTime += studyTime || 0;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Learning progress saved",
      masteryStatus
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
