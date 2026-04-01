import React from 'react';
import Hero from '../components/Hero';
import Values from '../components/Values';
import AboutUs from '../components/AboutUs';
import Pillars from '../components/Pillars';
import Antiques from '../components/Antiques';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import ContactForm from '../components/ContactForm';
import MapSection from '../components/MapSection';

const Home = () => {
  return (
    <>
      <Hero />
      <Values />
      <AboutUs />
      <Pillars />
      <Antiques />
      <Services />
      <Portfolio />
      <ContactForm />
      <MapSection />
    </>
  );
};

export default Home;
