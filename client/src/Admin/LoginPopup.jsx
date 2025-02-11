import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/login-popup.css';

function LoginPopup({ onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/login', { username, password });
      console.log('Server response:', response.data);

      localStorage.setItem('token', response.data.token);
      onLoginSuccess();
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Error logging in');
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2 className="popup-title">Admin Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Username:</label>
          <input placeholder="Enter Username" onChange={(e) => setUsername(e.target.value)} />
          <label>Password:</label>
          <input type="password" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} />
          <button className="login-button" type="submit">
            Login
          </button>
        </form>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default LoginPopup;
