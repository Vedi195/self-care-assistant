import React, { useState, useEffect } from 'react';
import './SkinHairCare.css';

import Confetti from "react-confetti";
import { FaRegCopy } from 'react-icons/fa';
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import ExpertTalkWidget from '../ExpertTalkWidget';

const quizQuestionsMaster = [
  // skin questions
  {
    id: 'skinType',
    question: "How would you describe your skin’s behavior on a normal day?",
    category: "skin",
    options: ["Oily", "Dry", "Combination", "Sensitive", "Normal"]
  },
  {
    id: 'skinConcern',
    question: "What’s the biggest skin issue you want to fix right now?",
    category: "skin",
    options: ["Acne", "Dark Spots", "Aging / Fine Lines", "Dry Patches", "Redness / Irritation"]
  },

  // hair questions
  {
    id: 'hairType',
    question: "What type of hair do you naturally have?",
    category: "hair",
    options: ["Straight", "Wavy", "Curly", "Coily"]
  },
  {
    id: 'hairTexture',
    question: "How would you describe your hair texture?",
    category: "hair",
    options: ["Fine", "Medium", "Thick", "Coarse"]
  },
  {
    id: 'hairConcern',
    question: "Which hair concern bothers you the most?",
    category: "hair",
    options: ["Frizz", "Hair Fall", "Dandruff", "Damage", "Dryness", "Oiliness"]
  },
  {
    id: 'washFrequency',
    question: "How often do you usually wash your hair?",
    category: "hair",
    options: ["Daily", "Every 2 Days", "2–3× Weekly", "Once a Week", "Rarely"]
  },

  // general
  {
    id: 'budget',
    question: "What’s your preferred budget for beauty products?",
    category: "general",
    options: ["Budget", "Mid-Range", "Premium", "Luxury"]
  },

  // optional extras (kept but shown only in 'both' or if you want to expand)
  {
    id: 'skinAfterWash',
    question: "How does your skin usually feel after washing your face?",
    category: "skin",
    options: ["Tight", "Soft", "Oily", "Itchy / Red"]
  },
  {
    id: 'scalpBehavior',
    question: "How does your scalp behave most days?",
    category: "hair",
    options: ["Normal", "Itchy", "Flaky", "Oily"]
  }
];

// Skin Care Routines Object
const skinCareRoutines = {
  oily: {
    title: "Oil Control & Clarity Routine",
    description: "Specially designed for oily, acne-prone skin to balance sebum production",
    color: "#4CAF50",
    icon: "🌿",
    morning: [
      { step: "💧 Gentle Foaming Cleanser", time: "2 minutes", details: "Use gel or foam cleanser with salicylic acid to remove excess oil without stripping skin" },
      { step: "🍃 Balancing Toner", time: "30 seconds", details: "Apply witch hazel or niacinamide toner to minimize pores and control oil" },
      { step: "💊 Lightweight Serum", time: "30 seconds", details: "Use oil-free vitamin C or niacinamide serum for brightness" },
      { step: "💧 Oil-Free Moisturizer", time: "1 minute", details: "Apply gel-based, non-comedogenic moisturizer to hydrate without clogging pores" },
      { step: "☀️ Mattifying Sunscreen SPF 50", time: "1 minute", details: "Essential! Use oil-free, matte-finish sunscreen. Reapply every 3-4 hours" }
    ],
    evening: [
      { step: "🧴 Oil-Based Cleanser (if wearing makeup)", time: "1 minute", details: "Gently massage to dissolve makeup and sunscreen" },
      { step: "💧 Foaming Cleanser - Double Cleanse", time: "2 minutes", details: "Remove remaining impurities and excess oil thoroughly" },
      { step: "🍊 Exfoliating Toner (2-3x weekly)", time: "30 seconds", details: "Use AHA/BHA toner to unclog pores and prevent breakouts" },
      { step: "🌟 Treatment - Retinol or Niacinamide", time: "1 minute", details: "Start with 2-3x weekly, gradually increase. Reduces oil, improves texture" },
      { step: "💧 Lightweight Night Moisturizer", time: "1 minute", details: "Seal in treatment with oil-free, breathable night cream" },
      { step: "👁️ Eye Cream", time: "30 seconds", details: "Gently pat around eye area to prevent premature aging" }
    ],
    weeklyTreatments: [
      { treatment: "🧊 Clay Mask", frequency: "2x per week", benefit: "Absorbs excess oil, deep cleans pores" },
      { treatment: "🧪 Chemical Exfoliant", frequency: "2-3x per week", benefit: "Prevents clogged pores, smooths skin texture" },
      { treatment: "💆‍♀️ Facial Massage", frequency: "3x per week", benefit: "Improves circulation, helps product absorption" }
    ]
  },
  dry: {
    title: "Deep Hydration & Nourishment Routine",
    description: "Intensive moisture therapy for dry, dehydrated, or mature skin",
    color: "#2196F3",
    icon: "💧",
    morning: [
      { step: "🥛 Creamy Gentle Cleanser", time: "1-2 minutes", details: "Use milk or cream cleanser to cleanse without stripping natural oils" },
      { step: "💦 Hydrating Essence/Toner", time: "1 minute", details: "Layer hyaluronic acid toner 2-3 times for deep hydration boost" },
      { step: "✨ Vitamin C Serum", time: "30 seconds", details: "Apply antioxidant serum for brightness and protection" },
      { step: "💧 Hyaluronic Acid Serum", time: "30 seconds", details: "Lock in moisture with water-binding ingredients" },
      { step: "🧴 Rich Moisturizer", time: "2 minutes", details: "Apply thick, nourishing cream with ceramides and peptides" },
      { step: "💎 Face Oil (optional)", time: "30 seconds", details: "Seal everything with 2-3 drops of facial oil" },
      { step: "☀️ Hydrating Sunscreen SPF 50", time: "1 minute", details: "Use moisturizing, dewy-finish sunscreen for protection" }
    ],
    evening: [
      { step: "🧴 Oil or Balm Cleanser", time: "2 minutes", details: "Massage thoroughly to dissolve makeup and nourish skin" },
      { step: "🥛 Creamy Second Cleanser", time: "1-2 minutes", details: "Gently remove remaining impurities without drying" },
      { step: "💦 Hydrating Toner - Layer 3x", time: "1 minute", details: "Pat in multiple layers for intense hydration" },
      { step: "💧 Hydrating Serum", time: "30 seconds", details: "Apply hyaluronic acid or glycerin-based serum" },
      { step: "🌟 Retinol or Peptide Treatment", time: "1 minute", details: "Apply anti-aging treatment (start slowly, 2x weekly)" },
      { step: "🧴 Rich Night Cream", time: "2 minutes", details: "Apply thick, occlusive moisturizer to seal in everything" },
      { step: "💎 Facial Oil", time: "30 seconds", details: "Lock in moisture with nourishing face oil" },
      { step: "👁️ Eye Cream", time: "30 seconds", details: "Pat rich eye cream to combat dryness and fine lines" }
    ],
    weeklyTreatments: [
      { treatment: "💦 Hydrating Sheet Mask", frequency: "3-4x per week", benefit: "Intensive moisture boost, plumps skin" },
      { treatment: "🧴 Overnight Sleeping Mask", frequency: "2-3x per week", benefit: "Deep overnight hydration therapy" },
      { treatment: "✨ Gentle Enzyme Exfoliant", frequency: "1-2x per week", benefit: "Removes dead skin, improves product absorption" }
    ]
  },
  combination: {
    title: "Balanced Multi-Zone Routine",
    description: "Strategic care for combination skin with oily T-zone and dry cheeks",
    color: "#FF9800",
    icon: "⚖️",
    morning: [
      { step: "🧼 Gentle Gel Cleanser", time: "2 minutes", details: "Use pH-balanced cleanser suitable for all areas" },
      { step: "💧 Balancing Toner", time: "30 seconds", details: "Apply hydrating toner to dry areas, mattifying to T-zone" },
      { step: "✨ Lightweight Serum", time: "30 seconds", details: "Use niacinamide serum to balance oil production" },
      { step: "💦 Multi-Zone Moisturizing", time: "2 minutes", details: "Gel cream on T-zone, richer cream on dry areas" },
      { step: "☀️ Broad Spectrum SPF 50", time: "1 minute", details: "Use lightweight sunscreen that works for all areas" }
    ],
    evening: [
      { step: "🧴 Oil Cleanser (makeup removal)", time: "1 minute", details: "Dissolve makeup and sunscreen gently" },
      { step: "🧼 Gentle Gel Cleanser", time: "2 minutes", details: "Remove remaining impurities thoroughly" },
      { step: "🍊 Zone-Specific Toning", time: "1 minute", details: "Exfoliating toner on T-zone, hydrating on cheeks" },
      { step: "🌟 Targeted Treatments", time: "2 minutes", details: "Retinol on problem areas, hydrating serum on dry patches" },
      { step: "💧 Multi-Zone Moisturizing", time: "2 minutes", details: "Lightweight gel on oily areas, richer cream on dry zones" },
      { step: "👁️ Eye Cream", time: "30 seconds", details: "Gentle application around delicate eye area" }
    ],
    weeklyTreatments: [
      { treatment: "🧊 Clay Mask on T-zone", frequency: "2x per week", benefit: "Controls oil in oily areas" },
      { treatment: "💦 Hydrating Mask on Cheeks", frequency: "2x per week", benefit: "Nourishes dry areas" },
      { treatment: "✨ Gentle Exfoliation", frequency: "2x per week", benefit: "Balances overall texture" }
    ]
  },
  sensitive: {
    title: "Gentle Soothing & Protection Routine",
    description: "Minimal, calming routine for sensitive, reactive, or rosacea-prone skin",
    color: "#E91E63",
    icon: "🌸",
    morning: [
      { step: "🥛 Ultra-Gentle Cleanser", time: "1 minute", details: "Use fragrance-free, pH-balanced, minimal ingredient cleanser" },
      { step: "🌸 Calming Toner", time: "30 seconds", details: "Apply soothing toner with centella or chamomile" },
      { step: "💚 Calming Serum", time: "30 seconds", details: "Use serum with niacinamide, azelaic acid, or centella" },
      { step: "🧴 Barrier Repair Moisturizer", time: "1 minute", details: "Apply ceramide-rich, fragrance-free moisturizer" },
      { step: "☀️ Mineral Sunscreen SPF 50", time: "1 minute", details: "Use zinc oxide/titanium dioxide sunscreen (less irritating)" }
    ],
    evening: [
      { step: "🧴 Gentle Cleansing Balm", time: "1-2 minutes", details: "Remove makeup with soothing, non-irritating formula" },
      { step: "🥛 Mild Cream Cleanser", time: "1 minute", details: "Second cleanse with ultra-gentle, fragrance-free cleanser" },
      { step: "🌸 Soothing Toner/Essence", time: "30 seconds", details: "Calm skin with anti-inflammatory ingredients" },
      { step: "💚 Calming Treatment", time: "1 minute", details: "Apply targeted treatment for redness or irritation" },
      { step: "🧴 Thick Barrier Cream", time: "2 minutes", details: "Seal with occlusive, protective night cream" },
      { step: "👁️ Gentle Eye Cream", time: "30 seconds", details: "Use fragrance-free, minimal ingredient eye cream" }
    ],
    weeklyTreatments: [
      { treatment: "🌸 Calming Sheet Mask", frequency: "2-3x per week", benefit: "Soothes irritation, reduces redness" },
      { treatment: "🧊 Cool Compress", frequency: "As needed", benefit: "Instantly calms flare-ups" },
      { treatment: "💆‍♀️ Gentle Facial Massage", frequency: "3x per week", benefit: "Promotes healing, reduces tension" }
    ]
  }
};

// Hair Care Routines Object
const hairCareRoutines = {
  straight: {
    title: "Sleek & Smooth Straight Hair Routine",
    description: "Maintain shine, prevent frizz, and enhance natural straightness",
    color: "#9C27B0",
    icon: "📏",
    washDay: [
      { step: "💧 Clarifying Shampoo (weekly)", time: "3 minutes", details: "Remove product buildup once a week" },
      { step: "🧴 Volumizing Shampoo", time: "2 minutes", details: "Focus on scalp, massage gently to cleanse roots" },
      { step: "💦 Lightweight Conditioner", time: "3-5 minutes", details: "Apply mid-lengths to ends only, avoid roots" },
      { step: "🌟 Smoothing Serum on Wet Hair", time: "1 minute", details: "Apply 2-3 drops to damp ends for frizz control" },
      { step: "💨 Blow Dry with Cool Shot", time: "10-15 minutes", details: "Use paddle brush, finish with cool air to seal cuticle" }
    ],
    styling: [
      { step: "🔥 Heat Protectant Spray", time: "30 seconds", details: "Always apply before any heat styling" },
      { step: "✨ Straightening/Flat Iron", time: "5-10 minutes", details: "Use 300-350°F, work in small sections" },
      { step: "💎 Shine Serum or Oil", time: "30 seconds", details: "Apply tiny amount to ends for glossy finish" }
    ],
    weekly: [
      { treatment: "🧴 Deep Conditioning Mask", frequency: "Once weekly", benefit: "Maintains moisture, prevents damage" },
      { treatment: "💆‍♀️ Scalp Massage with Oil", frequency: "Twice weekly", benefit: "Promotes healthy growth, relieves tension" },
      { treatment: "✂️ Trim Ends", frequency: "Every 6-8 weeks", benefit: "Prevents split ends, maintains health" }
    ]
  },
  wavy: {
    title: "Enhanced Wave Definition Routine",
    description: "Embrace natural texture, boost waves, minimize frizz",
    color: "#00BCD4",
    icon: "🌊",
    washDay: [
      { step: "🧴 Sulfate-Free Hydrating Shampoo", time: "2-3 minutes", details: "Gently cleanse without stripping natural oils" },
      { step: "💧 Moisturizing Conditioner", time: "5 minutes", details: "Focus on mid-lengths and ends, detangle gently" },
      { step: "🌊 Leave-In Conditioner", time: "1 minute", details: "Apply to soaking wet hair for moisture retention" },
      { step: "✨ Wave Enhancing Cream/Mousse", time: "2 minutes", details: "Scrunch product into waves while very wet" },
      { step: "🤲 Microfiber Towel Scrunch", time: "2 minutes", details: "Gently squeeze out excess water, enhance wave pattern" },
      { step: "💨 Air Dry or Diffuse", time: "30-60 minutes", details: "Let air dry or use diffuser on low heat for volume" }
    ],
    styling: [
      { step: "💦 Refresh Spray", time: "1 minute", details: "Lightly mist and scrunch to revive day 2-3 waves" },
      { step: "✨ Define Individual Waves", time: "3 minutes", details: "Use small amount of gel or cream on frizzy pieces" },
      { step: "💎 Light Oil on Ends", time: "30 seconds", details: "Smooth flyaways, add shine" }
    ],
    weekly: [
      { treatment: "💦 Protein Treatment", frequency: "Every 2 weeks", benefit: "Strengthens wave pattern, prevents breakage" },
      { treatment: "🧴 Deep Moisture Mask", frequency: "Weekly", benefit: "Intense hydration for defined, bouncy waves" },
      { treatment: "🌸 Clarifying Treatment", frequency: "Bi-weekly", benefit: "Removes buildup, refreshes waves" }
    ]
  },
  curly: {
    title: "Curl Definition & Hydration Routine",
    description: "CGM-friendly routine for bouncy, defined, frizz-free curls",
    color: "#FF5722",
    icon: "🌀",
    washDay: [
      { step: "🧴 Co-Wash or Sulfate-Free Shampoo", time: "3-5 minutes", details: "Cleanse scalp gently, use fingertips not nails" },
      { step: "💧 Rich Moisturizing Conditioner", time: "10 minutes", details: "Detangle with wide-tooth comb, lots of slip needed" },
      { step: "🚿 Squish to Condish Method", time: "2 minutes", details: "Cup water and conditioner into curls, squish upward" },
      { step: "🌊 Leave-In Conditioner", time: "2 minutes", details: "Apply generously to soaking wet hair, rake through" },
      { step: "✨ Curl Defining Cream", time: "3 minutes", details: "Use praying hands method, then scrunch" },
      { step: "💎 Curl Gel", time: "2 minutes", details: "Apply in sections, scrunch to encourage curl formation" },
      { step: "🤲 Plop with T-shirt", time: "20-30 minutes", details: "Wrap hair in cotton t-shirt to set curl pattern" },
      { step: "💨 Air Dry or Diffuse", time: "60-90 minutes", details: "Let dry completely before touching, scrunch out crunch" }
    ],
    styling: [
      { step: "💦 Refresh with Water Spray", time: "2 minutes", details: "Mist sections, add tiny bit of leave-in, scrunch" },
      { step: "✨ Reactivate with Curl Cream", time: "2 minutes", details: "Apply to frizzy areas, reform curls" },
      { step: "🌙 Pineapple at Night", time: "1 minute", details: "Gather curls on top of head with silk scrunchie" }
    ],
    weekly: [
      { treatment: "🧴 Deep Conditioning Mask", frequency: "Weekly", benefit: "Intense moisture for soft, bouncy curls" },
      { treatment: "💪 Protein Treatment", frequency: "Every 2-3 weeks", benefit: "Strengthens curl pattern, reduces breakage" },
      { treatment: "🌸 Clarifying Wash", frequency: "Monthly", benefit: "Removes buildup, resets curls" }
    ]
  },
  coily: {
    title: "Maximum Moisture & Protection Routine",
    description: "Intensive hydration and care for coily, kinky, or type 4 hair",
    color: "#795548",
    icon: "💫",
    washDay: [
      { step: "💧 Pre-Poo with Oil", time: "30 minutes", details: "Apply coconut or olive oil, add heat for 20-30 mins" },
      { step: "🧴 Sulfate-Free Cleansing Shampoo", time: "5 minutes", details: "Section hair, cleanse scalp thoroughly in sections" },
      { step: "💦 Ultra-Moisturizing Conditioner", time: "15-20 minutes", details: "Apply generously, detangle with wide-tooth comb" },
      { step: "🚿 Rinse with Cool Water", time: "2 minutes", details: "Seal hair cuticle, lock in moisture" },
      { step: "🌊 Leave-In Conditioner", time: "5 minutes", details: "Apply section by section on soaking wet hair" },
      { step: "🧴 Heavy Cream or Butter", time: "5 minutes", details: "Use LOC method: Leave-in, Oil, Cream" },
      { step: "💎 Seal with Thick Oil/Butter", time: "3 minutes", details: "Lock everything in with castor oil or shea butter" },
      { step: "🌙 Protective Style", time: "20-40 minutes", details: "Twist, braid, or style to protect delicate coils" }
    ],
    daily: [
      { step: "💦 Spritz with Water Mix", time: "3 minutes", details: "Water + leave-in spray, focus on dry sections" },
      { step: "🧴 Moisturize and Seal", time: "3 minutes", details: "Apply light cream, seal with oil" },
      { step: "✨ Edge Control", time: "1 minute", details: "Style edges gently with natural edge control" },
      { step: "🌙 Sleep with Satin/Silk", time: "2 minutes", details: "Protect with bonnet or silk pillowcase" }
    ],
    weekly: [
      { treatment: "💧 Hot Oil Treatment", frequency: "Weekly", benefit: "Deep conditioning, prevents breakage" },
      { treatment: "💪 Protein Treatment", frequency: "Every 2 weeks", benefit: "Strengthens coils, maintains elasticity" },
      { treatment: "💆‍♀️ Scalp Massage", frequency: "3x weekly", benefit: "Promotes growth, relieves tension" }
    ]
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

const SkinHairCare = () => {
  const [currentView, setCurrentView] = useState('main');

  // pre-quiz selection
  const [quizMode, setQuizMode] = useState(null); // 'skin' | 'hair' | 'both'
  const [quizStarted, setQuizStarted] = useState(false);

  const [quizQuestions, setQuizQuestions] = useState([]); // filtered questions for current quiz
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [careProfile, setCareProfile] = useState(null);

  // chat related
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // dropdowns for routines
  const [routineCategory, setRoutineCategory] = useState(null); // 'skin' or 'hair'
  const [selectedSkinType, setSelectedSkinType] = useState('oily');
  const [selectedHairType, setSelectedHairType] = useState('straight');

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

  // prepare questions when mode selected
  useEffect(() => {
    if (!quizMode) return;

    let filtered = [];
    if (quizMode === 'skin') {
      filtered = quizQuestionsMaster.filter(q => q.category === 'skin' || q.category === 'general');
    } else if (quizMode === 'hair') {
      filtered = quizQuestionsMaster.filter(q => q.category === 'hair' || q.category === 'general');
    } else { // both
      filtered = quizQuestionsMaster.filter(q => q.category === 'skin' || q.category === 'hair' || q.category === 'general');
    }

    // keep order consistent
    setQuizQuestions(filtered);
    setQuizStep(0);
    setQuizAnswers({});
  }, [quizMode]);

  const startQuiz = (mode) => {
    setQuizMode(mode);
    setQuizStarted(true);
    // currentView stays 'quiz'
  };

  const handleQuizAnswer = (answer) => {
    const currentQuestion = quizQuestions[quizStep];
    const newAnswers = { ...quizAnswers, [currentQuestion.id]: answer };
    setQuizAnswers(newAnswers);

    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(prev => prev + 1);
    } else {
      // finished
      generateCareProfile(newAnswers);
    }
  };

  const generateRecommendations = (answers) => {
    const recs = [];

    // Skin
    const skinType = answers.skinType;
    if (skinType === 'Oily') {
      recs.push({
        category: 'Skincare',
        title: 'Oil Control Routine',
        description: 'Use gel-based cleansers, salicylic acid toners, and lightweight moisturizers. Avoid over-cleansing.',
        products: ['Cetaphil Foaming Cleanser', "Paula's Choice BHA Liquid", 'Neutrogena Oil-Free Moisturizer']
      });
    } else if (skinType === 'Dry') {
      recs.push({
        category: 'Skincare',
        title: 'Hydration Focus',
        description: 'Use cream cleansers, hydrating serums, and rich moisturizers. Add face oils at night.',
        products: ['CeraVe Hydrating Cleanser', 'The Ordinary Hyaluronic Acid', 'Vanicream Daily Facial Moisturizer']
      });
    } else if (skinType === 'Combination') {
      recs.push({
        category: 'Skincare',
        title: 'Balanced Routine',
        description: 'Mix lightweight products for oily areas and richer products for dry zones. Spot-treat where needed.',
        products: ['Gentle Cleanser', 'Niacinamide Serum', 'Light Moisturizer']
      });
    } else if (skinType === 'Sensitive') {
      recs.push({
        category: 'Skincare',
        title: 'Gentle & Soothing',
        description: 'Avoid strong acids and fragrances; opt for centella/aloe based soothing products.',
        products: ['Cetaphil Gentle Cleanser', 'Centella Serum', 'Fragrance-free Moisturizer']
      });
    } else {
      recs.push({
        category: 'Skincare',
        title: 'Daily Essentials',
        description: 'Gentle cleanser, antioxidant serum, moisturizer and SPF daily.',
        products: ['Gentle Cleanser', 'Vitamin C Serum', 'SPF 30+']
      });
    }

    // Hair
    const hairType = answers.hairType;
    if (hairType === 'Curly' || hairType === 'Coily') {
      recs.push({
        category: 'Haircare',
        title: 'Curl Care Method',
        description: 'Use sulfate-free shampoos, deep condition weekly, and apply leave-in conditioner to wet hair.',
        products: ['DevaCurl Low-Poo', 'Shea Moisture Deep Treatment Mask', 'Ouai Leave-In Conditioner']
      });
    } else if (hairType === 'Wavy') {
      recs.push({
        category: 'Haircare',
        title: 'Enhance Your Waves',
        description: 'Use lightweight creams to define waves, avoid heavy oils mid-lengths.',
        products: ['Sulfate-free Shampoo', 'Wave Defining Cream', 'Light Conditioner']
      });
    } else if (hairType === 'Straight') {
      recs.push({
        category: 'Haircare',
        title: 'Light Care',
        description: 'Gentle cleansing and light conditioning to avoid weighing hair down.',
        products: ['Gentle Shampoo', 'Light Conditioner', 'Heat Protectant']
      });
    } else {
      recs.push({
        category: 'Haircare',
        title: 'General Hair Health',
        description: 'Hydrate, avoid excess heat, and deep condition weekly.',
        products: ['Hydrating Shampoo', 'Deep Conditioner', 'Hair Mask']
      });
    }

    return recs;
  };

  const generateCareProfile = (answers) => {
    const profile = {
      skinType: answers.skinType || '',
      skinConcern: answers.skinConcern || '',
      hairType: answers.hairType || '',
      hairTexture: answers.hairTexture || '',
      hairConcern: answers.hairConcern || '',
      washFrequency: answers.washFrequency || '',
      budget: answers.budget || '',
      recommendations: generateRecommendations(answers)
    };

    setCareProfile(profile);
    localStorage.setItem('skinHairProfile', JSON.stringify(profile));
    // reset quiz flow
    setQuizStarted(false);
    setQuizMode(null);
    setQuizQuestions([]);
    setQuizStep(0);
    setQuizAnswers({});
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

  // UI helpers
  const goToQuizScreen = () => {
    setCurrentView('quiz');
    setQuizMode(null);
    setQuizStarted(false);
    setQuizQuestions([]);
    setQuizAnswers({});
    setQuizStep(0);
  };

  const cancelPreQuiz = () => {
    setQuizMode(null);
    setQuizStarted(false);
    setQuizQuestions([]);
    setQuizStep(0);
  };

  return (
    <div className="skin-hair-care">
      <div className="care-header">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1>💆‍♀️ Skin & Hair Care</h1>
          <p>Discover your perfect beauty routine with personalized recommendations</p>
        </motion.div>
      </div>

      <motion.div
        className="care-nav"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.button
          className={currentView === 'main' ? 'active' : ''}
          onClick={() => setCurrentView('main')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          🏠 Overview
        </motion.button>

        <motion.button
          className={currentView === 'quiz' ? 'active' : ''}
          onClick={goToQuizScreen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📋 Care Quiz
        </motion.button>

        <motion.button
          className={currentView === 'routines' ? 'active' : ''}
          onClick={() => setCurrentView('routines')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >        
          📅 Routines
        </motion.button>

        <motion.button
          className={currentView === 'organic' ? 'active' : ''}
          onClick={() => setCurrentView('organic')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >  
          🌿 Natural Remedies
        </motion.button>

        <motion.button
          className={currentView === 'chat' ? 'active' : ''}
          onClick={() => setCurrentView('chat')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          💬 Beauty Chat
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
              onClick={() => { setCurrentView('quiz'); goToQuizScreen(); }}
            >
              <div className="feature-icon">🔍</div>
              <h3>Find Your Type</h3>
              <p>Take our quiz to discover your skin and hair type with personalized recommendations</p>
            </motion.div>

            <div className="feature-card" onClick={() => setCurrentView('routines')}>
              <div className="feature-icon">📅</div>
              <h3>Care Routines</h3>
              <p>Explore morning and evening routines tailored to your specific needs</p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="feature-card" 
              onClick={() => setCurrentView('organic')}
            >
              <div className="feature-icon">🌿</div>
              <h3>Natural Remedies</h3>
              <p>Discover organic DIY treatments using ingredients from your kitchen</p>
            </motion.div>
          </div>

          <div className="daily-tips">
            <h3>💡 Today's Beauty Tips</h3>
            <div className="tips-grid">
              <div className="tip-card">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                >
                  <div className="tip-icon">🧴</div>
                  <h4>Less is More</h4>
                  <p>Start with a simple routine and gradually add products. Your skin needs time to adjust.</p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => saveTipToFavorites("Start with a simple routine and gradually add products. Your skin needs time to adjust.")}>
                    ❤️ Save
                  </motion.button>
                </motion.div>
              </div>

              <div className="tip-card">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                >
                  <div className="tip-icon">☀️</div>
                  <h4>SPF Every Day</h4>
                  <p>Sunscreen is your best anti-aging product. Apply daily, even when staying indoors.</p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => saveTipToFavorites("Sunscreen is your best anti-aging product. Apply daily, even when staying indoors.")}>
                    ❤️ Save
                  </motion.button>
                </motion.div>
              </div>

              <div className="tip-card">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                >
                  <div className="tip-icon">💧</div>
                  <h4>Hydrate Inside Out</h4>
                  <p>Drink plenty of water and use hydrating products for healthy, glowing skin.</p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => saveTipToFavorites("Drink plenty of water and use hydrating products for healthy, glowing skin.")}>
                    ❤️ Save
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- QUIZ VIEW --- */}
      {currentView === 'quiz' && (
        <div className="quiz-view">

          {/* Pre-quiz selection cards */}
          {!quizStarted && !careProfile && (
            <div className="pre-quiz">
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="pre-quiz-title">
                  Choose your Quiz
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="pre-quiz-cards"
              >
                <div
                  className="quiz-card"
                  onClick={() => startQuiz('skin')}
                >
                  <div className="quiz-card-icon">🧴</div>
                  <h3>Skin Care Quiz</h3>
                  <p>Quick, targeted questions to build a skincare routine that suits you.</p>
                </div>

                <div
                  className="quiz-card"
                  onClick={() => startQuiz('hair')}
                >
                  <div className="quiz-card-icon">💇‍♀️</div>
                  <h3>Hair Care Quiz</h3>
                  <p>Find the right routine and products for your hair type and concerns.</p>
                </div>

                <div
                  className="quiz-card"
                  onClick={() => startQuiz('both')}
                >
                  <div className="quiz-card-icon">✨</div>
                  <h3>Both (Full Quiz)</h3>
                  <p>A full assessment for skin + hair — more detailed and personalized.</p>
                </div>
              </motion.div>

              <div className="pre-quiz-note">
                <small>Tip: choose the one you care about most — you can retake anytime.</small>
              </div>
            </div>
          )}

          {/* Quiz questions flow */}
          {quizStarted && quizQuestions.length > 0 && (
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

              <div className="quiz-actions">
                <button className="cancel-quiz" onClick={cancelPreQuiz}>Cancel</button>
              </div>
            </div>
          )}

          {/* Results */}
          {careProfile && (
            <div className="results-container">
              <Confetti numberOfPieces={180} gravity={0.25} recycle={false} />
              <motion.h2
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >✨ Your Personalized Beauty Profile</motion.h2>
              <div className="profile-summary">
                <div className="profile-item">
                  <strong>Skin Type:</strong> {careProfile.skinType}
                </div>
                <div className="profile-item">
                  <strong>Hair Type:</strong> {careProfile.hairType} {careProfile.hairTexture}
                </div>
                <div className="profile-item">
                  <strong>Main Concerns:</strong> {careProfile.skinConcern}{careProfile.hairConcern ? `, ${careProfile.hairConcern}` : ''}
                </div>
              </div>

              <div className="recommendations">
                {careProfile.recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-card">
                    <h4>{rec.title}</h4>
                    <p>{rec.description}</p>
                    <div className="rec-products">
                      {rec.products && (
                        <small><strong>Suggested:</strong> {rec.products.join(', ')}</small>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => saveTipToFavorites(rec.description)}>
                      ❤️ Save
                    </motion.button>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="retry-btn" 
                onClick={resetQuiz}
              >
                🔄 Retake Quiz
              </motion.button>
            </div>
          )}
        </div>
      )}

      {/* --- ROUTINES VIEW --- */}
      {currentView === 'routines' && (
        <div className="routines-view">
          {/* Main Category Selection */}
          {!routineCategory && (
            <div className="category-selection">
              <motion.div 
                className="category-header"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}>
                <h2>✨ Choose Your Care Routine</h2>
                <p>Select a category to explore personalized routines</p>
              </motion.div>

              <motion.div 
                className="main-category-cards"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div 
                  className="main-category-card skin-category"
                  onClick={() => setRoutineCategory('skin')}
                >
                  <div className="category-background">
                    <div className="floating-emoji emoji-1">💧</div>
                    <div className="floating-emoji emoji-2">✨</div>
                    <div className="floating-emoji emoji-3">🌸</div>
                  </div>
                  <div className="category-content">
                    <div className="category-icon-large">🌸</div>
                    <h3>Skincare Routines</h3>
                    <p>Personalized routines for all skin types</p>
                    <ul className="category-features">
                      <li>✓ Morning & Evening routines</li>
                      <li>✓ Weekly treatments</li>
                      <li>✓ Step-by-step guidance</li>
                      <li>✓ Product recommendations</li>
                    </ul>
                    <button className="category-btn">Explore Skincare →</button>
                  </div>
                </div>

                <div 
                  className="main-category-card hair-category"
                  onClick={() => setRoutineCategory('hair')}
                >
                  <div className="category-background">
                    <div className="floating-emoji emoji-1">💆‍♀️</div>
                    <div className="floating-emoji emoji-2">🌊</div>
                    <div className="floating-emoji emoji-3">✨</div>
                  </div>
                  <div className="category-content">
                    <div className="category-icon-large">💇‍♀️</div>
                    <h3>Haircare Routines</h3>
                    <p>Tailored routines for every hair texture</p>
                    <ul className="category-features">
                      <li>✓ Wash day routines</li>
                      <li>✓ Styling techniques</li>
                      <li>✓ Daily maintenance</li>
                      <li>✓ Weekly treatments</li>
                    </ul>
                    <button className="category-btn">Explore Haircare →</button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Skincare Section */}
          {routineCategory === 'skin' && (
            <div className="routines-main-section">
              <div className="back-navigation">
                <button onClick={() => setRoutineCategory(null)} className="back-btn">
                  ← Back to Categories
                </button>
              </div>

              <div className="section-header">
                <h2>🌸 Personalized Skincare Routines</h2>
                <p>Select your skin type for a customized daily routine</p>
              </div>

              <div className="type-selector-cards">
                {Object.entries(skinCareRoutines).map(([type, routine]) => (
                  <div
                    key={type}
                    className={`type-card ${selectedSkinType === type ? 'active' : ''}`}
                    onClick={() => setSelectedSkinType(type)}
                    style={{ '--type-color': routine.color }}
                  >
                    <div className="type-icon">{routine.icon}</div>
                    <h3>{type.charAt(0).toUpperCase() + type.slice(1)} Skin</h3>
                    <p>{routine.title.split('&')[0]}</p>
                  </div>
                ))}
              </div>

              <div className="routine-content-display">
                <div className="routine-display-header">
                  <div className="routine-title-badge" style={{ backgroundColor: skinCareRoutines[selectedSkinType].color }}>
                    {skinCareRoutines[selectedSkinType].icon}
                  </div>
                  <div>
                    <h3>{skinCareRoutines[selectedSkinType].title}</h3>
                    <p>{skinCareRoutines[selectedSkinType].description}</p>
                  </div>
                </div>


                <div className="routine-timeline">
                  <div className="timeline-section">
                    <div className="timeline-header">
                      <span className="timeline-icon">🌅</span>
                      <h4>Morning Routine</h4>
                      <span className="timeline-duration">
                        {skinCareRoutines[selectedSkinType].morning.reduce((total, step) => {
                          const mins = parseInt(step.time);
                          return total + (isNaN(mins) ? 0 : mins);
                        }, 0)} minutes total
                      </span>
                    </div>
                    <div className="timeline-steps">
                      {skinCareRoutines[selectedSkinType].morning.map((item, idx) => (
                        <div key={idx} className="timeline-step">
                          <div className="step-connector"></div>
                          <div className="step-number-circle" style={{ borderColor: skinCareRoutines[selectedSkinType].color }}>
                            {idx + 1}
                          </div>
                          <div className="step-content-card">
                            <div className="step-header-row">
                              <h5>{item.step}</h5>
                              <span className="step-time-badge">⏱️ {item.time}</span>
                            </div>
                            <p>{item.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="timeline-section">
                    <div className="timeline-header">
                      <span className="timeline-icon">🌙</span>
                      <h4>Evening Routine</h4>
                      <span className="timeline-duration">
                        {skinCareRoutines[selectedSkinType].evening.reduce((total, step) => {
                          const mins = parseInt(step.time);
                          return total + (isNaN(mins) ? 0 : mins);
                        }, 0)} minutes total
                      </span>
                    </div>
                    <div className="timeline-steps">
                      {skinCareRoutines[selectedSkinType].evening.map((item, idx) => (
                        <div key={idx} className="timeline-step">
                          <div className="step-connector"></div>
                          <div className="step-number-circle" style={{ borderColor: skinCareRoutines[selectedSkinType].color }}>
                            {idx + 1}
                          </div>
                          <div className="step-content-card">
                            <div className="step-header-row">
                              <h5>{item.step}</h5>
                              <span className="step-time-badge">⏱️ {item.time}</span>
                            </div>
                            <p>{item.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="weekly-extras">
                  <h4>📅 Weekly Treatments</h4>
                  <div className="extras-grid">
                    {skinCareRoutines[selectedSkinType].weeklyTreatments.map((item, idx) => (
                      <div key={idx} className="extra-card" style={{ borderLeftColor: skinCareRoutines[selectedSkinType].color }}>
                        <h5>{item.treatment}</h5>
                        <div className="extra-frequency">{item.frequency}</div>
                        <p>{item.benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Haircare Section */}
          {routineCategory === 'hair' && (
            <div className="routines-main-section">
              <div className="back-navigation">
                <button onClick={() => setRoutineCategory(null)} className="back-btn">
                  ← Back to Categories
                </button>
              </div>

              <div className="section-header">
                <h2>💇‍♀️ Personalized Haircare Routines</h2>
                <p>Choose your hair type for a tailored care routine</p>
              </div>

              <div className="type-selector-cards">
                {Object.entries(hairCareRoutines).map(([type, routine]) => (
                  <div
                    key={type}
                    className={`type-card ${selectedHairType === type ? 'active' : ''}`}
                    onClick={() => setSelectedHairType(type)}
                    style={{ '--type-color': routine.color }}
                  >
                    <div className="type-icon">{routine.icon}</div>
                    <h3>{type.charAt(0).toUpperCase() + type.slice(1)} Hair</h3>
                    <p>{routine.title.split('&')[0]}</p>
                  </div>
                ))}
              </div>

              <div className="routine-content-display">
                <div className="routine-display-header">
                  <div className="routine-title-badge" style={{ backgroundColor: hairCareRoutines[selectedHairType].color }}>
                    {hairCareRoutines[selectedHairType].icon}
                  </div>
                  <div>
                    <h3>{hairCareRoutines[selectedHairType].title}</h3>
                    <p>{hairCareRoutines[selectedHairType].description}</p>
                  </div>
                </div>

                <div className="routine-timeline">
                  <div className="timeline-section">
                    <div className="timeline-header">
                      <span className="timeline-icon">🚿</span>
                      <h4>Wash Day Routine</h4>
                      <span className="timeline-duration">
                        {hairCareRoutines[selectedHairType].washDay.reduce((total, step) => {
                          const mins = parseInt(step.time);
                          return total + (isNaN(mins) ? 0 : mins);
                        }, 0)} minutes total
                      </span>
                    </div>
                    <div className="timeline-steps">
                      {hairCareRoutines[selectedHairType].washDay.map((item, idx) => (
                        <div key={idx} className="timeline-step">
                          <div className="step-connector"></div>
                          <div className="step-number-circle" style={{ borderColor: hairCareRoutines[selectedHairType].color }}>
                            {idx + 1}
                          </div>
                          <div className="step-content-card">
                            <div className="step-header-row">
                              <h5>{item.step}</h5>
                              <span className="step-time-badge">⏱️ {item.time}</span>
                            </div>
                            <p>{item.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {hairCareRoutines[selectedHairType].styling && (
                    <div className="timeline-section">
                      <div className="timeline-header">
                        <span className="timeline-icon">✨</span>
                        <h4>Styling Routine</h4>
                        <span className="timeline-duration">
                          {hairCareRoutines[selectedHairType].styling.reduce((total, step) => {
                            const mins = parseInt(step.time);
                            return total + (isNaN(mins) ? 0 : mins);
                          }, 0)} minutes total
                        </span>
                      </div>
                      <div className="timeline-steps">
                        {hairCareRoutines[selectedHairType].styling.map((item, idx) => (
                          <div key={idx} className="timeline-step">
                            <div className="step-connector"></div>
                            <div className="step-number-circle" style={{ borderColor: hairCareRoutines[selectedHairType].color }}>
                              {idx + 1}
                            </div>
                            <div className="step-content-card">
                              <div className="step-header-row">
                                <h5>{item.step}</h5>
                                <span className="step-time-badge">⏱️ {item.time}</span>
                              </div>
                              <p>{item.details}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {hairCareRoutines[selectedHairType].daily && (
                    <div className="timeline-section">
                      <div className="timeline-header">
                        <span className="timeline-icon">📆</span>
                        <h4>Daily Maintenance</h4>
                        <span className="timeline-duration">
                          {hairCareRoutines[selectedHairType].daily.reduce((total, step) => {
                            const mins = parseInt(step.time);
                            return total + (isNaN(mins) ? 0 : mins);
                          }, 0)} minutes total
                        </span>
                      </div>
                      <div className="timeline-steps">
                        {hairCareRoutines[selectedHairType].daily.map((item, idx) => (
                          <div key={idx} className="timeline-step">
                            <div className="step-connector"></div>
                            <div className="step-number-circle" style={{ borderColor: hairCareRoutines[selectedHairType].color }}>
                              {idx + 1}
                            </div>
                            <div className="step-content-card">
                              <div className="step-header-row">
                                <h5>{item.step}</h5>
                                <span className="step-time-badge">⏱️ {item.time}</span>
                              </div>
                              <p>{item.details}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="weekly-extras">
                  <h4>📅 Weekly Treatments</h4>
                  <div className="extras-grid">
                    {hairCareRoutines[selectedHairType].weekly.map((item, idx) => (
                      <div key={idx} className="extra-card" style={{ borderLeftColor: hairCareRoutines[selectedHairType].color }}>
                        <h5>{item.treatment}</h5>
                        <div className="extra-frequency">{item.frequency}</div>
                        <p>{item.benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- ORGANIC VIEW --- */}
      {currentView === 'organic' && (
        <div className="organic-view">
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >🌿 Natural Beauty Remedies</motion.h2>

          <div className="remedies-grid">
            {organicRemedies.map((remedy, index) => (
              <div key={index} className="remedy-card">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                >
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
                  
                  <motion.button 
                    className="use-template-btn"
                    onClick={() => saveTipToFavorites(`${remedy.name}: ${remedy.instructions}`)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    ❤️ Save Recipe
                  </motion.button>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- CHAT VIEW --- */}
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
      {/* ── NEW: Expert Talk floating widget ─────────────────────────────── */}
      <ExpertTalkWidget service="skincare" isPremium={false} />
    </div>
  );
};

export default SkinHairCare;