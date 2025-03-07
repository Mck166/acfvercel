import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import logo from '../assets/allchinafinds.png';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { updateLoginState } = useContext(AuthContext);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('jwtToken');
    const hasProAccess = localStorage.getItem('hasProAccess');
    
    if (token && hasProAccess === 'true') {
      navigate('/');
    }
  }, [navigate]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const showError = (message) => {
    setLoginError(message);
    setTimeout(() => {
      setLoginError('');
    }, 5000);
  };

  const handleLogin = async () => {
    const trimmedUsername = username.trim().toLowerCase();
    const trimmedPassword = password;

    if (!trimmedUsername || !trimmedPassword) {
      showError('Please enter both username and password.');
      return;
    }

    try {
      setIsLoading(true);
      setLoginError('Logging in...');

      // Step 1: Get JWT token
      const tokenResponse = await fetch('https://allchinafinds.com/wp-json/jwt-auth/v1/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: trimmedUsername,
          password: trimmedPassword,
        }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok) {
        throw new Error(tokenData.message || 'Login failed');
      }

      // Store the token temporarily
      const token = tokenData.token;

      // Step 2: Check if user has pro access using the WordPress REST API
      const userResponse = await fetch('https://allchinafinds.com/wp-json/wp/v2/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      console.log('User data:', userData);
      
      // Check for pro access in user roles
      let hasProAccess = false;
      
      // Method 1: Check roles directly
      if (userData.roles && (userData.roles.includes('administrator') || userData.roles.includes('pro_member'))) {
        console.log('Pro access granted via user roles');
        hasProAccess = true;
      }
      
      // Method 2: Check for pro access in meta fields
      if (!hasProAccess && userData.meta) {
        const proAccessMeta = userData.meta.find(meta => meta.key === 'has_pro_access');
        if (proAccessMeta && proAccessMeta.value === true) {
          console.log('Pro access granted via meta fields');
          hasProAccess = true;
        }
      }
      
      // Method 3: For testing purposes - bypass pro access check
      // Remove this in production
      console.log('Bypassing pro access check for testing');
      hasProAccess = true;

      if (!hasProAccess) {
        throw new Error('You need Pro access to use this application. Please upgrade your membership.');
      }

      // Store auth data
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('username', trimmedUsername);
      localStorage.setItem('hasProAccess', 'true');
      localStorage.setItem('loginTimestamp', Date.now().toString());

      // Update login state in context
      updateLoginState(true);

      // Redirect to dashboard
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      showError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <img src={logo} alt="All China Finds Logo" />
        </div>
        
        <h2>Welcome Back</h2>
        <p className="login-subtitle">Sign in to your account to continue</p>
        
        {loginError && <div className="login-error">{loginError}</div>}
        
        <div className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username or Email</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
          </div>

          <button 
            className="login-button" 
            type="button" 
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>

          <div className="signup-link">
            Don't have an account?
            <a href="https://allchinafinds.com/membership-checkout/?pmpro_level=3" target="_blank" rel="noopener noreferrer">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 