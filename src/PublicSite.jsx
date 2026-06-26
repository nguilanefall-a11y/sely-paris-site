import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import SmoothScroll from './components/SmoothScroll';

import HomePage from './pages/HomePage';
import ExcellencePage from './pages/ExcellencePage';
import ContactPage from './pages/ContactPage';
import VehiclesPage from './pages/VehiclesPage';
import ReservationPage from './pages/ReservationPage';
import SpecialRequestPage from './pages/SpecialRequestPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Use Lenis if available, otherwise fallback
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
}

function PublicSite() {
  const location = useLocation();
  const isHome = location.pathname === '/';

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
            <Route path="/politique-de-confidentialite" element={<PrivacyPolicyPage />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </SmoothScroll>
  );
}

export default PublicSite;
