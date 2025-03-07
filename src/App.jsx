import { useState, useEffect, createContext } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Home from './Home/Home';
import SetupBot from './Pages/setupBot';
import ManageBot from './Pages/manageBot';
import ConvertCEToWC from './Pages/ConvertCEToWC';
import Login from './Pages/Login';
import Layout from './Layout';
import './App.css';

// Create auth context to share authentication state
export const AuthContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  // Function to update login state that can be called from Login component
  const updateLoginState = (loggedIn) => {
    console.log('Updating login state:', loggedIn);
    setIsLoggedIn(loggedIn);
  };

  useEffect(() => {
    console.log('Checking authentication status...');
    checkAuthStatus();
    
    // Add event listener for storage changes (for multi-tab support)
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Handle changes to localStorage (for multi-tab support)
  const handleStorageChange = (e) => {
    if (e.key === 'jwtToken' || e.key === 'hasProAccess') {
      checkAuthStatus();
    }
  };

  const checkAuthStatus = () => {
    console.log('Running checkAuthStatus');
    const token = localStorage.getItem('jwtToken');
    const hasProAccess = localStorage.getItem('hasProAccess');
    
    console.log('Token exists:', !!token);
    console.log('Has pro access:', hasProAccess);
    
    if (token && hasProAccess === 'true') {
      console.log('Setting isLoggedIn to true');
      setIsLoggedIn(true);
    } else {
      console.log('Setting isLoggedIn to false');
      setIsLoggedIn(false);
      
      // Only clear auth-related items, not all localStorage
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('username');
      localStorage.removeItem('hasProAccess');
      localStorage.removeItem('loginTimestamp');
    }
    
    setIsCheckingAuth(false);
  };

  if (isCheckingAuth) {
    return <div className="loading-auth">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, updateLoginState }}>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />

        {/* All routes with Layout */}
        <Route element={<Layout isLoggedIn={isLoggedIn} />}>
          {/* All routes are accessible, but functionality is limited based on login status */}
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route path="/home" element={<Navigate to="/" />} />
          <Route path="/setup-bot" element={<SetupBot isLoggedIn={isLoggedIn} />} />
          <Route path="/manage-bots" element={<ManageBot isLoggedIn={isLoggedIn} />} />
          <Route path="/convert-ce-to-wc" element={<ConvertCEToWC isLoggedIn={isLoggedIn} />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;