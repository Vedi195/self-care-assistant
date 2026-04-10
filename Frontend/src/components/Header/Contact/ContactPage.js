import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import { HiOutlineMail, HiOutlinePhone, HiArrowRight } from "react-icons/hi";
import "./ContactPage.css";

const Contact = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [focused, setFocused] = useState("");

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Formspree handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    setStatus("sending");

    try {
      const response = await fetch(
        "https://formspree.io/f/maqplwzk",
        {
          method: "POST",
          body: data,
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        setStatus("success");

        setTimeout(() => {
          setStatus("");
        }, 10000);

        form.reset();
        setFormData({ name: "", email: "", message: "" }); // ✅ reset state also
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const socials = [
    { Icon: FaLinkedin, label: "LinkedIn", href: "https://linkedin.com", color: "#0A66C2" },
    { Icon: FaGithub, label: "GitHub", href: "https://github.com", color: "#24292f" },
    { Icon: FaInstagram, label: "Instagram", href: "https://instagram.com", color: "#E1306C" },
  ];

  return (
    <div className="contact-page" ref={sectionRef}>
      {/* Ambient blobs */}
      <div className="blob blob-1" aria-hidden />
      <div className="blob blob-2" aria-hidden />

      {/* Header */}
      <motion.div
        className="contact-header"
        initial={{ opacity: 0, y: -28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="contact-eyebrow">Let's talk</span>
        <h1 className="contact-title">
          Get in <em>Touch</em>
        </h1>
        <p className="contact-subtitle">
          Have a project, a question, or just want to say hello? I'd love to hear from you.
        </p>
      </motion.div>

      {/* Cards grid */}
      <motion.div
        className="contact-grid"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Card 1 — Message form */}
        <motion.div className="contact-card card-form" variants={itemVariants}>
          <div className="card-inner">
            <div className="card-header-row">
              <span className="card-label">01</span>
              <h2 className="card-title">Send a message</h2>
            </div>

            {!showForm ? (
              <motion.button
                className="cta-btn"
                onClick={() => setShowForm(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Open form <HiArrowRight className="btn-icon" />
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.4 }}
              >
                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  {[
                    { name: "name", label: "Your name", type: "text" },
                    { name: "email", label: "Email address", type: "email" },
                  ].map(({ name, label, type }) => (
                    <div
                      key={name}
                      className={`field-group ${focused === name ? "field-focused" : ""}`}
                    >
                      <label className="field-label" htmlFor={name}>
                        {label}
                      </label>
                      <input
                        id={name}
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        onFocus={() => setFocused(name)}
                        onBlur={() => setFocused("")}
                        required
                        className="field-input"
                      />
                    </div>
                  ))}

                  <div
                    className={`field-group ${focused === "message" ? "field-focused" : ""}`}
                  >
                    <label className="field-label" htmlFor="message">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused("")}
                      required
                      className="field-input field-textarea"
                    />
                  </div>

                  <div className="form-actions">
                    <motion.button
                      type="submit"
                      className={`cta-btn submit-btn ${
                        status === "sending" ? "btn-loading" : ""
                      }`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      disabled={status === "sending"}
                    >
                      {status === "sending" ? "Sending…" : "Send message"}
                      {status !== "sending" && <HiArrowRight className="btn-icon" />}
                    </motion.button>

                    <button
                      type="button"
                      className="ghost-btn"
                      onClick={() => {
                        setShowForm(false);
                        setStatus("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>

                  {status === "success" && (
                    <motion.p className="status-msg status-success">
                      ✅ Message sent successfully!
                    </motion.p>
                  )}

                  {status === "error" && (
                    <motion.p className="status-msg status-error">
                      ❌ Failed to send message. Try again.
                    </motion.p>
                  )}
                </form>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Card 2 — Direct contact */}
        <motion.div className="contact-card card-direct" variants={itemVariants}>
          <div className="card-inner">
            <div className="card-header-row">
              <span className="card-label">02</span>
              <h2 className="card-title">Direct contact</h2>
            </div>

            <ul className="direct-list">
              <li>
                <a href="mailto:vedikavakhare@gmail.com" className="direct-item">
                  <span className="direct-icon-wrap">
                    <HiOutlineMail size={18} />
                  </span>
                  <span className="direct-info">
                    <span className="direct-type">Email</span>
                    <span className="direct-value">vedikavakhare@gmail.com</span>
                  </span>
                  <HiArrowRight className="direct-arrow" />
                </a>
              </li>
              <li>
                <a href="tel:+19016505424" className="direct-item">
                  <span className="direct-icon-wrap">
                    <HiOutlinePhone size={18} />
                  </span>
                  <span className="direct-info">
                    <span className="direct-type">Phone</span>
                    <span className="direct-value">(901) 650-5424</span>
                  </span>
                  <HiArrowRight className="direct-arrow" />
                </a>
              </li>
            </ul>

            <p className="availability-tag">
              <span className="pulse-dot" /> Available..!
            </p>
          </div>
        </motion.div>

        {/* Card 3 — Socials */}
        <motion.div className="contact-card card-social" variants={itemVariants}>
          <div className="card-inner">
            <div className="card-header-row">
              <span className="card-label">03</span>
              <h2 className="card-title">Follow along</h2>
            </div>

            <ul className="social-list">
              {socials.map(({ Icon, label, href, color }) => (
                <li key={label}>
                  <motion.a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-item"
                    whileHover={{ x: 6 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span
                      className="social-icon-wrap"
                      style={{ "--social-color": color }}
                    >
                      <Icon size={18} />
                    </span>
                    <span className="social-label">{label}</span>
                    <HiArrowRight className="social-arrow" />
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Contact;