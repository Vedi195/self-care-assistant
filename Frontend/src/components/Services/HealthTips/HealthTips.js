import React, { useState, useEffect } from 'react';
import './HealthTips.css';
import Confetti from "react-confetti";

const HealthTips = () => {
  const [currentView, setCurrentView] = useState('main');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizStep, setQuizStep] = useState(0);
  const [healthProfile, setHealthProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const quizQuestions = [
    {
      question: "What's your current age group?",
      type: "options",
      options: ["18-25", "26-35", "36-45", "46-55", "56+"]
    },
    {
      question: "What's your height? (in feet and inches)",
      type: "text",
      placeholder: "e.g., 5'6\" or 5 feet 6 inches"
    },
    {
      question: "What's your current weight? (in kg or lbs)",
      type: "text",
      placeholder: "e.g., 65 kg or 143 lbs"
    },
    {
      question: "How would you describe your current activity level?",
      type: "options",
      options: [
        "Sedentary (little to no exercise)",
        "Lightly active (light exercise 1-3 days/week)",
        "Moderately active (moderate exercise 3-5 days/week)",
        "Very active (hard exercise 6-7 days/week)",
        "Extremely active (very hard exercise, physical job)"
      ]
    },
    {
      question: "What are your main health goals?",
      type: "options",
      options: [
        "Weight loss",
        "Weight gain/muscle building",
        "Maintain current weight",
        "Improve cardiovascular health",
        "Increase flexibility and mobility",
        "Reduce stress and improve mental health"
      ]
    },
    {
      question: "Do you have any health conditions or dietary restrictions?",
      type: "text",
      placeholder: "e.g., diabetes, vegetarian, allergies (optional)"
    },
    {
      question: "How many hours do you sleep per night on average?",
      type: "options",
      options: ["Less than 5 hours", "5-6 hours", "6-7 hours", "7-8 hours", "More than 8 hours"]
    },
    {
      question: "How would you rate your stress level?",
      type: "options",
      options: ["Very low", "Low", "Moderate", "High", "Very high"]
    }
  ];

  const yogaPoses = {
    beginner: [
      {
        name: "Child's Pose (Balasana)",
        description: "Great for relaxation and stress relief",
        benefits: "Relieves back pain, calms the mind",
        duration: "Hold for 1-3 minutes"
      },
      {
        name: "Cat-Cow Pose",
        description: "Gentle spinal movement for flexibility",
        benefits: "Improves spinal flexibility, relieves tension",
        duration: "10-15 repetitions"
      },
      {
        name: "Downward Facing Dog",
        description: "Full body stretch and strengthening pose",
        benefits: "Strengthens arms and legs, stretches spine",
        duration: "Hold for 30-60 seconds"
      }
    ],
    intermediate: [
      {
        name: "Warrior II (Virabhadrasana II)",
        description: "Standing pose for strength and focus",
        benefits: "Strengthens legs, improves concentration",
        duration: "Hold for 30-60 seconds each side"
      },
      {
        name: "Triangle Pose (Trikonasana)",
        description: "Standing side stretch pose",
        benefits: "Stretches side body, improves balance",
        duration: "Hold for 30-45 seconds each side"
      },
      {
        name: "Bridge Pose (Setu Bandhasana)",
        description: "Back strengthening and heart opening pose",
        benefits: "Strengthens back, opens chest and hips",
        duration: "Hold for 30-60 seconds"
      }
    ]
  };

  useEffect(() => {
    // Load saved profile if exists
    const savedProfile = localStorage.getItem('healthProfile');
    if (savedProfile) {
      setHealthProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleQuizAnswer = (answer) => {
    const newAnswers = { ...quizAnswers, [quizStep]: answer };
    setQuizAnswers(newAnswers);

    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Quiz completed, generate recommendations
      generateHealthRecommendations(newAnswers);
    }
  };

  const generateHealthRecommendations = (answers) => {
    const profile = {
      age: answers[0],
      height: answers[1],
      weight: answers[2],
      activityLevel: answers[3],
      healthGoals: answers[4],
      conditions: answers[5] || 'None',
      sleepHours: answers[6],
      stressLevel: answers[7]
    };

    // Generate personalized recommendations
    const recs = [];

    // Activity recommendations
    if (answers[3].includes('Sedentary')) {
      recs.push({
        category: 'Exercise',
        title: 'Start with Light Activities',
        description: 'Begin with 15-20 minutes of walking daily. Gradually increase to 30 minutes.',
        icon: '🚶‍♀️'
      });
    } else if (answers[3].includes('Very active')) {
      recs.push({
        category: 'Exercise',
        title: 'Focus on Recovery',
        description: 'Include rest days and gentle yoga to prevent burnout and injury.',
        icon: '🧘‍♀️'
      });
    }

    // Sleep recommendations
    if (answers[6].includes('Less than 5') || answers[6].includes('5-6')) {
      recs.push({
        category: 'Sleep',
        title: 'Improve Sleep Duration',
        description: 'Aim for 7-9 hours of sleep. Create a bedtime routine and avoid screens before bed.',
        icon: '😴'
      });
    }

    // Stress recommendations
    if (answers[7].includes('High') || answers[7].includes('Very high')) {
      recs.push({
        category: 'Mental Health',
        title: 'Stress Management',
        description: 'Practice deep breathing, meditation, or gentle yoga. Consider talking to a counselor.',
        icon: '🌸'
      });
    }

    // Goal-based recommendations
    if (answers[4].includes('Weight loss')) {
      recs.push({
        category: 'Nutrition',
        title: 'Balanced Diet for Weight Loss',
        description: 'Focus on whole foods, lean proteins, and vegetables. Stay hydrated and eat mindfully.',
        icon: '🥗'
      });
    } else if (answers[4].includes('muscle building')) {
      recs.push({
        category: 'Nutrition',
        title: 'Protein-Rich Diet',
        description: 'Include lean meats, eggs, legumes, and dairy. Combine with strength training.',
        icon: '💪'
      });
    }

    // General wellness
    recs.push({
      category: 'Wellness',
      title: 'Stay Hydrated',
      description: 'Drink at least 8 glasses of water daily. More if you are active.',
      icon: '💧'
    });

    setHealthProfile(profile);
    setRecommendations(recs);
    localStorage.setItem('healthProfile', JSON.stringify(profile));
    localStorage.setItem('healthRecommendations', JSON.stringify(recs));
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizStep(0);
    setHealthProfile(null);
    setRecommendations([]);
    localStorage.removeItem('healthProfile');
    localStorage.removeItem('healthRecommendations');
  };

  const saveTipToFavorites = (tip) => {
    const favorites = JSON.parse(localStorage.getItem('healthFavorites') || '[]');
    if (!favorites.includes(tip)) {
      favorites.push(tip);
      localStorage.setItem('healthFavorites', JSON.stringify(favorites));
      alert('Health tip saved to favorites! ❤️');
    } else {
      alert('This tip is already in your favorites! 😊');
    }
  };

  const currentQuestion = quizQuestions[quizStep];

  return (
    <div className="health-tips-service">
      <div className="health-tips">
        <div className="health-header">
          <h1>🧘‍♀️ Health Tips</h1>
          <p>Personalized health guidance for your wellness journey</p>
        </div>

        <div className="health-nav">
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
            📋 Health Quiz
          </button>
          <button 
            className={currentView === 'yoga' ? 'active' : ''}
            onClick={() => setCurrentView('yoga')}
          >
            🧘‍♀️ Yoga Guide
          </button>
          {healthProfile && (
            <button 
              className={currentView === 'profile' ? 'active' : ''}
              onClick={() => setCurrentView('profile')}
            >
              👤 My Profile
            </button>
          )}
        </div>

        {currentView === 'main' && (
          <div className="main-view">
            <div className="feature-cards">
              <div className="feature-card" onClick={() => setCurrentView('quiz')}>
                <div className="feature-icon">📊</div>
                <h3>Health Assessment</h3>
                <p>Get personalized health recommendations based on your profile</p>
              </div>
              
              <div className="feature-card" onClick={() => setCurrentView('yoga')}>
                <div className="feature-icon">🧘‍♀️</div>
                <h3>Yoga & Exercise</h3>
                <p>Discover yoga poses and exercises suitable for your fitness level</p>
              </div>
            </div>

            <div className="daily-tips">
              <h3>💡 Today's Health Tips</h3>
              <div className="tips-grid">
                <div className="tip-card">
                  <div className="tip-icon">💧</div>
                  <h4>Stay Hydrated</h4>
                  <p>Drink at least 8 glasses of water daily to maintain optimal body function and energy levels.</p>
                  <button onClick={() => saveTipToFavorites("Drink at least 8 glasses of water daily to maintain optimal body function and energy levels.")}>
                    ❤️ Save
                  </button>
                </div>
                
                <div className="tip-card">
                  <div className="tip-icon">🚶‍♀️</div>
                  <h4>Move More</h4>
                  <p>Take a 10-minute walk every 2 hours to boost circulation and reduce stress.</p>
                  <button onClick={() => saveTipToFavorites("Take a 10-minute walk every 2 hours to boost circulation and reduce stress.")}>
                    ❤️ Save
                  </button>
                </div>
                
                <div className="tip-card">
                  <div className="tip-icon">😴</div>
                  <h4>Quality Sleep</h4>
                  <p>Maintain a consistent sleep schedule and aim for 7-9 hours of quality sleep nightly.</p>
                  <button onClick={() => saveTipToFavorites("Maintain a consistent sleep schedule and aim for 7-9 hours of quality sleep nightly.")}>
                    ❤️ Save
                  </button>
                </div>
                
                <div className="tip-card">
                  <div className="tip-icon">🥗</div>
                  <h4>Balanced Nutrition</h4>
                  <p>Include colorful fruits and vegetables in every meal for essential vitamins and minerals.</p>
                  <button onClick={() => saveTipToFavorites("Include colorful fruits and vegetables in every meal for essential vitamins and minerals.")}>
                    ❤️ Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'quiz' && (
          <div className="quiz-view">
            {!healthProfile ? (
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
                  <h3>{currentQuestion.question}</h3>
                  
                  {currentQuestion.type === 'options' ? (
                    <div className="options">
                      {currentQuestion.options.map((option, index) => (
                        <button 
                          key={index}
                          className="option-btn"
                          onClick={() => handleQuizAnswer(option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-input">
                      <input
                        type="text"
                        placeholder={currentQuestion.placeholder}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            handleQuizAnswer(e.target.value.trim());
                          }
                        }}
                      />
                      <button 
                        onClick={(e) => {
                          const input = e.target.previousElementSibling;
                          if (input.value.trim()) {
                            handleQuizAnswer(input.value.trim());
                          }
                        }}
                      >
                        Next ➤
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="results-container">
                <Confetti numberOfPieces={180} gravity={0.25} recycle={false} />
                <div className="results-header">
                  <h2>🎉 Your Personalized Health Recommendations</h2>
                  <p>Based on your profile, here are tailored suggestions for your wellness journey</p>
                </div>

                <div className="recommendations-grid">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="recommendation-card">
                      <div className="rec-icon">{rec.icon}</div>
                      <div className="rec-content">
                        <span className="rec-category">{rec.category}</span>
                        <h4>{rec.title}</h4>
                        <p>{rec.description}</p>
                        <button onClick={() => saveTipToFavorites(rec.description)}>
                          ❤️ Save
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="retry-btn" onClick={resetQuiz}>
                  🔄 Retake Assessment
                </button>
              </div>
            )}
          </div>
        )}

        {currentView === 'yoga' && (
          <div className="yoga-view">
            <div className="yoga-section">
              <h2>🧘‍♀️ Beginner Yoga Poses</h2>
              <p>Perfect for those new to yoga or looking for gentle movements</p>
              <div className="poses-grid">
                {yogaPoses.beginner.map((pose, index) => (
                  <div key={index} className="pose-card">
                    <h4>{pose.name}</h4>
                    <p className="pose-description">{pose.description}</p>
                    <div className="pose-benefits">
                      <strong>Benefits:</strong> {pose.benefits}
                    </div>
                    <div className="pose-duration">
                      <strong>Duration:</strong> {pose.duration}
                    </div>
                    <button onClick={() => saveTipToFavorites(`${pose.name}: ${pose.description}`)}>
                      ❤️ Save
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="yoga-section">
              <h2>🌟 Intermediate Yoga Poses</h2>
              <p>For those ready to challenge themselves with more advanced poses</p>
              <div className="poses-grid">
                {yogaPoses.intermediate.map((pose, index) => (
                  <div key={index} className="pose-card">
                    <h4>{pose.name}</h4>
                    <p className="pose-description">{pose.description}</p>
                    <div className="pose-benefits">
                      <strong>Benefits:</strong> {pose.benefits}
                    </div>
                    <div className="pose-duration">
                      <strong>Duration:</strong> {pose.duration}
                    </div>
                    <button onClick={() => saveTipToFavorites(`${pose.name}: ${pose.description}`)}>
                      ❤️ Save
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentView === 'profile' && healthProfile && (
          <div className="profile-view">
            <div className="profile-container">
              <h2>👤 Your Health Profile</h2>
              <div className="profile-grid">
                <div className="profile-item">
                  <strong>Age Group:</strong> {healthProfile.age}
                </div>
                <div className="profile-item">
                  <strong>Height:</strong> {healthProfile.height}
                </div>
                <div className="profile-item">
                  <strong>Weight:</strong> {healthProfile.weight}
                </div>
                <div className="profile-item">
                  <strong>Activity Level:</strong> {healthProfile.activityLevel}
                </div>
                <div className="profile-item">
                  <strong>Health Goals:</strong> {healthProfile.healthGoals}
                </div>
                <div className="profile-item">
                  <strong>Sleep Hours:</strong> {healthProfile.sleepHours}
                </div>
                <div className="profile-item">
                  <strong>Stress Level:</strong> {healthProfile.stressLevel}
                </div>
                {healthProfile.conditions !== 'None' && (
                  <div className="profile-item">
                    <strong>Health Conditions:</strong> {healthProfile.conditions}
                  </div>
                )}
              </div>
              
              <button className="update-btn" onClick={() => setCurrentView('quiz')}>
                📝 Update Profile
              </button>
            </div>
          </div>
        )}
      </div>  
    </div>
  );
};

export default HealthTips;