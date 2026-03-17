/**
 * ExpertTalkWidget.js
 *
 * Place this file at:  src/ExpertTalkWidget.js
 *   (one level above FashionSuggestion, HealthTips, SkinHairCare folders,
 *    matching the import path  '../ExpertTalkWidget'  already used in each service file)
 *
 * Usage (already present in every service file):
 *   <ExpertTalkWidget service="fashion"  isPremium={false} />
 *   <ExpertTalkWidget service="health"   isPremium={false} />
 *   <ExpertTalkWidget service="skincare" isPremium={false} />
 *
 * Set  isPremium={true}  once you implement premium auth.
 */

import React, { useState, useEffect, useRef } from 'react';


/* ── Expert catalogue ─────────────────────────────────────────────────────── */
const EXPERTS = {
  fashion: {
    name: 'Sarah K.',
    title: 'Personal Fashion Stylist',
    emoji: '👗',
    color: '#ff6b35',
    bg: 'linear-gradient(135deg,#ff6b35,#f7931e)',
  },
  health: {
    name: 'Dr. Priya M.',
    title: 'Health & Wellness Coach',
    emoji: '🌿',
    color: '#28a745',
    bg: 'linear-gradient(135deg,#28a745,#20c997)',
  },
  skincare: {
    name: 'Dr. Anita R.',
    title: 'Skin & Hair Specialist',
    emoji: '✨',
    color: '#e83e8c',
    bg: 'linear-gradient(135deg,#e83e8c,#764ba2)',
  },
};

/* ── Inline styles (no external CSS needed) ───────────────────────────────── */
const S = {
  /* floating square trigger – NO cancel button */
  floatBox: (color) => ({
    position: 'fixed',
    bottom: 28,
    right: 28,
    width: 62,
    height: 62,
    borderRadius: 16,          /* square with rounded corners */
    background: color,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 6px 24px rgba(0,0,0,0.25)',
    color: '#fff',
    fontSize: 26,
    userSelect: 'none',
    zIndex: 999,
    transition: 'transform 0.2s,box-shadow 0.2s',
  }),
  floatLabel: {
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: 0.5,
    marginTop: 3,
    lineHeight: 1,
  },

  /* overlay backdrop */
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1100,
    animation: 'etw-fadeIn 0.2s ease',
  },

  /* call / info card */
  card: {
    background: '#fff',
    borderRadius: 24,
    padding: '36px 32px 32px',
    minWidth: 320,
    maxWidth: 380,
    width: '90vw',
    textAlign: 'center',
    boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
    position: 'relative',
    animation: 'etw-slideUp 0.25s ease',
  },

  /* maximize / close buttons inside card */
  topBtn: {
    position: 'absolute',
    top: 14,
    background: 'none',
    border: 'none',
    fontSize: '1.25rem',
    cursor: 'pointer',
    color: '#aaa',
    lineHeight: 1,
    padding: 4,
    borderRadius: 8,
    transition: 'color 0.2s',
  },

  avatar: (bg) => ({
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 38,
    margin: '0 auto 12px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
  }),

  expertName: {
    fontSize: '1.35rem',
    fontWeight: 700,
    color: '#222',
    margin: '0 0 4px',
  },
  expertTitle: {
    fontSize: '0.9rem',
    color: '#777',
    margin: '0 0 10px',
  },
  badge: (color) => ({
    display: 'inline-block',
    padding: '4px 14px',
    borderRadius: 20,
    background: color + '18',
    color: color,
    fontSize: '0.8rem',
    fontWeight: 700,
    marginBottom: 22,
  }),

  timer: {
    fontSize: '2.2rem',
    fontWeight: 700,
    color: '#222',
    letterSpacing: 3,
    margin: '0 0 24px',
  },

  micBtn: (color, muted) => ({
    width: 72,
    height: 72,
    borderRadius: '50%',
    background: muted ? '#dc3545' : color,
    border: 'none',
    fontSize: '2rem',
    cursor: 'pointer',
    color: '#fff',
    boxShadow: muted
      ? '0 6px 18px rgba(220,53,69,0.4)'
      : `0 6px 18px ${color}55`,
    transition: 'background 0.3s,box-shadow 0.3s',
    marginBottom: 8,
  }),
  micLabel: {
    fontSize: '0.75rem',
    color: '#999',
    marginBottom: 22,
  },

  endBtn: {
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '12px 32px',
    borderRadius: 25,
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 6px 18px rgba(220,53,69,0.35)',
  },

  startBtn: (bg) => ({
    background: bg,
    color: '#fff',
    border: 'none',
    padding: '13px 36px',
    borderRadius: 25,
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    marginBottom: 12,
    boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
    transition: 'opacity 0.2s',
  }),

  closeTextBtn: {
    background: 'none',
    border: '1.5px solid #ddd',
    color: '#888',
    padding: '9px 22px',
    borderRadius: 20,
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
  },

  upgradeBtn: (bg) => ({
    background: bg,
    color: '#fff',
    border: 'none',
    padding: '13px 30px',
    borderRadius: 25,
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    marginBottom: 10,
    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
  }),
};

/* ── Keyframe injection (runs once) ──────────────────────────────────────── */
if (typeof document !== 'undefined' && !document.getElementById('etw-styles')) {
  const style = document.createElement('style');
  style.id = 'etw-styles';
  style.textContent = `
    @keyframes etw-fadeIn  { from{opacity:0} to{opacity:1} }
    @keyframes etw-slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  `;
  document.head.appendChild(style);
}

/* ══════════════════════════════════════════════════════════════════════════ */
const ExpertTalkWidget = ({ service = 'fashion', isPremium = false }) => {
  const expert = EXPERTS[service] || EXPERTS.fashion;

  /* panel states: 'closed' | 'info' | 'calling' | 'premium' */
  const [panel, setPanel] = useState('closed');
  const [muted, setMuted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  /* start call timer */
  const beginCall = () => {
    setPanel('calling');
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  /* end / close helpers */
  const endCall = () => {
    clearInterval(timerRef.current);
    setSeconds(0);
    setMuted(false);
    setPanel('closed');
  };
  const closePanel = () => setPanel('closed');

  useEffect(() => () => clearInterval(timerRef.current), []);

  const fmtTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  /* capitalize service label */
  const svcLabel =
    service === 'skincare'
      ? 'Skin & Hair Care'
      : service.charAt(0).toUpperCase() + service.slice(1);

  /* open call in new tab (maximize) */
  const maximize = () => {
    const url = `/expert-talk?service=${service}`;
    window.open(url, '_blank');
  };

  /* hover state for float box */
  const [hovered, setHovered] = useState(false);

  return (
    <>
      {/* ── Floating Square Trigger (no cancel button) ─────────────────── */}
      <div
        style={{
          ...S.floatBox(expert.color),
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
          boxShadow: hovered
            ? `0 10px 32px ${expert.color}66`
            : '0 6px 24px rgba(0,0,0,0.25)',
        }}
        onClick={() => setPanel('info')}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title={`Talk with ${expert.name}`}
        role="button"
        aria-label="Talk with Expert"
      >
        🎙️
        <span style={S.floatLabel}>Expert</span>
      </div>

      {/* ── Overlay panels ─────────────────────────────────────────────── */}
      {panel !== 'closed' && (
        <div style={S.overlay} onClick={closePanel}>
          <div style={S.card} onClick={(e) => e.stopPropagation()}>

            {/* ── INFO panel: shows before call starts ─────────────────── */}
            {panel === 'info' && (
              <>
                {/* Close button (X) – inside card, NOT on the float box */}
                <button
                  style={{ ...S.topBtn, right: 14 }}
                  onClick={closePanel}
                  title="Close"
                >
                  ✕
                </button>

                <div style={S.avatar(expert.bg)}>{expert.emoji}</div>
                <p style={S.expertName}>{expert.name}</p>
                <p style={S.expertTitle}>{expert.title}</p>
                <span style={S.badge(expert.color)}>{svcLabel}</span>

                <div>
                  {isPremium ? (
                    <button
                      style={S.startBtn(expert.bg)}
                      onClick={beginCall}
                    >
                      🎙️ Start Talk
                    </button>
                  ) : (
                    <button
                      style={S.startBtn(expert.bg)}
                      onClick={() => setPanel('premium')}
                    >
                      🎙️ Start Talk
                    </button>
                  )}
                  <br />
                  <button style={S.closeTextBtn} onClick={closePanel}>
                    Maybe Later
                  </button>
                </div>
              </>
            )}

            {/* ── PREMIUM gate ─────────────────────────────────────────── */}
            {panel === 'premium' && (
              <>
                <button
                  style={{ ...S.topBtn, right: 14 }}
                  onClick={closePanel}
                  title="Close"
                >
                  ✕
                </button>

                <div style={{ fontSize: 56, marginBottom: 14 }}>👑</div>
                <p style={{ ...S.expertName, marginBottom: 8 }}>
                  Premium Feature
                </p>
                <p
                  style={{
                    color: '#777',
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    marginBottom: 24,
                  }}
                >
                  Upgrade to <strong>Premium</strong> to talk live with{' '}
                  {expert.name}, your personal {svcLabel} expert.
                </p>

                <button
                  style={S.upgradeBtn(expert.bg)}
                  onClick={() => {
                    window.location.href = `/premium?service=${service}`;
                  }}
                >
                  ⬆️ Upgrade to Premium
                </button>
                <br />
                <button style={S.closeTextBtn} onClick={closePanel}>
                  Not Now
                </button>
              </>
            )}

            {/* ── CALLING panel ────────────────────────────────────────── */}
            {panel === 'calling' && (
              <>
                {/* Maximize – opens new tab */}
                <button
                  style={{ ...S.topBtn, right: 50 }}
                  onClick={maximize}
                  title="Maximize – open in new tab"
                >
                  ⤢
                </button>

                {/* End call (top-left) */}
                <div style={S.avatar(expert.bg)}>{expert.emoji}</div>
                <p style={S.expertName}>{expert.name}</p>
                <p style={S.expertTitle}>{expert.title}</p>
                <span style={S.badge(expert.color)}>{svcLabel}</span>

                {/* Timer */}
                <p style={S.timer}>{fmtTime(seconds)}</p>

                {/* Mute / Unmute microphone */}
                <div>
                  <button
                    style={S.micBtn(expert.color, muted)}
                    onClick={() => setMuted(!muted)}
                    title={muted ? 'Unmute' : 'Mute'}
                  >
                    {muted ? '🔇' : '🎙️'}
                  </button>
                  <p style={S.micLabel}>{muted ? 'Muted – tap to unmute' : 'Tap to mute'}</p>
                </div>

                {/* End call */}
                <button style={S.endBtn} onClick={endCall}>
                  📵 End Talk
                </button>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
};

export default ExpertTalkWidget;