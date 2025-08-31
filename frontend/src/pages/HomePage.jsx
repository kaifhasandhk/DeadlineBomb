import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Make sure this CSS file exists

const HomePage = () => {
  return (
    <div className="home-page-container">
      {/* === Hero Section (Top of the page) === */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Master Your Deadlines, Conquer Your Courses</h1>
          <p className="hero-subtitle">
            An all-in-one solution to track tasks, manage courses, and never miss a deadline again.
            Stay organized, stay ahead.
          </p>
          <Link to="/courses" className="hero-cta-button">
            Get Started
          </Link>
        </div>
      </section>

      {/* === Features Section === */}
      <section className="features-section">
        <h2 className="features-title">Everything You Need to Succeed</h2>
        
        <div className="features-list">

          {/* Feature 1 */}
          <div className="feature-item">
            <div className="feature-image-container">
              <img src="/picture1.svg" alt="Real-time Notifications" className="feature-image" />
            </div>
            <div className="feature-text-container">
              <h3 className="feature-item-title">Real-Time Urgent Notifications</h3>
              <p className="feature-item-description">
                Our system monitors your deadlines around the clock. When a task approaches its final hours, you'll receive an unmissable notification on any page, ensuring you never get caught by surprise.
              </p>
            </div>
          </div>

          {/* Feature 2 (Reversed Layout) */}
          <div className="feature-item feature-item-reverse">
            <div className="feature-text-container">
              <h3 className="feature-item-title">Visual Countdown Timers</h3>
              <p className="feature-item-description">
                Each task features a dynamic, circular timer that visually represents the time remaining. Instantly gauge urgency with color-coded indicators for tasks that are safe, upcoming, or urgent.
              </p>
            </div>
            <div className="feature-image-container">
              <img src="/picture2.svg" alt="Countdown Timers" className="feature-image" />
            </div>
          </div>

          {/* Feature 3 */}
          <div className="feature-item">
            <div className="feature-image-container">
              <img src="/picture3.svg" alt="Centralized Dashboard" className="feature-image" />
            </div>
            <div className="feature-text-container">
              <h3 className="feature-item-title">All Your Tasks in One Place</h3>
              <p className="feature-item-description">
                Get a high-level overview of all your responsibilities from every course on a single, clean dashboard. Track active, completed, and urgent tasks at a glance to prioritize your workload effectively.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* === Footer === */}
      <footer className="footer">
        <p>© 2025 Deadline Bomb. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;

