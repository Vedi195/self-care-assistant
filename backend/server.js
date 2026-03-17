require('dotenv').config();
const express = require('express');
const cors = require('cors');
const askGemini = require('./geminiService');

// Verify Gemini API Key exists
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing from .env file");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ---------------------------
//  AI CHATBOT ROUTE (Keep this!)
// ---------------------------
app.post('/api/ask-ai', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await askGemini(prompt);

    return res.json({
      reply: response 
    });

  } catch (error) {
    console.error("❌ AI Chatbot Error:", error);
    return res.status(500).json({
      error: "Failed to get response from Gemini"
    });
  }
});

// ---------------------------
//  SERVER START
// ---------------------------
app.listen(PORT, () => {
  console.log(`🚀 AI Server running at http://localhost:${PORT}`);
});