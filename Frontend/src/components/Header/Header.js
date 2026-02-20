import React, { useState, useEffect, useRef } from 'react';import './Header.css';
import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';

import { motion } from "framer-motion";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load profile from localStorage
    const saved = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (saved.name) setProfileData(saved);

    // Close dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = () => {
    if (!profileData?.name) return '?';
    return profileData.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDropdownNav = (path) => {
    navigate(path);
    setDropdownOpen(false);
    setMenuOpen(false);
  };
  return (
    <header className="header">
      <motion.nav
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-container">
          <div className="logo">
            <div className="logo-icon">
              <div className="heart">🧡</div>
              <div className="leaves">🌿</div>
            </div>
            <span className="logo-text">Self-Care Assistant</span>
          </div>

          {/* Hamburger for mobile */}
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
            <ul className="nav-links">
              <li>
                <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/favorites" className={({ isActive }) => isActive ? 'active' : ''}>
                  Favorites
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>
                  Contact
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
                  About
                </NavLink>
              </li>
               {/* ── Profile Icon (beside About) ── */}
                <li className="profile-nav-item" ref={dropdownRef}>
                  <button
                    className="profile-icon-btn"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    title={profileData?.name || 'Profile'}
                  >
                    {profileData?.profileImage ? (
                      <img
                        src={profileData.profileImage}
                        alt="Profile"
                        className="nav-profile-img"
                      />
                    ) : (
                      <div className="nav-profile-initials">
                        {getInitials()}
                      </div>
                    )}
                    {/* Online dot */}
                    <span className="online-dot"></span>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="profile-dropdown">
                      {/* Dropdown Header */}
                      <div className="dropdown-header">
                        <div className="dropdown-avatar">
                          {profileData?.profileImage ? (
                            <img src={profileData.profileImage} alt="Profile" />
                          ) : (
                            <div className="dropdown-initials">{getInitials()}</div>
                          )}
                        </div>
                        <div className="dropdown-info">
                          <strong>{profileData?.name || 'Guest User'}</strong>
                          <span>{profileData?.fashionStyle || 'Complete your profile'}</span>
                        </div>
                      </div>

                      <div className="dropdown-divider" />

                      {/* Dropdown Links */}
                      <button className="dropdown-item" onClick={() => handleDropdownNav('/profile')}>
                        <span className="dropdown-item-icon">👤</span> My Profile
                      </button>
                      <button className="dropdown-item" onClick={() => handleDropdownNav('/favorites')}>
                        <span className="dropdown-item-icon">❤️</span> My Favorites
                      </button>
                      <button className="dropdown-item" onClick={() => handleDropdownNav('/todo-list')}>
                        <span className="dropdown-item-icon">✅</span> My To-Do List
                      </button>
                      <button className="dropdown-item" onClick={() => handleDropdownNav('/reminders')}>
                        <span className="dropdown-item-icon">⏰</span> My Reminders
                      </button>

                      <div className="dropdown-divider" />

                      <button className="dropdown-item" onClick={() => handleDropdownNav('/about')}>
                        <span className="dropdown-item-icon">ℹ️</span> About Us
                      </button>
                      <button className="dropdown-item" onClick={() => handleDropdownNav('/contact')}>
                        <span className="dropdown-item-icon">📩</span> Contact
                      </button>

                      <div className="dropdown-divider" />

                      {/* Clear Profile */}
                      <button
                        className="dropdown-item logout-item"
                        onClick={() => {
                          localStorage.removeItem('userProfile');
                          setProfileData(null);
                          setDropdownOpen(false);
                          navigate('/');
                        }}
                      >
                        <span className="dropdown-item-icon">🚪</span> Clear Profile
                      </button>
                    </div>
                  )}
                </li>
                {/* ── End Profile Icon ── */}
            </ul>
          </nav>
        </div>
      </motion.nav>
    </header>
  );
};

export default Header;