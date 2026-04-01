import React, { useState, useEffect, useMemo } from 'react';
import './FashionSuggestion.css';
import Confetti from 'react-confetti';
import { FaRegCopy } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import ExpertTalkWidget from '../ExpertTalkWidget';

// ═══════════════════════════════════════════════════════════════
//  DATA: SKIN TONES
// ═══════════════════════════════════════════════════════════════
const SKIN_TONES = [
  { id: 'fair',   label: 'Fair',   hex: '#FDDBB4' },
  { id: 'light',  label: 'Light',  hex: '#F5C09A' },
  { id: 'medium', label: 'Medium', hex: '#D4956A' },
  { id: 'olive',  label: 'Olive',  hex: '#B57B50' },
  { id: 'tan',    label: 'Tan',    hex: '#9B6B45' },
  { id: 'dark',   label: 'Dark',   hex: '#6B3A2A' },
  { id: 'deep',   label: 'Deep',   hex: '#3D1C0E' },
];

// ═══════════════════════════════════════════════════════════════
//  DATA: OUTFIT DATABASE
//  skinTones: list of IDs that look best, OR 'all' for universal
// ═══════════════════════════════════════════════════════════════
const OUTFITS = [
  // ── FEMALE ──────────────────────────────────────────────────
  {
    id: 1, gender: 'female',
    skinTones: ['fair', 'light'],
    topHex: '#FFFFFF', topName: 'White',
    bottomHex: '#1B3A6B', bottomName: 'Deep Navy',
    name: 'White Blouse + Navy Trousers',
    vibe: 'Clean · Professional · Timeless',
    occasion: '💼 Office · College',
    tip: 'Add nude heels and a tan handbag for a polished look.',
  },
  {
    id: 2, gender: 'female',
    skinTones: ['fair', 'light', 'medium'],
    topHex: '#FFB6C1', topName: 'Soft Pink',
    bottomHex: '#F5F0E8', bottomName: 'Ivory',
    name: 'Pink Top + Ivory Skirt',
    vibe: 'Dreamy · Feminine · Soft',
    occasion: '☕ Brunch · Date · Shopping',
    tip: 'Pair with white sneakers and a small pink bag.',
  },
  {
    id: 3, gender: 'female',
    skinTones: ['medium', 'olive', 'tan'],
    topHex: '#E8A838', topName: 'Mustard',
    bottomHex: '#3E2723', bottomName: 'Dark Brown',
    name: 'Mustard Top + Brown Skirt',
    vibe: 'Earthy · Warm · Boho',
    occasion: '🌿 Casual · Outing',
    tip: 'Layer a denim jacket for an effortlessly cool look.',
  },
  {
    id: 4, gender: 'female',
    skinTones: ['tan', 'dark', 'deep'],
    topHex: '#FFFFFF', topName: 'White',
    bottomHex: '#FF4500', bottomName: 'Bright Orange',
    name: 'White Kurti + Orange Palazzo',
    vibe: 'Bold · Vibrant · Confident',
    occasion: '🎉 Festival · Party',
    tip: 'Gold jewellery complements this bold combination beautifully.',
  },
  {
    id: 5, gender: 'female',
    skinTones: ['fair', 'light', 'medium'],
    topHex: '#64B5F6', topName: 'Sky Blue',
    bottomHex: '#FFFFFF', bottomName: 'White',
    name: 'Sky Blue Top + White Pants',
    vibe: 'Fresh · Calm · Elegant',
    occasion: '🌸 Casual · Brunch · Travel',
    tip: 'White sneakers or tan sandals complete this breezy look.',
  },
  {
    id: 6, gender: 'female',
    skinTones: ['all'],
    topHex: '#1C1C1E', topName: 'Black',
    bottomHex: '#1C1C1E', bottomName: 'Black',
    name: 'All-Black Monochrome',
    vibe: 'Sleek · Powerful · Sophisticated',
    occasion: '🌙 Evening · Party · Work',
    tip: 'Add a colourful bag or bold earrings to make it pop.',
  },
  {
    id: 7, gender: 'female',
    skinTones: ['medium', 'olive', 'tan', 'dark', 'deep'],
    topHex: '#C62828', topName: 'Bold Red',
    bottomHex: '#1C1C1E', bottomName: 'Black',
    name: 'Red Top + Black Pants',
    vibe: 'Fierce · Confident · Classic',
    occasion: '💃 Party · Date Night',
    tip: 'Minimal jewellery keeps this look sharp and focused.',
  },
  {
    id: 8, gender: 'female',
    skinTones: ['olive', 'tan', 'dark', 'deep'],
    topHex: '#FDD835', topName: 'Golden Yellow',
    bottomHex: '#1B3A6B', bottomName: 'Navy Blue',
    name: 'Yellow Top + Navy Jeans',
    vibe: 'Sunny · Energetic · Playful',
    occasion: '🛍️ Day Out · Casual',
    tip: 'White sneakers make the yellow pop even more.',
  },
  {
    id: 9, gender: 'female',
    skinTones: ['fair', 'light', 'medium', 'olive'],
    topHex: '#7B1FA2', topName: 'Purple',
    bottomHex: '#F5F0E8', bottomName: 'Ivory',
    name: 'Purple Blouse + Ivory Pants',
    vibe: 'Elegant · Creative · Stylish',
    occasion: '🎓 College · Work · Events',
    tip: 'Silver jewellery pairs beautifully with purple tones.',
  },
  {
    id: 10, gender: 'female',
    skinTones: ['all'],
    topHex: '#D2B48C', topName: 'Camel',
    bottomHex: '#FFFFFF', bottomName: 'White',
    name: 'Camel Top + White Pants',
    vibe: 'Neutral · Polished · Versatile',
    occasion: '💼 Work · Brunch · Shopping',
    tip: 'Tan shoes and a brown belt create a cohesive neutral look.',
  },
  {
    id: 11, gender: 'female',
    skinTones: ['fair', 'light'],
    topHex: '#B5EAD7', topName: 'Mint Green',
    bottomHex: '#FFDAC1', bottomName: 'Peach',
    name: 'Mint Top + Peach Skirt',
    vibe: 'Pastel · Fresh · Cute',
    occasion: '🌻 Picnic · Garden Party',
    tip: 'White sneakers and a matching scrunchie complete this look.',
  },
  {
    id: 12, gender: 'female',
    skinTones: ['medium', 'olive', 'tan', 'dark', 'deep'],
    topHex: '#FF6B35', topName: 'Coral',
    bottomHex: '#1C1C1E', bottomName: 'Black',
    name: 'Coral Kurti + Black Jeggings',
    vibe: 'Vibrant · Trendy · Urban',
    occasion: '🏙️ College · Casual',
    tip: 'Pair with white sneakers for a street-style finish.',
  },

  // ── MALE ────────────────────────────────────────────────────
  {
    id: 13, gender: 'male',
    skinTones: ['fair', 'light', 'medium'],
    topHex: '#FFFFFF', topName: 'White',
    bottomHex: '#1C1C1E', bottomName: 'Black',
    name: 'White Shirt + Black Chinos',
    vibe: 'Classic · Clean · Sharp',
    occasion: '💼 Work · Casual · Semi-formal',
    tip: 'Roll up the sleeves for a relaxed smart-casual look.',
  },
  {
    id: 14, gender: 'male',
    skinTones: ['medium', 'olive', 'tan'],
    topHex: '#4E6B3A', topName: 'Olive Green',
    bottomHex: '#8B6914', bottomName: 'Khaki',
    name: 'Olive Shirt + Khaki Pants',
    vibe: 'Earthy · Rugged · Masculine',
    occasion: '🏕️ Casual · Outdoor · Travel',
    tip: 'Brown leather boots or tan sneakers complete this look.',
  },
  {
    id: 15, gender: 'male',
    skinTones: ['all'],
    topHex: '#1B3A6B', topName: 'Navy Blue',
    bottomHex: '#4A4A4A', bottomName: 'Charcoal',
    name: 'Navy Blue Tee + Charcoal Pants',
    vibe: 'Sophisticated · Understated · Smart',
    occasion: '🎓 Work · College · Events',
    tip: 'White sneakers keep it modern; dark loafers make it formal.',
  },
  {
    id: 16, gender: 'male',
    skinTones: ['tan', 'dark', 'deep'],
    topHex: '#FFFFFF', topName: 'White',
    bottomHex: '#D2B48C', bottomName: 'Beige',
    name: 'White Shirt + Beige Chinos',
    vibe: 'Bright · Tropical · Relaxed',
    occasion: '🏖️ Beach · Brunch · Casual',
    tip: 'Sunglasses and loafers give a vacation-ready vibe.',
  },
  {
    id: 17, gender: 'male',
    skinTones: ['fair', 'light'],
    topHex: '#2C3E7A', topName: 'Royal Blue',
    bottomHex: '#F5F0E8', bottomName: 'Ivory',
    name: 'Royal Blue Shirt + Cream Trousers',
    vibe: 'Fresh · Polished · Crisp',
    occasion: '💼 Office · Date · Formal',
    tip: 'A black belt and dark shoes tie this look together perfectly.',
  },
  {
    id: 18, gender: 'male',
    skinTones: ['medium', 'olive', 'tan', 'dark', 'deep'],
    topHex: '#C62828', topName: 'Red',
    bottomHex: '#1C1C1E', bottomName: 'Black',
    name: 'Red T-Shirt + Black Jeans',
    vibe: 'Bold · Edgy · Street Style',
    occasion: '🎉 Casual · Party',
    tip: 'White sneakers add contrast and keep it street-fresh.',
  },
  {
    id: 19, gender: 'male',
    skinTones: ['all'],
    topHex: '#4A7C59', topName: 'Sage Green',
    bottomHex: '#1C1C1E', bottomName: 'Black',
    name: 'Sage Green Shirt + Black Jeans',
    vibe: 'Calm · Natural · Modern',
    occasion: '☕ Casual · Brunch · College',
    tip: 'Minimalist white sneakers — no heavy accessories needed.',
  },
  {
    id: 20, gender: 'male',
    skinTones: ['tan', 'dark', 'deep'],
    topHex: '#FDD835', topName: 'Golden Yellow',
    bottomHex: '#1B3A6B', bottomName: 'Navy Blue',
    name: 'Yellow T-Shirt + Navy Pants',
    vibe: 'Bold · Sunny · Eye-catching',
    occasion: '🏃 Day Out · Sports · Casual',
    tip: 'White sneakers make the yellow pop even more.',
  },
  {
    id: 21, gender: 'male',
    skinTones: ['fair', 'light', 'medium', 'olive'],
    topHex: '#795548', topName: 'Warm Brown',
    bottomHex: '#F5F0E8', bottomName: 'Cream',
    name: 'Brown Tee + Cream Pants',
    vibe: 'Warm · Earthy · Effortless',
    occasion: '🌿 Casual · Outing',
    tip: 'Tan or rust loafers add to the warm earthy palette.',
  },
  {
    id: 22, gender: 'male',
    skinTones: ['all'],
    topHex: '#1C1C1E', topName: 'Black',
    bottomHex: '#1C1C1E', bottomName: 'Black',
    name: 'All-Black Outfit',
    vibe: 'Powerful · Sleek · Confident',
    occasion: '🌙 Party · Night Out · Events',
    tip: 'Add a silver watch or chain for a touch of contrast.',
  },
];

// ═══════════════════════════════════════════════════════════════
//  DATA: BODY TYPE (unchanged)
// ═══════════════════════════════════════════════════════════════
const bodyTypeData = {
  hourglass: {
    icon: '⌛', title: 'Hourglass',
    description: 'Balanced shoulders & hips with a defined waist',
    doWear: ['Wrap dresses highlight your natural waist', 'High-waisted bottoms with fitted tops', 'Bodycon dresses that follow your curves', 'Belted coats to emphasize the waist', 'A-line skirts that flow from the waist'],
    avoid: ['Boxy shapeless silhouettes', 'Drop-waist or shift dresses', 'Heavy bulky fabrics at the waist'],
    colors: ['Deep jewel tones', 'Monochromatic looks', 'Color-blocked two pieces'],
  },
  pear: {
    icon: '🍐', title: 'Pear / Triangle',
    description: 'Hips wider than shoulders with a smaller upper body',
    doWear: ['Statement tops & puff-sleeve blouses add volume on top', 'Darker colors on bottom, brighter on top', 'A-line and flared skirts skim over hips', 'Wide-leg trousers balance the hip line', 'Embellished necklines draw the eye upward'],
    avoid: ['Skinny tapered jeans without a bold top', 'Clingy fabric on hips and thighs', 'Low-rise bottoms that widen hips'],
    colors: ['Light/bright tops', 'Dark or neutral bottoms', 'Prints on upper body'],
  },
  apple: {
    icon: '🍎', title: 'Apple / Round',
    description: 'Fuller midsection with slender legs and arms',
    doWear: ['Empire-waist dresses flow from under the bust', 'V-necks and scoop necks elongate the torso', 'Wrap tops create a flattering diagonal line', 'Flowy tunic tops over slim pants', 'Monochromatic outfits create a long lean line'],
    avoid: ['High-waisted bottoms with tucked-in tops', 'Clingy fabrics at the midsection', 'Cropped or boxy T-shirts'],
    colors: ['Vertical stripes', 'Dark solid colors', 'Monochrome head-to-toe'],
  },
  rectangle: {
    icon: '▬', title: 'Rectangle / Straight',
    description: 'Shoulders, waist and hips roughly the same width',
    doWear: ['Peplum tops & ruffled blouses create curves', 'High-waisted skirts with belts define the waist', 'Layered outfits add dimension and volume', 'Fit-and-flare dresses add curves below', 'Prints and textures break up the straight line'],
    avoid: ['Straight boxy cuts from top to bottom', 'Shapeless shift dresses', 'Oversized tops with straight pants'],
    colors: ['Bold prints', 'Color blocking', 'Mixed textures'],
  },
  invertedTriangle: {
    icon: '🔻', title: 'Inverted Triangle',
    description: 'Broad shoulders with narrower hips',
    doWear: ['Full skirts & wide-leg pants add volume below', 'V-necks soften the shoulder line', 'Flared A-line skirts balance proportions', 'Soft drapey fabrics on top', 'Bright or patterned bottoms with simple tops'],
    avoid: ['Shoulder pads or puff sleeves', 'Boat necks or horizontal stripes on top', 'Skinny jeans without a flowy top'],
    colors: ['Bold/print bottoms', 'Soft neutral tops', 'Ombre or gradient skirts'],
  },
};

// ═══════════════════════════════════════════════════════════════
//  DATA: QUIZ
// ═══════════════════════════════════════════════════════════════
const quizQuestions = [
  {
    question: 'What best describes your overall fashion vibe?',
    options: [
      'Comfort-first — I love easy, breathable outfits',
      'Elegant & classy — neat, polished looks',
      'Trendy girl — I love experimenting with fashion',
      'Minimal and timeless — simple but stylish',
    ],
  },
  { question: 'Which color palette do you naturally gravitate towards?', options: ['Neutrals — black, white, beige, grey', 'Soft pastels — lavender, mint, baby pink', 'Bold pops — red, cobalt blue, hot pink', 'Earthy tones — brown, olive, rust, mustard'] },
  { question: 'How would you describe your daily lifestyle?', options: ['College / Student — casual, comfortable, quick outfits', 'Professional — formal or semi-formal every day', 'Active & Outdoorsy — functional, sporty looks', 'Social Butterfly — outings, café dates, events'] },
  { question: "What's your shopping preference?", options: ['Affordable basics — I love budget-friendly finds', 'Mid-range — good quality at reasonable price', 'High-end pieces — I prefer premium items', 'A mix — I buy whatever I fall in love with'] },
];

// ── Style types now include outfitIdeas + colors (no products)
const styleTypes = {
  'Comfort-first — I love easy, breathable outfits': {
    name: 'Soft Girl Comfort',
    description: 'You love cozy, breathable, cute outfits that make you feel relaxed and pretty.',
    tips: ['Choose flowy tops, oversized tees, and soft fabrics', 'Wear mom jeans, straight pants, or leggings', 'Style with sneakers, flats, and pastel bags', 'Use soft-girl accessories like scrunchies and dainty necklaces'],
    outfitIdeas: ['🤍 Oversized white tee + Light wash mom jeans', '🌸 Flowy pastel blouse + High-waist soft shorts', '🧶 Cozy knit sweater + Beige straight-leg pants', '💜 Soft grey hoodie + Lavender jogger pants'],
    colors: [{ hex: '#FFB6C1', name: 'Soft Pink' }, { hex: '#B5EAD7', name: 'Mint' }, { hex: '#C7CEEA', name: 'Periwinkle' }, { hex: '#FFDAC1', name: 'Peach' }, { hex: '#F5F0E8', name: 'Ivory' }],
  },
  'Elegant & classy — neat, polished looks': {
    name: 'Classy Chic',
    description: 'You prefer polished, elegant outfits with clean silhouettes.',
    tips: ['Invest in blazers, trousers, satin blouses, and midi dresses', 'Choose neutral or monotone outfits', 'Wear structured handbags & pointed heels', 'Keep accessories minimal and elegant'],
    outfitIdeas: ['🖤 Crisp white shirt + Tailored black trousers', '🤍 Camel blazer + Cream wide-leg pants', '💙 Satin navy midi dress + Nude heels', '🩶 Grey co-ord set + Structured tote bag'],
    colors: [{ hex: '#1C1C1E', name: 'Black' }, { hex: '#F5F0E8', name: 'Ivory' }, { hex: '#D2B48C', name: 'Camel' }, { hex: '#708090', name: 'Slate Grey' }, { hex: '#1B3A6B', name: 'Navy' }],
  },
  'Trendy girl — I love experimenting with fashion': {
    name: 'Fashionista Edge',
    description: 'You love bold patterns, new trends, and expressive outfits.',
    tips: ['Try statement jackets and printed tops', 'Mix bold colors and modern accessories', 'Wear trending shoes like chunky sneakers or block heels', 'Experiment with layers and silhouettes'],
    outfitIdeas: ['🔥 Crop top + High-waisted cargo pants + Chunky sneakers', '✨ Bold co-ord set in rust or lilac + Statement earrings', '🧥 Leather jacket + Floral midi skirt + Ankle boots', '🎨 Colour-blocked top + Tailored shorts + Platform shoes'],
    colors: [{ hex: '#FF6B6B', name: 'Coral' }, { hex: '#C8A2C8', name: 'Lilac' }, { hex: '#A0522D', name: 'Rust' }, { hex: '#4ECDC4', name: 'Teal' }, { hex: '#FFE66D', name: 'Sunshine' }],
  },
  'Minimal and timeless — simple but stylish': {
    name: 'Timeless Minimalist',
    description: 'You love clean, simple, timeless outfits that always stay stylish.',
    tips: ['Stick to monochrome or two-tone outfits', 'Choose basics like white shirts and tailored pants', 'Wear neutral handbags & clean shoes', 'Keep accessories minimal and premium-looking'],
    outfitIdeas: ['⬜ White tee + Straight-leg jeans + White sneakers', '🖤 Black turtleneck + Beige trousers + Loafers', '🤍 Linen button-down + Tailored shorts + Tan slides', '🩶 Grey knit top + Dark navy pants + Clean leather bag'],
    colors: [{ hex: '#FFFFFF', name: 'White' }, { hex: '#1C1C1E', name: 'Black' }, { hex: '#D2B48C', name: 'Tan' }, { hex: '#4A4A4A', name: 'Charcoal' }, { hex: '#F5F0E8', name: 'Cream' }],
  },
};

// ═══════════════════════════════════════════════════════════════
//  SVG: Female Avatar
//  Props: topHex, bottomHex (outfit colours), skinHex (skin tone)
// ═══════════════════════════════════════════════════════════════
function FemaleAvatar({ topHex = '#cccccc', bottomHex = '#999999', skinHex = '#FDDBB4' }) {
  const hair = '#3D2B1F';
  const shoe = '#4A3728';
  return (
    <svg viewBox="0 0 120 230" xmlns="http://www.w3.org/2000/svg" className="outfit-avatar">
      {/* Hair back */}
      <ellipse cx="60" cy="26" rx="23" ry="28" fill={hair} />
      {/* Head */}
      <circle cx="60" cy="28" r="20" fill={skinHex} />
      {/* Eyebrows */}
      <path d="M50 22 Q54 19 58 22" stroke="#5C3D2E" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
      <path d="M62 22 Q66 19 70 22" stroke="#5C3D2E" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
      {/* Eyes */}
      <ellipse cx="54" cy="27" rx="2.8" ry="3.2" fill="#2C1A10"/>
      <ellipse cx="66" cy="27" rx="2.8" ry="3.2" fill="#2C1A10"/>
      <circle cx="55" cy="26" r="0.9" fill="white"/>
      <circle cx="67" cy="26" r="0.9" fill="white"/>
      {/* Smile */}
      <path d="M54 34 Q60 39 66 34" stroke="#C06050" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Hair front */}
      <path d="M40 18 Q47 4 60 6 Q73 4 80 18" fill={hair}/>
      {/* Neck */}
      <rect x="56" y="47" width="8" height="11" fill={skinHex} rx="2"/>
      {/* Blouse body */}
      <path d="M36 58 L84 58 L79 112 L41 112 Z" fill={topHex}/>
      {/* Left arm/sleeve */}
      <path d="M36 58 L21 100 L30 103 L41 68 Z" fill={topHex}/>
      {/* Right arm/sleeve */}
      <path d="M84 58 L99 100 L90 103 L79 68 Z" fill={topHex}/>
      {/* Hands */}
      <ellipse cx="25.5" cy="104" rx="5" ry="3.5" fill={skinHex} transform="rotate(-20 25.5 104)"/>
      <ellipse cx="94.5" cy="104" rx="5" ry="3.5" fill={skinHex} transform="rotate(20 94.5 104)"/>
      {/* Skirt */}
      <path d="M41 112 L79 112 L95 198 L25 198 Z" fill={bottomHex}/>
      {/* Shoes */}
      <ellipse cx="41" cy="201" rx="11" ry="5" fill={shoe}/>
      <ellipse cx="79" cy="201" rx="11" ry="5" fill={shoe}/>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SVG: Male Avatar
// ═══════════════════════════════════════════════════════════════
function MaleAvatar({ topHex = '#cccccc', bottomHex = '#999999', skinHex = '#FDDBB4' }) {
  const hair = '#3D2B1F';
  const shoe = '#2C2C2C';
  return (
    <svg viewBox="0 0 120 235" xmlns="http://www.w3.org/2000/svg" className="outfit-avatar">
      {/* Head */}
      <circle cx="60" cy="28" r="21" fill={skinHex}/>
      {/* Hair */}
      <path d="M39 20 Q46 3 60 5 Q74 3 81 20 Q79 8 60 6 Q41 8 39 20 Z" fill={hair}/>
      {/* Eyebrows */}
      <path d="M49 21 Q54 18 59 21" stroke="#5C3D2E" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      <path d="M61 21 Q66 18 71 21" stroke="#5C3D2E" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      {/* Eyes */}
      <ellipse cx="53" cy="27" rx="2.8" ry="3.2" fill="#2C1A10"/>
      <ellipse cx="67" cy="27" rx="2.8" ry="3.2" fill="#2C1A10"/>
      <circle cx="54" cy="26" r="0.9" fill="white"/>
      <circle cx="68" cy="26" r="0.9" fill="white"/>
      {/* Smile */}
      <path d="M54 36 Q60 41 66 36" stroke="#C06050" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Neck */}
      <rect x="55" y="48" width="10" height="12" fill={skinHex} rx="2"/>
      {/* Shirt */}
      <path d="M32 60 L88 60 L85 125 L35 125 Z" fill={topHex}/>
      {/* Collar */}
      <path d="M55 60 L60 73 L65 60" fill="white" opacity="0.75"/>
      {/* Arms */}
      <path d="M32 60 L17 112 L27 115 L37 70 Z" fill={topHex}/>
      <path d="M88 60 L103 112 L93 115 L83 70 Z" fill={topHex}/>
      {/* Hands */}
      <ellipse cx="22" cy="117" rx="6" ry="4" fill={skinHex} transform="rotate(-15 22 117)"/>
      <ellipse cx="98" cy="117" rx="6" ry="4" fill={skinHex} transform="rotate(15 98 117)"/>
      {/* Left trouser leg */}
      <path d="M35 125 L60 125 L56 212 L28 212 Z" fill={bottomHex}/>
      {/* Right trouser leg */}
      <path d="M60 125 L85 125 L92 212 L64 212 Z" fill={bottomHex}/>
      {/* Shoes */}
      <ellipse cx="42" cy="215" rx="14" ry="5" fill={shoe}/>
      <ellipse cx="78" cy="215" rx="14" ry="5" fill={shoe}/>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
//  COMPONENT: Colour Combination View
//  Two inputs → skin tone + gender → outfit card with avatar
// ═══════════════════════════════════════════════════════════════
function ColorCombinationView({ saveTip }) {
  const [skinTone, setSkinTone]     = useState(null);
  const [gender, setGender]         = useState('female');
  const [rejectedIds, setRejectedIds] = useState(new Set());
  const [outfitIdx, setOutfitIdx]   = useState(0);

  // All outfits matching skin tone + gender
  const matchingOutfits = useMemo(() => {
    if (!skinTone) return [];
    return OUTFITS.filter(o =>
      o.gender === gender &&
      (o.skinTones.includes(skinTone) || o.skinTones.includes('all'))
    );
  }, [skinTone, gender]);

  // Remove rejected from the list
  const availableOutfits = useMemo(
    () => matchingOutfits.filter(o => !rejectedIds.has(o.id)),
    [matchingOutfits, rejectedIds]
  );

  // Currently shown outfit
  const currentOutfit = availableOutfits.length > 0
    ? availableOutfits[outfitIdx % availableOutfits.length]
    : null;

  // The skin tone hex for the avatar
  const skinHex = SKIN_TONES.find(s => s.id === skinTone)?.hex || '#FDDBB4';

  // Reset index and rejections when inputs change
  useEffect(() => {
    setOutfitIdx(0);
    setRejectedIds(new Set());
  }, [skinTone, gender]);

  // Reject: add to rejected set, move to next
  const handleReject = () => {
    if (!currentOutfit) return;
    const newRejected = new Set(rejectedIds);
    newRejected.add(currentOutfit.id);
    const remaining = matchingOutfits.filter(o => !newRejected.has(o.id));
    if (remaining.length === 0) {
      // All rejected → reset and start fresh
      setRejectedIds(new Set());
      setOutfitIdx(0);
    } else {
      setRejectedIds(newRejected);
      setOutfitIdx(0);
    }
  };

  // Next: just advance the index
  const handleNext = () => {
    if (availableOutfits.length <= 1) return;
    setOutfitIdx(prev => (prev + 1) % availableOutfits.length);
  };

  return (
    <motion.div className="colors-view" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
      <div className="products-header">
        <h2>🎨 Colour Match</h2>
        <p>Choose your skin tone and gender to get personalised outfit suggestions</p>
      </div>

      {/* ── Step 1: Skin Tone */}
      <div className="cc-section">
        <h3 className="cc-step-label">
          <span className="cc-step-num">1</span> Select Your Skin Tone
        </h3>
        <div className="skin-tone-row">
          {SKIN_TONES.map(tone => (
            <button
              key={tone.id}
              className={`skin-tone-btn ${skinTone === tone.id ? 'selected' : ''}`}
              onClick={() => setSkinTone(tone.id)}
              title={tone.label}
            >
              <span className="skin-dot" style={{ background: tone.hex }} />
              <span className="skin-label">{tone.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Step 2: Gender */}
      <div className="cc-section">
        <h3 className="cc-step-label">
          <span className="cc-step-num">2</span> Select Gender
        </h3>
        <div className="gender-row">
          {[['female','👩 Female'],['male','👨 Male']].map(([g,l]) => (
            <button
              key={g}
              className={`gender-btn ${gender === g ? 'selected' : ''}`}
              onClick={() => setGender(g)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results */}
      <AnimatePresence mode="wait">
        {/* Show placeholder until skin tone is picked */}
        {!skinTone && (
          <motion.div key="placeholder" className="outfit-placeholder" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
            <div className="placeholder-avatar-wrap">
              {gender === 'female'
                ? <FemaleAvatar topHex="#e0e0e0" bottomHex="#bdbdbd" skinHex="#f0d9c0"/>
                : <MaleAvatar   topHex="#e0e0e0" bottomHex="#bdbdbd" skinHex="#f0d9c0"/>
              }
            </div>
            <p>👆 Select your skin tone above to see personalised outfit suggestions</p>
          </motion.div>
        )}

        {/* Show outfit card when skin tone selected */}
        {skinTone && currentOutfit && (
          <motion.div
            key={currentOutfit.id}
            className="outfit-result-card"
            initial={{ opacity:0, scale:0.95, y:20 }}
            animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:0.95, y:-20 }}
            transition={{ duration:0.4 }}
          >
            {/* Counter */}
            <div className="outfit-counter">
              Outfit {(outfitIdx % availableOutfits.length) + 1} of {availableOutfits.length}
              {rejectedIds.size > 0 && <span className="rejected-badge">{rejectedIds.size} skipped</span>}
            </div>

            <div className="outfit-result-inner">
              {/* ── Left: Avatar + colour swatches */}
              <div className="outfit-avatar-col">
                {gender === 'female'
                  ? <FemaleAvatar topHex={currentOutfit.topHex} bottomHex={currentOutfit.bottomHex} skinHex={skinHex}/>
                  : <MaleAvatar   topHex={currentOutfit.topHex} bottomHex={currentOutfit.bottomHex} skinHex={skinHex}/>
                }
                <div className="outfit-swatches">
                  <div className="swatch-item">
                    <span className="swatch-circle" style={{ background: currentOutfit.topHex, border: currentOutfit.topHex === '#FFFFFF' ? '1px solid #ddd' : 'none' }}/>
                    <span>{currentOutfit.topName}</span>
                  </div>
                  <span className="swatch-plus">+</span>
                  <div className="swatch-item">
                    <span className="swatch-circle" style={{ background: currentOutfit.bottomHex, border: currentOutfit.bottomHex === '#FFFFFF' ? '1px solid #ddd' : 'none' }}/>
                    <span>{currentOutfit.bottomName}</span>
                  </div>
                </div>
              </div>

              {/* ── Right: Outfit info */}
              <div className="outfit-info-col">
                <h3 className="outfit-name">{currentOutfit.name}</h3>
                <p className="outfit-vibe">{currentOutfit.vibe}</p>
                <span className="outfit-occasion">{currentOutfit.occasion}</span>

                <div className="outfit-tip-box">
                  <span>💡</span>
                  <p>{currentOutfit.tip}</p>
                </div>

                <div className="outfit-actions">
                  <button className="outfit-btn btn-reject" onClick={handleReject} title="Not for me — show a different suggestion">
                    ✗ Not for me
                  </button>
                  {availableOutfits.length > 1 && (
                    <button className="outfit-btn btn-next" onClick={handleNext} title="Show next outfit">
                      → Next
                    </button>
                  )}
                  <button className="outfit-btn btn-save" onClick={() => saveTip(`${currentOutfit.name} — ${currentOutfit.tip}`)}>
                    ❤️ Save
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* All outfits rejected */}
        {skinTone && availableOutfits.length === 0 && (
          <motion.div key="empty" className="outfit-result-card" style={{ textAlign:'center', padding:'40px 20px' }} initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <p style={{ fontSize:'2rem', marginBottom:'12px' }}>🔄</p>
            <p style={{ fontSize:'1.1rem', color:'#555' }}>You've seen all suggestions! Showing them again…</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT: FashionSuggestion
// ═══════════════════════════════════════════════════════════════
const FashionSuggestion = () => {
  const [currentView, setCurrentView] = useState('main');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizStep, setQuizStep]       = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput]     = useState('');
  const [styleResult, setStyleResult] = useState(null);
  const [isLoading, setIsLoading]     = useState(false);
  const [selectedBodyType, setSelectedBodyType] = useState(null);

  useEffect(() => {
    setChatMessages([{
      type: 'bot',
      message: "👋 Hi! I'm your fashion assistant! Ask me anything about style, outfit ideas, or fashion trends. How can I help you look amazing today?",
    }]);
  }, []);

  const handleQuizAnswer = (answer) => {
    const a = { ...quizAnswers, [quizStep]: answer };
    setQuizAnswers(a);
    if (quizStep < quizQuestions.length - 1) setQuizStep(quizStep + 1);
    else setStyleResult(styleTypes[a[0]]);
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput(''); setIsLoading(true);
    setChatMessages(prev => [...prev, { type: 'user', message: msg }]);
    try {
      const res = await fetch('https://self-care-assistant.onrender.com/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `You are a friendly fashion expert. User: ${msg}` }),
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { type: 'bot', message: data.reply || "Sorry, I couldn't generate a response." }]);
    } catch {
      setChatMessages(prev => [...prev, { type: 'bot', message: '⚠️ Something went wrong. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTip = (tip) => {
    const favs = JSON.parse(localStorage.getItem('fashionFavorites') || '[]');
    if (!favs.includes(tip)) { favs.push(tip); localStorage.setItem('fashionFavorites', JSON.stringify(favs)); alert('Tip saved! ❤️'); }
    else alert('Already in favorites! 😊');
  };

  return (
    <div className="fashion-service">
      <div className="fashion-suggestion">

        {/* Header */}
        <div className="fashion-header">
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}>
            <h1>👗 Fashion Suggestion</h1>
            <p>Discover your personal style and get fashion advice</p>
          </motion.div>
        </div>

        {/* Nav — Products removed */}
        <motion.div className="fashion-nav" initial={{ opacity:0, y:25 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.2 }}>
          {[['main','🏠 Home'],['bodytype','👤 Body Type'],['colors','🎨 Colour Match'],['quiz','🎯 Style Quiz'],['chat','🤖 AI Chat']].map(([k,l]) => (
            <button key={k} className={currentView===k?'active':''} onClick={() => setCurrentView(k)}>{l}</button>
          ))}
        </motion.div>

        {/* ════════════ HOME ════════════ */}
        {currentView==='main' && (
          <div className="main-view">
            <div className="feature-cards">
              {[
                ['bodytype','👤','Body Type Guide','Get outfit tips tailored to your unique body shape'],
                ['colors','🎨','Colour Match','Get outfit suggestions based on your skin tone & gender'],
                ['quiz','🎯','Discover Your Style','Take our quiz to find your perfect fashion personality'],
                ['chat','🤖','AI Fashion Assistant','Chat with our AI for personalised outfit recommendations'],
              ].map(([v,ic,t,d]) => (
                <motion.div key={v} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }} className="feature-card" onClick={() => setCurrentView(v)}>
                  <div className="feature-icon">{ic}</div><h3>{t}</h3><p>{d}</p>
                </motion.div>
              ))}
            </div>
            <div className="daily-tips">
              <h3>💡 Today's Fashion Tips</h3>
              <div className="tips-grid">
                {[
                  'Mix textures for visual interest — try pairing a silk blouse with denim or leather.',
                  'The rule of three: stick to maximum 3 colors in one outfit for a cohesive look.',
                  'When in doubt, add a belt — it defines your waist and elevates any outfit.',
                ].map((tip,i) => (
                  <div key={i} className="tip-card">
                    <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}>
                      <p>"{tip}"</p>
                      <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={() => saveTip(tip)}>❤️ Save</motion.button>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════════ BODY TYPE ════════════ */}
        {currentView==='bodytype' && (
          <motion.div className="bodytype-view" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
            <div className="products-header"><h2>👤 Dress for Your Body Type</h2><p>Select your body shape to get personalised style tips</p></div>
            <div className="bodytype-selector">
              {Object.entries(bodyTypeData).map(([k,d]) => (
                <motion.div key={k} className={`bodytype-chip ${selectedBodyType===k?'selected':''}`} onClick={() => setSelectedBodyType(selectedBodyType===k?null:k)} whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}>
                  <span className="bt-icon">{d.icon}</span><span>{d.title}</span>
                </motion.div>
              ))}
            </div>
            {selectedBodyType && (
              <motion.div className="bodytype-detail" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
                <div className="bt-detail-header">
                  <span className="bt-big-icon">{bodyTypeData[selectedBodyType].icon}</span>
                  <div><h3>{bodyTypeData[selectedBodyType].title} Body Type</h3><p>{bodyTypeData[selectedBodyType].description}</p></div>
                </div>
                <div className="bt-detail-grid">
                  <div className="bt-section do"><h4>✅ What to Wear</h4><ul>{bodyTypeData[selectedBodyType].doWear.map((item,i) => <li key={i}>{item}</li>)}</ul></div>
                  <div className="bt-section avoid"><h4>❌ What to Avoid</h4><ul>{bodyTypeData[selectedBodyType].avoid.map((item,i) => <li key={i}>{item}</li>)}</ul></div>
                </div>
                <div className="bt-colors-tip"><h4>🎨 Color & Pattern Tips</h4><div className="bt-color-list">{bodyTypeData[selectedBodyType].colors.map((c,i) => <span key={i} className="bt-color-tag">{c}</span>)}</div></div>
                <motion.button className="save-tip-btn" onClick={() => saveTip(`${bodyTypeData[selectedBodyType].title}: ${bodyTypeData[selectedBodyType].doWear[0]}`)} whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>❤️ Save These Tips</motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ════════════ COLOUR MATCH ════════════ */}
        {currentView==='colors' && <ColorCombinationView saveTip={saveTip}/>}

        {/* ════════════ STYLE QUIZ ════════════ */}
        {currentView==='quiz' && (
          <div className="quiz-view">
            {!styleResult ? (
              <div className="quiz-container">
                <div className="quiz-progress">
                  <div className="progress-bar"><div className="progress-fill" style={{ width:`${((quizStep+1)/quizQuestions.length)*100}%` }}/></div>
                  <span>Question {quizStep+1} of {quizQuestions.length}</span>
                </div>
                <div className="question-card">
                  <h3>{quizQuestions[quizStep].question}</h3>
                  <div className="options">
                    {quizQuestions[quizStep].options.map((opt,i) => <button key={i} className="option-btn" onClick={() => handleQuizAnswer(opt)}>{opt}</button>)}
                  </div>
                </div>
              </div>
            ) : (
              // ── Result: outfit ideas + colour palette (no products)
              <div className="result-container">
                <Confetti numberOfPieces={180} gravity={0.25} recycle={false}/>
                <div className="result-header">
                  <h2>🎉 Your Style: {styleResult.name}</h2>
                  <p>{styleResult.description}</p>
                </div>

                {/* Style tips */}
                <div className="style-tips">
                  <h3>✨ Your Personal Style Tips</h3>
                  <div className="tips-list">
                    {styleResult.tips.map((tip,i) => (
                      <div key={i} className="tip-item">
                        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}>
                          <p>{tip}</p>
                          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={() => saveTip(tip)}>❤️ Save</motion.button>
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outfit ideas */}
                <div className="quiz-outfit-section">
                  <h3>👗 Outfit Ideas for Your Style</h3>
                  <div className="quiz-outfit-grid">
                    {styleResult.outfitIdeas.map((idea,i) => (
                      <motion.div key={i} className="quiz-outfit-item" initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.4, delay:i*0.1 }}>
                        <p>{idea}</p>
                        <button onClick={() => saveTip(idea)}>❤️ Save</button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Colour palette */}
                <div className="quiz-palette-section">
                  <h3>🎨 Your Colour Palette</h3>
                  <div className="quiz-palette-row">
                    {styleResult.colors.map((c,i) => (
                      <div key={i} className="quiz-palette-chip">
                        <div className="quiz-palette-dot" style={{ background:c.hex, border: c.hex === '#FFFFFF' ? '1px solid #ddd' : 'none' }}/>
                        <span>{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }} className="retry-btn" onClick={() => { setQuizAnswers({}); setQuizStep(0); setStyleResult(null); }}>
                  🔄 Take Quiz Again
                </motion.button>
              </div>
            )}
          </div>
        )}

        {/* ════════════ AI CHAT ════════════ */}
        {currentView==='chat' && (
          <div className="chat-view">
            <div className="chat-container">
              <div className="chat-messages">
                {chatMessages.map((msg,i) => (
                  <div key={i} className={`message ${msg.type}`}>
                    <div className="message-content">
                      <ReactMarkdown>{msg.message}</ReactMarkdown>
                      <div className="message-actions">{msg.type==='bot' && <button className="copy-btn" onClick={() => navigator.clipboard.writeText(msg.message)}><FaRegCopy/></button>}</div>
                    </div>
                  </div>
                ))}
                {isLoading && <div className="message bot"><div className="message-content loading"><div className="typing-indicator"><span/><span/><span/></div></div></div>}
              </div>
              <form className="chat-input-form" onSubmit={handleChatSubmit}>
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ask me about fashion, outfits, or style tips..." disabled={isLoading}/>
                <button type="submit" disabled={isLoading || !chatInput.trim()}>➤</button>
              </form>
            </div>
          </div>
        )}

      </div>
      <ExpertTalkWidget service="fashion" isPremium={false}/>
    </div>
  );
};

export default FashionSuggestion;