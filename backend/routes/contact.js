const express = require('express');
const router = express.Router();
const Feedback = require("../models/Feedback");
const nodemailer = require("nodemailer");
const devAuth = require('../middleware/devAuth');

// 📩 POST: Save feedback + send emails
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    // 1️⃣ Save feedback in MongoDB
    const newFeedback = new Feedback({ name, email, message });
    await newFeedback.save();

    // 2️⃣ Setup Nodemailer transporter (Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: { rejectUnauthorized: false }  // 👈 allow self-signed certificates
    });

    // 3️⃣ Send mail to Admin
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Feedback Received',
      text: `📩 You received new feedback:\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`
    });

    // 4️⃣ Confirmation mail to User
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for your feedback!',
      text: `Hi ${name},\n\nWe have received your message and will get back to you soon.\n\nYour message:\n${message}\n\n- Self Care Assistant Team`
    });

    res.status(200).json({ success: true, message: '✅ Feedback saved and emails sent successfully.' });
  } catch (err) {
    console.error('❌ Error while sending feedback:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// 📌 Get all feedback (Developer/Admin only)
router.get('/all', devAuth, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: feedbacks });
  } catch (err) {
    console.error('Error fetching feedbacks:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;