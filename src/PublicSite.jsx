import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useParams, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import SmoothScroll from './components/SmoothScroll';

import HomePage from './pages/HomePage';
import ExcellencePage from './pages/ExcellencePage';
import ContactPage from './pages/ContactPage';
import VehiclesPage from './pages/VehiclesPage';
import ReservationPage from './pages/ReservationPage';
import SpecialRequestPage from './pages/SpecialRequestPage';
import ReservationSuccessPage from './pages/ReservationSuccessPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
}

function PublicSite() {
  const { city } = useParams();
  const location = useLocation();
  const validCities = ['paris', 'bordeaux', 'french-riviera', 'london'];

  if (!validCities.includes(city)) {
    return <Navigate to="/paris" replace />;
  }

  const isHome = location.pathname === `/${city}` || location.pathname === `/${city}/`;

  return (
    <SmoothScroll>
      <div className="app-container">
        <ScrollToTop />
        <Navbar isHome={isHome} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/excellence" element={<ExcellencePage />} />
            <Route path="/vehicules" element={<VehiclesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/reserver" element={<ReservationPage />} />
            <Route path="/demande-specifique" element={<SpecialRequestPage />} />
            <Route path="/reservation-succes" element={<ReservationSuccessPage />} />
            <Route path="/politique-de-confidentialite" element={<PrivacyPolicyPage />} />
          </Routes>
        </main>
        <Footer />
        <FloatingActions />
      </div>
    </SmoothScroll>
  );
}

export default PublicSite;
