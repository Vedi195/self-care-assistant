import React, { useState, useEffect } from 'react';
import './PeriodTracker.css';


const phaseInfo = {
  period: {
    name: "Menstruation", icon: "🌸", color: "#E91E63",
    days: "Days 1–5 (avg)",
    description: "Your body sheds the uterine lining. Hormone levels are at their lowest — rest is essential.",
    symptoms: ["Cramps","Fatigue","Bloating","Mood changes","Back pain","Headaches"],
    selfCare: ["Use a heating pad on your lower abdomen","Rest when your body needs it — be kind","Eat iron-rich foods: spinach, lentils, eggs","Stay hydrated to reduce bloating","Light yoga (child's pose) soothes discomfort"],
    foods: ["Dark leafy greens (iron)","Ginger tea (anti-inflammatory)","Dark chocolate (magnesium)","Bananas (potassium)","Chamomile tea (cramp relief)"],
    exercise: "Gentle yoga, slow walks, or rest. Avoid intense cardio.",
    mood: "You may feel introspective and low-energy. Journaling can help."
  },
  follicular: {
    name: "Follicular Phase", icon: "🌱", color: "#4CAF50",
    days: "Days 1–13",
    description: "Estrogen rises as your body prepares to release an egg. Energy and mood naturally improve.",
    symptoms: ["Rising energy","Clearer skin","Improved mood","Creative peak","Better focus"],
    selfCare: ["Great time to start new projects or workouts","Your skin glows — keep skincare consistent","Social energy is high — plan fun activities","Best time for important decisions","Channel creative energy into passion projects"],
    foods: ["Fresh vegetables and fruits","Fermented foods (yogurt, kimchi)","Seeds: flaxseed, pumpkin","Lean proteins","Whole grains"],
    exercise: "High energy available — great for cardio, strength training, and challenges.",
    mood: "You feel optimistic, social, and motivated. Take advantage of this!"
  },
  ovulation: {
    name: "Ovulation", icon: "⭐", color: "#FF9800",
    days: "~Day 14 (mid-cycle)",
    description: "An egg is released from the ovary. Peak fertility. Energy and confidence are highest.",
    symptoms: ["Peak energy","High confidence","Mild mid-cycle cramping","Increased libido","Clear stretchy discharge"],
    selfCare: ["Schedule important presentations or meetings","Great time for intense workouts and social events","Light one-sided cramping is normal (mittelschmerz)","Track this phase if monitoring fertility","Embrace your most radiant self!"],
    foods: ["Antioxidant-rich foods: berries, tomatoes","Light, easily digestible meals","Coconut water for hydration","Leafy greens","Fiber-rich foods"],
    exercise: "Peak performance — tackle your most intense workouts now.",
    mood: "You feel magnetic, confident, and at your most sociable."
  },
  luteal: {
    name: "Luteal Phase", icon: "🌕", color: "#9C27B0",
    days: "Days 15–28",
    description: "Progesterone rises. If no pregnancy occurs, it drops sharply near day 28, triggering your period.",
    symptoms: ["PMS symptoms","Mood swings","Bloating","Tender breasts","Cravings","Fatigue"],
    selfCare: ["Reduce caffeine — it worsens PMS","Exercise releases endorphins that combat mood swings","Set boundaries and say no to extra commitments","Sleep a little extra — body temperature is slightly higher","Track symptoms to spot your personal PMS pattern"],
    foods: ["Complex carbs: oats, sweet potato (reduce cravings)","Omega-3: salmon, walnuts, chia seeds","Magnesium: dark chocolate, almonds","Avoid: caffeine, alcohol, salty and refined foods"],
    exercise: "Moderate — walks, pilates, yoga. Avoid overexertion.",
    mood: "Emotions may feel amplified. Practice self-compassion and reduce stress."
  }
};

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const fmt = (date) =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date));

const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

const calcCycle = (lastPeriodStr, cycleLen) => {
  const start = new Date(lastPeriodStr);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextPeriod    = addDays(start, cycleLen);
  const ovulationDay  = addDays(start, cycleLen - 14);
  const fertileStart  = addDays(ovulationDay, -5);
  const fertileEnd    = addDays(ovulationDay, 1);
  const daysUntilNext = daysBetween(today, nextPeriod);
  const cycleDay      = Math.max(1, Math.min(daysBetween(start, today) + 1, cycleLen));

  let currentPhase = 'follicular';
  if (cycleDay <= 5) currentPhase = 'period';
  else if (cycleDay > cycleLen - 13) currentPhase = 'luteal';
  else if (Math.abs(cycleDay - (cycleLen - 14)) <= 1) currentPhase = 'ovulation';

  return { nextPeriod, ovulationDay, fertileStart, fertileEnd, daysUntilNext, cycleDay, currentPhase };
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const SYMPTOMS_LIST = ['Cramps','Bloating','Fatigue','Headache','Mood swings','Back pain','Nausea','Spotting','Tender breasts','Cravings','Acne','Insomnia'];
const MOODS_LIST    = ['😊 Happy','😐 Neutral','😔 Sad','😤 Irritable','😰 Anxious','😴 Tired','🌟 Energetic','😢 Emotional'];

export default function PeriodTracker() {
  const [view, setView]             = useState('home');
  const [trackerData, setTrackerData] = useState(null);   // calculated cycle data
  const [form, setForm]             = useState({ lastPeriod: '', cycleLength: '28', periodLength: '5' });
  const [savedLogs, setSavedLogs]   = useState([]);
  const [selectedPhase, setSelectedPhase] = useState('period');
  const [logForm, setLogForm]       = useState({ date: '', symptoms: [], mood: '', notes: '' });
  const [reminder, setReminder]     = useState('');
  const [toast, setToast]           = useState('');

  /* Persist to localStorage */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pt_data');
      if (saved) {
        const d = JSON.parse(saved);
        const calc = calcCycle(d.lastPeriod, parseInt(d.cycleLength));
        setTrackerData({ ...d, ...calc });
        setView('tracker');
      }
      const logs = JSON.parse(localStorage.getItem('pt_logs') || '[]');
      setSavedLogs(logs);
    } catch (_) {}
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3200);
  };

  /* ── SETUP ── */
  const handleSetup = () => {
    if (!form.lastPeriod) { showToast('⚠️ Please enter your last period date!'); return; }
    const cl = parseInt(form.cycleLength);
    if (cl < 21 || cl > 45) { showToast('⚠️ Cycle length should be between 21 and 45 days.'); return; }
    const calc = calcCycle(form.lastPeriod, cl);
    const data = { ...form, ...calc };
    setTrackerData(data);
    try { localStorage.setItem('pt_data', JSON.stringify({ lastPeriod: form.lastPeriod, cycleLength: form.cycleLength, periodLength: form.periodLength })); } catch (_) {}
    setView('tracker');
    showToast('✅ Cycle calculated successfully!');
  };

  const handleReset = () => {
    if (!window.confirm('Reset all period tracking data?')) return;
    try { localStorage.removeItem('pt_data'); localStorage.removeItem('pt_logs'); } catch (_) {}
    setTrackerData(null);
    setSavedLogs([]);
    setForm({ lastPeriod: '', cycleLength: '28', periodLength: '5' });
    setView('home');
    showToast('🔄 Data reset.');
  };

  /* ── LOG ── */
  const toggleSymptom = (s) =>
    setLogForm(p => ({ ...p, symptoms: p.symptoms.includes(s) ? p.symptoms.filter(x => x !== s) : [...p.symptoms, s] }));

  const saveLog = () => {
    if (!logForm.date) { showToast('⚠️ Please select a date!'); return; }
    const newLog = { ...logForm, id: Date.now() };
    const updated = [newLog, ...savedLogs].slice(0, 30);
    setSavedLogs(updated);
    try { localStorage.setItem('pt_logs', JSON.stringify(updated)); } catch (_) {}
    setLogForm({ date: '', symptoms: [], mood: '', notes: '' });
    showToast('💖 Log saved successfully!');
  };

  /* ── REMINDER ── */
  const setReminder3Days = () => {
    if (!trackerData) return;
    const r = addDays(trackerData.nextPeriod, -3);
    const msg = `⏰ Reminder noted: 3 days before next period — ${fmt(r)}`;
    setReminder(msg);
    showToast('🔔 Reminder set!');
  };

  /* ── NAV items ── */
  const NAV = [['home','🏠 Home'], ['tracker','📊 My Cycle'], ['phase','💡 Phase Guide'], ['log','📝 Symptom Log']];

  return (
    <>

      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', top:18, left:'50%', transform:'translateX(-50%)', background:'#fff', border:'2px solid #e91e8c', borderRadius:40, padding:'12px 26px', fontWeight:700, fontSize:'.93rem', color:'#880e4f', boxShadow:'0 8px 30px rgba(233,30,140,.2)', zIndex:9999, animation:'fadeDown .3s ease', whiteSpace:'nowrap' }}>
          {toast}
        </div>
      )}

      <div className="pt-root">
        {/* ── HEADER ── */}
        <div className="pt-header">
          <h1>🌸 Period Tracker</h1>
          <p>Track your cycle · understand your body · get personalised care tips</p>
        </div>

        {/* ── NAV ── */}
        <nav className="pt-nav">
          {NAV.map(([k, l]) => (
            <button key={k} className={`pt-nav-btn${view === k ? ' active' : ''}`} onClick={() => setView(k)}>{l}</button>
          ))}
        </nav>

        {/* ══════════ HOME ══════════ */}
        {view === 'home' && (
          <div>
            <div className="pt-card pt-welcome-card">
              <span className="pt-welcome-icon">🌸</span>
              <h2>Welcome to Your Period Tracker</h2>
              <p>Track your cycle, predict your next period, understand your phases, and get personalised health tips every step of the way.</p>
              <button className="pt-primary-btn" onClick={() => setView('tracker')}>
                {trackerData ? '📊 View My Cycle' : '✨ Start Tracking'}
              </button>
            </div>

            <div className="pt-features-grid">
              {[
                { icon: '📅', title: 'Cycle Prediction',   desc: 'Predict your next period, ovulation day and fertile window accurately.' },
                { icon: '🌙', title: 'Phase Insights',     desc: 'Understand Menstruation, Follicular, Ovulation and Luteal phases.' },
                { icon: '💊', title: 'Health Suggestions', desc: 'Personalised food, exercise and self-care tips for each phase.' },
                { icon: '📝', title: 'Symptom Log',        desc: 'Track symptoms, mood and notes to identify your personal patterns.' },
              ].map(({ icon, title, desc }, i) => (
                <div key={i} className="pt-feature-card" style={{ animationDelay: `${i * 0.08}s` }}>
                  <span className="pt-fc-icon">{icon}</span>
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════ TRACKER ══════════ */}
        {view === 'tracker' && (
          <div>
            {!trackerData ? (
              /* ── Setup Form ── */
              <div className="pt-card">
                <h2>📅 Set Up Your Cycle</h2>
                <p className="pt-setup-desc">Enter your last period start date and average cycle length to get predictions tailored to you.</p>
                <div className="pt-form">
                  <div className="pt-form-group">
                    <label>📅 Last Period Start Date *</label>
                    <input type="date" value={form.lastPeriod} max={new Date().toISOString().split('T')[0]}
                      onChange={e => setForm(p => ({ ...p, lastPeriod: e.target.value }))} />
                  </div>
                  <div className="pt-form-group">
                    <label>🔁 Average Cycle Length (days)</label>
                    <input type="number" min="21" max="45" value={form.cycleLength}
                      onChange={e => setForm(p => ({ ...p, cycleLength: e.target.value }))} />
                    <small>Most cycles are 21–35 days. Average is 28 days.</small>
                  </div>
                  <div className="pt-form-group">
                    <label>🌸 Average Period Length (days)</label>
                    <input type="number" min="2" max="8" value={form.periodLength}
                      onChange={e => setForm(p => ({ ...p, periodLength: e.target.value }))} />
                    <small>Usually 3–7 days.</small>
                  </div>
                  <button className="pt-primary-btn" onClick={handleSetup}>🚀 Calculate My Cycle</button>
                </div>
              </div>
            ) : (
              /* ── Results ── */
              <div>
                {/* Summary cards */}
                <div className="pt-summary-grid">
                  {[
                    { icon: '🌸', title: 'Next Period', value: fmt(trackerData.nextPeriod), sub: trackerData.daysUntilNext > 0 ? `In ${trackerData.daysUntilNext} days` : trackerData.daysUntilNext === 0 ? 'Today!' : `${Math.abs(trackerData.daysUntilNext)} days ago`, color: '#E91E63' },
                    { icon: '⭐', title: 'Ovulation Day', value: fmt(trackerData.ovulationDay), sub: '~14 days before next period', color: '#FF9800' },
                    { icon: '🌱', title: 'Fertile Window', value: fmt(trackerData.fertileStart), sub: `to ${fmt(trackerData.fertileEnd)}`, color: '#4CAF50' },
                    { icon: '🌀', title: 'Cycle Day', value: `Day ${trackerData.cycleDay}`, sub: `of ${trackerData.cycleLength}-day cycle`, color: '#9C27B0' },
                  ].map((c, i) => (
                    <div key={i} className="pt-summary-card" style={{ borderLeftColor: c.color, animationDelay: `${i * 0.07}s` }}>
                      <span className="pt-sc-icon">{c.icon}</span>
                      <div>
                        <h4>{c.title}</h4>
                        <p className="pt-sc-value">{c.value}</p>
                        <p className="pt-sc-sub">{c.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Current Phase */}
                <div className="pt-current-phase" style={{ borderTopColor: phaseInfo[trackerData.currentPhase].color }}>
                  <div className="pt-cp-header">
                    <span>{phaseInfo[trackerData.currentPhase].icon}</span>
                    <div>
                      <h3>Current Phase: {phaseInfo[trackerData.currentPhase].name}</h3>
                      <p>{phaseInfo[trackerData.currentPhase].description}</p>
                    </div>
                  </div>
                  <div className="pt-cp-tips">
                    <h4>🌿 Self-Care Tips Right Now</h4>
                    <ul>
                      {phaseInfo[trackerData.currentPhase].selfCare.slice(0, 4).map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>
                  <div style={{ marginTop: 18 }}>
                    <button className="pt-secondary-btn" onClick={() => { setSelectedPhase(trackerData.currentPhase); setView('phase'); }}>
                      See Full Phase Guide →
                    </button>
                  </div>
                </div>

                {/* Cycle Progress */}
                <div className="pt-cycle-bar-section">
                  <h3>📊 Cycle Progress — Day {trackerData.cycleDay} of {trackerData.cycleLength}</h3>
                  <div className="pt-cycle-bar">
                    <div className="pt-cycle-fill" style={{ width: `${(trackerData.cycleDay / parseInt(trackerData.cycleLength)) * 100}%`, background: `linear-gradient(90deg, ${phaseInfo[trackerData.currentPhase].color}99, ${phaseInfo[trackerData.currentPhase].color})` }} />
                  </div>
                  <div className="pt-cycle-labels">
                    <span>Day 1</span>
                    <span>Day {Math.round(parseInt(trackerData.cycleLength) / 2)}</span>
                    <span>Day {trackerData.cycleLength}</span>
                  </div>
                </div>

                {/* Reminder */}
                <div className="pt-reminder-section">
                  <h3>⏰ Set Reminder</h3>
                  <p>Get a reminder 3 days before your next period so you're always prepared.</p>
                  <button className="pt-primary-btn" onClick={setReminder3Days}>🔔 Set 3-Day Reminder</button>
                  {reminder && <p className="pt-reminder-success">{reminder}</p>}
                </div>

                <div>
                  <button className="pt-reset-btn" onClick={handleReset}>🔄 Reset &amp; Re-enter Data</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════ PHASE GUIDE ══════════ */}
        {view === 'phase' && (
          <div>
            <div className="pt-phase-tabs">
              {Object.entries(phaseInfo).map(([key, data]) => (
                <button key={key}
                  className={`pt-phase-tab${selectedPhase === key ? ' active' : ''}`}
                  style={selectedPhase === key ? { backgroundColor: data.color, borderColor: data.color } : {}}
                  onClick={() => setSelectedPhase(key)}>
                  {data.icon} {data.name.split(' ')[0]}
                </button>
              ))}
            </div>

            <div className="pt-phase-detail" key={selectedPhase} style={{ borderTopColor: phaseInfo[selectedPhase].color }}>
              <div className="pt-pd-header">
                <span className="pt-pd-icon">{phaseInfo[selectedPhase].icon}</span>
                <div>
                  <h2>{phaseInfo[selectedPhase].name}</h2>
                  <p className="pt-pd-days" style={{ color: phaseInfo[selectedPhase].color }}>{phaseInfo[selectedPhase].days}</p>
                  <p>{phaseInfo[selectedPhase].description}</p>
                </div>
              </div>
              <div className="pt-pd-grid">
                <div className="pt-pd-section">
                  <h4>🩺 Common Symptoms</h4>
                  <div className="pt-symptom-tags">
                    {phaseInfo[selectedPhase].symptoms.map((s, i) => (
                      <span key={i} className="pt-symptom-tag" style={{ borderColor: phaseInfo[selectedPhase].color, color: phaseInfo[selectedPhase].color }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div className="pt-pd-section">
                  <h4>🥗 Best Foods</h4>
                  <ul className="pt-pd-list">{phaseInfo[selectedPhase].foods.map((f, i) => <li key={i}>{f}</li>)}</ul>
                </div>
                <div className="pt-pd-section">
                  <h4>🌿 Self-Care Routine</h4>
                  <ul className="pt-pd-list">{phaseInfo[selectedPhase].selfCare.map((s, i) => <li key={i}>{s}</li>)}</ul>
                </div>
                <div className="pt-pd-section">
                  <h4>💪 Exercise Guidance</h4>
                  <p className="pt-pd-text">{phaseInfo[selectedPhase].exercise}</p>
                  <h4 style={{ marginTop: 16 }}>🧠 Mood &amp; Energy</h4>
                  <p className="pt-pd-text">{phaseInfo[selectedPhase].mood}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ SYMPTOM LOG ══════════ */}
        {view === 'log' && (
          <div>
            <div className="pt-log-section">
              <h2>📝 Log Today's Symptoms</h2>
              <div className="pt-log-form">
                <div className="pt-form-group">
                  <label>📅 Date *</label>
                  <input type="date" value={logForm.date} max={new Date().toISOString().split('T')[0]}
                    onChange={e => setLogForm(p => ({ ...p, date: e.target.value }))} />
                </div>
                <div className="pt-form-group">
                  <label>🩺 Symptoms (select all that apply)</label>
                  <div className="pt-symptom-picker">
                    {SYMPTOMS_LIST.map(s => (
                      <button key={s} className={`pt-symptom-pick${logForm.symptoms.includes(s) ? ' selected' : ''}`} onClick={() => toggleSymptom(s)}>{s}</button>
                    ))}
                  </div>
                </div>
                <div className="pt-form-group">
                  <label>😊 How are you feeling today?</label>
                  <div className="pt-mood-picker">
                    {MOODS_LIST.map(m => (
                      <button key={m} className={`pt-mood-pick${logForm.mood === m ? ' selected' : ''}`} onClick={() => setLogForm(p => ({ ...p, mood: m }))}>{m}</button>
                    ))}
                  </div>
                </div>
                <div className="pt-form-group">
                  <label>📔 Personal Notes</label>
                  <textarea value={logForm.notes} placeholder="How are you feeling? Any observations..." rows="3"
                    onChange={e => setLogForm(p => ({ ...p, notes: e.target.value }))} />
                </div>
                <div>
                  <button className="pt-primary-btn" onClick={saveLog}>💾 Save Log</button>
                </div>
              </div>
            </div>

            {savedLogs.length > 0 && (
              <div className="pt-past-logs">
                <h3>📜 Recent Logs</h3>
                <div className="pt-logs-list">
                  {savedLogs.slice(0, 6).map(log => (
                    <div key={log.id} className="pt-log-card">
                      <div className="pt-log-date">{fmt(log.date)}</div>
                      {log.mood && <div className="pt-log-mood">{log.mood}</div>}
                      {log.symptoms.length > 0 && (
                        <div className="pt-log-symptoms">
                          {log.symptoms.map((s, i) => <span key={i} className="pt-log-symptom-tag">{s}</span>)}
                        </div>
                      )}
                      {log.notes && <p className="pt-log-notes">"{log.notes}"</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {savedLogs.length === 0 && (
              <div className="pt-past-logs">
                <p className="pt-no-logs">No logs yet — add your first entry above! 🌸</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}