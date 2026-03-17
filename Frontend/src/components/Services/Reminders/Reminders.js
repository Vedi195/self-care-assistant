import React, { useState, useEffect } from 'react';
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
    repeatIntervalHours: 1,   // user-chosen hour interval for recurring reminders
    // ── priority fields ─────────────────────────────
    priority: 'low',          // 'low' | 'high'
    intervalType: 'default',  // 'default' | 'custom'  (high priority only)
    customIntervalHours: 2    // used when intervalType === 'custom'
  });
  const [filter, setFilter] = useState('all');

  const categories = [
    { value: 'general', label: 'General', icon: '📝', color: '#6c757d' },
    { value: 'health', label: 'Health', icon: '🏥', color: '#28a745' },
    { value: 'beauty', label: 'Beauty', icon: '💄', color: '#e83e8c' },
    { value: 'exercise', label: 'Exercise', icon: '💪', color: '#fd7e14' },
    { value: 'wellness', label: 'Wellness', icon: '🧘‍♀️', color: '#20c997' },
    { value: 'medication', label: 'Medication', icon: '💊', color: '#dc3545' },
    { value: 'selfcare', label: 'Self-Care', icon: '🌸', color: '#6f42c1' }
  ];

  const repeatOptions = [
    { value: 'none',      label: 'No Repeat' },
    { value: 'recurring', label: '🔁 Every X Hours (set below)' },
    { value: 'daily',     label: 'Daily' },
    { value: 'weekly',    label: 'Weekly' },
    { value: 'monthly',   label: 'Monthly' }
  ];

  // Load saved reminders + check due reminders
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('reminders') || '[]');
    setReminders(saved);

    const interval = setInterval(checkDueReminders, 60000);
    checkDueReminders();

    return () => clearInterval(interval);

    // eslint-disable-next-line
  }, []);

  const saveRemindersToStorage = (list) => {
    localStorage.setItem('reminders', JSON.stringify(list));
  };

  const checkDueReminders = () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const currentDate = now.toISOString().slice(0, 10);

    reminders.forEach(reminder => {
      if (
        reminder.date === currentDate &&
        reminder.time === currentTime &&
        !reminder.notified
      ) {
        showNotification(reminder);

        const updated = reminders.map(r =>
          r.id === reminder.id ? { ...r, notified: true } : r
        );

        setReminders(updated);
        saveRemindersToStorage(updated);
      }
    });
  };

  const showNotification = (reminder) => {
    if (Notification.permission === 'granted') {
      new Notification(`Reminder: ${reminder.title}`, {
        body: reminder.description,
        icon: '⏰'
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(`Reminder: ${reminder.title}`, {
            body: reminder.description,
            icon: '⏰'
          });
        }
      });
    }
  };

  // ── NEW: Schedule 3 advance notifications for High Priority reminders ───────
  const scheduleHighPriorityNotifications = (reminder) => {
    const dueTime = new Date(`${reminder.date}T${reminder.time}`);
    const now = new Date();

    // Interval in minutes (default = 60 min, custom = user-specified hours × 60)
    const intervalMin =
      reminder.intervalType === 'custom'
        ? Number(reminder.customIntervalHours) * 60
        : 60;

    // Notify 3×, 2×, and 1× the interval BEFORE due time
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

  // Schedule recurring notifications at the user-chosen interval for the whole day
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

      // ── auto-schedule high-priority advance notifications ────────────
      if (reminder.priority === 'high') {
        scheduleHighPriorityNotifications(reminder);
      }

      // ── auto-schedule recurring interval notifications ────────────────
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

  // Request notification permission on mount
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const stats = {
    total: reminders.length,
    today: reminders.filter(r =>
      r.date === new Date().toISOString().slice(0, 10)
    ).length,
    upcoming: reminders.filter(r => {
      const d = new Date(`${r.date}T${r.time}`);
      return d > new Date() && !r.completed;
    }).length,
    completed: reminders.filter(r => r.completed).length
  };

  return (
    <div className="reminders">
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
                onChange={(e) =>
                  setNewReminder({ ...newReminder, description: e.target.value })
                }
                placeholder="Additional details..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Repeat</label>
              <select
                value={newReminder.repeat}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, repeat: e.target.value })
                }
              >
                {repeatOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* ── Interval hours picker – only shown when Recurring is selected ── */}
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

            {/* ── NEW: Priority Selection ──────────────────────────────────── */}
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
            {/* ─────────────────────────────────────────────────────────────── */}

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
                  className={`reminder-item ${reminder.completed ? 'completed' : ''} ${
                    isOverdue ? 'overdue' : ''
                  }`}
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

                    {/* ── NEW: Priority badge ─────────────────────────────── */}
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