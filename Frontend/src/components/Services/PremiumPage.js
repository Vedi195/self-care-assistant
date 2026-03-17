/**
 * PremiumPage.js
 *
 * Place at:  src/pages/PremiumPage.js
 *
 * Add this route in App.js:
 *   <Route path="/premium" element={<PremiumPage />} />
 *
 * Reads  ?service=fashion | health | skincare  and shows ONLY that expert.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './PremiumPage.css';

/* ─────────────────────────────────────────────────────────────────────────────
   Expert catalogue – one entry per service
───────────────────────────────────────────────────────────────────────────── */
const EXPERT_DATA = {
  fashion: {
    service: 'fashion',
    accent: '#ff6b35',
    gradFrom: '#ff6b35',
    gradTo: '#f7931e',
    heroBg: 'linear-gradient(135deg,#fff4ef 0%,#ffe8d6 100%)',
    emoji: '👗',
    name: 'Sarah K.',
    credential: 'Certified Personal Stylist & Image Consultant',
    location: 'Mumbai, India',
    exp: '8 Years Experience',
    rating: 4.9,
    reviews: 1240,
    sessions: '3,800+ Sessions',
    about:
      'Sarah is a globally certified Image Consultant and Personal Stylist who has worked with top fashion houses in Mumbai and Dubai. She specialises in body-type dressing, wardrobe audits, capsule wardrobes, and occasion styling. Whether you need a complete wardrobe overhaul or help putting together one perfect look, Sarah makes fashion feel effortless and personal.',
    specialties: [
      'Body-type outfit planning',
      'Capsule wardrobe building',
      'Colour analysis & palette',
      'Occasion & event styling',
      'Budget-friendly styling',
      'Sustainable fashion tips',
    ],
    languages: ['English', 'Hindi', 'Marathi'],
    availability: 'Mon – Sat  |  9 AM – 8 PM IST',
    plan: {
      name: 'Fashion Premium',
      price: 499,
      currency: '₹',
      period: 'month',
      features: [
        'Unlimited live talk sessions with Sarah K.',
        'Personalised outfit plan every week',
        'Wardrobe audit (virtual)',
        'Priority response within 2 hours',
        'Access to exclusive style lookbooks',
        'Session recordings for future reference',
        'Cancel anytime',
      ],
    },
    testimonials: [
      { q: '"Sarah completely transformed how I dress. I finally feel confident every day!"', a: 'Priya S.' },
      { q: '"She understood my budget and gave me looks I actually wear. Worth every rupee!"', a: 'Meera T.' },
      { q: '"Best styling advice I\'ve ever received. Already recommended to 5 friends!"', a: 'Anika R.' },
    ],
  },

  health: {
    service: 'health',
    accent: '#28a745',
    gradFrom: '#28a745',
    gradTo: '#20c997',
    heroBg: 'linear-gradient(135deg,#eefff4 0%,#d4f7e5 100%)',
    emoji: '🌿',
    name: 'Dr. Priya M.',
    credential: 'MBBS · Certified Wellness & Nutrition Coach',
    location: 'Bangalore, India',
    exp: '11 Years Experience',
    rating: 4.8,
    reviews: 2100,
    sessions: '6,500+ Sessions',
    about:
      'Dr. Priya is a practising physician with postgraduate training in preventive medicine and a certified Wellness & Nutrition Coach. She blends clinical expertise with holistic lifestyle guidance — covering nutrition, sleep, stress management, hormonal health, and fitness planning. Her approach is evidence-based yet warm, making complex health topics easy to act on.',
    specialties: [
      'Personalised nutrition planning',
      'Weight management (loss & gain)',
      'Hormonal health & PCOS',
      'Sleep hygiene & stress reduction',
      'Yoga & mindfulness guidance',
      'Chronic condition lifestyle advice',
    ],
    languages: ['English', 'Hindi', 'Kannada'],
    availability: 'Mon – Fri  |  8 AM – 7 PM IST',
    plan: {
      name: 'Health Premium',
      price: 699,
      currency: '₹',
      period: 'month',
      features: [
        'Unlimited live talk sessions with Dr. Priya',
        'Custom weekly nutrition & workout plan',
        'Monthly health progress review',
        'Priority response within 1 hour',
        'Access to guided yoga video library',
        'Session notes & health summary PDF',
        'Cancel anytime',
      ],
    },
    testimonials: [
      { q: '"Dr. Priya\'s advice helped me lose 8 kg in 3 months — sustainably and healthily."', a: 'Riya N.' },
      { q: '"She explained everything so clearly. My PCOS is finally under control!"', a: 'Sneha D.' },
      { q: '"I sleep better, eat better, feel better. One session changed everything."', a: 'Pooja K.' },
    ],
  },

  skincare: {
    service: 'skincare',
    accent: '#e83e8c',
    gradFrom: '#e83e8c',
    gradTo: '#764ba2',
    heroBg: 'linear-gradient(135deg,#fff0f6 0%,#f3e8ff 100%)',
    emoji: '✨',
    name: 'Dr. Anita R.',
    credential: 'MD Dermatology · Certified Trichologist',
    location: 'Delhi, India',
    exp: '14 Years Experience',
    rating: 4.9,
    reviews: 3350,
    sessions: '9,200+ Sessions',
    about:
      'Dr. Anita is a board-certified dermatologist and trichologist with over a decade of clinical practice. She specialises in medical-grade skincare, acne management, pigmentation treatment, anti-ageing protocols, and hair loss therapy. Her consultations combine clinical diagnosis with practical, affordable at-home routines that deliver visible results.',
    specialties: [
      'Acne & blemish treatment plans',
      'Pigmentation & dark spot correction',
      'Anti-ageing skin protocols',
      'Hair loss & scalp health',
      'Ingredient & product guidance',
      'Pre- & post-event skin prep',
    ],
    languages: ['English', 'Hindi', 'Punjabi'],
    availability: 'Mon – Sat  |  10 AM – 9 PM IST',
    plan: {
      name: 'Skin & Hair Premium',
      price: 799,
      currency: '₹',
      period: 'month',
      features: [
        'Unlimited live talk sessions with Dr. Anita',
        'Custom skin & hair routine (day + night)',
        'Product ingredient safety review',
        'Priority response within 30 minutes',
        'Access to dermatologist-curated video guides',
        'Monthly skin progress photo analysis',
        'Cancel anytime',
      ],
    },
    testimonials: [
      { q: '"My acne is 90% cleared after 6 weeks of Dr. Anita\'s routine. I\'m amazed!"', a: 'Tara M.' },
      { q: '"She reviewed every product I owned and fixed my entire routine in one session."', a: 'Lavanya S.' },
      { q: '"Hair fall stopped in just 3 weeks. Dr. Anita is a miracle worker!"', a: 'Divya P.' },
    ],
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
   Stars component
───────────────────────────────────────────────────────────────────────────── */
const Stars = ({ rating, accent }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="pm-stars">
      {[...Array(5)].map((_, i) => (
        <span key={i} style={{ color: i < full || (i === full && half) ? accent : '#ddd', fontSize: '1.1rem' }}>
          {i < full ? '★' : i === full && half ? '⯨' : '☆'}
        </span>
      ))}
    </span>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Payment form
───────────────────────────────────────────────────────────────────────────── */
const PaymentForm = ({ plan, accent, onSuccess }) => {
  const [method, setMethod] = useState('card');
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [upi, setUpi] = useState('');
  const [errors, setErrors] = useState({});
  const [paying, setPaying] = useState(false);

  const formatCardNum = (v) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const validate = () => {
    const e = {};
    if (method === 'card') {
      if (!card.name.trim()) e.name = 'Cardholder name required';
      if (card.number.replace(/\s/g, '').length !== 16) e.number = 'Enter a valid 16-digit number';
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) e.expiry = 'Use MM/YY format';
      if (card.cvv.length < 3) e.cvv = '3-digit CVV required';
    } else if (method === 'upi') {
      if (!upi.includes('@')) e.upi = 'Enter a valid UPI ID (e.g. name@upi)';
    }
    return e;
  };

  const handlePay = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setPaying(true);
    setTimeout(() => { setPaying(false); onSuccess(); }, 2200);
  };

  return (
    <div className="pm-payment">
      <h3 className="pm-pay-title">💳 Complete Payment</h3>

      {/* Summary bar */}
      <div className="pm-pay-summary" style={{ borderLeft: `4px solid ${accent}` }}>
        <span className="pm-pay-plan">{plan.name}</span>
        <span className="pm-pay-amount" style={{ color: accent }}>
          {plan.currency}{plan.price}
          <small> / {plan.period}</small>
        </span>
      </div>

      {/* Method tabs */}
      <div className="pm-method-tabs">
        {[
          { key: 'card', label: '💳 Card' },
          { key: 'upi', label: '📱 UPI' },
          { key: 'netbanking', label: '🏦 Net Banking' },
        ].map(({ key, label }) => (
          <button
            key={key}
            className={`pm-method-tab ${method === key ? 'active' : ''}`}
            style={method === key ? { borderColor: accent, color: accent, background: accent + '12' } : {}}
            onClick={() => setMethod(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Card inputs */}
      {method === 'card' && (
        <div className="pm-form">
          <div className="pm-field">
            <label>Cardholder Name</label>
            <input
              className={errors.name ? 'pm-input-err' : ''}
              placeholder="Name on card"
              value={card.name}
              style={{ '--fc': accent }}
              onChange={(e) => setCard({ ...card, name: e.target.value })}
            />
            {errors.name && <span className="pm-err">{errors.name}</span>}
          </div>
          <div className="pm-field">
            <label>Card Number</label>
            <input
              className={errors.number ? 'pm-input-err' : ''}
              placeholder="1234 5678 9012 3456"
              value={card.number}
              style={{ '--fc': accent }}
              onChange={(e) => setCard({ ...card, number: formatCardNum(e.target.value) })}
            />
            {errors.number && <span className="pm-err">{errors.number}</span>}
          </div>
          <div className="pm-field-row">
            <div className="pm-field">
              <label>Expiry</label>
              <input
                className={errors.expiry ? 'pm-input-err' : ''}
                placeholder="MM/YY"
                value={card.expiry}
                style={{ '--fc': accent }}
                onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
              />
              {errors.expiry && <span className="pm-err">{errors.expiry}</span>}
            </div>
            <div className="pm-field">
              <label>CVV</label>
              <input
                className={errors.cvv ? 'pm-input-err' : ''}
                placeholder="••••"
                type="password"
                maxLength={4}
                value={card.cvv}
                style={{ '--fc': accent }}
                onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '') })}
              />
              {errors.cvv && <span className="pm-err">{errors.cvv}</span>}
            </div>
          </div>
        </div>
      )}

      {/* UPI input */}
      {method === 'upi' && (
        <div className="pm-form">
          <div className="pm-field">
            <label>UPI ID</label>
            <input
              className={errors.upi ? 'pm-input-err' : ''}
              placeholder="yourname@upi"
              value={upi}
              style={{ '--fc': accent }}
              onChange={(e) => setUpi(e.target.value)}
            />
            {errors.upi && <span className="pm-err">{errors.upi}</span>}
          </div>
          <p className="pm-upi-hint">Supported: PhonePe · Google Pay · Paytm · BHIM</p>
        </div>
      )}

      {/* Net banking */}
      {method === 'netbanking' && (
        <div className="pm-form">
          <div className="pm-bank-grid">
            {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'Other'].map((b) => (
              <div key={b} className="pm-bank-chip" style={{ '--bc': accent }}>{b}</div>
            ))}
          </div>
          <p className="pm-upi-hint">You'll be redirected to your bank's secure portal.</p>
        </div>
      )}

      {/* Trust badges */}
      <div className="pm-secure">
        <span>🔒 256-bit SSL</span>
        <span>✅ RBI Compliant</span>
        <span>🛡️ PCI DSS</span>
      </div>

      <button
        className="pm-pay-btn"
        style={{
          background: paying
            ? '#aaa'
            : `linear-gradient(135deg,${accent},${accent}bb)`,
        }}
        onClick={handlePay}
        disabled={paying}
      >
        {paying
          ? '⏳ Processing payment…'
          : `Pay ${plan.currency}${plan.price} & Activate Premium`}
      </button>

      <p className="pm-disclaimer">
        By paying you agree to our <a href="/terms">Terms of Service</a>.
        Cancel anytime — no hidden charges.
      </p>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Success screen
───────────────────────────────────────────────────────────────────────────── */
const SuccessScreen = ({ expert }) => {
  const navigate = useNavigate();
  return (
    <div className="pm-success-page" style={{ background: expert.heroBg }}>
      <div className="pm-success-card">
        <div
          className="pm-success-ring"
          style={{ borderColor: expert.accent, color: expert.accent }}
        >
          ✓
        </div>
        <h2 style={{ color: expert.accent }}>You're Premium! 🎉</h2>
        <p className="pm-success-msg">
          Your 1-on-1 access to <strong>{expert.name}</strong> is now active.
          Head back and tap <em>"Start Talk"</em> to begin your session.
        </p>
        <div
          className="pm-success-expert"
          style={{ borderColor: expert.accent + '44' }}
        >
          <span className="pm-success-emoji">{expert.emoji}</span>
          <div>
            <strong>{expert.name}</strong>
            <br />
            <small style={{ color: '#888' }}>{expert.credential}</small>
          </div>
        </div>
        <button
          className="pm-back-btn"
          style={{ background: `linear-gradient(135deg,${expert.gradFrom},${expert.gradTo})` }}
          onClick={() => navigate(-1)}
        >
          ← Start My Session
        </button>
      </div>
    </div>
  );
};

/* ═════════════════════════════════════════════════════════════════════════════
   PremiumPage — main export
═══════════════════════════════════════════════════════════════════════════════*/
const PremiumPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const serviceKey = searchParams.get('service') || 'fashion';
  const expert = EXPERT_DATA[serviceKey] || EXPERT_DATA.fashion;
  const { plan } = expert;

  const [paid, setPaid] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (paid) return <SuccessScreen expert={expert} />;

  return (
    <div className="pm-page" style={{ background: expert.heroBg }}>

      {/* ── Back nav ─────────────────────────────────────────────────────── */}
      <button className="pm-back-nav" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* ── Hero banner ──────────────────────────────────────────────────── */}
      <div
        className="pm-banner"
        style={{ background: `linear-gradient(135deg,${expert.gradFrom},${expert.gradTo})` }}
      >
        <div className="pm-banner-inner">
          <div className="pm-banner-emoji">{expert.emoji}</div>
          <div>
            <h1 className="pm-banner-title">{plan.name}</h1>
            <p className="pm-banner-sub">
              Exclusive 1-on-1 expert access · only for Premium members
            </p>
          </div>
          <div className="pm-banner-crown">👑</div>
        </div>
      </div>

      {/* ── Two-column body ──────────────────────────────────────────────── */}
      <div className="pm-body">

        {/* LEFT ─────────────────────────────────────────────────────────── */}
        <div className="pm-left">

          {/* Expert identity card */}
          <div className="pm-expert-card" style={{ borderTop: `5px solid ${expert.accent}` }}>
            <div
              className="pm-expert-avatar"
              style={{ background: `linear-gradient(135deg,${expert.gradFrom},${expert.gradTo})` }}
            >
              {expert.emoji}
            </div>
            <div className="pm-expert-meta">
              <h2 className="pm-expert-name">{expert.name}</h2>
              <p className="pm-expert-cred">{expert.credential}</p>
              <div className="pm-expert-stats">
                <div className="pm-stat-row">
                  <Stars rating={expert.rating} accent={expert.accent} />
                  <span className="pm-stat-text">
                    {expert.rating} ({expert.reviews.toLocaleString()} reviews)
                  </span>
                </div>
                <div className="pm-stat-row">📍 {expert.location}</div>
                <div className="pm-stat-row">🏅 {expert.exp}</div>
                <div className="pm-stat-row">🎙️ {expert.sessions}</div>
              </div>
              <div className="pm-langs">
                {expert.languages.map((l) => (
                  <span
                    key={l}
                    className="pm-lang-tag"
                    style={{ background: expert.accent + '1a', color: expert.accent }}
                  >
                    {l}
                  </span>
                ))}
              </div>
              <div className="pm-avail">
                🕐 Available: <strong>{expert.availability}</strong>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="pm-section">
            <h3 className="pm-section-title" style={{ color: expert.accent }}>
              About {expert.name}
            </h3>
            <p className="pm-about">{expert.about}</p>
          </div>

          {/* Specialties */}
          <div className="pm-section">
            <h3 className="pm-section-title" style={{ color: expert.accent }}>
              ✦ Specialties
            </h3>
            <ul className="pm-specialties">
              {expert.specialties.map((s) => (
                <li
                  key={s}
                  className="pm-specialty"
                  style={{ '--dot-color': expert.accent }}
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Whats included */}
          <div className="pm-section">
            <h3 className="pm-section-title" style={{ color: expert.accent }}>
              ✦ What's included in {plan.name}
            </h3>
            <ul className="pm-features">
              {plan.features.map((f) => (
                <li key={f} className="pm-feature-item">
                  <span className="pm-check" style={{ color: expert.accent }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Testimonials */}
          <div className="pm-section">
            <h3 className="pm-section-title" style={{ color: expert.accent }}>
              ✦ What members say
            </h3>
            <div className="pm-testimonials">
              {expert.testimonials.map((t, i) => (
                <div key={i} className="pm-testimonial" style={{ borderLeft: `3px solid ${expert.accent}` }}>
                  <p className="pm-testimonial-q">{t.q}</p>
                  <span className="pm-testimonial-a" style={{ color: expert.accent }}>
                    — {t.a}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT ─────────────────────────────────────────────────────────── */}
        <div className="pm-right">

          {/* Sticky pricing card */}
          <div className="pm-price-card" style={{ borderTop: `5px solid ${expert.accent}` }}>
            <div className="pm-price-header">
              <span className="pm-price-badge" style={{ background: expert.accent + '18', color: expert.accent }}>
                Monthly Plan
              </span>
              <div className="pm-price-row">
                <span className="pm-currency">{plan.currency}</span>
                <span className="pm-price-num" style={{ color: expert.accent }}>{plan.price}</span>
                <span className="pm-price-period">/ {plan.period}</span>
              </div>
              <p className="pm-price-note">Billed monthly · Cancel anytime</p>
            </div>

            <PaymentForm
              plan={plan}
              accent={expert.accent}
              onSuccess={() => setPaid(true)}
            />
          </div>

          {/* Guarantee */}
          <div className="pm-guarantee" style={{ borderColor: expert.accent + '44' }}>
            <span className="pm-guarantee-icon">🛡️</span>
            <div>
              <strong>7-Day Money-Back Guarantee</strong>
              <p>Not satisfied within 7 days? We refund 100% — no questions asked.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PremiumPage;