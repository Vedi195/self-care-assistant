import React, { useState, useEffect } from 'react';
import './SkinHairCare.css';

import Confetti from "react-confetti";
import { FaRegCopy } from 'react-icons/fa';
import ReactMarkdown from "react-markdown";

const SkinHairCare = () => {
  const [currentView, setCurrentView] = useState('main');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizStep, setQuizStep] = useState(0);
  const [careProfile, setCareProfile] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSkinType, setSelectedSkinType] = useState("");
  const [selectedHairType, setSelectedHairType] = useState("");


  const quizQuestions = [
    {
      question: "What's your skin type?",
      category: "skin",
      options: ["Oily", "Dry", "Combination", "Sensitive", "Normal"]
    },
    {
      question: "What's your main skin concern?",
      category: "skin",
      options: ["Acne/Breakouts", "Dark spots/Hyperpigmentation", "Fine lines/Aging", "Dryness", "Sensitivity/Redness"]
    },
    {
      question: "What's your hair type?",
      category: "hair",
      options: ["Straight", "Wavy", "Curly", "Coily"]
    },
    {
      question: "What's your hair texture?",
      category: "hair",
      options: ["Fine", "Medium", "Thick", "Coarse"]
    },
    {
      question: "What's your main hair concern?",
      category: "hair",
      options: ["Dryness", "Oiliness", "Hair loss/Thinning", "Damage/Breakage", "Frizz", "Dandruff"]
    },
    {
      question: "How often do you wash your hair?",
      category: "hair",
      options: ["Daily", "Every other day", "2-3 times per week", "Once a week", "Less than once a week"]
    },
    {
      question: "What's your budget preference for products?",
      category: "general",
      options: ["Budget-friendly (Under $15)", "Mid-range ($15-40)", "Premium ($40-80)", "Luxury ($80+)"]
    }
  ];

  const fullRoutines = {
    skin: {
      oily: {
        morning: [
          "Foaming cleanser (2 mins)",
          "Salicylic toner (30 sec)",
          "Gel moisturizer (1 min)",
          "Sunscreen SPF 30+ (1 min)"
        ],
        evening: [
          "Oil cleanser (1 min)",
          "Foaming cleanser (2 min)",
          "Retinol (2–3 nights/week)",
          "Light moisturizer (1 min)"
        ]
      },
      dry: {
        morning: [
          "Cream cleanser",
          "Hydrating toner",
          "Vitamin C serum",
          "Thick moisturizer",
          "SPF 30+"
        ],
        evening: [
          "Oil/cream cleanser",
          "Hydrating toner",
          "Hyaluronic serum",
          "Night cream"
        ]
      },
      combination: {
        morning: [
          "Gentle cleanser",
          "Balancing toner",
          "Light moisturizer",
          "SPF 30+"
        ],
        evening: [
          "Cleanser",
          "Niacinamide serum",
          "Gel moisturizer"
        ]
      },
      sensitive: {
        morning: [
          "Non-foaming cleanser",
          "Aloe toner",
          "Light cream",
          "SPF"
        ],
        evening: [
          "Cream cleanser",
          "Centella serum",
          "Calming moisturizer"
        ]
      },
      normal: {
        morning: [
          "Gentle cleanser",
          "Hydrating toner",
          "Moisturizer",
          "SPF"
        ],
        evening: [
          "Cleanser",
          "Serum (Vitamin C / HA)",
          "Night moisturizer"
        ]
      }
    },

    hair: {
      straight: {
        wash: ["Use mild shampoo", "Apply light conditioner", "Air dry"],
        weekly: ["Hair oiling once a week", "Hair mask once a week"]
      },
      wavy: {
        wash: ["Sulfate-free shampoo", "Condition mid–ends", "Scrunch while drying"],
        weekly: ["Deep conditioning", "Apply hair serum"]
      },
      curly: {
        wash: ["Co-wash or sulfate-free shampoo", "Leave-in conditioner", "Dry with microfiber towel"],
        weekly: ["Curl mask", "Hair oil before wash"]
      },
      coily: {
        wash: ["Moisturizing shampoo", "Rich conditioner", "Leave-in cream"],
        weekly: ["Hot oil treatment", "Deep hydration mask"]
      }
    }
  };

  const organicRemedies = [
    {
      name: "Honey & Oatmeal Face Mask",
      purpose: "For sensitive or dry skin",
      ingredients: ["2 tbsp oatmeal", "1 tbsp honey", "1 tsp water"],
      instructions: "Mix ingredients, apply for 15 minutes, rinse with warm water",
      benefits: "Soothes irritation, provides gentle exfoliation"
    },
    {
      name: "Coconut Oil Hair Treatment",
      purpose: "For dry or damaged hair",
      ingredients: ["2-3 tbsp coconut oil", "Optional: few drops essential oil"],
      instructions: "Warm oil, apply to hair, leave for 30 minutes, shampoo out",
      benefits: "Deep moisturizing, reduces protein loss"
    },
    {
      name: "Green Tea Toner",
      purpose: "For oily or acne-prone skin",
      ingredients: ["1 green tea bag", "1 cup hot water", "1 tsp apple cider vinegar"],
      instructions: "Steep tea, cool, add vinegar, apply with cotton pad",
      benefits: "Reduces inflammation, controls oil production"
    },
    {
      name: "Avocado Hair Mask",
      purpose: "For nourishing dry hair",
      ingredients: ["1 ripe avocado", "2 tbsp olive oil", "1 tbsp honey"],
      instructions: "Mash avocado, mix with oil and honey, apply for 20 minutes",
      benefits: "Rich in vitamins, deeply moisturizes"
    }
  ];

  useEffect(() => {
    // Load saved profile
    const savedProfile = localStorage.getItem('skinHairProfile');
    if (savedProfile) {
      setCareProfile(JSON.parse(savedProfile));
    }

    // Initialize chat
    setChatMessages([
      {
        type: 'bot',
        message: "✨ Hello! I'm your skin and hair care specialist! Ask me about skincare routines, hair care tips, product recommendations, or any beauty concerns you have. How can I help you glow today?"
      }
    ]);
  }, []);

  const handleQuizAnswer = (answer) => {
    const newAnswers = { ...quizAnswers, [quizStep]: answer };
    setQuizAnswers(newAnswers);

    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      generateCareProfile(newAnswers);
    }
  };

  const generateCareProfile = (answers) => {
    const profile = {
      skinType: answers[0],
      skinConcern: answers[1],
      hairType: answers[2],
      hairTexture: answers[3],
      hairConcern: answers[4],
      washFrequency: answers[5],
      budget: answers[6],
      recommendations: generateRecommendations(answers)
    };

    setCareProfile(profile);
    localStorage.setItem('skinHairProfile', JSON.stringify(profile));
  };

  const generateRecommendations = (answers) => {
    const recs = [];
    
    // Skin recommendations
    if (answers[0] === 'Oily') {
      recs.push({
        category: 'Skincare',
        title: 'Oil Control Routine',
        description: 'Use gel-based cleansers, salicylic acid toners, and lightweight moisturizers. Avoid over-cleansing.',
        products: ['Cetaphil Foaming Cleanser', 'Paula\'s Choice BHA Liquid', 'Neutrogena Oil-Free Moisturizer']
      });
    } else if (answers[0] === 'Dry') {
      recs.push({
        category: 'Skincare',
        title: 'Hydration Focus',
        description: 'Use cream cleansers, hydrating serums, and rich moisturizers. Add face oils at night.',
        products: ['CeraVe Hydrating Cleanser', 'The Ordinary Hyaluronic Acid', 'Vanicream Daily Facial Moisturizer']
      });
    }

    // Hair recommendations
    if (answers[2] === 'Curly' || answers[2] === 'Coily') {
      recs.push({
        category: 'Haircare',
        title: 'Curl Care Method',
        description: 'Use sulfate-free shampoos, deep condition weekly, and apply leave-in conditioner to wet hair.',
        products: ['DevaCurl Low-Poo', 'Shea Moisture Deep Treatment Mask', 'Ouai Leave-In Conditioner']
      });
    }

    return recs;
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizStep(0);
    setCareProfile(null);
    localStorage.removeItem('skinHairProfile');
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
          prompt: `You are a gentle and knowledgeable skin & hair care advisor. Give safe, simple, and practical care tips using common products. Avoid medical advice. Keep suggestions clear and easy to follow. 
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
    const favorites = JSON.parse(localStorage.getItem('skinCareFavorites') || '[]');
    if (!favorites.includes(tip)) {
      favorites.push(tip);
      localStorage.setItem('skinCareFavorites', JSON.stringify(favorites));
      alert('Tip saved to favorites! ❤️');
    } else {
      alert('This tip is already in your favorites! 😊');
    }
  };

  return (
    <div className="skin-hair-care">
      <div className="care-header">
        <h1>💆‍♀️ Skin & Hair Care</h1>
        <p>Discover your perfect beauty routine with personalized recommendations</p>
      </div>

      <div className="care-nav">
        <button 
          className={currentView === 'main' ? 'active' : ''}
          onClick={() => setCurrentView('main')}
        >
          🏠 Overview
        </button>
        <button 
          className={currentView === 'quiz' ? 'active' : ''}
          onClick={() => setCurrentView('quiz')}
        >
          📋 Care Quiz
        </button>
        <button 
          className={currentView === 'routines' ? 'active' : ''}
          onClick={() => setCurrentView('routines')}
        >
          📅 Routines
        </button>
        <button 
          className={currentView === 'organic' ? 'active' : ''}
          onClick={() => setCurrentView('organic')}
        >
          🌿 Natural Remedies
        </button>
        <button 
          className={currentView === 'chat' ? 'active' : ''}
          onClick={() => setCurrentView('chat')}
        >
          💬 Beauty Chat
        </button>
      </div>

      {currentView === 'main' && (
        <div className="main-view">
          <div className="feature-cards">
            <div className="feature-card" onClick={() => setCurrentView('quiz')}>
              <div className="feature-icon">🔍</div>
              <h3>Find Your Type</h3>
              <p>Take our quiz to discover your skin and hair type with personalized recommendations</p>
            </div>
            
            <div className="feature-card" onClick={() => setCurrentView('routines')}>
              <div className="feature-icon">📅</div>
              <h3>Care Routines</h3>
              <p>Explore morning and evening routines tailored to your specific needs</p>
            </div>

            <div className="feature-card" onClick={() => setCurrentView('organic')}>
              <div className="feature-icon">🌿</div>
              <h3>Natural Remedies</h3>
              <p>Discover organic DIY treatments using ingredients from your kitchen</p>
            </div>
          </div>

          <div className="daily-tips">
            <h3>💡 Today's Beauty Tips</h3>
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-icon">🧴</div>
                <h4>Less is More</h4>
                <p>Start with a simple routine and gradually add products. Your skin needs time to adjust.</p>
                <button onClick={() => saveTipToFavorites("Start with a simple routine and gradually add products. Your skin needs time to adjust.")}>
                  ❤️ Save
                </button>
              </div>
              
              <div className="tip-card">
                <div className="tip-icon">☀️</div>
                <h4>SPF Every Day</h4>
                <p>Sunscreen is your best anti-aging product. Apply daily, even when staying indoors.</p>
                <button onClick={() => saveTipToFavorites("Sunscreen is your best anti-aging product. Apply daily, even when staying indoors.")}>
                  ❤️ Save
                </button>
              </div>
              
              <div className="tip-card">
                <div className="tip-icon">💧</div>
                <h4>Hydrate Inside Out</h4>
                <p>Drink plenty of water and use hydrating products for healthy, glowing skin.</p>
                <button onClick={() => saveTipToFavorites("Drink plenty of water and use hydrating products for healthy, glowing skin.")}>
                  ❤️ Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz View, Routines View, Organic View, and Chat View would follow similar patterns as other components */}
      {/* Due to length constraints, I'll include the key quiz logic and complete the remaining views */}

      {currentView === 'quiz' && (
        <div className="quiz-view">
          {!careProfile ? (
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
            <div className="results-container">
              <Confetti numberOfPieces={180} gravity={0.25} recycle={false} />
              <h2>✨ Your Personalized Beauty Profile</h2>
              <div className="profile-summary">
                <div className="profile-item">
                  <strong>Skin Type:</strong> {careProfile.skinType}
                </div>
                <div className="profile-item">
                  <strong>Hair Type:</strong> {careProfile.hairType} {careProfile.hairTexture}
                </div>
                <div className="profile-item">
                  <strong>Main Concerns:</strong> {careProfile.skinConcern}, {careProfile.hairConcern}
                </div>
              </div>
              
              <div className="recommendations">
                {careProfile.recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-card">
                    <h4>{rec.title}</h4>
                    <p>{rec.description}</p>
                    <button onClick={() => saveTipToFavorites(rec.description)}>
                      ❤️ Save
                    </button>
                  </div>
                ))}
              </div>

              <button className="retry-btn" onClick={resetQuiz}>
                🔄 Retake Quiz
              </button>
            </div>
          )}
        </div>
      )}

      {currentView === "routines" && (
        <div className="routines-view">

          <h2>✨ Personalized Skin & Hair Routine</h2>

          {/* Skin Type Dropdown */}
          <div className="select-group">
            <label>Select Skin Type</label>
            <select
              value={selectedSkinType}
              onChange={(e) => setSelectedSkinType(e.target.value)}
            >
              <option value="">Choose your skin type</option>
              <option value="oily">Oily</option>
              <option value="dry">Dry</option>
              <option value="combination">Combination</option>
              <option value="sensitive">Sensitive</option>
              <option value="normal">Normal</option>
            </select>
          </div>

          {/* Hair Type Dropdown */}
          <div className="select-group">
            <label>Select Hair Type</label>
            <select
              value={selectedHairType}
              onChange={(e) => setSelectedHairType(e.target.value)}
            >
              <option value="">Choose your hair type</option>
              <option value="straight">Straight</option>
              <option value="wavy">Wavy</option>
              <option value="curly">Curly</option>
              <option value="coily">Coily</option>
            </select>
          </div>

          {/* Skin Routine Output */}
          {selectedSkinType && (
            <div className="routine-card">
              <h3>🧴 Skin Care Routine ({selectedSkinType})</h3>

              <h4>🌞 Morning Routine</h4>
              <ul>
                {fullRoutines.skin[selectedSkinType].morning.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <h4>🌙 Evening Routine</h4>
              <ul>
                {fullRoutines.skin[selectedSkinType].evening.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Hair Routine Output */}
          {selectedHairType && (
            <div className="routine-card">
              <h3>💇‍♀️ Hair Care Routine ({selectedHairType})</h3>

              <h4>🚿 Wash Routine</h4>
              <ul>
                {fullRoutines.hair[selectedHairType].wash.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <h4>🧪 Weekly Routine</h4>
              <ul>
                {fullRoutines.hair[selectedHairType].weekly.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}

      {currentView === 'organic' && (
        <div className="organic-view">
          <h2>🌿 Natural Beauty Remedies</h2>
          <div className="remedies-grid">
            {organicRemedies.map((remedy, index) => (
              <div key={index} className="remedy-card">
                <h3>{remedy.name}</h3>
                <p className="remedy-purpose">{remedy.purpose}</p>
                <div className="remedy-details">
                  <div className="ingredients">
                    <strong>Ingredients:</strong>
                    <ul>
                      {remedy.ingredients.map((ingredient, i) => (
                        <li key={i}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="instructions">
                    <strong>Instructions:</strong>
                    <p>{remedy.instructions}</p>
                  </div>
                  <div className="benefits">
                    <strong>Benefits:</strong>
                    <p>{remedy.benefits}</p>
                  </div>
                </div>
                <button onClick={() => saveTipToFavorites(`${remedy.name}: ${remedy.instructions}`)}>
                  ❤️ Save Recipe
                </button>
              </div>
            ))}
          </div>
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
                placeholder="Ask about skincare, haircare, products..."
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
  );
};

export default SkinHairCare;