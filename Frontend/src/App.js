import React from 'react';
import './App.css';
import "./Background.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from "framer-motion";
import ScrollToTop from "./components/ScrollToTop";
import BottomNav from "./components/Header/BottomNav";


import Header from './components/Header/Header';
import ContactPage from './components/Header/Contact/ContactPage';
import FavoritesPage from './components/Header/Favorites/FavoritesPage';
import AboutPage from './components/Header/About/AboutPage';
import ProfilePage from './components/Header/ProfilePage/ProfilePage';

import Hero from './components/Hero/Hero';
import ServiceCards from './components/ServiceCards/ServiceCards';
import QuoteBox from './components/QuoteBox/QuoteBox';
import FeedbackTable from './components/Admin/FeedbackTable';

import Footer from './components/Footer/Footer';
import Privacy from "./components/Footer/pages/Privacy";
import Terms from "./components/Footer/pages/Terms";
import Cookies from "./components/Footer/pages/Cookies";


// Service Components
import FashionSuggestion from './components/Services/FashionSuggestion/FashionSuggestion';
import HealthTips from './components/Services/HealthTips/HealthTips';
import DailyRoutine from './components/Services/DailyRoutine/DailyRoutine';
import SkinHairCare from './components/Services/SkinHairCare/SkinHairCare';
import TodoList from './components/Services/TodoList/TodoList';
import Reminders from './components/Services/Reminders/Reminders';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />

        <div className="floating-emojis">
          <span style={{ top: "10%", left: "15%" }}>✨</span>
          <span style={{ top: "30%", left: "70%" }}>💖</span>
          <span style={{ top: "60%", left: "25%" }}>🌿</span>
          <span style={{ top: "80%", left: "50%" }}>💗</span>
          <span style={{ top: "20%", left: "85%" }}>🪷</span>
          <span style={{ top: "50%", left: "10%" }}>✨</span>
          <span style={{ top: "75%", left: "80%" }}>💞</span>
          <span style={{ top: "40%", left: "40%" }}>🌸</span>
          <span style={{ top: "12%", left: "60%" }}>🧘‍♀️</span>
          <span style={{ top: "65%", left: "55%" }}>🎀</span>
          <span style={{ top: "85%", left: "20%" }}>💫</span>
          <span style={{ top: "45%", left: "90%" }}>✨</span>
        </div>

        <ScrollToTop />

        <main className="main-content">
          <AnimatePresence>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Hero />
                    <ServiceCards />
                    <QuoteBox />
                  </>
                }
              />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin/feedback" element={<FeedbackTable />} />
              
              {/* Service Routes */}
              <Route path="/fashion-suggestion" element={<FashionSuggestion />} />
              <Route path="/health-tips" element={<HealthTips />} />
              <Route path="/daily-routine" element={<DailyRoutine />} />
              <Route path="/skin-hair-care" element={<SkinHairCare />} />
              <Route path="/todo-list" element={<TodoList />} />
              <Route path="/reminders" element={<Reminders />} />

              {/* Footer Pages */}
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />
            </Routes>
          </AnimatePresence>
        </main>

        <BottomNav /> 

        <Footer />
      </div>
    </Router>
  );
}

export default App;