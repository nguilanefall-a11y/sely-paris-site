import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCity } from '../hooks/useCity';
import Hero from '../components/Hero';
import About from '../components/About';
import HowItWorks from '../components/HowItWorks';
import Services from '../components/Services';
import Vehicle from '../components/Vehicle';
import Booking from '../components/Booking';
import SectionDivider from '../components/SectionDivider';
import VoyagesPage from './VoyagesPage';
import BottomAppNav from '../components/BottomAppNav';
import styles from './HomePage.module.css';

export default function HomePage({ initialTab = 'home' }) {
  const { getCityPath } = useCity();
  const location = useLocation();
  const navigate = useNavigate();

  const isVoyagesRoute = location.pathname.includes('/voyages');
  const [activeTab, setActiveTab] = useState(isVoyagesRoute || initialTab === 'voyages' ? 'voyages' : 'home');

  useEffect(() => {
    if (location.pathname.includes('/voyages')) {
      setActiveTab('voyages');
    } else if (location.pathname.endsWith('/paris') || location.pathname.endsWith('/paris/')) {
      setActiveTab('home');
    }
  }, [location.pathname]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    if (newTab === 'voyages') {
      navigate(getCityPath('/voyages'), { replace: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      navigate(getCityPath('/'), { replace: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  // Touch Swipe Gestures
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    const diffY = e.changedTouches[0].clientY - touchStartY.current;

    // Detect dominant horizontal swipe with threshold
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 45) {
      if (diffX < 0 && activeTab === 'home') {
        // Swiped left -> transition to voyages
        handleTabChange('voyages');
      } else if (diffX > 0 && activeTab === 'voyages') {
        // Swiped right -> transition back to home
        handleTabChange('home');
      }
    }
  };

  return (
    <div
      className={styles.appSliderWrapper}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={styles.appSliderTrack}
        style={{
          transform: activeTab === 'voyages' ? 'translateX(-50%)' : 'translateX(0%)',
        }}
      >
        {/* SLIDE 1 : ACCUEIL */}
        <div className={styles.slideAccueil}>
          <Hero hideBottomNav={true} />
          <Vehicle />
          <SectionDivider />
          <About />
          <SectionDivider />
          <HowItWorks />
          <SectionDivider />
          <Services />
          <SectionDivider />
          <Booking />
        </div>

        {/* SLIDE 2 : VOYAGES (Slides seamlessly into view) */}
        <div className={styles.slideVoyages}>
          <VoyagesPage hideBottomNav={true} />
        </div>
      </div>

      {/* Persistent Bottom Floating Capsule matching media_1790590617904.png */}
      <BottomAppNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
}
