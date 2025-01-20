import React, { useState, useEffect } from 'react';
// import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CookieConsent from './components/CookieConsent';
import AdminLogin from './components/AdminLogin';

function App() {
  const [subsections, setSubsections] = useState([]);

  useEffect(() => {
    // Load subsections from localStorage, if available
    const storedSubsections = JSON.parse(localStorage.getItem('subsections'));
    if (storedSubsections) {
      setSubsections(storedSubsections);
    }
  }, []);

  const handleUpdateSubsections = (newSubsections) => {
    setSubsections(newSubsections);
    localStorage.setItem('subsections', JSON.stringify(newSubsections)); // Save subsections to localStorage
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Route for normal users */}
          <Route
            path="/"
            element={<CookieConsent subsections={subsections} onUpdateSubsections={handleUpdateSubsections} />}
          />

          {/* Route for admin login */}
          <Route path="/admin" element={<AdminLogin onLogin={setSubsections} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
