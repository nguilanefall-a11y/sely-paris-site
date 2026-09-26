import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import SmoothScroll from './components/SmoothScroll';
import AmbientGleam from './components/AmbientGleam';
import './App.css';

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

export default function JournalLayout({ children }) {
  return (
    <SmoothScroll>
      <div className="app-container">
        <AmbientGleam />
        <ScrollToTop />
        <Navbar isHome={false} />
        <main>{children}</main>
        <Footer />
        <FloatingActions />
      </div>
    </SmoothScroll>
  );
}
