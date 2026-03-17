import React, { useState } from "react";
import { FiEdit3, FiUser, FiLink } from "react-icons/fi";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import "./ContactPage.css";
import { motion } from "framer-motion";

const Contact = () => {
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    setStatus("Sending...");

    try {
      // Replace YOUR_FORMSPREE_ID with the ID from your Formspree dashboard
      const response = await fetch("https://formspree.io/f/maqplwzk", {
        method: "POST",
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus("✅ Message sent successfully!");
        form.reset();
      } else {
        setStatus("❌ Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setStatus("❌ Server error. Please try again later.");
    }
  };

  return (
    <div className="contact-page">
      <motion.div
        className="favorites-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="contact-title">Contact Me</h1>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="contact-cards">
          <div className="contact-card">
            <div className="card-icon">
              <FiEdit3 size={32} />
            </div>
            <h2>Get in Touch</h2>
            <p>Fill out the form with your name, email, and message to connect!</p>
            {!showForm ? (
              <button className="contact-link" onClick={() => setShowForm(true)}>
                <b>Show contact form</b>
              </button>
            ) : (
              <>
                <form className="contact-form" onSubmit={handleSubmit}>
                  <label>Name</label>
                  <input type="text" name="name" required />

                  <label>Email</label>
                  <input type="email" name="email" required />

                  <label>Message</label>
                  <textarea name="message" required></textarea>

                  <button type="submit" className="send-btn">Send Message</button>
                </form>
                {status && <p className="status-msg">{status}</p>}
                <button className="contact-link" onClick={() => setShowForm(false)}>
                  <b>Hide contact form</b>
                </button>
              </>
            )}
          </div>

          <div className="contact-card">
            <div className="card-icon">
              <FiUser size={32} />
            </div>
            <h2>Direct Contact</h2>
            <p>Email: <a href="mailto:vedikavakhare@gmail.com" className="direct-link">vedikavakhare@gmail.com</a></p>
            <p>Phone: <a href="tel:+19016505424" className="direct-link">(901) 650-5424</a></p>
          </div>

          <div className="contact-card">
            <div className="card-icon">
              <FiLink size={32} />
            </div>
            <h2>Follow Me</h2>
            <ul className="social-icons">
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="sociallink"><FaFacebook size={24} /> Facebook</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="sociallink"><FaTwitter size={24} /> Twitter</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="sociallink"><FaInstagram size={24} /> Instagram</a></li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;