import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import LoginPopup from '../Admin/LoginPopup';
import CookieConsent from './CookieConsent';
import HomeNav from './HomeNav';
import ProductForm from './ProductForm';

function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.id);
    }
  }, []);

  const handlePopupClose = () => {
    setShowLoginPopup(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div className="homePage-container">
      {showLoginPopup && (
        <LoginPopup
          onClose={handlePopupClose}
          onLoginSuccess={() => {
            setShowLoginPopup(false);
            setIsLoggedIn(true);
          }}
        />
      )}
      <HomeNav isLoggedIn={isLoggedIn} setShowLoginPopup={setShowLoginPopup} onLogout={handleLogout} />
      <CookieConsent />
      <ProductForm ownerId={userId} />
    </div>
  );
}

export default HomePage;
