/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
// import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminPanel from './Admin/AdminPanel';
import CookieConsent from './Banner/CookieConsent';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<CookieConsent />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
