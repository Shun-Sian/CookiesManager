import React, { useState, useEffect } from 'react';

const CookieConsent = ({ subsections, onUpdateSubsections }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <p style={styles.message}>
          We use cookies to improve your experience. By continuing to browse the site, you agree to our use of cookies.
        </p>

        {subsections.map((subsection) => (
          <div key={subsection.id} style={styles.subsection}>
            <p>{subsection.title}</p>
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
