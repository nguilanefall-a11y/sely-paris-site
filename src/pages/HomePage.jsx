import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import HowItWorks from '../components/HowItWorks';
import Services from '../components/Services';
import Vehicle from '../components/Vehicle';
import Experiences from '../components/Experiences';
import WineTours from '../components/WineTours';
import Booking from '../components/Booking';
import SectionDivider from '../components/SectionDivider';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Vehicle />
      <SectionDivider />
      <About />
      <SectionDivider />
      <HowItWorks />
      <SectionDivider />
      <Services />
      <SectionDivider />
      <Experiences />
      <SectionDivider />
      <WineTours />
      <SectionDivider />
      <Booking />
    </>
  );
}
