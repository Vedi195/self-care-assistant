import React, { useState, useEffect } from 'react';
import './DailyRoutine.css';

import { FaRegCopy } from 'react-icons/fa';
import ReactMarkdown from "react-markdown";

const DailyRoutine = () => {
  const [currentView, setCurrentView] = useState('main');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [routineNotes, setRoutineNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [editText, setEditText] = useState('');

  const routineTemplates = [
    {
      name: "Morning Energizer",
      icon: "🌅",
      description: "Start your day with energy and purpose",
      tasks: [
        { time: "6:00 AM", task: "Wake up and hydrate with a glass of water", completed: false },
        { time: "6:15 AM", task: "5-minute meditation or deep breathing", completed: false },
        { time: "6:30 AM", task: "Light stretching or yoga", completed: false },
        { time: "7:00 AM", task: "Healthy breakfast", completed: false },
        { time: "7:30 AM", task: "Review daily goals and priorities", completed: false }
      ]
    },
    {
      name: "Work Productivity",
      icon: "💼",
      description: "Optimize your workday for maximum productivity",
      tasks: [
        { time: "9:00 AM", task: "Check emails and prioritize tasks", completed: false },
        { time: "9:30 AM", task: "Focus on most important task (2 hours)", completed: false },
        { time: "11:30 AM", task: "Take a 15-minute break and walk", completed: false },
        { time: "12:00 PM", task: "Continue with secondary tasks", completed: false },
        { time: "1:00 PM", task: "Lunch break away from desk", completed: false }
      ]
    },
    {
      name: "Evening Wind-Down",
      icon: "🌙",
      description: "Relax and prepare for restful sleep",
      tasks: [
        { time: "7:00 PM", task: "Light dinner and family time", completed: false },
        { time: "8:00 PM", task: "Digital detox - no screens", completed: false },
        { time: "8:30 PM", task: "Reading or journaling", completed: false },
        { time: "9:00 PM", task: "Prepare for next day", completed: false },
        { time: "9:30 PM", task: "Relaxation routine (bath, tea, music)", completed: false }
      ]
    }
  ];

  useEffect(() => {
    // Load saved notes and chat messages
    const savedNotes = JSON.parse(localStorage.getItem('dailyRoutineNotes') || '[]');
    setRoutineNotes(savedNotes);

    // Initialize chat with welcome message
    setChatMessages([
      {
        type: 'bot',
        message: "🌟 Hello! I'm your daily routine assistant! Ask me about creating productive schedules, time management tips, or building healthy habits. How can I help you optimize your day?"
      }
    ]);
  }, []);

  const saveNotesToStorage = (notes) => {
    localStorage.setItem('dailyRoutineNotes', JSON.stringify(notes));
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        text: newNote.trim(),
        completed: false,
        createdAt: new Date().toLocaleDateString()
      };
      const updatedNotes = [...routineNotes, note];
      setRoutineNotes(updatedNotes);
      saveNotesToStorage(updatedNotes);
      setNewNote('');
    }
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = routineNotes.filter(note => note.id !== id);
    setRoutineNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
  };

  const handleToggleComplete = (id) => {
    const updatedNotes = routineNotes.map(note =>
      note.id === id ? { ...note, completed: !note.completed } : note
    );
    setRoutineNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
  };

  const handleEditNote = (id, newText) => {
    const updatedNotes = routineNotes.map(note =>
      note.id === id ? { ...note, text: newText } : note
    );
    setRoutineNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
    setEditingNote(null);
    setEditText('');
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setIsLoading(true);

    // Add user message to UI
    setChatMessages(prev => [...prev, { type: 'user', message: userMessage }]);

    try {
      const response = await fetch("http://localhost:5000/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // craft the system prompt to guide Gemini; change wording as needed
          prompt: `You are a friendly, helpful daily routine expert. Give simple, practical, and easy-to-follow routine suggestions. Keep answers short and motivating. 
            RULES:
            1. If the user is greeting (e.g., "hi", "hello", "hey"), respond casually and short.
            2. If the user says "thanks", "okay", "good", "bye", respond normally and DO NOT give steps.
            3. If the user asks for advice, routines, fashion tips, skin care, hair care, or any guidance — then reply in a structured format with:
              - Headings
              - Steps
              - Bullet points
              - Clean spacing
            4. Always detect user intent before choosing the response format.
            5. Never return steps for small talk.
          User: ${userMessage}`
        })
      });

      const data = await response.json();

      const botResponse = data.reply || "Sorry, I couldn't generate a response right now.";

      setChatMessages(prev => [...prev, { type: 'bot', message: botResponse }]);
    } catch (error) {
      console.error("Frontend error:", error);
      setChatMessages(prev => [
        ...prev,
        { type: 'bot', message: "⚠️ Something went wrong. Please try again later." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTipToFavorites = (tip) => {
    const favorites = JSON.parse(localStorage.getItem('dailyRoutineFavorites') || '[]');
    if (!favorites.includes(tip)) {
      favorites.push(tip);
      localStorage.setItem('dailyRoutineFavorites', JSON.stringify(favorites));
      alert('Tip saved to favorites! ❤️');
    } else {
      alert('This tip is already in your favorites! 😊');
    }
  };

  return (
    <div className="daily-routine-service">
      <div className="daily-routine">
        <div className="routine-header">
          <h1>📅 Daily Routine</h1>
          <p>Plan your perfect day and build productive habits</p>
        </div>

        <div className="routine-nav">
          <button 
            className={currentView === 'main' ? 'active' : ''}
            onClick={() => setCurrentView('main')}
          >
            🏠 Overview
          </button>
          <button 
            className={currentView === 'templates' ? 'active' : ''}
            onClick={() => setCurrentView('templates')}
          >
            📋 Templates
          </button>
          <button 
            className={currentView === 'notes' ? 'active' : ''}
            onClick={() => setCurrentView('notes')}
          >
            📝 My Notes
          </button>
          <button 
            className={currentView === 'chat' ? 'active' : ''}
            onClick={() => setCurrentView('chat')}
          >
            💬 AI Assistant
          </button>
        </div>

        {currentView === 'main' && (
          <div className="main-view">
            <div className="feature-cards">
              <div className="feature-card" onClick={() => setCurrentView('templates')}>
                <div className="feature-icon">📋</div>
                <h3>Routine Templates</h3>
                <p>Explore pre-made routines for different parts of your day</p>
              </div>
              
              <div className="feature-card" onClick={() => setCurrentView('notes')}>
                <div className="feature-icon">📝</div>
                <h3>Personal Notes</h3>
                <p>Create and manage your custom routine tasks and notes</p>
              </div>

              <div className="feature-card" onClick={() => setCurrentView('chat')}>
                <div className="feature-icon">🤖</div>
                <h3>AI Routine Coach</h3>
                <p>Get personalized advice for building better daily habits</p>
              </div>
            </div>

            <div className="daily-tips">
              <h3>💡 Today's Routine Tips</h3>
              <div className="tips-grid">
                <div className="tip-card">
                  <div className="tip-icon">⏰</div>
                  <h4>Time Blocking</h4>
                  <p>Schedule specific time slots for different activities to stay focused and organized.</p>
                  <button onClick={() => saveTipToFavorites("Schedule specific time slots for different activities to stay focused and organized.")}>
                    ❤️ Save
                  </button>
                </div>
                
                <div className="tip-card">
                  <div className="tip-icon">🎯</div>
                  <h4>Priority First</h4>
                  <p>Tackle your most important task when your energy levels are highest.</p>
                  <button onClick={() => saveTipToFavorites("Tackle your most important task when your energy levels are highest.")}>
                    ❤️ Save
                  </button>
                </div>
                
                <div className="tip-card">
                  <div className="tip-icon">🔄</div>
                  <h4>Consistent Sleep</h4>
                  <p>Go to bed and wake up at the same time every day to regulate your body clock.</p>
                  <button onClick={() => saveTipToFavorites("Go to bed and wake up at the same time every day to regulate your body clock.")}>
                    ❤️ Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'templates' && (
          <div className="templates-view">
            <div className="templates-header">
              <h2>📋 Routine Templates</h2>
              <p>Choose from these proven routine templates to get started</p>
            </div>

            <div className="templates-grid">
              {routineTemplates.map((template, index) => (
                <div key={index} className="template-card">
                  <div className="template-header">
                    <div className="template-icon">{template.icon}</div>
                    <h3>{template.name}</h3>
                    <p>{template.description}</p>
                  </div>
                  
                  <div className="template-tasks">
                    {template.tasks.map((task, taskIndex) => (
                      <div key={taskIndex} className="template-task">
                        <span className="task-time">{task.time}</span>
                        <span className="task-description">{task.task}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    className="use-template-btn"
                    onClick={() => saveTipToFavorites(`${template.name} Template: ${template.description}`)}
                  >
                    ❤️ Save Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'notes' && (
          <div className="notes-view">
            <div className="notes-header">
              <h2>📝 My Routine Notes</h2>
              <p>Create and manage your personal routine tasks and reminders</p>
            </div>

            <div className="add-note-section">
              <div className="add-note-form">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a new routine task or note..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                />
                <button onClick={handleAddNote}>Add Note</button>
              </div>
            </div>

            <div className="notes-list">
              {routineNotes.length === 0 ? (
                <div className="no-notes">
                  <div className="no-notes-icon">📝</div>
                  <h3>No notes yet!</h3>
                  <p>Start by adding your first routine task or note above.</p>
                </div>
              ) : (
                routineNotes.map((note) => (
                  <div key={note.id} className={`note-item ${note.completed ? 'completed' : ''}`}>
                    <div className="note-content">
                      <button
                        className="complete-btn"
                        onClick={() => handleToggleComplete(note.id)}
                      >
                        {note.completed ? '✅' : '⭕'}
                      </button>
                      
                      {editingNote === note.id ? (
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onBlur={() => handleEditNote(note.id, editText)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleEditNote(note.id, editText);
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        <span
                          className="note-text"
                          onDoubleClick={() => {
                            setEditingNote(note.id);
                            setEditText(note.text);
                          }}
                        >
                          {note.text}
                        </span>
                      )}
                      
                      <span className="note-date">{note.createdAt}</span>
                    </div>
                    
                    <div className="note-actions">
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setEditingNote(note.id);
                          setEditText(note.text);
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {currentView === 'chat' && (
          <div className="chat-view">
            <div className="chat-container">
              <div className="chat-messages">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`message ${msg.type}`}>
                    <div className="message-content">
                      <ReactMarkdown>{msg.message}</ReactMarkdown>
                      <div className="message-actions">
                        {msg.type === 'bot' && (
                          <button
                            className="copy-btn"
                            onClick={() => navigator.clipboard.writeText(msg.message)}
                          >
                            <FaRegCopy /> 
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="message bot">
                    <div className="message-content loading">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <form className="chat-input-form" onSubmit={handleChatSubmit}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about routines, habits, time management..."
                  disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !chatInput.trim()}>
                  ➤
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>  
  );
};

export default DailyRoutine;