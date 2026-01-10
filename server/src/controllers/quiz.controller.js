const Quiz = require("../models/Quiz.model");
const User = require("../models/User.model");
const { generateQuizQuestions } = require("../utils/generateQuiz");
// STEP 3: Import the AI explanation utility
const { explainWrongAnswer } = require("../utils/explainWrongAnswer");

// Generate quiz
exports.generateQuiz = async (req, res) => {
  try {
    const { topic } = req.body;

    const questions = await generateQuizQuestions(topic);

    const quiz = await Quiz.create({
      user: req.user._id,
      topic,
      questions
    });

    // For Learning Mode, we send specific details (or hiding them if strict)
    // const safeQuestions = questions.map(({ correctAnswer, ...rest }) => rest);
    const safeQuestions = questions; // Send full data for immediate feedback mode

    res.status(200).json({
      quizId: quiz._id,
      questions: safeQuestions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit quiz
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz || quiz.completed) {
      return res.status(400).json({ message: "Invalid quiz" });
    }

    let correct = 0;
    let explanations = []; // To store data for AI generation

    // Loop through questions to calculate score and identify wrong answers
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        correct++;
      } else {
        // Collect details for AI explanations for incorrect answers
        explanations.push({
          question: q.question,
          yourAnswer: answers[i],
          correctAnswer: q.correctAnswer,
          difficulty: q.difficulty
        });
      }
    });

    const score = correct;
    const accuracy = Math.round((correct / quiz.questions.length) * 100);

    // Update Quiz Document
    quiz.answers = answers;
    quiz.score = score;
    quiz.accuracy = accuracy;
    quiz.completed = true;
    await quiz.save();

    // Mastery logic
    let masteryStatus = "Average";
    if (accuracy >= 70) masteryStatus = "Strong";
    else if (accuracy < 60) masteryStatus = "Weak";

    // Update user learning history
    const user = await User.findById(quiz.user);
    user.learningHistory.push({
      topicName: quiz.topic,
      quizScore: accuracy,
      masteryStatus
    });

    if (masteryStatus === "Weak") {
      if (!user.weakTopics.includes(quiz.topic)) {
        user.weakTopics.push(quiz.topic);
      }
    }
    await user.save();

    // 🤖 Generate AI explanations (ASYNC)
    // We do this AFTER updating the DB so the user's progress is saved first
    const explainedResults = [];
    for (const item of explanations) {
      const explanation = await explainWrongAnswer(
        item.question,
        item.correctAnswer,
        item.yourAnswer,
        quiz.topic
      );

      explainedResults.push({
        ...item,
        explanation
      });
    }

    // Return the final result including AI feedback
    res.status(200).json({
      success: true,
      score,
      accuracy,
      masteryStatus,
      wrongAnswers: explainedResults // This contains the AI-generated feedback
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// const Quiz = require("../models/Quiz.model");
// const { generateQuizQuestions } = require("../utils/generateQuiz");

// // Generate quiz
// exports.generateQuiz = async (req, res) => {
//   try {
//     const { topic } = req.body;

//     const questions = await generateQuizQuestions(topic);

//     const quiz = await Quiz.create({
//       user: req.user._id,
//       topic,
//       questions
//     });

//     // Hide correct answers before sending
//     const safeQuestions = questions.map(({ correctAnswer, ...rest }) => rest);

//     res.status(200).json({
//       quizId: quiz._id,
//       questions: safeQuestions
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Submit quizconst User = require("../models/User.model");

// exports.submitQuiz = async (req, res) => {
    
//   try {
//     const { quizId, answers } = req.body;

//     const quiz = await Quiz.findById(quizId);
//     if (!quiz || quiz.completed) {
//       return res.status(400).json({ message: "Invalid quiz" });
//     }

//     let correct = 0;
//     let weakCount = 0;

//     quiz.questions.forEach((q, i) => {
//       if (answers[i] === q.correctAnswer) {
//         correct++;
//       } else if (q.difficulty === "Hard") {
//         weakCount++;
//       }
//     });

//     const score = correct;
//     const accuracy = Math.round((correct / quiz.questions.length) * 100);

//     quiz.answers = answers;
//     quiz.score = score;
//     quiz.accuracy = accuracy;
//     quiz.completed = true;

//     await quiz.save();

//     // Mastery logic
//     let masteryStatus = "Average";
//     if (accuracy >= 70) masteryStatus = "Strong";
//     else if (accuracy < 60) masteryStatus = "Weak";

//     // Update user learning history
//     const user = await User.findById(quiz.user);

//     user.learningHistory.push({
//       topicName: quiz.topic,
//       quizScore: accuracy,
//       masteryStatus
//     });

//     if (masteryStatus === "Weak") {
//       if (!user.weakTopics.includes(quiz.topic)) {
//         user.weakTopics.push(quiz.topic);
//       }
//     }

//     await user.save();

//     res.status(200).json({
//       success: true,
//       score,
//       accuracy,
//       masteryStatus
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
