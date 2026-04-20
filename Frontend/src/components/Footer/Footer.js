import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="footer">
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>© {new Date().getFullYear()} Self-Care Assistant. Made by <b>KV</b> Solutions</p>
            <div className="footer-bottom-links">
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/cookies">Cookies</Link>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;