import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
const AdminLayout = React.lazy(() => import('./layouts/AdminLayout'));

// Pages (Home and NotFound loaded immediately for better UX on entry/errors)
import Home from './pages/public/Home';
import NotFound from './pages/NotFound';

// Lazy load Admin Pages
const Login = React.lazy(() => import('./pages/admin/Login'));
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const AdminMessages = React.lazy(() => import('./pages/admin/AdminMessages'));
const AdminHero = React.lazy(() => import('./pages/admin/AdminHero'));
const AdminExperience = React.lazy(() => import('./pages/admin/AdminExperience'));
const AdminProjects = React.lazy(() => import('./pages/admin/AdminProjects'));
const AdminExplorations = React.lazy(() => import('./pages/admin/AdminExplorations'));

import './App.css';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<div className="loading-screen"><div className="loader"></div></div>}>
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
                <Route path="/admin/explorations" element={<AdminExplorations />} />
                <Route path="/admin/messages" element={<AdminMessages />} />
                <Route path="/admin/settings" element={<div>Settings Component (Coming Soon)</div>} />
              </Route>
            </Route>


            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;

