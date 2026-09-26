import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PortalPage from './pages/PortalPage';
import PublicSite from './PublicSite';
import ReservationSuccessPage from './pages/ReservationSuccessPage';
import PageLoader from './components/PageLoader';

const AdminRouter = lazy(() => import('./admin/AdminRouter'));

function App() {
  return (
    <BrowserRouter>
      <PageLoader />
      <Routes>
        <Route path="/" element={<Navigate to="/paris" replace />} />
        <Route path="/portal" element={<PortalPage />} />
        <Route path="/reservation-succes" element={<ReservationSuccessPage />} />
        <Route path="/:city/*" element={<PublicSite />} />
        <Route
          path="/sely-office/*"
          element={
            <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0a0a' }} />}>
              <AdminRouter />
            </Suspense>
          }
        />
        {/* Fallback to /paris if invalid path */}
        <Route path="*" element={<Navigate to="/paris" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
