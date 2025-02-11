import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PreferenceSection from './PreferenceSection';
import LoginPopup from './LoginPopup';
import AdminNav from './AdminNav';
import '../Styles/admin-panel.css';

const AdminPanel = () => {
  const [subsections, setSubsections] = useState([]);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowLoginPopup(true);
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  async function fetchPreferences() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/get-all-preferences', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubsections(response.data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetchPreferences();
    }
  }, [isLoggedIn]);

  async function saveOrUpdate(section) {
    try {
      const token = localStorage.getItem('token');
      if (section._id) {
        const response = await axios.post(`http://localhost:3001/update-preference/${section._id}`, section, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Successfully updated preference:', response.data.preference);
      } else {
        const response = await axios.post('http://localhost:3001/add-preference', section, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Successfully added preference:', response.data.preference);
      }
      fetchPreferences();
    } catch (error) {
      console.error('Error saving/updating preference:', error);
    }
  }

  async function deletePref(section) {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3001/delete-preference/${section._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPreferences();
    } catch (error) {
      console.error('Error deleting preference:', error);
    }
  }

  const handlePopupClose = () => {
    if (!isLoggedIn) {
      navigate('/');
    }
    setShowLoginPopup(false);
  };

  return (
    <>
      <AdminNav onLoginClick={() => setShowLoginPopup(true)} />
      <div className="preferences-container">
        {showLoginPopup && (
          <LoginPopup
            onClose={handlePopupClose}
            onLoginSuccess={() => {
              setShowLoginPopup(false);
              setIsLoggedIn(true);
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
    </>
  );
};

export default AdminPanel;
