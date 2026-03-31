import React from 'react';
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Values from './components/Values';
import AboutUs from './components/AboutUs';
import Pillars from './components/Pillars';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import ContactForm from './components/ContactForm';
import MapSection from './components/MapSection';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <TopBar />
      <Navbar />
      <main>
        <Hero />
        <Values />
        <AboutUs />
        <Pillars />
        <Services />
        <Portfolio />
        <ContactForm />
        <MapSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
