// src/components/QuoteBox.js
import React, { useEffect, useState } from 'react';
import './QuoteBox.css'; // Import the CSS file

import { motion } from "framer-motion";

const quotes = [
  "Believe in yourself and all that you are.",
  "Take time to do what makes your soul happy.",
  "You are stronger than you think.",
  "Self-care is how you take your power back.",
  "Every day is a second chance.",
  "Breathe. It’s just a bad day, not a bad life.",
  "Make yourself a priority.",
  "You deserve rest, love, and peace.",
];

function QuoteBox() {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const dayIndex = new Date().getDate() % quotes.length;
    setQuote(quotes[dayIndex]);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="quote-container">
        <h2>💬 Daily Motivation</h2>
        <p className="quote-text">{quote}</p>
      </div>
    </motion.div>
  );
}

export default QuoteBox;
