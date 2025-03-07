import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import './Layout.css';

const Layout = ({ isLoggedIn }) => {
  return (
    <div className="app-container">
      <Header isLoggedIn={isLoggedIn} />
      <main className="main-content">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;