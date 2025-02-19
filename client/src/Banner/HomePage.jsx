import React, { useState } from 'react';
import LoginPopup from '../Admin/LoginPopup';
import CookieConsent from './CookieConsent';
import HomeNav from './HomeNav';

function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handlePopupClose = () => {
    setShowLoginPopup(false);
  };

  const handleLogout = () => {
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
    </div>
  );
}

export default HomePage;
