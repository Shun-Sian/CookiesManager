import React from 'react';

function AdminNav({ onLoginClick }) {
  return (
    <div className="adminNav-container">
      <h2>Admin Panel</h2>
      <button className="preferences-button" onClick={onLoginClick}>
        Login
      </button>
    </div>
  );
}

export default AdminNav;
