import React, { useState, FormEvent } from 'react';
import type { LoginPopupProps } from '../types/LoginPopup.types';
import api from '../utils/api';
import '../Styles/login-popup.css';

export default function LoginPopup(props: LoginPopupProps) {
  const { onClose, onLoginSuccess } = props;
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post('/login', { username, password });
      const token = response.data.token;

      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      onLoginSuccess();
    } catch (error) {
      console.error('Login failed:', error);
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
