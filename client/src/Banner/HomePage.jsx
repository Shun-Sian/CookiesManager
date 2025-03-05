import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import LoginPopup from '../Admin/LoginPopup';
import CookieConsent from './CookieConsent';
import HomeNav from './HomeNav';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import '../Styles/home-page.css';

function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showProductFormPopup, setShowProductFormPopup] = useState(false);

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

  const toggleProductFormPopup = () => {
    setShowProductFormPopup(!showProductFormPopup);
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

      {isLoggedIn && (
        <button onClick={toggleProductFormPopup} className="add-product-button">
          Add Product
        </button>
      )}

      {showProductFormPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <ProductForm ownerId={userId} onClose={toggleProductFormPopup} />
          </div>
        </div>
      )}
      <ProductList />

      <CookieConsent />
    </div>
  );
}

export default HomePage;
