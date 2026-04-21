const { GoogleGenerativeAI } = require("@google/generative-ai");

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function askGemini(prompt) {
  try {
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    // CRITICAL: Check if the response was blocked by safety filters
    if (!result.response || !result.response.candidates || result.response.candidates[0].finishReason === 'SAFETY') {
        return "I'm sorry, but I can't answer that due to safety filters. Try asking differently!";
    }

    return result.response.text();
  } catch (error) {
    // CHANGE THIS: Log the actual error object to your terminal
    console.error("FULL GEMINI ERROR DETAILS:", error); 
    throw error; // Throw the original error so server.js can see it
  }
}

module.exports = askGemini;