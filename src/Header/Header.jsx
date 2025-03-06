import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/allchinafinds.png';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
    localStorage.removeItem('hasProAccess');
    localStorage.removeItem('loginTimestamp');
    
    // Force a page reload to ensure all state is cleared
    window.location.href = '/';
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/home">
            <img src={logo} alt="All China Finds Logo" className="header-logo" />
          </Link>
        </div>
        
        <nav className="header-nav">
          <div className="nav-links desktop-nav">
            <Link 
              to="/home" 
              className={`nav-link ${isActive('/home') ? 'active' : ''}`}
            >
              <i className="fas fa-th-large"></i> Dashboard
            </Link>
            <Link 
              to="/setup-bot" 
              className={`nav-link ${isActive('/setup-bot') ? 'active' : ''}`}
            >
              <i className="fas fa-play-circle"></i> Setup Bot
            </Link>
            <Link 
              to="/manage-bots" 
              className={`nav-link ${isActive('/manage-bots') ? 'active' : ''}`}
            >
              <i className="fas fa-robot"></i> Manage Bots
            </Link>
            <Link 
              to="/convert-ce-to-wc" 
              className={`nav-link ${isActive('/convert-ce-to-wc') ? 'active' : ''}`}
            >
              <i className="fas fa-exchange-alt"></i> Convert CE To WC
            </Link>
          </div>
          
          <div className="user-menu">
            <button 
              className="user-menu-button" 
              onClick={toggleDropdown}
              aria-expanded={isDropdownOpen}
            >
              <span className="username">{localStorage.getItem('username')}</span>
              <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'}`}></i>
            </button>
            
            {isDropdownOpen && (
              <>
                <div className="dropdown-overlay" onClick={closeDropdown}></div>
                <div className="dropdown-menu">
                  <div className="mobile-nav">
                    <Link 
                      to="/home" 
                      className={`dropdown-item ${isActive('/home') ? 'active' : ''}`}
                      onClick={closeDropdown}
                    >
                      <i className="fas fa-th-large"></i> Dashboard
                    </Link>
                    <Link 
                      to="/setup-bot" 
                      className={`dropdown-item ${isActive('/setup-bot') ? 'active' : ''}`}
                      onClick={closeDropdown}
                    >
                      <i className="fas fa-play-circle"></i> Setup Bot
                    </Link>
                    <Link 
                      to="/manage-bots" 
                      className={`dropdown-item ${isActive('/manage-bots') ? 'active' : ''}`}
                      onClick={closeDropdown}
                    >
                      <i className="fas fa-robot"></i> Manage Bots
                    </Link>
                    <Link 
                      to="/convert-ce-to-wc" 
                      className={`dropdown-item ${isActive('/convert-ce-to-wc') ? 'active' : ''}`}
                      onClick={closeDropdown}
                    >
                      <i className="fas fa-exchange-alt"></i> Convert CE To WC
                    </Link>
                    <div className="dropdown-divider"></div>
                  </div>
                  <button 
                    className="dropdown-item logout-item" 
                    onClick={handleLogout}
                  >
                    <i className="fas fa-sign-out-alt"></i> Log Out
                  </button>
                </div>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 