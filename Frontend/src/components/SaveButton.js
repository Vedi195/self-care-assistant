import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const SaveButton = ({ tip, category, className = "", label = "" }) => {
  const [saved, setSaved] = useState(false);

  // ✅ Check ONLY this tip
  useEffect(() => {
    const checkSaved = () => {
      const stored = JSON.parse(localStorage.getItem(category) || "[]");
      setSaved(stored.some(item => item.text === tip.text)); // 🔥 important
    };

    checkSaved();

    window.addEventListener("favoritesUpdated", checkSaved);
    return () =>
      window.removeEventListener("favoritesUpdated", checkSaved);
  }, [tip, category]);

  // ✅ Save ONLY this tip
  const handleSave = () => {
    const stored = JSON.parse(localStorage.getItem(category) || "[]");

    // ✅ check using text
    if (!stored.some(item => item.text === tip.text)) {

      const updated = [
        ...stored,
        {
          text: tip.text,
          page: tip.page,
          section: tip.section
        }
      ];

      localStorage.setItem(category, JSON.stringify(updated));
      setSaved(true);

      window.dispatchEvent(new Event("favoritesUpdated"));
    }
  };

  return (
    <motion.button
      className={`outfit-btn ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleSave}
      disabled={saved}
    >
      {saved
        ? `💖 Saved ${label}`
        : `❤️ Save ${label}`}
    </motion.button>
  );
};

export default SaveButton;