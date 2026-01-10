const axios = require("axios");

exports.explainWrongAnswer = async (
  question,
  correctAnswer,
  userAnswer,
  topic
) => {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You are a patient teacher who explains mistakes in very simple language for students."
          },
          {
            role: "user",
            content: `
Topic: ${topic}

Question:
${question}

User Answer:
${userAnswer}

Correct Answer:
${correctAnswer}

Explain in simple language:
1. Why the user's answer is wrong
2. Why the correct answer is right
3. Short concept explanation
`
          }
        ],
        temperature: 0.4,
        max_tokens: 400
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;

  } catch (error) {
    console.error("EXPLAIN WRONG ANSWER ERROR DETAILS:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error("Failed to explain wrong answer");
  }
};



// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// exports.explainWrongAnswer = async (
//   question,
//   correctAnswer,
//   userAnswer,
//   topic
// ) => {
//   const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//   const prompt = `
// Topic: ${topic}

// Question:
// ${question}

// User Answer:
// ${userAnswer}

// Correct Answer:
// ${correctAnswer}

// Explain in simple language:
// 1. Why the user's answer is wrong
// 2. Why the correct answer is right
// 3. Short concept explanation
// `;

//   const result = await model.generateContent(prompt);
//   return result.response.text();
// };
