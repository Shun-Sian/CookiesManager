/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
// import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminLogin from './Admin/AdminLogin';
import CookieConsent from './Banner/CookieConsent';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<CookieConsent />} />
          <Route path="/admin" element={<AdminLogin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
