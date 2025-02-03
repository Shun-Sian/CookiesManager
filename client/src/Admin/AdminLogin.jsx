/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import PreferenceSection from './PreferenceSection';
import LoginPopup from './LoginPopup'; // Import the LoginPopup component
import axios from 'axios'; // Import axios for making HTTP requests
import '../Styles/admin-login.css';

const AdminLogin = () => {
  const [subsections, setSubsections] = useState([]);
  const [showLoginPopup, setShowLoginPopup] = useState(true); // State to control popup visibility
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  async function fetchPreferences() {
    return await fetch('http://localhost:3001/get-all-preferences').then((response) => response.json());
  }

  useEffect(() => {
    fetchPreferences().then((references) => {
      setSubsections(references);
    });
  }, []);

  async function saveOrUpdate(section) {
    console.log('saveOrUpdate:', section);
    if (section._id) {
      try {
        const response = await fetch(`http://localhost:3001/update-preference/${section._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(section),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Successfully added preference:', data.preference);
        } else {
          console.error('Error adding preference');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      try {
        const response = await fetch('http://localhost:3001/add-preference', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(section),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Successfully added preference:', data.preference);
        } else {
          console.error('Error adding preference');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
    fetchPreferences().then((references) => {
      setSubsections(references);
    });
  }

  async function deletePref(section) {
    console.log('delete:', section);
    const response = await fetch(`http://localhost:3001/delete-preference/${section._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    fetchPreferences().then((references) => {
      setSubsections(references);
    });
  }

  // console.log('subsections:', subsections);

  return (
    <div className="preferences-container">
      <h2>Admin Panel</h2>
      {!isLoggedIn && (
        <button className="preferences-button" onClick={() => setShowLoginPopup(true)}>
          Login
        </button>
      )}
      {showLoginPopup && (
        <LoginPopup
          onClose={() => setShowLoginPopup(false)}
          onLoginSuccess={() => {
            setIsLoggedIn(true);
            setShowLoginPopup(false);
            console.log('Login button clicked, showLoginPopup:');
          }}
        />
      )}
      <h3>Manage Subsections</h3>
      <button className="preferences-button" onClick={() => setSubsections((prev) => [...prev, { adminId: 1 }])}>
        Add Subsection
      </button>

      {subsections.map((subsection, index) => (
        <PreferenceSection
          key={index}
          subsection={subsection}
          onUpdate={(section) => saveOrUpdate(section)}
          onDelete={(section) => deletePref(section)}
        />
      ))}
    </div>
  );
};

export default AdminLogin;
