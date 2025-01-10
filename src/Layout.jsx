import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sideBar'; // Adjust the path as necessary
import './sideBar.css'; // Ensure sidebar styles are imported

const Layout = () => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Outlet /> {/* This will render the child routes */}
      </div>
    </div>
  );
};

export default Layout;