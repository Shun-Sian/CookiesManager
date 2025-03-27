import React from 'react';
import type { HomeNavProps } from '../types/HomeNav.types';
import '../Styles/home-nav.css';

export default function HomeNav(props: HomeNavProps) {
  const { isLoggedIn, setShowLoginPopup, onLogout } = props;
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

  return (
    <div className="homeNav-container">
      <h3 className="homeNav-title">BestOffers.com</h3>
      <div className="homeNav-right">
        {isLoggedIn ? (
          <button className="homeNav-authButton" onClick={handleLogoutClick}>
            Logout
          </button>
        ) : (
          <button className="homeNav-authButton" onClick={handleLoginClick}>
            Login
          </button>
        )}
      </div>
    </div>
  );
}
