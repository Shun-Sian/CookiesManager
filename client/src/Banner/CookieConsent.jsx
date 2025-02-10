import React, { useEffect, useState } from 'react';
import ExpandableText from '../Banner/ExpandableText';
import '../Styles/cookies-consent.css';

const CookieConsent = ({ subsections }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [preferences, setPreferences] = useState([]);

  async function fetchPreferences() {
    try {
      const response = await fetch('http://localhost:3001/get-all-preferences');
      if (!response.ok) {
        throw new Error('Failed to fetch preferences');
      }
      const data = await response.json();
      setPreferences(data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      setPreferences([]); // Fallback to an empty array if the request fails
    }
  }

  useEffect(() => {
    fetchPreferences();
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
