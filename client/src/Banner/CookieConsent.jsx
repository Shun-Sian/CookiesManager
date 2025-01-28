/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import ExpandableText from '../Banner/ExpandableText';
import '../Styles/cookies-consent.css';

const CookieConsent = ({ subsections }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [preferences, setPreferences] = useState([]);

  async function fetchPreferences() {
    return await fetch('http://localhost:3001/get-all-preferences').then((response) => response.json());
  }

  useEffect(() => {
    fetchPreferences().then((references) => {
      setPreferences(references);
    });
  }, []);

  const handleAccept = () => {
    sessionStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    setIsVisible(false);
  };

  return (
    <div className="cookiesConcsent-container">
      <div className="cookiesConcsent-popup">
        <h2>Let us know you agree to advertising cookies</h2>
        <p className="cookiesConsent-description">
          We use cookies to improve your experience. By continuing to browse the site, you agree to our use of cookies.
        </p>
        {preferences.map((subsection) => (
          <div key={subsection._id}>
            <ExpandableText title={subsection.title} description={subsection.content} />
          </div>
        ))}
        <div className="cookiesConsent-agreementButtons">
          <button className="agreementButtons-button" onClick={handleDecline}>
            I do not agree
          </button>
          <button className="agreementButtons-button" onClick={handleAccept}>
            I agree
          </button>
        </div>
        <button className="cookiesConsent-optionsButton">Manage Options</button>
      </div>
    </div>
  );
};

export default CookieConsent;
