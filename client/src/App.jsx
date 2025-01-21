/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
// import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminLogin from './Admin/AdminLogin';
import CookieConsent from './Banner/CookieConsent';

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
          <Route
            path="/"
            element={<CookieConsent subsections={subsections} onUpdateSubsections={handleUpdateSubsections} />}
          />
          <Route path="/admin" element={<AdminLogin onLogin={setSubsections} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
