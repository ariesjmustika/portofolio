import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Terminal } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  const errorDetails = {
    status: 404,
    error: "PATH_NOT_FOUND",
    message: "Node not registered in routing table.",
    origin: window.location.pathname
  };

  return (
    <div className="not-found-page admin-theme">
      <div className="grid-bg"></div>
      
      <div className="not-found-content">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="error-blueprint"
        >
          404
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="terminal-box"
        >
          <div className="terminal-header">
            <div className="terminal-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="terminal-title">
              <Terminal size={14} /> system_logs.json
            </div>
          </div>
          <div className="terminal-body">
            <pre>
              <code>
                {JSON.stringify(errorDetails, null, 2)}
              </code>
            </pre>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="technical-heading"
        >
          SYSTEM_RESOURCE_MISSING
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          The system encountered an invalid entry point. The path you are attempting to access does not exist in our current architecture.
        </motion.p>
        
        <motion.div 
          className="not-found-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button onClick={() => navigate(-1)} className="btn btn-outline">
            <ArrowLeft size={18} /> System Check (Back)
          </button>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            <Home size={18} /> Re-route to Home
          </button>
        </motion.div>
      </div>

      <div className="not-found-glow"></div>
    </div>
  );
};

export default NotFound;
