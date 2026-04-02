import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ArtCraftPage from './pages/ArtCraftPage';
import ConstructionPage from './pages/ConstructionPage';
import LandDevelopmentPage from './pages/LandDevelopmentPage';
import ContactPage from './pages/ContactPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="art-and-craft" element={<ArtCraftPage />} />
          <Route path="constructions" element={<ConstructionPage />} />
          <Route path="land-development" element={<LandDevelopmentPage />} />
          <Route path="contact" element={<ContactPage />} />
          {/* Add more routes here as needed */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
