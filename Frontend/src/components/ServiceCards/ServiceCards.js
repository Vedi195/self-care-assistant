import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ServiceCards.css';
import { motion } from "framer-motion";

const ServiceCards = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      icon: '👗👔',
      title: 'Fashion Suggestion',
      description: 'What should I wear today?',
      path: '/fashion-suggestion',
      color: '#ff6b35'
    },
    {
      id: 2,
      icon: '🧘🏻‍♀️🧘🏻',
      title: 'Health Tips',
      description: 'Tips to stay fit and strong',
      path: '/health-tips',
      color: '#4caf50'
    },
    {
      id: 3,
      icon: '📅',
      title: 'Daily Routine',
      description: 'Plan your perfect day',
      path: '/daily-routine',
      color: '#2196f3'
    },
    {
      id: 4,
      icon: '💆🏻‍♀️💆🏻',
      title: 'Skin & Hair Care',
      description: 'Your daily skin & hair routine',
      path: '/skin-hair-care',
      color: '#9c27b0'
    },
    {
      id: 5,
      icon: '✅',
      title: 'To-do List',
      description: 'Track your daily goals',
      path: '/todo-list',
      color: '#009688'
    },
    {
      id: 6,
      icon: '⏰',
      title: 'Reminders',
      description: "Don't forget your self-care",
      path: '/reminders',
      color: '#ff9800'
    },
    {
      id: 7,
      icon: '📔',
      title: 'Dear Diary',
      description: 'Your private locked diary',
      path: '/dear-diary',
      color: '#7b1fa2',
      badge: 'New'
    },
    {
      id: 8,
      icon: '🌸',
      title: 'Period Tracker',
      description: 'Track your cycle & wellness',
      path: '/period-tracker',
      color: '#e91e8c',
      badge: 'New'
    },
  ];

  return (
    <section className="service-cards">
      <motion.div
        className="card"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <motion.div
          className="cards-grid"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className="service-card"
              onClick={() => navigate(service.path)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07, duration: 0.4 }}
              style={{ '--card-accent': service.color }}
            >
              {service.badge && (
                <span className="sc-badge" style={{ background: service.color }}>
                  {service.badge}
                </span>
              )}
              <div className="card-icon">{service.icon}</div>
              <h3 className="card-title">{service.title}</h3>
              <p className="card-description">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ServiceCards;