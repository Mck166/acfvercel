import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import logo from '../assets/allchinafinds.png';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, updateLoginState } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname, isLoggedIn]);

  const checkAuthStatus = () => {
    const storedUsername = localStorage.getItem('username');
    if (isLoggedIn && storedUsername) {
      setUsername(storedUsername);
    } else {
      setUsername('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
    localStorage.removeItem('hasProAccess');
    localStorage.removeItem('loginTimestamp');
    
    // Update login state in context
    updateLoginState(false);
    
    // Navigate to home
    navigate('/');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path || 
           (path === '/' && location.pathname === '/home');
  };

  // Don't show navigation on login page
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/">
            <img src={logo} alt="All China Finds Logo" className="header-logo" />
          </Link>
        </div>
        
        {/* Navigation - always visible */}
        <nav className="header-nav">
          <div className="desktop-nav">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Dashboard
            </Link>
            <Link to="/setup-bot" className={`nav-link ${isActive('/setup-bot') ? 'active' : ''}`}>
              Setup Bot
            </Link>
            <Link to="/manage-bots" className={`nav-link ${isActive('/manage-bots') ? 'active' : ''}`}>
              Manage Bots
            </Link>
            <Link to="/convert-ce-to-wc" className={`nav-link ${isActive('/convert-ce-to-wc') ? 'active' : ''}`}>
              Convert CE To WC
            </Link>
          </div>
          
          {/* User menu or auth buttons */}
          <div className="user-menu">
            {isLoggedIn ? (
              <>
                <button 
                  className="user-dropdown-toggle" 
                  onClick={toggleDropdown}
                  aria-expanded={isDropdownOpen}
                >
                  <span className="username">{username}</span>
                  <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'}`}></i>
                </button>
                
                {isDropdownOpen && (
                  <>
                    <div className="dropdown-overlay" onClick={closeDropdown}></div>
                    <div className="dropdown-menu">
                      <div className="mobile-nav">
                        <Link 
                          to="/" 
                          className={`dropdown-item ${isActive('/') ? 'active' : ''}`}
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
              </>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="auth-button login-btn">Log In</Link>
                <a 
                  href="https://allchinafinds.com/membership-checkout/?pmpro_level=3" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="auth-button signup-btn"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 