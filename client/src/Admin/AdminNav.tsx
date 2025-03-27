import React from 'react';
import type { AdminNavProps } from '../types/AdminNav.types';
import '../Styles/admin-nav.css';

export default function AdminNav(props: AdminNavProps) {
  const { isLoggedIn, setShowLoginPopup, onLogout, setActiveView } = props;
  const handleLoginClick = () => {
    setShowLoginPopup(true);
  };

  const handleLogoutClick = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      localStorage.removeItem('token');
      onLogout();
    }
  };

  const handleCookiesManagerClick = () => {
    setActiveView('cookies-manager');
  };

  const handleProductManagerClick = () => {
    setActiveView('product-manager');
  };

  return (
    <div className="adminNav-container">
      {isLoggedIn ? (
        <div className="adminNav-left">
          <button className="adminNav-cookieManagerButton" onClick={handleCookiesManagerClick}>
            Cookies Manager
          </button>
          <button className="adminNav-productManagerButton" onClick={handleProductManagerClick}>
            Product Manager
          </button>
        </div>
      ) : (
        <div className="adminNav-left"></div>
      )}
      <h3 className="adminNav-header">Admin Panel</h3>
      <div className="adminNav-right">
        {isLoggedIn ? (
          <button className="adminNav-authButton" onClick={handleLogoutClick}>
            Logout
          </button>
        ) : (
          <button className="adminNav-authButton" onClick={handleLoginClick}>
            Login
          </button>
        )}
      </div>
    </div>
  );
}
