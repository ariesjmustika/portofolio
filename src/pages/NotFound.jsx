import React from 'react';
import { m } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <m.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="error-code"
        >
          404
        </m.div>
        
        <m.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Oops! Page Not Found
        </m.h1>
        
        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </m.p>
        
        <m.div 
          className="not-found-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button onClick={() => navigate(-1)} className="btn btn-outline">
            <ArrowLeft size={18} /> Go Back
          </button>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            <Home size={18} /> Back to Home
          </button>
        </m.div>
      </div>
      
      {/* Decorative background elements */}
      <div className="not-found-bg">
        <div className="blob"></div>
        <div className="blob"></div>
      </div>
    </div>
  );
};

export default NotFound;
