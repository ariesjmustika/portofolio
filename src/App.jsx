import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import AdminLayout from './layouts/AdminLayout';

// Pages
import Home from './pages/public/Home';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminMessages from './pages/admin/AdminMessages';
import AdminHero from './pages/admin/AdminHero';
import AdminExperience from './pages/admin/AdminExperience';
import AdminProjects from './pages/admin/AdminProjects';
import NotFound from './pages/NotFound';

import './App.css';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/hero" element={<AdminHero />} />
              <Route path="/admin/experience" element={<AdminExperience />} />
              <Route path="/admin/projects" element={<AdminProjects />} />
              <Route path="/admin/messages" element={<AdminMessages />} />
              <Route path="/admin/settings" element={<div>Settings Component (Coming Soon)</div>} />
            </Route>
          </Route>


          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

