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
      <div className="cookiesConcsent-popup" style={styles.popup}>
        <h2>Let us know you agree to advertising cookies</h2>
        <p style={styles.message}>
          We use cookies to improve your experience. By continuing to browse the site, you agree to our use of cookies.
        </p>

        {preferences.map((subsection) => (
          <div key={subsection._id} style={styles.subsection}>
            <ExpandableText title={subsection.title} description={subsection.content} />
          </div>
        ))}

        <div style={styles.buttons}>
          <button style={styles.button} onClick={handleAccept}>
            I do not agree
          </button>
          <button style={styles.button} onClick={handleDecline}>
            I agree
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  message: {
    fontSize: '14px',
    marginBottom: '20px',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  subsection: {
    marginBottom: '10px',
    fontSize: '12px',
    textAlign: 'left',
  },
};

export default CookieConsent;
