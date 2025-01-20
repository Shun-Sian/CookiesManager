// src/AdminLogin.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [subsections, setSubsections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedSubsections = JSON.parse(localStorage.getItem('subsections'));
    if (storedSubsections) {
      setSubsections(storedSubsections);
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
      onLogin(true);
      navigate('/admin');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSubsections([]);
    navigate('/');
  };

  const handleAddSubsection = () => {
    const newSubsection = {
      id: Date.now(),
      title: 'New Subsection',
    };
    const updatedSubsections = [...subsections, newSubsection];
    setSubsections(updatedSubsections);
    localStorage.setItem('subsections', JSON.stringify(updatedSubsections));
  };

  const handleRemoveSubsection = (id) => {
    const updatedSubsections = subsections.filter((sub) => sub.id !== id);
    setSubsections(updatedSubsections);
    localStorage.setItem('subsections', JSON.stringify(updatedSubsections));
  };

  const handleEditSubsection = (id, newTitle) => {
    const updatedSubsections = subsections.map((sub) => (sub.id === id ? { ...sub, title: newTitle } : sub));
    setSubsections(updatedSubsections);
    localStorage.setItem('subsections', JSON.stringify(updatedSubsections));
  };

  return (
    <div style={styles.container}>
      {!isLoggedIn ? (
        <>
          <h2>Admin Login</h2>
          {error && <p style={styles.error}>{error}</p>}
          <div style={styles.inputContainer}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>
          <button onClick={handleLogin} style={styles.loginButton}>
            Login
          </button>
        </>
      ) : (
        <>
          <h2>Admin Panel</h2>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
          <h3>Manage Subsections</h3>
          <button onClick={handleAddSubsection} style={styles.addButton}>
            Add Subsection
          </button>
          <ul style={styles.subsectionsList}>
            {subsections.map((subsection) => (
              <li key={subsection.id} style={styles.subsectionItem}>
                <input
                  type="text"
                  value={subsection.title}
                  onChange={(e) => handleEditSubsection(subsection.id, e.target.value)}
                  style={styles.subsectionInput}
                />
                <button onClick={() => handleRemoveSubsection(subsection.id)} style={styles.removeButton}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  inputContainer: {
    marginBottom: '10px',
  },
  input: {
    padding: '8px 16px',
    fontSize: '14px',
    width: '100%',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  loginButton: {
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
  logoutButton: {
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '10px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
  addButton: {
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    marginBottom: '20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
  subsectionsList: {
    listStyleType: 'none',
    padding: 0,
  },
  subsectionItem: {
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subsectionInput: {
    padding: '8px 16px',
    fontSize: '14px',
    width: '70%',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  removeButton: {
    padding: '8px 16px',
    fontSize: '12px',
    cursor: 'pointer',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
  error: {
    color: 'red',
    fontSize: '12px',
  },
};

export default AdminLogin;
