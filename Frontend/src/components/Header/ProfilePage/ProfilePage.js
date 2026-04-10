import React, { useState, useEffect } from 'react';
import './ProfilePage.css';

// ─── DETAILED INFO for each suggestion category (shown on card flip) ─────────
const suggestionDetails = {
  Fashion: {
    Casual: { title:"Casual Style Guide", icon:"👕", points:["White tee + blue jeans + white sneakers = the ultimate casual formula","Oversized hoodies with joggers for comfort-first days","Floral summer dress with flats for a feminine casual look","Layer a denim jacket over any outfit to elevate the casual vibe","Accessorize with small hoop earrings and a tote bag"], tip:"Pro Tip: Invest in 5 quality basics: a white tee, straight jeans, a neutral hoodie, sneakers, and a minimal bag.", link:"/fashion-suggestion", linkLabel:"Explore Fashion →" },
    Formal: { title:"Formal Style Guide", icon:"👔", points:["Navy blazer + white shirt + grey trousers = a timeless professional look","Pencil skirt with a tucked-in blouse for a polished office appearance","Monochrome outfits in neutral shades always look sophisticated","Invest in one good pair of block heels or loafers for work days","Keep jewellery minimal — stud earrings and a delicate necklace"], tip:"Pro Tip: A well-fitting blazer can instantly upgrade even a simple outfit.", link:"/fashion-suggestion", linkLabel:"Explore Fashion →" },
    Trendy: { title:"Trendy Style Guide", icon:"✨", points:["Co-ord sets are the easiest way to look put-together and trendy","Cargo pants + crop top + chunky sneakers = current it-girl aesthetic","Bold prints, statement sleeves, and cut-out details are trending","Mix vintage finds with modern pieces for a unique fashion-forward look","Keep up with trends but only adopt what genuinely suits you"], tip:"Pro Tip: Trend pieces work best when styled with your own signature twist.", link:"/fashion-suggestion", linkLabel:"Explore Fashion →" },
    Classic: { title:"Classic Style Guide", icon:"🎩", points:["The little black dress is a forever classic — invest in one","Crisp white shirt, tailored trousers, and loafers never go out of style","Neutral color palette: black, white, beige, navy — mix and match freely","Choose quality over quantity — fewer but well-made pieces","Silk scarves and structured bags elevate a classic look"], tip:"Pro Tip: Classic dressing is about fit — even a simple outfit looks elevated when it fits perfectly.", link:"/fashion-suggestion", linkLabel:"Explore Fashion →" },
  },
  Health: {
    Beginner: { title:"Beginner Fitness Plan", icon:"🚶‍♀️", points:["Start with 15–20 minute walks every day — consistency over intensity","Add 5 minutes of morning stretching to improve flexibility","Bodyweight basics: 10 squats, 10 push-ups, 30-second plank daily","Drink 8 glasses of water and get 7–8 hours of sleep","Progress: Increase walk duration by 5 minutes every week"], tip:"Pro Tip: Schedule your workout like a meeting — a specific time makes it stick.", link:"/health-tips", linkLabel:"Explore Health Tips →" },
    Intermediate: { title:"Intermediate Fitness Plan", icon:"🏃‍♀️", points:["30-minute jog or cycling 4x per week for cardio endurance","Strength train 3x per week: squats, lunges, dumbbell rows, shoulder press","Add yoga or pilates 1x per week for flexibility and recovery","Meal prep on Sundays to stay consistent with nutrition","Track your progress — log workouts and celebrate small wins"], tip:"Pro Tip: The 80/20 rule — 80% clean eating + 20% flexibility = sustainable results.", link:"/health-tips", linkLabel:"Explore Health Tips →" },
    Advanced: { title:"Advanced Training Plan", icon:"🏋️‍♀️", points:["HIIT sessions 3x weekly for fat burning and cardiovascular fitness","Progressive overload in strength training — increase weight weekly","Prioritize recovery: foam rolling, stretching, rest days are non-negotiable","Track macros: protein (1.6–2g/kg), complex carbs, healthy fats","Consider periodization — change your training program every 4–6 weeks"], tip:"Pro Tip: Sleep is where gains are made — 7–9 hours is a non-negotiable for advanced athletes.", link:"/health-tips", linkLabel:"Explore Health Tips →" },
  },
  Skincare: {
    Oily: { title:"Oily Skin Routine", icon:"🌿", points:["AM: Gel cleanser → niacinamide toner → lightweight moisturizer → SPF 50 mattifying sunscreen","PM: Double cleanse → exfoliating toner (2–3x/week) → niacinamide serum → gel moisturizer","Weekly: Clay mask 2x/week to absorb excess oil and unclog pores","Key ingredients: Salicylic acid, niacinamide, witch hazel, hyaluronic acid","Never skip moisturizer — oily skin also needs hydration!"], tip:"Pro Tip: Over-cleansing triggers more oil. Stick to 2x daily cleansing max.", link:"/skin-hair-care", linkLabel:"Explore Skin & Hair Care →" },
    Dry: { title:"Dry Skin Routine", icon:"💧", points:["AM: Cream cleanser → essence → vitamin C serum → rich moisturizer → hydrating SPF","PM: Oil cleanser → second cleanse → layered hyaluronic acid toner (3x) → facial oil → thick night cream","Weekly: Hydrating sheet mask 3–4x and gentle enzyme exfoliant 1–2x","Key ingredients: Hyaluronic acid, ceramides, glycerin, squalane, shea butter","Use lukewarm water — hot water strips natural oils from dry skin"], tip:"Pro Tip: Apply serum and moisturizer while skin is still slightly damp to lock in hydration.", link:"/skin-hair-care", linkLabel:"Explore Skin & Hair Care →" },
    Combination: { title:"Combination Skin Routine", icon:"⚖️", points:["AM: Gentle gel cleanser → balancing toner → niacinamide serum → zone-specific moisturizer → SPF","PM: Oil cleanser → gel cleanser → exfoliating toner on T-zone → hydrating serum on cheeks → moisturize by zone","Key approach: Treat oily and dry zones differently with targeted products","T-zone: gel-based, mattifying products; Cheeks: cream-based, hydrating products","Niacinamide is your best friend — it balances both zones simultaneously"], tip:"Pro Tip: Multi-masking — clay mask on T-zone and hydrating mask on cheeks at the same time.", link:"/skin-hair-care", linkLabel:"Explore Skin & Hair Care →" },
    Sensitive: { title:"Sensitive Skin Routine", icon:"🌸", points:["AM: Ultra-gentle fragrance-free cleanser → centella/chamomile toner → barrier serum → mineral SPF","PM: Oil or milk cleanser → gentle second cleanse → soothing toner → ceramide cream","Patch test every new product on inner wrist for 24–48 hours","Key ingredients: Centella asiatica, ceramides, allantoin, panthenol, oat extract","Avoid: Fragrance, alcohol, essential oils, harsh exfoliants, retinol initially"], tip:"Pro Tip: Less is more for sensitive skin — a 3-step routine is often better than 10 products.", link:"/skin-hair-care", linkLabel:"Explore Skin & Hair Care →" },
  },
  Haircare: {
    Curly: { title:"Curly Hair Care Method", icon:"🌀", points:["Co-wash (conditioner only wash) 2–3x per week to retain moisture","Deep condition weekly with a hydrating hair mask for 20–30 minutes","Apply leave-in conditioner on damp hair, followed by curl gel","Scrunch upward to define curls and reduce frizz as hair dries","Protect curls overnight with a satin/silk bonnet or pillowcase"], tip:"Pro Tip: The Curly Girl Method (CGM) avoids sulfates and silicones — give it 8 weeks to see results.", link:"/skin-hair-care", linkLabel:"Explore Skin & Hair Care →" },
    Straight: { title:"Straight Hair Care Routine", icon:"📏", points:["Wash 2–3x weekly with a volumizing shampoo to prevent flatness","Apply conditioner only from mid-lengths to ends, never the scalp","Use a heat protectant spray every single time before using any heat tools","A weekly hair mask adds moisture and shine to otherwise flat hair","Dry shampoo on day 2–3 extends freshness between washes"], tip:"Pro Tip: Always use a microfiber towel — cotton towels cause unnecessary friction and frizz.", link:"/skin-hair-care", linkLabel:"Explore Skin & Hair Care →" },
    Wavy: { title:"Wavy Hair Care Guide", icon:"〰️", points:["Wash 2–3x weekly with a lightweight shampoo to preserve wave pattern","Plop hair in a microfiber towel after washing to reduce frizz","Apply a wave-enhancing cream or mousse on soaking wet hair","Scrunch out the crunch once hair is fully dry for soft, defined waves","Air dry whenever possible — diffuse on low heat if in a hurry"], tip:"Pro Tip: Never brush wavy hair dry — only detangle with a wide-tooth comb on wet, conditioned hair.", link:"/skin-hair-care", linkLabel:"Explore Skin & Hair Care →" },
    Coily: { title:"Coily / 4C Hair Guide", icon:"🔄", points:["Wash 1x per week with a sulfate-free, moisturizing shampoo","The LOC Method: Liquid → Oil → Cream for maximum moisture retention","Deep condition with heat (steaming or heat cap) for 30–60 minutes weekly","Protective styles (braids, twists, buns) protect ends from breakage","Handle coily hair with extreme care — wet detangling only with wide-tooth comb"], tip:"Pro Tip: Coily hair is the most fragile curl type — retain length by keeping ends moisturized and tucked away.", link:"/skin-hair-care", linkLabel:"Explore Skin & Hair Care →" },
  },
  'Daily Routine': {
    morning: { title:"Morning Routine", icon:"🌅", points:["Wake up at the same time daily — consistency resets your circadian rhythm","5 minutes of sunlight exposure boosts serotonin and alertness","Drink a full glass of water before coffee to rehydrate after sleep","5-minute meditation or deep breathing sets a calm, focused tone","Review your top 3 goals for the day to prime purposeful action"], tip:"Pro Tip: Lay out tomorrow's outfit and pack your bag the night before — it removes 2 decisions from your morning.", link:"/daily-routine", linkLabel:"Explore Daily Routine →" },
    afternoon: { title:"Afternoon Routine", icon:"🌤️", points:["The 2–3 PM energy dip is real — a 10-minute walk combats it naturally","Eat a protein-rich lunch to sustain energy without a blood sugar crash","Use the Pomodoro technique: 25 min focused work + 5 min break","Step away from screens for 5 minutes every hour to rest your eyes","Stay hydrated — dehydration significantly reduces focus and mood"], tip:"Pro Tip: Do your most creative or cognitively demanding work in the morning, admin tasks in the afternoon.", link:"/daily-routine", linkLabel:"Explore Daily Routine →" },
    evening: { title:"Evening Wind-Down", icon:"🌙", points:["Begin screen dimming 1 hour before bed — blue light disrupts melatonin","Light dinner 2–3 hours before sleep prevents restless nights","Journaling 5 minutes: 3 gratitudes + tomorrow's priorities","Evening skincare routine signals to your brain that sleep time is near","Consistent bedtime (same time every night) improves sleep quality enormously"], tip:"Pro Tip: Make your bedroom a 'sleep sanctuary' — cool, dark, and quiet. Your phone should charge outside the room.", link:"/daily-routine", linkLabel:"Explore Daily Routine →" },
  }
};

// ─── FLIP CARD COMPONENT ─────────────────────────────────────────────────────
const FlipCard = ({ suggestion }) => {
  const [flipped, setFlipped] = useState(false);

  const getDetail = () => {
    if (suggestion.category === 'Fashion') return suggestionDetails.Fashion[suggestion.style] || null;
    if (suggestion.category === 'Health') return suggestionDetails.Health[suggestion.fitnessLevel] || null;
    if (suggestion.category === 'Skincare') return suggestionDetails.Skincare[suggestion.skinType] || null;
    if (suggestion.category === 'Haircare') return suggestionDetails.Haircare[suggestion.hairType] || null;
    if (suggestion.category === 'Daily Routine') return suggestionDetails['Daily Routine'][suggestion.timeKey] || null;
    return null;
  };

  const detail = getDetail();

  return (
    <div className={`flip-card-wrapper ${flipped ? 'is-flipped' : ''}`}>
      <div className="flip-card-inner">
        {/* FRONT */}
        <div className="flip-card-front suggestion-card" style={{ borderTopColor: suggestion.color }}>
          <div className="suggestion-header">
            <span className="suggestion-icon">{suggestion.icon}</span>
            <span className="suggestion-category" style={{ backgroundColor: suggestion.color }}>{suggestion.category}</span>
          </div>
          <h3>{suggestion.title}</h3>
          <p>{suggestion.description}</p>
          <div className="suggestion-footer">
            <button
              className="action-btn"
              style={{ color: suggestion.color }}
              onClick={() => setFlipped(true)}
            >
              Learn More →
            </button>
          </div>
        </div>

        {/* BACK */}
        <div className="flip-card-back" style={{ borderTopColor: suggestion.color }}>
          {detail ? (
            <>
              <div className="flip-back-header">
                <span>{detail.icon}</span>
                <h3>{detail.title}</h3>
              </div>
              <ul className="flip-back-points">
                {detail.points.map((pt, i) => <li key={i}>{pt}</li>)}
              </ul>
              <div className="flip-back-tip">
                <span>💡</span>
                <p>{detail.tip}</p>
              </div>
              <div className="flip-back-footer">
                {detail.link && (
                  <a href={detail.link} className="flip-explore-btn" style={{ backgroundColor: suggestion.color }}>
                    {detail.linkLabel}
                  </a>
                )}
                <button className="flip-back-btn" onClick={() => setFlipped(false)}>← Back</button>
              </div>
            </>
          ) : (
            <div className="flip-no-detail">
              <p>Detailed guide coming soon! ✨</p>
              <button className="flip-back-btn" onClick={() => setFlipped(false)}>← Back</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: '', age: '', gender: '', skinType: '', hairType: '',
    fashionStyle: '', fitnessLevel: '', healthGoals: '', profileImage: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (saved.name) { setProfile(saved); generateSuggestions(saved); }
    else setIsEditing(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfile(prev => ({ ...prev, profileImage: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    generateSuggestions(profile);
    setIsEditing(false);
    alert('Profile saved successfully! 🎉');
  };

  const clearAllData = () => {
    const confirmed = window.confirm('⚠️ This will permanently delete ALL your data and reset the entire app.\n\nAre you sure? This cannot be undone.');
    if (!confirmed) return;
    ['userProfile','reminders','fashionFavorites','healthFavorites','skinCareFavorites','dailyRoutineFavorites','favorites','healthProfile','healthRecommendations','skinHairProfile','todoList','todos','dailyRoutine','contactChats','chatHistory','waterLog','mealLog','waterTracker','periodData','periodTracking','dearDiary','diaryPin','settings','userSettings'].forEach(k => localStorage.removeItem(k));
    localStorage.clear();
    try { sessionStorage.clear(); } catch(_) {}
    setProfile({ name:'', age:'', gender:'', skinType:'', hairType:'', fashionStyle:'', fitnessLevel:'', healthGoals:'', profileImage:null });
    setSuggestions([]);
    setIsEditing(true);
    window.location.href = "/";
  };

  const generateSuggestions = (p) => {
    const list = [];
    const hour = new Date().getHours();
    const timeKey = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    const timeData = { morning:{ icon:'🌅', title:'Morning Productivity', desc:'Start with 5-min meditation, healthy breakfast, and review your top 3 goals!' }, afternoon:{ icon:'🌤️', title:'Afternoon Energy Boost', desc:'A 10-minute walk, protein snack, and Pomodoro session will power your afternoon!' }, evening:{ icon:'🌙', title:'Evening Wind-Down', desc:'Dim screens 1hr before bed, journal 3 gratitudes, and prep for tomorrow!' } };

    if (p.fashionStyle) {
      const fashionMap = { Casual:{ icon:'👕', title:"Today's Casual Look", desc:"White tee + blue jeans + white sneakers for a fresh, casual look!" }, Formal:{ icon:'👔', title:"Professional Look", desc:"Navy blazer + grey trousers and brown shoes — perfect for meetings!" }, Trendy:{ icon:'✨', title:"Trending Style", desc:"Oversized hoodie + cargo pants + chunky sneakers — very on-trend!" }, Classic:{ icon:'🎩', title:"Classic Style", desc:"Crisp white shirt + tailored trousers + loafers — always impeccable!" } };
      const f = fashionMap[p.fashionStyle] || fashionMap.Casual;
      list.push({ category:'Fashion', icon:f.icon, title:f.title, description:f.desc, color:'#FF6B6B', style:p.fashionStyle });
    }
    if (p.fitnessLevel) {
      const fitMap = { Beginner:{ icon:'💪', title:'Start Your Fitness Journey', desc:'Begin with 15-min walks daily and 5-min stretching. Gradually increase duration!' }, Intermediate:{ icon:'🏃‍♀️', title:'Level Up Your Routine', desc:'30-min jog or cycling + 15 min strength training. Mix cardio and weights!' }, Advanced:{ icon:'🏋️‍♀️', title:'Advanced Training', desc:'HIIT workouts 4x weekly + strength training. Focus on progressive overload!' } };
      const ft = fitMap[p.fitnessLevel];
      if (ft) list.push({ category:'Health', icon:ft.icon, title:ft.title, description:ft.desc, color:'#4ECDC4', fitnessLevel:p.fitnessLevel });
    }
    if (p.skinType) {
      const skinMap = { Oily:{ icon:'🌿', title:'Oil Control Routine', desc:'Gel cleanser → niacinamide toner → lightweight moisturizer → SPF 50 daily!' }, Dry:{ icon:'💧', title:'Hydration Focus', desc:'Cream cleanser → hyaluronic acid → rich moisturizer → face oil at night!' }, Combination:{ icon:'⚖️', title:'Balanced Zone Care', desc:'Niacinamide balances both zones. Use gel on T-zone, cream on cheeks!' }, Sensitive:{ icon:'🌸', title:'Gentle Soothing Routine', desc:'Minimal fragrance-free routine with centella and ceramides daily.' }, Normal:{ icon:'✨', title:'Maintenance Routine', desc:'Simple AM/PM routine with cleanser, moisturizer and SPF 50 is all you need!' } };
      const sk = skinMap[p.skinType];
      if (sk) list.push({ category:'Skincare', icon:sk.icon, title:sk.title, description:sk.desc, color:'#E83E8C', skinType:p.skinType });
    }
    if (p.hairType) {
      const hairMap = { Curly:{ icon:'🌀', title:'Curl Care Method', desc:'Co-wash, deep condition weekly, use leave-in conditioner and curl gel. Scrunch!' }, Straight:{ icon:'📏', title:'Sleek & Smooth', desc:'Volumizing shampoo, lightweight conditioner, and heat protectant before styling!' }, Wavy:{ icon:'〰️', title:'Wave Enhancing Routine', desc:'Wave-enhancing cream on wet hair, scrunch it in, and let air dry for soft waves!' }, Coily:{ icon:'🔄', title:'4C Hair Moisture Method', desc:'LOC method (Liquid-Oil-Cream) after washing keeps coily hair moisturized!' } };
      const hr = hairMap[p.hairType];
      if (hr) list.push({ category:'Haircare', icon:hr.icon, title:hr.title, description:hr.desc, color:'#FD79A8', hairType:p.hairType });
    }
    const td = timeData[timeKey];
    list.push({ category:'Daily Routine', icon:td.icon, title:td.title, description:td.desc, color:'#FDCB6E', timeKey });
    setSuggestions(list);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-banner"></div>
          <div className="profile-info-section">
            <div className="profile-image-container">
              {profile.profileImage
                ? <img src={profile.profileImage} alt="Profile" className="profile-image" />
                : <div className="profile-image-placeholder">{profile.name ? profile.name[0].toUpperCase() : '?'}</div>
              }
              {isEditing && (
                <label className="upload-photo-btn" title="Upload photo">
                  📷
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display:'none' }} />
                </label>
              )}
            </div>
            <div className="profile-details">
              <h1>{profile.name || 'Your Name'}</h1>
              <p className="profile-subtitle">{profile.age ? `${profile.age} years` : ''} {profile.gender ? `· ${profile.gender}` : ''} {profile.skinType ? `· ${profile.skinType} skin` : ''}</p>
              {!isEditing && (
                <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
                  <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>✏️ Edit Profile</button>
                  <button className="edit-profile-btn" style={{ background:'linear-gradient(135deg, #dc3545, #c82333)' }} onClick={clearAllData}>🗑️ Clear All Data</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing ? (
          <div className="profile-edit-section">
            <h2>📝 Personal Information</h2>
            <div className="form-grid">
              <div className="form-group"><label>Full Name *</label><input type="text" name="name" value={profile.name} onChange={handleInputChange} placeholder="Enter your name" /></div>
              <div className="form-group"><label>Age *</label><input type="number" name="age" value={profile.age} min="1" max="120" onChange={handleInputChange} placeholder="Your age" /></div>
              <div className="form-group"><label>Gender *</label>
                <select name="gender" value={profile.gender} onChange={handleInputChange}>
                  <option value="">Select Gender</option>
                  <option value="Female">Female</option><option value="Male">Male</option>
                  <option value="Non-binary">Non-binary</option><option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div className="form-group"><label>Skin Type</label>
                <select name="skinType" value={profile.skinType} onChange={handleInputChange}>
                  <option value="">Select Skin Type</option>
                  <option value="Oily">Oily</option><option value="Dry">Dry</option>
                  <option value="Combination">Combination</option><option value="Sensitive">Sensitive</option><option value="Normal">Normal</option>
                </select>
              </div>
              <div className="form-group"><label>Hair Type</label>
                <select name="hairType" value={profile.hairType} onChange={handleInputChange}>
                  <option value="">Select Hair Type</option>
                  <option value="Straight">Straight</option><option value="Wavy">Wavy</option>
                  <option value="Curly">Curly</option><option value="Coily">Coily</option>
                </select>
              </div>
              <div className="form-group"><label>Fashion Style</label>
                <select name="fashionStyle" value={profile.fashionStyle} onChange={handleInputChange}>
                  <option value="">Select Style</option>
                  <option value="Casual">Casual & Comfortable</option><option value="Formal">Formal & Professional</option>
                  <option value="Trendy">Trendy & Fashion-forward</option><option value="Classic">Classic & Timeless</option>
                </select>
              </div>
              <div className="form-group"><label>Fitness Level</label>
                <select name="fitnessLevel" value={profile.fitnessLevel} onChange={handleInputChange}>
                  <option value="">Select Fitness Level</option>
                  <option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option>
                </select>
              </div>
              <div className="form-group full-width"><label>Health Goals</label>
                <textarea name="healthGoals" value={profile.healthGoals} onChange={handleInputChange} placeholder="E.g., Lose weight, build muscle, improve flexibility..." rows="3" />
              </div>
            </div>
            <div className="form-actions">
              <button className="save-btn" onClick={saveProfile}>💾 Save Profile</button>
              {profile.name && <button className="cancel-btn" onClick={() => setIsEditing(false)}>❌ Cancel</button>}
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="profile-stats">
              <div className="stat-card"><div className="stat-icon">👗</div><div className="stat-info"><h3>{profile.fashionStyle||'Not Set'}</h3><p>Fashion Style</p></div></div>
              <div className="stat-card"><div className="stat-icon">💪</div><div className="stat-info"><h3>{profile.fitnessLevel||'Not Set'}</h3><p>Fitness Level</p></div></div>
              <div className="stat-card"><div className="stat-icon">🧴</div><div className="stat-info"><h3>{profile.skinType||'Not Set'}</h3><p>Skin Type</p></div></div>
              <div className="stat-card"><div className="stat-icon">💇‍♀️</div><div className="stat-info"><h3>{profile.hairType||'Not Set'}</h3><p>Hair Type</p></div></div>
            </div>

            {/* Suggestions with Flip Cards */}
            <div className="suggestions-section">
              <h2>✨ Your Personalized Suggestions</h2>
              <p className="suggestions-subtitle">Tap "Learn More" on any card to see detailed tips — the card will flip! 🔄</p>
              {suggestions.length === 0 ? (
                <div className="no-suggestions">
                  <div className="no-suggestions-icon">💡</div>
                  <h3>Complete your profile to get personalized suggestions!</h3>
                  <p>Add your preferences and we'll provide tailored recommendations.</p>
                  <button className="complete-profile-btn" onClick={() => setIsEditing(true)}>Complete Profile →</button>
                </div>
              ) : (
                <div className="suggestions-grid">
                  {suggestions.map((s, i) => <FlipCard key={i} suggestion={s} />)}
                </div>
              )}
            </div>

            {profile.healthGoals && (
              <div className="goals-section">
                <h2>🎯 Your Health Goals</h2>
                <div className="goals-card"><p>{profile.healthGoals}</p></div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;