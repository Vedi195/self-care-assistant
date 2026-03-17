import React, { useState, useEffect } from 'react';
import './FashionSuggestion.css';

import Confetti from "react-confetti";
import { FaRegCopy } from 'react-icons/fa';
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import ExpertTalkWidget from '../ExpertTalkWidget';

const FashionSuggestion = () => {
  const [currentView, setCurrentView] = useState('main');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizStep, setQuizStep] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [styleResult, setStyleResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const quizQuestions = [
    {
      question: "What best describes your overall fashion vibe?",
      options: [
        "Comfort-first — I love easy, breathable outfits",
        "Elegant & classy — neat, polished looks",
        "Trendy girl — I love experimenting with fashion",
        "Minimal and timeless — simple but stylish"
      ]
    },
    {
      question: "Which color palette do you naturally gravitate towards?",
      options: [
        "Neutrals — black, white, beige, grey",
        "Soft pastels — lavender, mint, baby pink",
        "Bold pops — red, cobalt blue, hot pink",
        "Earthy tones — brown, olive, rust, mustard"
      ]
    },
    {
      question: "How would you describe your daily lifestyle?",
      options: [
        "College / Student — casual, comfortable, quick outfits",
        "Professional — formal or semi-formal every day",
        "Active & Outdoorsy — functional, sporty looks",
        "Social Butterfly — outings, café dates, events"
      ]
    },
    {
      question: "What’s your shopping preference?",
      options: [
        "Affordable basics — I love budget-friendly finds",
        "Mid-range — good quality at reasonable price",
        "High-end pieces — I prefer premium items",
        "A mix — I buy whatever I fall in love with"
      ]
    }
  ];

  const styleTypes = {
    "Comfort-first — I love easy, breathable outfits": {
      name: "Soft Girl Comfort",
      description: "You love cozy, breathable, cute outfits that make you feel relaxed and pretty.",
      tips: [
        "Choose flowy tops, oversized tees, and soft fabrics",
        "Wear mom jeans, straight pants, or leggings",
        "Style with sneakers, flats, and pastel bags",
        "Use soft-girl accessories like scrunchies and dainty necklaces"
      ]
    },

    "Elegant & classy — neat, polished looks": {
      name: "Classy Chic",
      description: "You prefer polished, elegant outfits with clean silhouettes.",
      tips: [
        "Invest in blazers, trousers, satin blouses, and midi dresses",
        "Choose neutral or monotone outfits",
        "Wear structured handbags & pointed heels",
        "Keep accessories minimal and elegant"
      ]
    },

    "Trendy girl — I love experimenting with fashion": {
      name: "Fashionista Edge",
      description: "You love bold patterns, new trends, and expressive outfits.",
      tips: [
        "Try statement jackets and printed tops",
        "Mix bold colors and modern accessories",
        "Wear trending shoes like chunky sneakers or block heels",
        "Experiment with layers and silhouettes"
      ]
    },

    "Minimal and timeless — simple but stylish": {
      name: "Timeless Minimalist",
      description: "You love clean, simple, timeless outfits that always stay stylish.",
      tips: [
        "Stick to monochrome or two-tone outfits",
        "Choose basics like white shirts and tailored pants",
        "Wear neutral handbags & clean shoes",
        "Keep accessories minimal and premium-looking"
      ]
    }
  };

  useEffect(() => {
    // Initialize chat with welcome message
    setChatMessages([
      {
        type: 'bot',
        message: "👋 Hi! I'm your fashion assistant! Ask me anything about style, outfit ideas, or fashion trends. How can I help you look amazing today?"
      }
    ]);
  }, []);

  const handleQuizAnswer = (answer) => {
    const newAnswers = { ...quizAnswers, [quizStep]: answer };
    setQuizAnswers(newAnswers);

    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // USE ANSWER OF QUESTION 1 (STYLE QUESTION)
      const primaryStyle = newAnswers[0];
      setStyleResult(styleTypes[primaryStyle]);
    }
  };


  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizStep(0);
    setStyleResult(null);
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setIsLoading(true);

    // Add user message to UI
    setChatMessages(prev => [...prev, { type: 'user', message: userMessage }]);

    try {
      const response = await fetch("http://localhost:5000/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // craft the system prompt to guide Gemini; change wording as needed
          prompt: `You are a friendly, helpful fashion expert. Give concise, practical outfit tips or suggestions.
          RULES:
          1. If the user is greeting (e.g., "hi", "hello", "hey"), respond casually and short.
          2. If the user says "thanks", "okay", "good", "bye", respond normally and DO NOT give steps.
          3. If the user asks for advice, routines, fashion tips, skin care, hair care, or any guidance — then reply in a structured format with:
            - Headings
            - Steps
            - Bullet points
            - Clean spacing
          4. Always detect user intent before choosing the response format.
          5. Never return steps for small talk.


          User: ${userMessage}`
        })
      });

      const data = await response.json();

      const botResponse = data.reply || "Sorry, I couldn't generate a response right now.";

      setChatMessages(prev => [...prev, { type: 'bot', message: botResponse }]);
    } catch (error) {
      console.error("Frontend error:", error);
      setChatMessages(prev => [
        ...prev,
        { type: 'bot', message: "⚠️ Something went wrong. Please try again later." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };


  const saveTipToFavorites = (tip) => {
    const favorites = JSON.parse(localStorage.getItem('fashionFavorites') || '[]');
    if (!favorites.includes(tip)) {
      favorites.push(tip);
      localStorage.setItem('fashionFavorites', JSON.stringify(favorites));
      alert('Tip saved to favorites! ❤️');
    } else {
      alert('This tip is already in your favorites! 😊');
    }
  };

  return (
    <div className="fashion-service">
      <div className="fashion-suggestion">
        <div className="fashion-header">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1>👗 Fashion Suggestion</h1>
            <p>Discover your personal style and get fashion advice</p>
          </motion.div>
        </div>

        <motion.div
          className="fashion-nav"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.button
            className={currentView === 'main' ? 'active' : ''}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => setCurrentView('main')}
          >
            🏠 Overview
          </motion.button>

          <motion.button
            className={currentView === 'quiz' ? 'active' : ''}
            onClick={() => setCurrentView('quiz')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📋 Style Quiz
          </motion.button>

          <motion.button
            className={currentView === 'chat' ? 'active' : ''}
            onClick={() => setCurrentView('chat')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            💬 Fashion Chat
          </motion.button>
        </motion.div>

        {currentView === 'main' && (
          <div className="main-view">
            <div className="feature-cards">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="feature-card" 
                onClick={() => setCurrentView('quiz')}
              >
                <div className="feature-icon">🎯</div>
                <h3>Discover Your Style</h3>
                <p>Take our quiz to find your perfect fashion personality</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="feature-card" 
                onClick={() => setCurrentView('chat')}
              >
                <div className="feature-icon">🤖</div>
                <h3>AI Fashion Assistant</h3>
                <p>Chat with our AI for personalized outfit recommendations</p>
              </motion.div>
            </div>

            <div className="daily-tips">
              <h3>💡 Today's Fashion Tips</h3>
              <div className="tips-grid">
                <div className="tip-card">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <p>"Mix textures for visual interest - try pairing a silk blouse with denim or leather."</p>
                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => saveTipToFavorites("Mix textures for visual interest - try pairing a silk blouse with denim or leather.")}>
                      ❤️ Save
                    </motion.button>
                  </motion.div>
                </div>
                <div className="tip-card">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <p>"The rule of three: stick to maximum 3 colors in one outfit for a cohesive look."</p>
                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => saveTipToFavorites("The rule of three: stick to maximum 3 colors in one outfit for a cohesive look.")}>
                      ❤️ Save
                    </motion.button>
                  </motion.div>
                </div>
                <div className="tip-card">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                      <p>"When in doubt, add a belt - it defines your waist and elevates any outfit."</p>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }} 
                        onClick={() => saveTipToFavorites("When in doubt, add a belt - it defines your waist and elevates any outfit.")}>
                        ❤️ Save
                      </motion.button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'quiz' && (
          <div className="quiz-view">
            {!styleResult ? (
              <div className="quiz-container">
                <div className="quiz-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${((quizStep + 1) / quizQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                  <span>Question {quizStep + 1} of {quizQuestions.length}</span>
                </div>

                <div className="question-card">
                  <h3>{quizQuestions[quizStep].question}</h3>
                  <div className="options">
                    {quizQuestions[quizStep].options.map((option, index) => (
                      <button
                        key={index}
                        className="option-btn"
                        onClick={() => handleQuizAnswer(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="result-container">
                <Confetti numberOfPieces={180} gravity={0.25} recycle={false} />
                <div className="result-header">
                  <h2>🎉 Your Style Type: {styleResult.name}</h2>
                  <p>{styleResult.description}</p>
                </div>

                <div className="style-tips">
                  <h3>✨ Your Personal Style Tips</h3>
                  <div className="tips-list">
                    {styleResult.tips.map((tip, index) => (
                      <div key={index} className="tip-item">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5 }}
                        >
                          <p>{tip}</p>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => saveTipToFavorites(tip)}>
                            ❤️ Save
                          </motion.button>
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="retry-btn"
                  onClick={resetQuiz}
                >
                  🔄 Take Quiz Again
                </motion.button>
              </div>
            )}
          </div>
        )}

        {currentView === 'chat' && (
          <div className="chat-view">
            <div className="chat-container">
              <div className="chat-messages">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`message ${msg.type}`}>
                    <div className="message-content">
                      <ReactMarkdown>{msg.message}</ReactMarkdown>
                      <div className="message-actions">
                        {msg.type === 'bot' && (
                          <button
                            className="copy-btn"
                            onClick={() => navigator.clipboard.writeText(msg.message)}
                          >
                            <FaRegCopy />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="message bot">
                    <div className="message-content loading">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <form className="chat-input-form" onSubmit={handleChatSubmit}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask me about fashion, outfits, or style tips..."
                  disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !chatInput.trim()}>
                  ➤
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      {/* ── NEW: Expert Talk floating widget ─────────────────────────────── */}
      <ExpertTalkWidget service="fashion" isPremium={false} />
    </div>
  );
};

export default FashionSuggestion;