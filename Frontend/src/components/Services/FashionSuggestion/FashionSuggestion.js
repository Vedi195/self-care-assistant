import React, { useState, useEffect } from 'react';
import './FashionSuggestion.css';
import Confetti from "react-confetti";
import { FaRegCopy } from 'react-icons/fa';
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import ExpertTalkWidget from '../ExpertTalkWidget';

const fashionProducts = {
  casual: [
    { 
      id:1, 
      name:"Oversized Cotton Tee", 
      image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop", 
      description:"Breathable, relaxed fit — perfect for everyday wear", 
      colors:["White","Beige","Lavender"], 
      price:"₹499–₹999", 
      link:"https://www.myntra.com/t-shirts", 
      tag:"Best Seller" 
    },
    { id:2, name:"High-Rise Mom Jeans", image:"https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop", description:"Classic straight-leg fit with a comfortable high waist", colors:["Light Blue","Dark Blue","Black"], price:"₹1,299–₹2,499", link:"https://www.myntra.com/jeans", tag:"Trending" },
    { id:3, name:"Floral Midi Skirt", image:"https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=300&h=300&fit=crop", description:"Lightweight flowy skirt, perfect for casual outings", colors:["Pink Floral","Blue Floral"], price:"₹799–₹1,499", link:"https://www.myntra.com/skirts", tag:"New" },
    { id:4, name:"Canvas Sneakers", image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop", description:"Clean, versatile sneakers that match any casual outfit", colors:["White","Black","Pastel Pink"], price:"₹999–₹2,999", link:"https://www.myntra.com/sneakers", tag:"Must Have" },
  ],
  formal: [
    { id:5, name:"Structured Blazer", image:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=300&fit=crop", description:"Sharp, tailored blazer for professional settings", colors:["Black","Navy","Beige"], price:"₹1,999–₹4,999", link:"https://www.myntra.com/blazers", tag:"Professional Pick" },
    { id:6, name:"Tailored Trousers", image:"https://images.unsplash.com/photo-1594938298603-c8148c4b4e43?w=300&h=300&fit=crop", description:"Well-cut trousers in premium fabric for work wear", colors:["Black","Grey","Camel"], price:"₹1,499–₹3,499", link:"https://www.myntra.com/trousers", tag:"Classic" },
    { id:7, name:"Satin Blouse", image:"https://images.unsplash.com/photo-1503342564462-17f3343dfb64?w=300&h=300&fit=crop", description:"Elegant satin blouse — pairs with trousers or pencil skirt", colors:["Ivory","Dusty Rose","Sage"], price:"₹999–₹2,499", link:"https://www.myntra.com/shirts", tag:"Elegant" },
    { id:8, name:"Block Heel Pumps", image:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=300&fit=crop", description:"Comfortable block heel — stable for long work days", colors:["Nude","Black","Brown"], price:"₹1,499–₹4,999", link:"https://www.myntra.com/heels", tag:"Work Essential" },
  ],
  trendy: [
    { id:9, name:"Co-ord Set", image:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop", description:"Matching set — effortless yet stylish for any outing", colors:["Lilac","Sage Green","Rust"], price:"₹1,299–₹3,499", link:"https://www.myntra.com/co-ords", tag:"🔥 Hot Now" },
    { id:10, name:"Cargo Pants", image:"https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=300&h=300&fit=crop", description:"Multi-pocket cargo — functional and super on-trend", colors:["Olive","Black","Khaki"], price:"₹999–₹2,499", link:"https://www.myntra.com/cargo-pants", tag:"Y2K Comeback" },
    { id:11, name:"Statement Jacket", image:"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop", description:"Bold printed or textured jacket for an expressive look", colors:["Patchwork","Denim","Faux Leather"], price:"₹1,499–₹5,999", link:"https://www.myntra.com/jackets", tag:"Bold" },
    { id:12, name:"Chunky Platform Sneakers", image:"https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=300&fit=crop", description:"Thick sole sneakers — add height and edge to any fit", colors:["White","Black/White","Pastel"], price:"₹1,999–₹6,999", link:"https://www.myntra.com/platform-sneakers", tag:"Viral Pick" },
  ],
};

const bodyTypeData = {
  hourglass:{ 
    icon:"⌛", 
    title:"Hourglass", 
    description:"Balanced shoulders & hips with a defined waist", 
    doWear:[
      "Wrap dresses highlight your natural waist",
      "High-waisted bottoms with fitted tops",
      "Bodycon dresses that follow your curves",
      "Belted coats to emphasize the waist",
      "A-line skirts that flow from the waist"
    ], 
    avoid:[
      "Boxy shapeless silhouettes",
      "Drop-waist or shift dresses",
      "Heavy bulky fabrics at the waist"
    ], 
    colors:[
      "Deep jewel tones",
      "Monochromatic looks",
      "Color-blocked two pieces"
    ] 
  },

  pear:{ icon:"🍐", title:"Pear / Triangle", description:"Hips wider than shoulders with a smaller upper body", doWear:["Statement tops & puff-sleeve blouses add volume on top","Darker colors on bottom, brighter on top","A-line and flared skirts skim over hips","Wide-leg trousers balance the hip line","Embellished necklines draw the eye upward"], avoid:["Skinny tapered jeans without a bold top","Clingy fabric on hips and thighs","Low-rise bottoms that widen hips"], colors:["Light/bright tops","Dark or neutral bottoms","Prints on upper body"] },
  apple:{ icon:"🍎", title:"Apple / Round", description:"Fuller midsection with slender legs and arms", doWear:["Empire-waist dresses flow from under the bust","V-necks and scoop necks elongate the torso","Wrap tops create a flattering diagonal line","Flowy tunic tops over slim pants","Monochromatic outfits create a long lean line"], avoid:["High-waisted bottoms with tucked-in tops","Clingy fabrics at the midsection","Cropped or boxy T-shirts"], colors:["Vertical stripes","Dark solid colors","Monochrome head-to-toe"] },
  rectangle:{ icon:"▬", title:"Rectangle / Straight", description:"Shoulders, waist and hips roughly the same width", doWear:["Peplum tops & ruffled blouses create curves","High-waisted skirts with belts define the waist","Layered outfits add dimension and volume","Fit-and-flare dresses add curves below","Prints and textures break up the straight line"], avoid:["Straight boxy cuts from top to bottom","Shapeless shift dresses","Oversized tops with straight pants"], colors:["Bold prints","Color blocking","Mixed textures"] },
  invertedTriangle:{ icon:"🔻", title:"Inverted Triangle", description:"Broad shoulders with narrower hips", doWear:["Full skirts & wide-leg pants add volume below","V-necks soften the shoulder line","Flared A-line skirts balance proportions","Soft drapey fabrics on top","Bright or patterned bottoms with simple tops"], avoid:["Shoulder pads or puff sleeves","Boat necks or horizontal stripes on top","Skinny jeans without a flowy top"], colors:["Bold/print bottoms","Soft neutral tops","Ombre or gradient skirts"] },
};

const colorCombos = [
  { 
    name:"Classic Neutrals", 
    palette:["#F5F0E8","#D2B48C","#8B7355","#4A3728"], 
    labels:["Ivory","Sand","Tan","Espresso"], 
    outfit:"Ivory blouse + tan trousers + espresso belt & bag", 
    vibe:"Timeless · Polished · Professional" 
  },

  { name:"Soft Pastels", palette:["#FFD1DC","#B5EAD7","#C7CEEA","#FFDAC1"], labels:["Blush","Mint","Periwinkle","Peach"], outfit:"Blush top + periwinkle skirt + mint accessories", vibe:"Dreamy · Feminine · Fresh" },
  { name:"Bold & Vibrant", palette:["#FF6B6B","#4ECDC4","#FFE66D","#1A535C"], labels:["Coral","Teal","Sunshine","Deep Teal"], outfit:"Coral blazer + teal wide-leg pants + sunshine bag", vibe:"Confident · Energetic · Eye-catching" },
  { name:"Earthy Tones", palette:["#A0522D","#D2691E","#8FBC8F","#F4A460"], labels:["Rust","Terracotta","Sage","Camel"], outfit:"Rust top + sage skirt + camel sandals", vibe:"Grounded · Warm · Natural" },
  { name:"Monochrome Black", palette:["#1C1C1E","#3C3C3C","#6E6E6E","#B0B0B0"], labels:["Jet","Charcoal","Grey","Silver"], outfit:"All-black with subtle texture contrast — blazer over slip dress", vibe:"Sleek · Sophisticated · Powerful" },
  { name:"Pink Power", palette:["#FF1493","#FF69B4","#FFB6C1","#FFF0F5"], labels:["Deep Pink","Hot Pink","Light Pink","Blush"], outfit:"Hot pink blazer + light pink pants + deep pink heels", vibe:"Playful · Bold · Fashion-forward" },
  { name:"Ocean Blues", palette:["#003366","#0066CC","#66B2FF","#CCE5FF"], labels:["Navy","Royal","Sky","Powder"], outfit:"Navy blazer + sky blue jeans + powder blue scarf", vibe:"Fresh · Calm · Refined" },
  { name:"Sunset Warm", palette:["#FF4500","#FF8C00","#FFD700","#FFF8DC"], labels:["Sunset","Amber","Gold","Cream"], outfit:"Amber midi dress + gold accessories + cream cardigan", vibe:"Warm · Glowing · Bohemian" },
];

const quizQuestions = [
  { 
    question:"What best describes your overall fashion vibe?", 
    options:[
      "Comfort-first — I love easy, breathable outfits",
      "Elegant & classy — neat, polished looks",
      "Trendy girl — I love experimenting with fashion",
      "Minimal and timeless — simple but stylish"
    ]
  },

  { question:"Which color palette do you naturally gravitate towards?", options:["Neutrals — black, white, beige, grey","Soft pastels — lavender, mint, baby pink","Bold pops — red, cobalt blue, hot pink","Earthy tones — brown, olive, rust, mustard"] },
  { question:"How would you describe your daily lifestyle?", options:["College / Student — casual, comfortable, quick outfits","Professional — formal or semi-formal every day","Active & Outdoorsy — functional, sporty looks","Social Butterfly — outings, café dates, events"] },
  { question:"What's your shopping preference?", options:["Affordable basics — I love budget-friendly finds","Mid-range — good quality at reasonable price","High-end pieces — I prefer premium items","A mix — I buy whatever I fall in love with"] }
];


const styleTypes = {
  "Comfort-first — I love easy, breathable outfits": 
  { 
    name:"Soft Girl Comfort", 
    description:"You love cozy, breathable, cute outfits that make you feel relaxed and pretty.", 
    tips:[
      "Choose flowy tops, oversized tees, and soft fabrics",
      "Wear mom jeans, straight pants, or leggings",
      "Style with sneakers, flats, and pastel bags",
      "Use soft-girl accessories like scrunchies and dainty necklaces"
    ]
  },
  
  "Elegant & classy — neat, polished looks": { name:"Classy Chic", description:"You prefer polished, elegant outfits with clean silhouettes.", tips:["Invest in blazers, trousers, satin blouses, and midi dresses","Choose neutral or monotone outfits","Wear structured handbags & pointed heels","Keep accessories minimal and elegant"] },
  "Trendy girl — I love experimenting with fashion": { name:"Fashionista Edge", description:"You love bold patterns, new trends, and expressive outfits.", tips:["Try statement jackets and printed tops","Mix bold colors and modern accessories","Wear trending shoes like chunky sneakers or block heels","Experiment with layers and silhouettes"] },
  "Minimal and timeless — simple but stylish": { name:"Timeless Minimalist", description:"You love clean, simple, timeless outfits that always stay stylish.", tips:["Stick to monochrome or two-tone outfits","Choose basics like white shirts and tailored pants","Wear neutral handbags & clean shoes","Keep accessories minimal and premium-looking"] }
};

const FashionSuggestion = () => {
  const [currentView, setCurrentView] = useState('main');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizStep, setQuizStep] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [styleResult, setStyleResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [productCategory, setProductCategory] = useState('casual');
  const [selectedBodyType, setSelectedBodyType] = useState(null);
  const [selectedCombo, setSelectedCombo] = useState(null);

  useEffect(() => { setChatMessages([{ type:'bot', message:"👋 Hi! I'm your fashion assistant! Ask me anything about style, outfit ideas, or fashion trends. How can I help you look amazing today?" }]); }, []);

  const handleQuizAnswer = (answer) => {
    const a = { ...quizAnswers, [quizStep]: answer };
    setQuizAnswers(a);
    if (quizStep < quizQuestions.length - 1) setQuizStep(quizStep+1);
    else setStyleResult(styleTypes[a[0]]);
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput(''); setIsLoading(true);
    setChatMessages(prev => [...prev, { type:'user', message:msg }]);
    try {
      const res = await fetch("http://localhost:5000/api/ask-ai", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ prompt:`You are a friendly fashion expert. User: ${msg}` }) });
      const data = await res.json();
      setChatMessages(prev => [...prev, { type:'bot', message:data.reply || "Sorry, I couldn't generate a response." }]);
    } catch { setChatMessages(prev => [...prev, { type:'bot', message:"⚠️ Something went wrong. Please try again later." }]); }
    finally { setIsLoading(false); }
  };

  const saveTip = (tip) => {
    const favs = JSON.parse(localStorage.getItem('fashionFavorites')||'[]');
    if (!favs.includes(tip)) { favs.push(tip); localStorage.setItem('fashionFavorites', JSON.stringify(favs)); alert('Tip saved! ❤️'); }
    else alert('Already in favorites! 😊');
  };

  return (
    <div className="fashion-service">
      <div className="fashion-suggestion">
        <div className="fashion-header">
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}>
            <h1>👗 Fashion Suggestion</h1>
            <p>Discover your personal style and get fashion advice</p>
          </motion.div>
        </div>

        <motion.div className="fashion-nav" initial={{ opacity:0, y:25 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.2 }}>
          {[['main','🏠 Home'],['products','🛍️ Products'],['bodytype','👤 Body Type'],['colors','🎨 Color Combos'],['quiz','🎯 Style Quiz'],['chat','🤖 AI Chat']].map(([k,l]) => (
            <button key={k} className={currentView===k?'active':''} onClick={() => setCurrentView(k)}>{l}</button>
          ))}
        </motion.div>

        {currentView==='main' && (
          <div className="main-view">
            <div className="feature-cards">
              {[['products','🛍️','Shop by Style','Browse curated Casual, Formal & Trendy products'],['bodytype','👤','Body Type Guide','Get outfit tips tailored to your unique body shape'],['colors','🎨','Color Combinations','Explore 8 stunning color palettes with outfit ideas'],['quiz','🎯','Discover Your Style','Take our quiz to find your perfect fashion personality'],['chat','🤖','AI Fashion Assistant','Chat with our AI for personalized outfit recommendations']].map(([v,ic,t,d]) => (
                <motion.div key={v} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }} className="feature-card" onClick={() => setCurrentView(v)}>
                  <div className="feature-icon">{ic}</div><h3>{t}</h3><p>{d}</p>
                </motion.div>
              ))}
            </div>
            <div className="daily-tips">
              <h3>💡 Today's Fashion Tips</h3>
              <div className="tips-grid">
                {["Mix textures for visual interest — try pairing a silk blouse with denim or leather.","The rule of three: stick to maximum 3 colors in one outfit for a cohesive look.","When in doubt, add a belt — it defines your waist and elevates any outfit."].map((tip,i) => (
                  <div key={i} className="tip-card"><motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}><p>"{tip}"</p><motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={() => saveTip(tip)}>❤️ Save</motion.button></motion.div></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentView==='products' && (
          <motion.div className="products-view" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
            <div className="products-header"><h2>🛍️ Curated Fashion Products</h2><p>Tap any product to explore and shop</p></div>
            <div className="product-category-tabs">
              {[['casual','👕 Casual'],['formal','👔 Formal'],['trendy','✨ Trendy']].map(([k,l]) => (
                <button key={k} className={`category-tab ${productCategory===k?'active':''}`} onClick={() => setProductCategory(k)}>{l}</button>
              ))}
            </div>
            <div className="products-grid">
              {fashionProducts[productCategory].map(p => (
                <motion.div key={p.id} className="product-card" initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ duration:0.4 }} whileHover={{ y:-6 }}>
                  <div className="product-img-wrap">
                    <img src={p.image} alt={p.name} loading="lazy" onError={e => { e.target.src=`https://via.placeholder.com/300x200/f8f9fa/999?text=${encodeURIComponent(p.name)}`; }} />
                    <span className="product-tag">{p.tag}</span>
                  </div>
                  <div className="product-info">
                    <h4>{p.name}</h4>
                    <p className="product-desc">{p.description}</p>
                    <div className="product-colors"><span className="colors-label">Colors: </span>{p.colors.join(' · ')}</div>
                    <div className="product-footer">
                      <span className="product-price">{p.price}</span>
                      <a href={p.link} target="_blank" rel="noopener noreferrer" className="shop-btn" onClick={e => e.stopPropagation()}>Shop Now →</a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

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

        {currentView==='colors' && (
          <motion.div className="colors-view" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
            <div className="products-header"><h2>🎨 Color Combination Guide</h2><p>Tap a palette to see the outfit idea</p></div>
            <div className="combos-grid">
              {colorCombos.map((combo,idx) => (
                <motion.div key={idx} className={`combo-card ${selectedCombo===idx?'expanded':''}`} onClick={() => setSelectedCombo(selectedCombo===idx?null:idx)} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.4, delay:idx*0.04 }} whileHover={{ y:-4 }}>
                  <div className="combo-swatches">{combo.palette.map((color,i) => <div key={i} className="swatch" style={{ backgroundColor:color }} title={combo.labels[i]} />)}</div>
                  <h4>{combo.name}</h4>
                  <p className="combo-vibe">{combo.vibe}</p>
                  {selectedCombo===idx && (
                    <motion.div className="combo-detail" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.3 }}>
                      <div className="swatch-labels">{combo.palette.map((color,i) => <div key={i} className="swatch-label"><div className="swatch-dot" style={{ backgroundColor:color }} /><span>{combo.labels[i]}</span></div>)}</div>
                      <p className="combo-outfit">👗 <strong>Outfit Idea:</strong> {combo.outfit}</p>
                      <motion.button className="save-tip-btn" onClick={e => { e.stopPropagation(); saveTip(`${combo.name}: ${combo.outfit}`); }} whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>❤️ Save Combo</motion.button>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {currentView==='quiz' && (
          <div className="quiz-view">
            {!styleResult ? (
              <div className="quiz-container">
                <div className="quiz-progress">
                  <div className="progress-bar"><div className="progress-fill" style={{ width:`${((quizStep+1)/quizQuestions.length)*100}%` }}></div></div>
                  <span>Question {quizStep+1} of {quizQuestions.length}</span>
                </div>
                <div className="question-card"><h3>{quizQuestions[quizStep].question}</h3>
                  <div className="options">{quizQuestions[quizStep].options.map((opt,i) => <button key={i} className="option-btn" onClick={() => handleQuizAnswer(opt)}>{opt}</button>)}</div>
                </div>
              </div>
            ) : (
              <div className="result-container">
                <Confetti numberOfPieces={180} gravity={0.25} recycle={false} />
                <div className="result-header"><h2>🎉 Your Style Type: {styleResult.name}</h2><p>{styleResult.description}</p></div>
                <div className="style-tips"><h3>✨ Your Personal Style Tips</h3>
                  <div className="tips-list">{styleResult.tips.map((tip,i) => (
                    <div key={i} className="tip-item"><motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}><p>{tip}</p><motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={() => saveTip(tip)}>❤️ Save</motion.button></motion.div></div>
                  ))}</div>
                </div>
                <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }} className="retry-btn" onClick={() => { setQuizAnswers({}); setQuizStep(0); setStyleResult(null); }}>🔄 Take Quiz Again</motion.button>
              </div>
            )}
          </div>
        )}

        {currentView==='chat' && (
          <div className="chat-view">
            <div className="chat-container">
              <div className="chat-messages">
                {chatMessages.map((msg,i) => (
                  <div key={i} className={`message ${msg.type}`}><div className="message-content"><ReactMarkdown>{msg.message}</ReactMarkdown><div className="message-actions">{msg.type==='bot' && <button className="copy-btn" onClick={() => navigator.clipboard.writeText(msg.message)}><FaRegCopy /></button>}</div></div></div>
                ))}
                {isLoading && <div className="message bot"><div className="message-content loading"><div className="typing-indicator"><span></span><span></span><span></span></div></div></div>}
              </div>
              <form className="chat-input-form" onSubmit={handleChatSubmit}>
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ask me about fashion, outfits, or style tips..." disabled={isLoading} />
                <button type="submit" disabled={isLoading || !chatInput.trim()}>➤</button>
              </form>
            </div>
          </div>
        )}
      </div>
      <ExpertTalkWidget service="fashion" isPremium={false} />
    </div>
  );
};
export default FashionSuggestion;