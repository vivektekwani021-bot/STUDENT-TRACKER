// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// exports.generateQuizQuestions = async (topic) => {
//   const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//   const prompt = `
// Generate exactly 12 MCQ questions on topic "${topic}".
// Rules:
// - 4 Easy, 4 Medium, 4 Hard
// - Each question must have 4 options
// - Mention correct answer explicitly
// - Return STRICT JSON ONLY in this format:

// [
//   {
//     "question": "",
//     "options": ["", "", "", ""],
//     "correctAnswer": "",
//     "difficulty": "Easy"
//   }
// ]
// `;

//   const result = await model.generateContent(prompt);

//   return JSON.parse(result.response.text());
// };
const axios = require("axios");

exports.generateQuizQuestions = async (topic) => {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are an exam paper setter who generates clean MCQ questions in JSON."
          },
          {
            role: "user",
            content: `
Generate EXACTLY 10 MCQ questions on topic "${topic}".

Rules:
- 3 Easy, 3 Medium, 4 Hard
- Each question must have 4 options
- "correctAnswer" must be the 0-based INDEX of the correct option (0, 1, 2, or 3)
- Include a short "explanation" for why the answer is correct
- Return STRICT JSON ONLY in this format:

[
  {
    "question": "",
    "options": ["", "", "", ""],
    "correctAnswer": 0,
    "explanation": "",
    "difficulty": "Easy"
  }
]
`
          }
        ],
        temperature: 0.3,
        temperature: 0.3,
        max_tokens: 4000
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const content = response.data.choices[0].message.content;
    const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanContent);

  } catch (error) {
    console.error("QUIZ GEN ERROR DETAILS:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error("Failed to generate quiz");
  }
};
