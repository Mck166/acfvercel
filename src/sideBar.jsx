import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import logo from './assets/allchinafinds.png';
import burgerMenu from './assets/burger-menu.png';
import './sideBar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="mobile-header">
        <button className="menu-toggle" onClick={toggleMenu}>
          <img src={burgerMenu} alt="Menu" className="burger-icon" />
        </button>
        <img src={logo} alt="All China Finds Logo" className="mobile-logo" />
      </div>

      {/* Sidebar/Dropdown */}
      <div className={`sidebar ${isOpen ? 'active' : ''}`}>
        <div className="sidebar-header desktop-only">
          <div className="logo">
            <img src={logo} alt="All China Finds Logo" />
          </div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link 
                to="/home" 
                className={`nav-item ${isActive('/home') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <i className="fas fa-th-large"></i>Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/setup-bot" 
                className={`nav-item ${isActive('/setup-bot') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <i className="fas fa-play-circle"></i>Setup Bot
              </Link>
            </li>
            <li>
              <Link 
                to="/manage-bots" 
                className={`nav-item ${isActive('/manage-bots') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <i className="fas fa-robot"></i>Manage Bots
              </Link>
            </li>
            <li>
              <Link 
                to="/convert-ce-to-wc" 
                className={`nav-item ${isActive('/convert-ce-to-wc') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <i className="fas fa-exchange-alt"></i>Convert CE To WC
              </Link>
            </li>
            <li>
              <a href="#" className="nav-item" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>Log Out
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={closeMenu}></div>
      )}
    </>
  );
};

export default Sidebar;