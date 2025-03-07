import React from 'react';
import { Link } from 'react-router-dom';
import './LoginCTA.css';

const LoginCTA = () => {
  return (
    <div className="login-cta">
      <h3>Pro Access Required</h3>
      <p>You need to be logged in with Pro Access to use this feature.</p>
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
    </div>
  );
};

export default LoginCTA; 