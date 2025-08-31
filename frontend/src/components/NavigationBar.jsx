import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './NavigationBar.css';

const NavigationBar = () => {
  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <img src="/logo.png" alt="DeadlineBomb Logo" className="navbar-logo" />
          <span>DeadlineBomb</span>
        </Link>
        <nav className="navbar-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Home
          </NavLink>
          <NavLink to="/courses" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Courses
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Dashboard
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default NavigationBar;

