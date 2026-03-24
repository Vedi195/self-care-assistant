// Load environment variables from .env
require('dotenv').config();

// Check Mongo URI
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing from .env file");
  process.exit(1);
}

// Check Gemini API Key
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing from .env file");
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Contact Form Routes
const contactRoutes = require('./routes/contact');

// Gemini Chatbot Service
const askGemini = require('./geminiService');  // ⭐ NEW LINE

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
(async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
})();

// ---------------------------
//  CONTACT FORM ROUTE
// ---------------------------
app.use('/api/contact', contactRoutes);

// ---------------------------
//  AI CHATBOT ROUTE ⭐ NEW ⭐
// ---------------------------
app.post('/api/ask-ai', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await askGemini(prompt);

    // Do NOT trim, do NOT replace newlines
    return res.json({
      reply: response   // raw markdown
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
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
