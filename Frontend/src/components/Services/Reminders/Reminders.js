import React, { useState, useEffect, useRef } from 'react';
import './Reminders.css';

import { motion } from "framer-motion";

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    category: 'general',
    repeat: 'none',
    repeatIntervalHours: 1,
    priority: 'low',
    intervalType: 'default',
    customIntervalHours: 2
  });
  const [filter, setFilter] = useState('all');

  // ── Alarm state ──────────────────────────────────────────────────────────────
  const [alarmActive, setAlarmActive] = useState(false);
  const [alarmReminder, setAlarmReminder] = useState(null);
  const audioCtxRef = useRef(null);
  const alarmTimerRef = useRef(null);

  const categories = [
    { value: 'general',    label: 'General',   icon: '📝', color: '#6c757d' },
    { value: 'health',     label: 'Health',    icon: '🏥', color: '#28a745' },
    { value: 'beauty',     label: 'Beauty',    icon: '💄', color: '#e83e8c' },
    { value: 'exercise',   label: 'Exercise',  icon: '💪', color: '#fd7e14' },
    { value: 'wellness',   label: 'Wellness',  icon: '🧘‍♀️', color: '#20c997' },
    { value: 'medication', label: 'Medication',icon: '💊', color: '#dc3545' },
    { value: 'selfcare',   label: 'Self-Care', icon: '🌸', color: '#6f42c1' }
  ];

  const repeatOptions = [
    { value: 'none',      label: 'No Repeat' },
    { value: 'recurring', label: '🔁 Every X Hours (set below)' },
    { value: 'daily',     label: 'Daily' },
    { value: 'weekly',    label: 'Weekly' },
    { value: 'monthly',   label: 'Monthly' }
  ];

  // ── Load saved reminders on mount ────────────────────────────────────────────
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('reminders') || '[]');
    setReminders(saved);

    const interval = setInterval(checkDueReminders, 60000);
    checkDueReminders();

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  // Request browser notification permission on mount
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const saveRemindersToStorage = (list) => {
    localStorage.setItem('reminders', JSON.stringify(list));
  };

  // Reads directly from localStorage so it always has the latest data
  const checkDueReminders = () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const currentDate = now.toISOString().slice(0, 10);

    const saved = JSON.parse(localStorage.getItem('reminders') || '[]');

    saved.forEach(reminder => {
      if (
        reminder.date === currentDate &&
        reminder.time === currentTime &&
        !reminder.notified
      ) {
        showNotification(reminder);

        const updated = saved.map(r =>
          r.id === reminder.id ? { ...r, notified: true } : r
        );
        localStorage.setItem('reminders', JSON.stringify(updated));
        setReminders(updated);
      }
    });
  };

  // ── Play a beeping ringtone for 10 seconds via Web Audio API ─────────────────
  const playAlarmSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;

      const DURATION  = 10;   // total seconds
      const beepEvery = 0.6;  // seconds between beep starts
      const beepLen   = 0.28; // length of each beep

      for (let t = 0; t < DURATION; t += beepEvery) {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();

        // Alternate between two pitches for a classic alarm feel
        osc.type = 'sine';
        osc.frequency.value = (Math.floor(t / beepEvery) % 2 === 0) ? 880 : 1100;

        gain.gain.setValueAtTime(0,    ctx.currentTime + t);
        gain.gain.linearRampToValueAtTime(0.75, ctx.currentTime + t + 0.02);
        gain.gain.linearRampToValueAtTime(0,    ctx.currentTime + t + beepLen);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + beepLen);
      }

      // Auto-close AudioContext after 10 s + small buffer
      alarmTimerRef.current = setTimeout(() => {
        stopAlarmSound();
      }, (DURATION + 0.5) * 1000);

    } catch (err) {
      console.warn('Web Audio API not available:', err);
    }
  };

  const stopAlarmSound = () => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    clearTimeout(alarmTimerRef.current);
    setAlarmActive(false);
    setAlarmReminder(null);
  };

  // ── Show notification: in-app alarm popup + browser notification ─────────────
  const showNotification = (reminder) => {
    // In-app alarm popup + ringtone (always works)
    setAlarmReminder(reminder);
    setAlarmActive(true);
    playAlarmSound();

    // Browser notification (best-effort)
    if (Notification.permission === 'granted') {
      new Notification(`⏰ Reminder: ${reminder.title}`, {
        body: reminder.description || 'Time for your reminder!',
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(`⏰ Reminder: ${reminder.title}`, {
            body: reminder.description || 'Time for your reminder!',
          });
        }
      });
    }
  };

  // ── Schedule 3 advance notifications for High Priority reminders ─────────────
  const scheduleHighPriorityNotifications = (reminder) => {
    const dueTime = new Date(`${reminder.date}T${reminder.time}`);
    const now = new Date();

    const intervalMin =
      reminder.intervalType === 'custom'
        ? Number(reminder.customIntervalHours) * 60
        : 60;

    [3, 2, 1].forEach((multiplier) => {
      const notifyAt = new Date(dueTime.getTime() - multiplier * intervalMin * 60000);
      const delay = notifyAt.getTime() - now.getTime();
      if (delay > 0) {
        setTimeout(() => {
          showNotification({
            ...reminder,
            title: `⚠️ [${4 - multiplier}/3] ${reminder.title}`,
          });
        }, delay);
      }
    });
  };

  // ── Schedule recurring notifications ─────────────────────────────────────────
  const scheduleRecurringReminder = (reminder) => {
    const startTime = new Date(`${reminder.date}T${reminder.time}`);
    const endOfDay  = new Date(`${reminder.date}T23:59`);
    const now       = new Date();
    const hours     = Number(reminder.repeatIntervalHours) || 1;
    const INTERVAL  = hours * 60 * 60 * 1000;

    let fireAt = new Date(startTime.getTime());
    let count  = 1;

    while (fireAt <= endOfDay) {
      const delay = fireAt.getTime() - now.getTime();
      if (delay > 0) {
        const label = count === 1 ? '' : ` (×${count})`;
        setTimeout(() => {
          showNotification({
            ...reminder,
            title: `${reminder.title}${label}`,
          });
        }, delay);
      }
      fireAt = new Date(fireAt.getTime() + INTERVAL);
      count++;
    }
  };

  const addReminder = () => {
    if (newReminder.title.trim() && newReminder.date && newReminder.time) {
      const reminder = {
        id: Date.now(),
        ...newReminder,
        title: newReminder.title.trim(),
        description: newReminder.description.trim(),
        createdAt: new Date().toISOString(),
        notified: false,
        completed: false
      };

      const updated = [...reminders, reminder];
      setReminders(updated);
      saveRemindersToStorage(updated);

      if (reminder.priority === 'high') {
        scheduleHighPriorityNotifications(reminder);
      }

      if (reminder.repeat === 'recurring') {
        scheduleRecurringReminder(reminder);
      }

      setNewReminder({
        title: '',
        description: '',
        date: '',
        time: '',
        category: 'general',
        repeat: 'none',
        repeatIntervalHours: 1,
        priority: 'low',
        intervalType: 'default',
        customIntervalHours: 2
      });

      setShowAddForm(false);
    }
  };

  const deleteReminder = (id) => {
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    saveRemindersToStorage(updated);
  };

  const toggleComplete = (id) => {
    const updated = reminders.map(r =>
      r.id === id ? { ...r, completed: !r.completed } : r
    );
    setReminders(updated);
    saveRemindersToStorage(updated);
  };

  const filteredReminders = reminders.filter((reminder) => {
    const now = new Date();
    const reminderTime = new Date(`${reminder.date}T${reminder.time}`);

    switch (filter) {
      case 'today':
        return reminder.date === now.toISOString().slice(0, 10);
      case 'upcoming':
        return reminderTime > now && !reminder.completed;
      case 'completed':
        return reminder.completed;
      case 'overdue':
        return reminderTime < now && !reminder.completed;
      default:
        return true;
    }
  });

  const getCategoryInfo = (value) => {
    return categories.find(cat => cat.value === value) || categories[0];
  };

  const formatDateTime = (date, time) => {
    const dt = new Date(`${date}T${time}`);
    return `${dt.toLocaleDateString()} at ${dt.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  };

  const stats = {
    total:     reminders.length,
    today:     reminders.filter(r => r.date === new Date().toISOString().slice(0, 10)).length,
    upcoming:  reminders.filter(r => new Date(`${r.date}T${r.time}`) > new Date() && !r.completed).length,
    completed: reminders.filter(r => r.completed).length
  };

  return (
    <div className="reminders">

      {/* ── Alarm Popup Overlay ─────────────────────────────────────────────── */}
      {alarmActive && alarmReminder && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white', borderRadius: 24, padding: '44px 52px',
            textAlign: 'center', maxWidth: 420, width: '90%',
            boxShadow: '0 12px 48px rgba(0,0,0,0.35)',
            animation: 'slideIn 0.3s ease-out'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: 14 }}>⏰</div>
            <h2 style={{ color: '#6f42c1', marginBottom: 8, fontSize: '1.6rem' }}>
              Time's Up!
            </h2>
            <h3 style={{ color: '#333', marginBottom: 12, fontWeight: 700 }}>
              {alarmReminder.title}
            </h3>
            {alarmReminder.description && (
              <p style={{ color: '#666', marginBottom: 24, lineHeight: 1.6 }}>
                {alarmReminder.description}
              </p>
            )}
            <button
              onClick={stopAlarmSound}
              style={{
                background: '#6f42c1', color: 'white', border: 'none',
                padding: '14px 40px', borderRadius: 30, fontSize: '1.1rem',
                fontWeight: 700, cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
              onMouseOver={e => e.target.style.background = '#5a2d91'}
              onMouseOut={e  => e.target.style.background = '#6f42c1'}
            >
              ✅ Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="reminders-header">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1>⏰ Reminders</h1>
          <p>Never forget your self-care routines and important tasks</p>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="reminders-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.today}</div>
          <div className="stat-label">Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.upcoming}</div>
          <div className="stat-label">Upcoming</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      {/* Add Button */}
      <div className="add-reminder-section">
        <motion.button
          className="add-reminder-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {showAddForm ? '❌ Cancel' : '➕ Add New Reminder'}
        </motion.button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="add-form">
          <div className="form-grid">

            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={newReminder.title}
                onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                placeholder="Reminder title..."
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={newReminder.category}
                onChange={(e) => setNewReminder({ ...newReminder, category: e.target.value })}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                value={newReminder.date}
                onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
                min={new Date().toISOString().slice(0, 10)}
              />
            </div>

            <div className="form-group">
              <label>Time *</label>
              <input
                type="time"
                value={newReminder.time}
                onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
              />
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                value={newReminder.description}
                onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                placeholder="Additional details..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Repeat</label>
              <select
                value={newReminder.repeat}
                onChange={(e) => setNewReminder({ ...newReminder, repeat: e.target.value })}
              >
                {repeatOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Recurring interval picker */}
            {newReminder.repeat === 'recurring' && (
              <div className="form-group">
                <label>🕐 Repeat every how many hours?</label>
                <input
                  type="number"
                  min="1"
                  max="23"
                  value={newReminder.repeatIntervalHours}
                  onChange={(e) =>
                    setNewReminder({
                      ...newReminder,
                      repeatIntervalHours: Math.max(1, Math.min(23, Number(e.target.value)))
                    })
                  }
                  placeholder="e.g. 2 for every 2 hours"
                />
                <small style={{ color: '#888', marginTop: 4 }}>
                  Will repeat from your set time until end of day (every {newReminder.repeatIntervalHours}h)
                </small>
              </div>
            )}

            {/* Priority Selection */}
            <div className="form-group">
              <label>Priority</label>
              <select
                value={newReminder.priority}
                onChange={(e) => setNewReminder({ ...newReminder, priority: e.target.value })}
              >
                <option value="low">🟢 Low Priority (notify once)</option>
                <option value="high">🔴 High Priority (notify 3× before due)</option>
              </select>
            </div>

            {newReminder.priority === 'high' && (
              <div className="form-group">
                <label>Notification Interval</label>
                <select
                  value={newReminder.intervalType}
                  onChange={(e) => setNewReminder({ ...newReminder, intervalType: e.target.value })}
                >
                  <option value="default">Default – every 1 hour before due</option>
                  <option value="custom">Custom interval</option>
                </select>
              </div>
            )}

            {newReminder.priority === 'high' && newReminder.intervalType === 'custom' && (
              <div className="form-group">
                <label>Interval between notifications (hours)</label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={newReminder.customIntervalHours}
                  onChange={(e) => setNewReminder({ ...newReminder, customIntervalHours: e.target.value })}
                />
              </div>
            )}

          </div>{/* end form-grid */}

          <div className="form-actions">
            <motion.button
              onClick={addReminder}
              className="save-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✅ Save Reminder
            </motion.button>
            <motion.button
              onClick={() => setShowAddForm(false)}
              className="cancel-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ❌ Cancel
            </motion.button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-buttons">
          <motion.button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All ({stats.total})
          </motion.button>
          <motion.button
            className={filter === 'today' ? 'active' : ''}
            onClick={() => setFilter('today')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Today ({stats.today})
          </motion.button>
          <motion.button
            className={filter === 'upcoming' ? 'active' : ''}
            onClick={() => setFilter('upcoming')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Upcoming ({stats.upcoming})
          </motion.button>
          <motion.button
            className={filter === 'overdue' ? 'active' : ''}
            onClick={() => setFilter('overdue')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Overdue
          </motion.button>
          <motion.button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Completed ({stats.completed})
          </motion.button>
        </div>
      </div>

      {/* Reminders List */}
      <div className="reminders-list">
        {filteredReminders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⏰</div>
            <h3>No reminders found</h3>
            <p>
              {filter === 'all'
                ? 'Create your first reminder to get started!'
                : `No ${filter} reminders right now.`}
            </p>
          </div>
        ) : (
          filteredReminders
            .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
            .map(reminder => {
              const categoryInfo = getCategoryInfo(reminder.category);
              const isOverdue =
                new Date(`${reminder.date}T${reminder.time}`) < new Date() &&
                !reminder.completed;

              return (
                <div
                  key={reminder.id}
                  className={`reminder-item ${reminder.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
                >
                  <div className="reminder-content">
                    <div className="reminder-header">
                      <div className="category-badge" style={{ backgroundColor: categoryInfo.color }}>
                        {categoryInfo.icon} {categoryInfo.label}
                      </div>
                      <div className="reminder-time">
                        {formatDateTime(reminder.date, reminder.time)}
                      </div>
                    </div>

                    {/* Priority badge */}
                    {reminder.priority === 'high' && (
                      <div className="priority-badge high">
                        🔴 High Priority
                        {reminder.intervalType === 'custom'
                          ? ` · Every ${reminder.customIntervalHours}h`
                          : ' · Every 1h'}
                      </div>
                    )}

                    <h4 className="reminder-title">{reminder.title}</h4>

                    {reminder.description && (
                      <p className="reminder-description">{reminder.description}</p>
                    )}

                    {reminder.repeat !== 'none' && (
                      <div className="repeat-info">
                        🔄 Repeats{' '}
                        {reminder.repeat === 'recurring'
                          ? `every ${reminder.repeatIntervalHours || 1} hour${Number(reminder.repeatIntervalHours) === 1 ? '' : 's'}`
                          : reminder.repeat}
                      </div>
                    )}
                  </div>

                  <div className="reminder-actions">
                    <button
                      onClick={() => toggleComplete(reminder.id)}
                      className={`complete-btn ${reminder.completed ? 'completed' : ''}`}
                    >
                      {reminder.completed ? '✅' : '⭕'}
                    </button>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="delete-btn"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
};

export default Reminders;