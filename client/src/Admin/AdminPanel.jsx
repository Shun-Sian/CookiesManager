import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CookiesManager from './CookiesManager';
import ProductManager from './ProductManager';
import LoginPopup from './LoginPopup';
import AdminNav from './AdminNav';
import '../Styles/admin-panel.css';

const AdminPanel = () => {
  const [subsections, setSubsections] = useState([]);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState('cookies-manager');
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

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSubsections([]);
  };

  const handleAddSubsection = () => {
    setSubsections((prev) => [...prev, { adminId: 1 }]);
  };

  return (
    <div className="adminPanel-container">
      <AdminNav
        isLoggedIn={isLoggedIn}
        setShowLoginPopup={setShowLoginPopup}
        onLogout={handleLogout}
        setActiveView={setActiveView}
      />
      {showLoginPopup && (
        <LoginPopup
          onClose={handlePopupClose}
          onLoginSuccess={() => {
            setShowLoginPopup(false);
            setIsLoggedIn(true);
          }}
        />
      )}
      <div className="adminPanel-body">
        {activeView === 'cookies-manager' && (
          <CookiesManager
            subsections={subsections}
            onAddSubsection={handleAddSubsection}
            onUpdateSubsection={saveOrUpdate}
            onDeleteSubsection={deletePref}
          />
        )}
        {activeView === 'product-manager' && <ProductManager />}
      </div>
    </div>
  );
};

export default AdminPanel;
