import React, { useState, useEffect } from 'react';
import './FavoritesPage.css';

import { motion } from "framer-motion";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState({
    fashionTips: [],
    healthTips: [],
    skinCareTips: [],
    dailyRoutineTips: []
  });

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = {
      fashionTips: JSON.parse(localStorage.getItem('fashionFavorites') || '[]'),
      healthTips: JSON.parse(localStorage.getItem('healthFavorites') || '[]'),
      skinCareTips: JSON.parse(localStorage.getItem('skinCareFavorites') || '[]'),
      dailyRoutineTips: JSON.parse(localStorage.getItem('dailyRoutineFavorites') || '[]')
    };
    setFavorites(savedFavorites);
  }, []);

  const removeFavorite = (category, index) => {
    const newFavorites = { ...favorites };
    newFavorites[category].splice(index, 1);
    setFavorites(newFavorites);
    
    // Update localStorage
    const storageKey = category === 'fashionTips' ? 'fashionFavorites' :
                      category === 'healthTips' ? 'healthFavorites' :
                      category === 'skinCareTips' ? 'skinCareFavorites' :
                      'dailyRoutineFavorites';
    localStorage.setItem(storageKey, JSON.stringify(newFavorites[category]));
  };

  const totalFavorites = Object.values(favorites).reduce((sum, arr) => sum + arr.length, 0);
  const handleRedirect = (item) => {
  window.location.href = `/${item.page}#${item.section}`;
};

  return (
    <div className="favorites-page">
      <motion.div
        className="favorites-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>❤️ My Favorites</h1>
        <p>Your saved tips and recommendations ({totalFavorites} items)</p>
      </motion.div>

      {totalFavorites === 0 ? (
        <div className="no-favorites">
          <div className="no-favorites-icon">💭</div>
          <h3>No favorites yet!</h3>
          <p>Start using our services to save your favorite tips and recommendations.</p>
        </div>
      ) : (
        <div className="favorites-sections">
          {favorites.fashionTips.length > 0 && (
            <motion.div
              className="favorites-section"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >👗 Fashion Tips</motion.h2>

              <div className="favorites-grid">
                {favorites.fashionTips.map((tip, index) => (
                  <div key={index} className="favorite-item">
                    <p>{typeof tip === "string" ? tip : tip.text}</p>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFavorite('fashionTips', index)}
                    >
                      ❌
                    </button>
                    <button
                      className="go-btn"
                      onClick={() => handleRedirect(tip)}
                    >
                      🔗 Go
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {favorites.healthTips.length > 0 && (
            <motion.div
              className="favorites-section"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.h2
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >🧘‍♀ Health Tips</motion.h2>

              <div className="favorites-grid">
                {favorites.healthTips.map((tip, index) => (
                  <div key={index} className="favorite-item">
                    <p>{typeof tip === "string" ? tip : tip.text}</p>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFavorite('healthTips', index)}
                    >
                      ❌
                    </button>
                    <button
                      className="go-btn"
                      onClick={() => handleRedirect(tip)}
                    >
                      🔗 Go
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {favorites.skinCareTips.length > 0 && (
            <motion.div
              className="favorites-section"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >💆‍♀ Skin & Hair Care Tips</motion.h2>

              <div className="favorites-grid">
                {favorites.skinCareTips.map((tip, index) => (
                  <div key={index} className="favorite-item">
                    <p>{typeof tip === "string" ? tip : tip.text}</p>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFavorite('skinCareTips', index)}
                    >
                      ❌
                    </button>
                    <button
                      className="go-btn"
                      onClick={() => handleRedirect(tip)}
                    >
                      🔗 Go
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {favorites.dailyRoutineTips.length > 0 && (
            <motion.div
              className="favorites-section"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >📅 Daily Routine Tips</motion.h2>

              <div className="favorites-grid">
                {favorites.dailyRoutineTips.map((tip, index) => (
                  <div key={index} className="favorite-item">
                    <p>{typeof tip === "string" ? tip : tip.text}</p>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFavorite('dailyRoutineTips', index)}
                    >
                      ❌
                    </button>
                    <button
                      className="go-btn"
                      onClick={() => handleRedirect(tip)}
                    >
                      🔗 Go
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
  
};

export default FavoritesPage;