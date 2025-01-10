import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import logo from './assets/allchinafinds.png'; // Adjust the path as necessary
import './sideBar.css'; // Ensure this line is present at the top of your sideBar.jsx file

const Sidebar = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Setup mobile menu
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    const toggleMenu = () => {
      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
    };

    if (menuToggle) {
      menuToggle.addEventListener('click', toggleMenu);
    }

    if (overlay) {
      overlay.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking links
    const navLinks = document.querySelectorAll('.nav-item');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          toggleMenu();
        }
      });
    });

    // Cleanup event listeners on unmount
    return () => {
      if (menuToggle) {
        menuToggle.removeEventListener('click', toggleMenu);
      }
      if (overlay) {
        overlay.removeEventListener('click', toggleMenu);
      }
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Clear all local storage items
    navigate('/'); // Redirect to login page after logout
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <img src={logo} alt="All China Finds Logo" />
        </div>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/home" className="nav-item" data-page="homeScreen">
              <i className="fas fa-th-large"></i>Dashboard
            </Link>
          </li>
          <li>
            <Link to="/setup-bot" className="nav-item" data-page="setup-bot">
              <i className="fas fa-play-circle"></i>Setup Bot
            </Link>
          </li>
          <li>
            <Link to="/active-bots" className="nav-item" data-page="active-bots">
              <i className="fas fa-robot"></i>Manage Bots
            </Link>
          </li>
          <li>
            <a href="#" className="nav-item" id="logoutButton" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>Log Out
            </a>
          </li>
        </ul>
      </nav>
      <button className="menu-toggle">
        <i className="fas fa-bars"></i>
      </button>
      <div className="sidebar-overlay"></div>
    </div>
  );
};

export default Sidebar;