import { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import logo from './assets/allchinafinds.png';
import Home from './Home';
import SetupBot from './setupBot';
import ManageBot from './manageBot';
import Layout from './Layout';
import './App.css';
import './logIn.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Checking authentication status...');
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('jwtToken');
    console.log('Token found:', token);
    if (token) {
      try {
        const isValid = await validateToken(token);
        if (isValid) {
          setIsLoggedIn(true);
          console.log('User is logged in.');
          return;
        }
      } catch (error) {
        console.error('Token validation error:', error);
      }
    }
    console.log('User is not logged in.');
    setIsLoggedIn(false);
  };

  const handleLogin = async () => {
    const trimmedUsername = username.trim().toLowerCase();
    const trimmedPassword = password;

    console.log('Attempting to log in with username:', trimmedUsername);

    if (!trimmedUsername || !trimmedPassword) {
      showError('Please enter both username and password.');
      console.log('Login failed: Missing username or password.');
      return;
    }

    try {
      setLoginError('Logging in...');
      console.log('Sending login request...');

      const response = await fetch('https://allchinafinds.com/wp-json/jwt-auth/v1/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: trimmedUsername, password: trimmedPassword }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (data.token) {
        localStorage.setItem('jwtToken', data.token);
        localStorage.setItem('loginTimestamp', Date.now());
        localStorage.setItem('username', trimmedUsername);

        setIsLoggedIn(true);
        console.log('User logged in, navigating to home...');
        navigate('/home');
      } else {
        showError(data.message || 'Invalid login credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      showError('An error occurred. Please try again.');
    }
  };

  const validateToken = async (token) => {
    try {
      const response = await fetch('https://allchinafinds.com/wp-json/wp/v2/users/me', {
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      });

      if (!response.ok) {
        console.log('Token validation failed. Response status:', response.status);
        return false;
      }

      const userData = await response.json();
      console.log('User data from token validation:', userData);

      const hasProAccess = 
        userData.subscription_status === 'active' && (
          userData.membership_level === 3 ||
          userData.membership_level === '3' ||
          (userData.membership_level?.id === 3) ||
          (userData.membership_level?.name && userData.membership_level.name.includes('Pro'))
        );

      if (!hasProAccess) {
        console.log('User does not have Pro access');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  const showError = (message) => {
    setLoginError(message);
    console.log('Error message set:', message);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUsername('');
    setPassword('');
    setIsLoggedIn(false);
    console.log('User logged out.');
    navigate('/');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Routes>
      {/* Login Route */}
      <Route path="/" element={
        isLoggedIn ? (
          <Navigate to="/home" />
        ) : (
          <div className="login-container">
            <div className="logo">
              <img src={logo} alt="AllChinaFinds Logo" />
            </div>

            <div id="loginError" dangerouslySetInnerHTML={{ __html: loginError }}></div>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
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
              />
            </div>

            <button id="loginButton" type="button" onClick={handleLogin}>
              Log In
            </button>

            <div className="signup-link">
              Don't have an account?
              <a href="https://allchinafinds.com/membership-levels/" id="signUpButton">Sign Up</a>
            </div>
          </div>
        )
      } />

      {/* Protected Routes */}
      <Route element={<Layout />}>
        <Route
          path="/home"
          element={isLoggedIn ? <Home handleLogout={handleLogout} /> : <Navigate to="/" />}
        />
        <Route
          path="/setup-bot"
          element={isLoggedIn ? <SetupBot handleLogout={handleLogout} /> : <Navigate to="/" />}
        />
        <Route
          path="/manage-bots"
          element={isLoggedIn ? <ManageBot handleLogout={handleLogout} /> : <Navigate to="/" />}
        />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;