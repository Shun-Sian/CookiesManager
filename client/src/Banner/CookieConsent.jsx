/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';

const CookieConsent = ({ subsections }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [preferences, setPreferences] = useState([]);

  
  async function fetchPreferences() {
    return await fetch('http://localhost:3001/get-all-preferences').then((response) => response.json());
  };

  useEffect(() => {
    fetchPreferences().then(references => { setPreferences(references)});
  }, []);

  const handleAccept = () => {
    sessionStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    setIsVisible(false);
  };


  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <p style={styles.message}>
          We use cookies to improve your experience. By continuing to browse the site, you agree to our use of cookies.
        </p>

        {preferences.map((subsection) => (
          <div key={subsection._id} style={styles.subsection}>
            <h2>{subsection.title}</h2>
            <p>{subsection.content}</p>
          </div>
        ))}

        <div style={styles.buttons}>
          <button style={styles.button} onClick={handleAccept}>
            Accept
          </button>
          <button style={styles.button} onClick={handleDecline}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '300px',
    textAlign: 'center',
  },
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
