import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = ({ isLoggedIn }) => {
  const username = localStorage.getItem('username');

  return (
    <div className="dashboard-container">
      <div className="content-header">
        <h1>Dashboard</h1>
        {isLoggedIn && <div className="user-info">Welcome, {username}!</div>}
      </div>

      <div className="welcome-section">
        <h2>Welcome to All China Finds Bot Manager</h2>
        <p>
          {isLoggedIn 
            ? "Manage your bots, create new ones, and convert CE to WC with ease."
            : "Create and manage Telegram bots with your affiliate links. Log in to get started."}
        </p>
        {!isLoggedIn && (
          <div className="cta-buttons">
            <Link to="/login" className="cta-button login">
              Log In
            </Link>
            <a 
              href="https://allchinafinds.com/membership-checkout/?pmpro_level=3" 
              target="_blank" 
              rel="noopener noreferrer"
              className="cta-button signup"
            >
              Sign Up for Pro Access
            </a>
          </div>
        )}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <i className="fas fa-play-circle"></i>
            <h3>Setup Bot</h3>
          </div>
          <p className="card-description">
            Create a new bot for your Telegram channel with your affiliate code.
          </p>
          <div className="card-actions">
            {isLoggedIn ? (
              <Link to="/setup-bot" className="card-action-btn">
                <i className="fas fa-arrow-right"></i> Setup New Bot
              </Link>
            ) : (
              <Link to="/login" className="card-action-btn login-required">
                <i className="fas fa-lock"></i> Login Required
              </Link>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <i className="fas fa-robot"></i>
            <h3>Manage Bots</h3>
          </div>
          <p className="card-description">
            View, pause, or delete your existing bots.
          </p>
          <div className="card-actions">
            {isLoggedIn ? (
              <Link to="/manage-bots" className="card-action-btn">
                <i className="fas fa-arrow-right"></i> Manage Bots
              </Link>
            ) : (
              <Link to="/login" className="card-action-btn login-required">
                <i className="fas fa-lock"></i> Login Required
              </Link>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <i className="fas fa-exchange-alt"></i>
            <h3>Convert CE to WC</h3>
          </div>
          <p className="card-description">
            Convert Commerce Explorer links to WooCommerce compatible format.
          </p>
          <div className="card-actions">
            {isLoggedIn ? (
              <Link to="/convert-ce-to-wc" className="card-action-btn">
                <i className="fas fa-arrow-right"></i> Convert Links
              </Link>
            ) : (
              <Link to="/login" className="card-action-btn login-required">
                <i className="fas fa-lock"></i> Login Required
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;