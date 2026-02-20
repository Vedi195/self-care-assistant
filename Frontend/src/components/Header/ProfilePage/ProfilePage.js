import React, { useState, useEffect } from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    gender: '',
    skinType: '',
    hairType: '',
    fashionStyle: '',
    fitnessLevel: '',
    healthGoals: '',
    profileImage: null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (savedProfile.name) {
      setProfile(savedProfile);
      generateSuggestions(savedProfile);
    } else {
      setIsEditing(true); // First time user
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    generateSuggestions(profile);
    setIsEditing(false);
    alert('Profile saved successfully! 🎉');
  };

  const generateSuggestions = (profileData) => {
    const suggestions = [];

    // Fashion Suggestions
    if (profileData.fashionStyle === 'Casual') {
      suggestions.push({
        category: 'Fashion',
        icon: '👕',
        title: 'Today\'s Outfit Suggestion',
        description: 'Try a white t-shirt with blue jeans and white sneakers for a fresh, casual look!',
        color: '#FF6B6B'
      });
    } else if (profileData.fashionStyle === 'Formal') {
      suggestions.push({
        category: 'Fashion',
        icon: '👔',
        title: 'Professional Look',
        description: 'Navy blazer with grey trousers and brown leather shoes - perfect for meetings!',
        color: '#4ECDC4'
      });
    } else if (profileData.fashionStyle === 'Trendy') {
      suggestions.push({
        category: 'Fashion',
        icon: '✨',
        title: 'Trending Style',
        description: 'Oversized hoodie with cargo pants and chunky sneakers - very on-trend!',
        color: '#95E1D3'
      });
    }

    // Health Tips based on fitness level
    if (profileData.fitnessLevel === 'Beginner') {
      suggestions.push({
        category: 'Health',
        icon: '💪',
        title: 'Start Your Fitness Journey',
        description: 'Begin with 15-minute walks daily and 5-minute stretching. Gradually increase duration!',
        color: '#38ADA9'
      });
    } else if (profileData.fitnessLevel === 'Intermediate') {
      suggestions.push({
        category: 'Health',
        icon: '🏃‍♀️',
        title: 'Level Up Your Routine',
        description: '30-minute jog or cycling + 15 minutes strength training. Mix cardio and weights!',
        color: '#78E08F'
      });
    } else if (profileData.fitnessLevel === 'Advanced') {
      suggestions.push({
        category: 'Health',
        icon: '🏋️‍♀️',
        title: 'Advanced Training',
        description: 'HIIT workouts 4x weekly + strength training. Focus on progressive overload!',
        color: '#38ADA9'
      });
    }

    // Skincare based on skin type
    if (profileData.skinType === 'Oily') {
      suggestions.push({
        category: 'Skincare',
        icon: '🧴',
        title: 'Oil Control Routine',
        description: 'Use gel-based cleanser, salicylic acid toner, and lightweight moisturizer with SPF 50!',
        color: '#E83E8C'
      });
    } else if (profileData.skinType === 'Dry') {
      suggestions.push({
        category: 'Skincare',
        icon: '💧',
        title: 'Hydration Focus',
        description: 'Use cream cleanser, hyaluronic acid serum, rich moisturizer, and face oil at night!',
        color: '#6C5CE7'
      });
    }

    // Haircare based on hair type
    if (profileData.hairType === 'Curly') {
      suggestions.push({
        category: 'Haircare',
        icon: '🌀',
        title: 'Curl Care Method',
        description: 'Co-wash, deep condition weekly, use leave-in conditioner and curl gel. Scrunch to enhance!',
        color: '#FD79A8'
      });
    } else if (profileData.hairType === 'Straight') {
      suggestions.push({
        category: 'Haircare',
        icon: '📏',
        title: 'Sleek & Smooth',
        description: 'Use volumizing shampoo, lightweight conditioner, and heat protectant before styling!',
        color: '#A29BFE'
      });
    }

    // Daily Routine Suggestion
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      suggestions.push({
        category: 'Daily Routine',
        icon: '🌅',
        title: 'Morning Productivity',
        description: 'Start with 5-min meditation, healthy breakfast, and review your top 3 goals for today!',
        color: '#FDCB6E'
      });
    } else if (currentHour < 18) {
      suggestions.push({
        category: 'Daily Routine',
        icon: '☀️',
        title: 'Afternoon Boost',
        description: 'Take a 10-min walk, hydrate with water, and tackle your most important task now!',
        color: '#FD79A8'
      });
    } else {
      suggestions.push({
        category: 'Daily Routine',
        icon: '🌙',
        title: 'Evening Wind-Down',
        description: 'Digital detox after 8 PM, light dinner, journaling, and prepare for tomorrow!',
        color: '#6C5CE7'
      });
    }

    setSuggestions(suggestions);
  };

  const getInitials = () => {
    if (!profile.name) return '?';
    return profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-banner"></div>
          <div className="profile-info-section">
            <div className="profile-image-container">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="Profile" className="profile-image" />
              ) : (
                <div className="profile-image-placeholder">
                  {getInitials()}
                </div>
              )}
              {isEditing && (
                <label className="upload-photo-btn">
                  📷
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
              )}
            </div>
            
            <div className="profile-details">
              <h1>{profile.name || 'Complete Your Profile'}</h1>
              <p className="profile-subtitle">
                {profile.age && `${profile.age} years`}
                {profile.age && profile.gender && ' • '}
                {profile.gender}
              </p>
              {!isEditing && (
                <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                  ✏️ Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        {isEditing ? (
          <div className="profile-edit-section">
            <h2>📝 Personal Information</h2>
            <div className="profile-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-group">
                  <label>Age *</label>
                  <input
                    type="number"
                    name="age"
                    value={profile.age}
                    onChange={handleInputChange}
                    placeholder="Your age"
                  />
                </div>

                <div className="form-group">
                  <label>Gender *</label>
                  <select name="gender" value={profile.gender} onChange={handleInputChange}>
                    <option value="">Select Gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Skin Type</label>
                  <select name="skinType" value={profile.skinType} onChange={handleInputChange}>
                    <option value="">Select Skin Type</option>
                    <option value="Oily">Oily</option>
                    <option value="Dry">Dry</option>
                    <option value="Combination">Combination</option>
                    <option value="Sensitive">Sensitive</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Hair Type</label>
                  <select name="hairType" value={profile.hairType} onChange={handleInputChange}>
                    <option value="">Select Hair Type</option>
                    <option value="Straight">Straight</option>
                    <option value="Wavy">Wavy</option>
                    <option value="Curly">Curly</option>
                    <option value="Coily">Coily</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Fashion Style</label>
                  <select name="fashionStyle" value={profile.fashionStyle} onChange={handleInputChange}>
                    <option value="">Select Style</option>
                    <option value="Casual">Casual & Comfortable</option>
                    <option value="Formal">Formal & Professional</option>
                    <option value="Trendy">Trendy & Fashion-forward</option>
                    <option value="Classic">Classic & Timeless</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Fitness Level</label>
                  <select name="fitnessLevel" value={profile.fitnessLevel} onChange={handleInputChange}>
                    <option value="">Select Fitness Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Health Goals</label>
                  <textarea
                    name="healthGoals"
                    value={profile.healthGoals}
                    onChange={handleInputChange}
                    placeholder="E.g., Lose weight, build muscle, improve flexibility..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button className="save-btn" onClick={saveProfile}>
                  💾 Save Profile
                </button>
                {profile.name && (
                  <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                    ❌ Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="profile-stats">
              <div className="stat-card">
                <div className="stat-icon">👗</div>
                <div className="stat-info">
                  <h3>{profile.fashionStyle || 'Not Set'}</h3>
                  <p>Fashion Style</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💪</div>
                <div className="stat-info">
                  <h3>{profile.fitnessLevel || 'Not Set'}</h3>
                  <p>Fitness Level</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🧴</div>
                <div className="stat-info">
                  <h3>{profile.skinType || 'Not Set'}</h3>
                  <p>Skin Type</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💇‍♀️</div>
                <div className="stat-info">
                  <h3>{profile.hairType || 'Not Set'}</h3>
                  <p>Hair Type</p>
                </div>
              </div>
            </div>

            {/* Personalized Suggestions */}
            <div className="suggestions-section">
              <h2>✨ Your Personalized Suggestions</h2>
              <p className="suggestions-subtitle">Based on your profile, here's what we recommend today!</p>
              
              {suggestions.length === 0 ? (
                <div className="no-suggestions">
                  <div className="no-suggestions-icon">💡</div>
                  <h3>Complete your profile to get personalized suggestions!</h3>
                  <p>Add your preferences and we'll provide tailored recommendations for you.</p>
                  <button className="complete-profile-btn" onClick={() => setIsEditing(true)}>
                    Complete Profile →
                  </button>
                </div>
              ) : (
                <div className="suggestions-grid">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="suggestion-card" style={{ borderTopColor: suggestion.color }}>
                      <div className="suggestion-header">
                        <span className="suggestion-icon">{suggestion.icon}</span>
                        <span className="suggestion-category" style={{ backgroundColor: suggestion.color }}>
                          {suggestion.category}
                        </span>
                      </div>
                      <h3>{suggestion.title}</h3>
                      <p>{suggestion.description}</p>
                      <div className="suggestion-footer">
                        <button className="action-btn" style={{ color: suggestion.color }}>
                          Learn More →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Health Goals Section */}
            {profile.healthGoals && (
              <div className="goals-section">
                <h2>🎯 Your Health Goals</h2>
                <div className="goals-card">
                  <p>{profile.healthGoals}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;