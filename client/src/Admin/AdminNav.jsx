import React from 'react';
import '../Styles/admin-nav.css';

function AdminNav({ isLoggedIn, setShowLoginPopup, onLogout }) {
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
    <div className="adminNav-container">
      <button className="adminNav-cookieManagerButton">Cookies Manager</button>
      <h3 className="adminNav-header">Admin Panel</h3>
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
  );
}

export default AdminNav;
