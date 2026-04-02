import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ArtCraftPage from './pages/ArtCraftPage';
import ConstructionPage from './pages/ConstructionPage';
import LandDevelopmentPage from './pages/LandDevelopmentPage';
import ContactPage from './pages/ContactPage';
import Login from './pages/Auth/Login';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />; // Redirect back to home if not admin
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="art-and-craft" element={<ArtCraftPage />} />
            <Route path="constructions" element={<ConstructionPage />} />
            <Route path="land-development" element={<LandDevelopmentPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<Login />} />
          </Route>

          {/* Admin Routes (Isolated from Website Layout) */}
          <Route 
            path="admin" 
            element={
              <PrivateRoute adminOnly={true}>
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
