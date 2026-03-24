import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const SaveButton = ({ category }) => {
  const [saved, setSaved] = useState(false);

  // 🔍 Get tip text from parent card
  const getTipText = (btn) => {
    const card = btn.closest(".tip-card");
    const text = card.querySelector("p").innerText;
    return text;
  };


  useEffect(() => {
    const checkSaved = () => {
        const stored = JSON.parse(localStorage.getItem(category) || "[]");

        const btn = document.querySelector(`.tip-card button`);

        if (btn) {
        const tip = btn.closest(".tip-card").querySelector("p").innerText;
        setSaved(stored.includes(tip));
        }
    };

    checkSaved(); // ✅ runs on reload

    window.addEventListener("favoritesUpdated", checkSaved);

    return () =>
        window.removeEventListener("favoritesUpdated", checkSaved);
  }, [category]);


  // 💾 Save
  const handleSave = (e) => {
    const btn = e.target;
    const tip = getTipText(btn);

    const stored = JSON.parse(localStorage.getItem(category) || "[]");

    if (!stored.includes(tip)) {
      const updated = [...stored, tip];
      localStorage.setItem(category, JSON.stringify(updated));
      setSaved(true);

      window.dispatchEvent(new Event("favoritesUpdated"));
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleSave}
      disabled={saved}
    >
      {saved ? "💖 Saved" : "❤️ Save"}
    </motion.button>
  );
};

export default SaveButton;