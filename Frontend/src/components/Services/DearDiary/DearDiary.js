import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './DearDiary.css';

/* ───────────────────────────────────────────────
   THEMES
─────────────────────────────────────────────── */
const THEMES = [
  { id: 'cherry',   label: '🌸 Cherry Blossom', bg: 'linear-gradient(135deg,#fce4ec,#f8bbd0,#fce4ec)', card: '#fff0f5', accent: '#e91e8c', text: '#4a0026' },
  { id: 'midnight', label: '🌙 Midnight Sky',   bg: 'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)',  card: '#1e2a45', accent: '#a78bfa', text: '#e2d9f3' },
  { id: 'forest',   label: '🌿 Enchanted Forest', bg: 'linear-gradient(135deg,#e8f5e9,#c8e6c9,#dcedc8)', card: '#f1f8e9', accent: '#2e7d32', text: '#1b3a1f' },
  { id: 'sunset',   label: '🌅 Golden Sunset',  bg: 'linear-gradient(135deg,#fff3e0,#ffe0b2,#fce4ec)',  card: '#fffde7', accent: '#ef6c00', text: '#3e2723' },
  { id: 'ocean',    label: '🌊 Ocean Dream',    bg: 'linear-gradient(135deg,#e0f7fa,#b2ebf2,#e0f2f1)',  card: '#e0fbfc', accent: '#00838f', text: '#002b36' },
  { id: 'lavender', label: '💜 Lavender Mist',  bg: 'linear-gradient(135deg,#ede7f6,#d1c4e9,#e8eaf6)', card: '#f3eaff', accent: '#7b1fa2', text: '#2d0040' },
];

const MOODS = ['😊 Happy','😢 Sad','😌 Calm','😤 Frustrated','🥰 Loved','😴 Tired','✨ Grateful','🌟 Excited','😰 Anxious','😶 Numb'];
const STICKERS = ['🌸','🌟','💫','🦋','🌈','💕','🌙','☀️','🌺','🍀','🎀','✨','💖','🌻','🎵'];

/* ───────────────────────────────────────────────
   HELPERS
─────────────────────────────────────────────── */
const LS_KEY_ENTRIES = 'dearDiary_entries';
const LS_KEY_PIN     = 'dearDiary_pin';
const LS_KEY_THEME   = 'dearDiary_theme';

const load = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};
const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));

const shortDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'2-digit' });

/* ───────────────────────────────────────────────
   LOCK SCREEN
─────────────────────────────────────────────── */
const LockScreen = ({ onUnlock, hasPin }) => {
  const [pin, setPin]       = useState('');
  const [error, setError]   = useState('');
  const [confirm, setConfirm] = useState('');
  const [step, setStep]     = useState(hasPin ? 'enter' : 'create');   // create | confirm | enter

  const digits = (v) => v.replace(/\D/g,'').slice(0,4);

  const handleCreate = () => {
    if (pin.length < 4) { setError('PIN must be 4 digits'); return; }
    setStep('confirm'); setError('');
  };

  const handleConfirm = () => {
    if (confirm !== pin) { setError('PINs do not match — try again'); setConfirm(''); return; }
    save(LS_KEY_PIN, pin);
    onUnlock();
  };

  const handleEnter = () => {
    const stored = load(LS_KEY_PIN, '');
    if (pin === stored) { onUnlock(); }
    else { setError('Wrong PIN 🔒'); setPin(''); }
  };

  return (
    <div className="dd-lock-bg">
      <motion.div className="dd-lock-card"
        initial={{ scale:0.85, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ type:'spring', stiffness:200 }}>
        <div className="dd-lock-icon">📔</div>
        <h2 className="dd-lock-title">Dear Diary</h2>
        <p className="dd-lock-sub">
          {step === 'create'  ? 'Set a 4-digit PIN to protect your diary' :
           step === 'confirm' ? 'Confirm your PIN' :
                                'Enter your PIN to unlock'}
        </p>

        {step === 'create' && (
          <>
            <input className="dd-pin-input" type="password" inputMode="numeric"
              maxLength={4} placeholder="• • • •" value={pin}
              onChange={e => { setPin(digits(e.target.value)); setError(''); }} />
            {error && <p className="dd-lock-error">{error}</p>}
            <button className="dd-lock-btn" onClick={handleCreate}>Set PIN 🔒</button>
          </>
        )}

        {step === 'confirm' && (
          <>
            <input className="dd-pin-input" type="password" inputMode="numeric"
              maxLength={4} placeholder="• • • •" value={confirm}
              onChange={e => { setConfirm(digits(e.target.value)); setError(''); }} />
            {error && <p className="dd-lock-error">{error}</p>}
            <button className="dd-lock-btn" onClick={handleConfirm}>Confirm PIN ✅</button>
            <button className="dd-lock-back" onClick={() => { setStep('create'); setConfirm(''); setError(''); }}>← Go back</button>
          </>
        )}

        {step === 'enter' && (
          <>
            <input className="dd-pin-input" type="password" inputMode="numeric"
              maxLength={4} placeholder="• • • •" value={pin}
              onChange={e => { setPin(digits(e.target.value)); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleEnter()} />
            {error && <p className="dd-lock-error">{error}</p>}
            <button className="dd-lock-btn" onClick={handleEnter}>Unlock 🔓</button>
            <button className="dd-lock-back" onClick={() => {
              if (window.confirm('Reset diary? All entries will be deleted.')) {
                localStorage.removeItem(LS_KEY_PIN);
                localStorage.removeItem(LS_KEY_ENTRIES);
                window.location.reload();
              }
            }}>Forgot PIN? (Reset)</button>
          </>
        )}
      </motion.div>
    </div>
  );
};

/* ───────────────────────────────────────────────
   ENTRY EDITOR
─────────────────────────────────────────────── */
const EntryEditor = ({ entry, onSave, onCancel, theme }) => {
  const [title,    setTitle]    = useState(entry?.title    || '');
  const [body,     setBody]     = useState(entry?.body     || '');
  const [mood,     setMood]     = useState(entry?.mood     || '');
  const [stickers] = useState(entry?.stickers || []);
  const bodyRef = useRef();

  const addSticker = (s) => {
    const el = bodyRef.current;
    if (!el) return;
    const pos = el.selectionStart || body.length;
    const updated = body.slice(0, pos) + s + body.slice(pos);
    setBody(updated);
  };

  const handleSave = () => {
    if (!body.trim()) { alert('Write something first 💕'); return; }
    onSave({
      id:      entry?.id || Date.now().toString(),
      title:   title || 'Untitled Diary',
      body,
      mood,
      stickers,
      date:    entry?.date || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <motion.div className="dd-editor" style={{ background: theme.card }}
      initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:30 }}>

      <div className="dd-editor-header">
        <h3 style={{ color: theme.text }}>✍️ {entry ? 'Edit Entry' : 'New Diary'}</h3>
        <button className="dd-ed-close" onClick={onCancel} style={{ color: theme.accent }}>✕ Cancel</button>
      </div>

      <input className="dd-ed-title" placeholder="Give this Diary a title…"
        value={title} onChange={e => setTitle(e.target.value)}
        style={{ borderColor: theme.accent + '55', color: theme.text, background: theme.bg ? 'transparent' : 'white' }} />

      {/* Mood */}
      <div className="dd-ed-moods">
        <span className="dd-ed-label" style={{ color: theme.text }}>How are you feeling?</span>
        <div className="dd-mood-row">
          {MOODS.map(m => (
            <button key={m} className={`dd-mood-chip${mood===m?' dd-mood-sel':''}`}
              style={mood===m ? { background: theme.accent, color:'#fff', borderColor: theme.accent } : { borderColor: theme.accent + '55', color: theme.text }}
              onClick={() => setMood(m === mood ? '' : m)}>{m}</button>
          ))}
        </div>
      </div>

      {/* Sticker bar */}
      <div className="dd-sticker-bar">
        <span className="dd-ed-label" style={{ color: theme.text }}>Add stickers to text:</span>
        <div className="dd-sticker-row">
          {STICKERS.map(s => (
            <button key={s} className="dd-sticker-btn" title="Insert" onClick={() => addSticker(s)}>{s}</button>
          ))}
        </div>
      </div>

      <textarea ref={bodyRef} className="dd-ed-body"
        placeholder="Dear Diary, today I felt…"
        value={body} onChange={e => setBody(e.target.value)}
        style={{ borderColor: theme.accent + '55', color: theme.text }} />

      <div className="dd-ed-footer">
        <span className="dd-ed-chars" style={{ color: theme.text + '88' }}>{body.length} chars</span>
        <button className="dd-save-btn" onClick={handleSave}
          style={{ background: theme.accent }}>💾 Save Diary</button>
      </div>
    </motion.div>
  );
};

/* ───────────────────────────────────────────────
   ENTRY CARD (read view)
─────────────────────────────────────────────── */
const EntryCard = ({ entry, theme, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const preview = entry.body.length > 180 ? entry.body.slice(0,180) + '…' : entry.body;

  return (
    <motion.div className="dd-entry-card" style={{ background: theme.card }}
      whileHover={{ y:-3, boxShadow:'0 12px 35px rgba(0,0,0,0.15)' }}
      layout>
      <div className="dd-ec-top">
        <div>
          <div className="dd-ec-date" style={{ color: theme.accent }}>{shortDate(entry.date)}</div>
          <h4 className="dd-ec-title" style={{ color: theme.text }}>{entry.title}</h4>
        </div>
        {entry.mood && <span className="dd-ec-mood">{entry.mood.split(' ')[0]}</span>}
      </div>

      <p className="dd-ec-body" style={{ color: theme.text + 'cc' }}>
        {expanded ? entry.body : preview}
      </p>

      {entry.body.length > 180 && (
        <button className="dd-ec-expand" style={{ color: theme.accent }}
          onClick={() => setExpanded(!expanded)}>
          {expanded ? '▲ Show less' : '▼ Read more'}
        </button>
      )}

      <div className="dd-ec-footer">
        <span className="dd-ec-updated" style={{ color: theme.text + '66' }}>
          {entry.updatedAt !== entry.date ? `Edited ${shortDate(entry.updatedAt)}` : ''}
        </span>
        <div className="dd-ec-actions">
          <button className="dd-ec-btn" style={{ color: theme.accent }} onClick={() => onEdit(entry)} title="Edit">✏️</button>
          <button className="dd-ec-btn dd-ec-del" onClick={() => onDelete(entry.id)} title="Delete">🗑️</button>
        </div>
      </div>
    </motion.div>
  );
};

/* ───────────────────────────────────────────────
   MAIN COMPONENT
─────────────────────────────────────────────── */
const DearDiary = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [hasPin]                = useState(!!load(LS_KEY_PIN, ''));

  const [entries, setEntries]   = useState([]);
  const [themeId, setThemeId]   = useState(load(LS_KEY_THEME, 'cherry'));
  const [view, setView]         = useState('home');     // home | write | themes | settings
  const [editingEntry, setEditingEntry] = useState(null);
  const [search, setSearch]     = useState('');
  const [filterMood, setFilterMood] = useState('');
  const [showThemePicker, setShowThemePicker] = useState(false);

  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];

  /* load entries after unlock */
  useEffect(() => {
    if (unlocked) setEntries(load(LS_KEY_ENTRIES, []));
  }, [unlocked]);

  const persistEntries = (updated) => {
    setEntries(updated);
    save(LS_KEY_ENTRIES, updated);
  };

  const handleSaveEntry = (entry) => {
    const existing = entries.find(e => e.id === entry.id);
    const updated = existing
      ? entries.map(e => e.id === entry.id ? entry : e)
      : [entry, ...entries];
    persistEntries(updated);
    setEditingEntry(null);
    setView('home');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this entry? 💔')) return;
    persistEntries(entries.filter(e => e.id !== id));
  };

  const handleThemeChange = (id) => {
    setThemeId(id);
    save(LS_KEY_THEME, id);
    setShowThemePicker(false);
  };

  const handleLock = () => {
    setUnlocked(false);
    setEntries([]);
  };

  const handleChangePin = () => {
    if (!window.confirm('Change your diary PIN? You will be logged out.')) return;
    localStorage.removeItem(LS_KEY_PIN);
    handleLock();
    window.location.reload();
  };

  /* filtered list */
  const filtered = entries.filter(e => {
    const matchSearch = !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.body.toLowerCase().includes(search.toLowerCase());
    const matchMood = !filterMood || e.mood === filterMood;
    return matchSearch && matchMood;
  });

  /* ── LOCK SCREEN ── */
  if (!unlocked) {
    return <LockScreen hasPin={hasPin} onUnlock={() => setUnlocked(true)} />;
  }

  /* ── THEME PICKER OVERLAY ── */
  const ThemePicker = () => (
    <motion.div className="dd-theme-overlay"
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      onClick={() => setShowThemePicker(false)}>
      <motion.div className="dd-theme-picker" onClick={e => e.stopPropagation()}
        initial={{ scale:0.9 }} animate={{ scale:1 }}>
        <h3>🎨 Choose Your Theme</h3>
        <div className="dd-theme-grid">
          {THEMES.map(t => (
            <div key={t.id} className={`dd-theme-swatch${themeId===t.id?' dd-ts-active':''}`}
              style={{ background: t.bg }} onClick={() => handleThemeChange(t.id)}>
              <span>{t.label}</span>
              {themeId === t.id && <span className="dd-ts-check">✓</span>}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  /* ── UNLOCKED UI ── */
  return (
    <div className="dear-diary" style={{ background: theme.bg }}>
      {/* Floating particles */}
      <div className="dd-particles" aria-hidden="true">
        {['✨','🌸','💫','🦋','🌟'].map((p,i) => (
          <span key={i} className={`dd-particle dd-p${i+1}`}>{p}</span>
        ))}
      </div>

      <div className="dd-wrapper">
        {/* ── HEADER ── */}
        <div className="dd-header" style={{ background: theme.card }}>
          <div className="dd-h-left">
            <span className="dd-h-icon">📔</span>
            <div>
              <h1 style={{ color: theme.text }}>Dear Diary</h1>
              <p style={{ color: theme.accent }}>{entries.length} {entries.length===1?'Diary':'Diaries'}</p>
            </div>
          </div>
          <div className="dd-h-actions">
            <button className="dd-h-btn" title="Change theme" style={{ color: theme.accent }}
              onClick={() => setShowThemePicker(true)}>🎨</button>
            <button className="dd-h-btn" title="Lock Diary" style={{ color: theme.accent }}
              onClick={handleLock}>🔒</button>
          </div>
        </div>

        {/* ── NAV ── */}
        <div className="dd-nav">
          {[['home','📖 Diaries'],['write','✍️ Write'],['settings','⚙️ Settings']].map(([v,l]) => (
            <button key={v} className={`dd-nav-btn${view===v?' active':''}`}
              style={view===v ? { background: theme.accent, borderColor: theme.accent, color:'#fff' }
                              : { borderColor: theme.accent + '66', color: theme.accent }}
              onClick={() => { setView(v); setEditingEntry(null); }}>{l}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── ENTRIES VIEW ── */}
          {view === 'home' && !editingEntry && (
            <motion.div key="home" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
              {/* Search + filter */}
              <div className="dd-search-row">
                <input className="dd-search" placeholder="🔍 Search Diaries…"
                  value={search} onChange={e => setSearch(e.target.value)}
                  style={{ borderColor: theme.accent + '55', color: theme.text, background: theme.card }} />
                <select className="dd-mood-filter"
                  value={filterMood} onChange={e => setFilterMood(e.target.value)}
                  style={{ borderColor: theme.accent + '55', color: theme.text, background: theme.card }}>
                  <option value="">All moods</option>
                  {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              {/* New entry CTA */}
              <motion.button className="dd-new-btn" onClick={() => setView('write')}
                style={{ background: theme.accent }}
                whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>
                ✍️ Write a new Diary
              </motion.button>

              {/* Entries */}
              {filtered.length === 0 ? (
                <div className="dd-empty" style={{ background: theme.card }}>
                  <div className="dd-empty-icon">📔</div>
                  <h3 style={{ color: theme.text }}>
                    {entries.length === 0 ? 'Your diary is empty' : 'No entries match'}
                  </h3>
                  <p style={{ color: theme.text + '88' }}>
                    {entries.length === 0 ? 'Start writing your first entry 💕' : 'Try a different search'}
                  </p>
                </div>
              ) : (
                <motion.div className="dd-entries-grid" layout>
                  <AnimatePresence>
                    {filtered.map(entry => (
                      <EntryCard key={entry.id} entry={entry} theme={theme}
                        onEdit={(e) => { setEditingEntry(e); setView('write'); }}
                        onDelete={handleDelete} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── WRITE / EDIT VIEW ── */}
          {view === 'write' && (
            <motion.div key="write" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
              <EntryEditor
                entry={editingEntry}
                theme={theme}
                onSave={handleSaveEntry}
                onCancel={() => { setView('home'); setEditingEntry(null); }} />
            </motion.div>
          )}

          {/* ── SETTINGS VIEW ── */}
          {view === 'settings' && (
            <motion.div key="settings" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
              <div className="dd-settings" style={{ background: theme.card }}>
                <h2 style={{ color: theme.text }}>⚙️ Settings</h2>

                <div className="dd-setting-item">
                  <div>
                    <h4 style={{ color: theme.text }}>🎨 Diary Theme</h4>
                    <p style={{ color: theme.text + '88' }}>Current: {theme.label}</p>
                  </div>
                  <button className="dd-setting-btn" style={{ borderColor: theme.accent, color: theme.accent }}
                    onClick={() => setShowThemePicker(true)}>Change</button>
                </div>

                <div className="dd-setting-item">
                  <div>
                    <h4 style={{ color: theme.text }}>🔑 Change PIN</h4>
                    <p style={{ color: theme.text + '88' }}>Reset your secret diary PIN</p>
                  </div>
                  <button className="dd-setting-btn" style={{ borderColor: theme.accent, color: theme.accent }}
                    onClick={handleChangePin}>Change</button>
                </div>

                <div className="dd-setting-item">
                  <div>
                    <h4 style={{ color: theme.text }}>📊 Stats</h4>
                    <p style={{ color: theme.text + '88' }}>{entries.length} diaries · {entries.filter(e=>e.mood).length} with moods</p>
                  </div>
                </div>

                <div className="dd-setting-item">
                  <div>
                    <h4 style={{ color: '#e53935' }}>🗑️ Delete All Diaries</h4>
                    <p style={{ color: theme.text + '88' }}>This cannot be undone</p>
                  </div>
                  <button className="dd-setting-btn dd-delete-all-btn"
                    onClick={() => {
                      if (window.confirm('Delete ALL diary entries? This is permanent 💔')) {
                        persistEntries([]);
                      }
                    }}>Delete All</button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Theme picker overlay */}
      <AnimatePresence>
        {showThemePicker && <ThemePicker key="tp" />}
      </AnimatePresence>
    </div>
  );
};

export default DearDiary;