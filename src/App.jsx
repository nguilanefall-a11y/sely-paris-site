import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PortalPage from './pages/PortalPage';
import PublicSite from './PublicSite';
import AdminRouter from './admin/AdminRouter';
import ReservationSuccessPage from './pages/ReservationSuccessPage';

function App() {
  return (
    <BrowserRouter>
      <PageLoader />
      <Routes>
        <Route path="/" element={<PortalPage />} />
        <Route path="/reservation-succes" element={<ReservationSuccessPage />} />
        <Route path="/:city/*" element={<PublicSite />} />
        <Route path="/sely-office/*" element={<AdminRouter />} />
        {/* Fallback to root portal if invalid path */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
