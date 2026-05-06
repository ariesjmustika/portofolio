import React, { useState, useEffect } from 'react';
import { Palette, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './ThemeSwitcher.css';

export const themes = [
  {
    id: 'midnight',
    name: 'Midnight Cyber',
    accent: '#00f0ff',
    glow: 'rgba(0, 240, 255, 0.2)',
    hover: '#00d4ff',
    bgPrimary: '#0a0a0a',
    bgSecondary: '#171717',
    bgTertiary: '#262626',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8'
  },
  {
    id: 'forest',
    name: 'Deep Forest',
    accent: '#10b981',
    glow: 'rgba(16, 185, 129, 0.2)',
    hover: '#34d399',
    bgPrimary: '#051f15',
    bgSecondary: '#064e3b',
    bgTertiary: '#065f46',
    textPrimary: '#ecfdf5',
    textSecondary: '#a7f3d0'
  },
  {
    id: 'royal',
    name: 'Royal Purple',
    accent: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.2)',
    hover: '#c084fc',
    bgPrimary: '#1e1b4b',
    bgSecondary: '#312e81',
    bgTertiary: '#3730a3',
    textPrimary: '#e0e7ff',
    textSecondary: '#a5b4fc'
  },
  {
    id: 'sunset',
    name: 'Sunset Dark',
    accent: '#f97316',
    glow: 'rgba(249, 115, 22, 0.2)',
    hover: '#ea580c',
    bgPrimary: '#1c1917',
    bgSecondary: '#292524',
    bgTertiary: '#44403c',
    textPrimary: '#fafaf9',
    textSecondary: '#a8a29e'
  },
  {
    id: 'light',
    name: 'Clean Light',
    accent: '#2563eb',
    glow: 'rgba(37, 99, 235, 0.2)',
    hover: '#1d4ed8',
    bgPrimary: '#ffffff',
    bgSecondary: '#f8fafc',
    bgTertiary: '#e2e8f0',
    textPrimary: '#0f172a',
    textSecondary: '#475569'
  }
];


const ThemeSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState('light');


  // Load saved theme on initial mount
  useEffect(() => {
    const savedThemeId = localStorage.getItem('portfolio-theme') || 'light';
    const theme = themes.find(t => t.id === savedThemeId);
    if (theme) {
      applyTheme(theme);
      setActiveTheme(theme.id);
    }

  }, []);

  const applyTheme = (theme) => {
    const root = document.documentElement;
    // Set Accent
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-glow', theme.glow);
    root.style.setProperty('--accent-hover', theme.hover);
    
    // Set Backgrounds
    root.style.setProperty('--bg-primary', theme.bgPrimary);
    root.style.setProperty('--bg-secondary', theme.bgSecondary);
    root.style.setProperty('--bg-tertiary', theme.bgTertiary);
    
    // Set Text
    root.style.setProperty('--text-primary', theme.textPrimary);
    root.style.setProperty('--text-secondary', theme.textSecondary);
    
    // Update the hero glow directly
    root.style.setProperty('--hero-glow-color', `rgba(${hexToRgb(theme.accent)}, 0.15)`);
    
    localStorage.setItem('portfolio-theme', theme.id);
    setActiveTheme(theme.id);
  };

  // Helper to convert hex to rgb for the hero glow
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
      : '0, 240, 255';
  };

  return (
    <div className="theme-switcher-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="theme-panel card"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="theme-panel-header">
              <h3 className="theme-panel-title">Select Accent</h3>
              <button onClick={() => setIsOpen(false)} className="close-btn">
                <X size={18} />
              </button>
            </div>
            
            <div className="theme-grid">
              {themes.map(theme => (
                <button
                  key={theme.id}
                  className={`theme-btn ${activeTheme === theme.id ? 'active' : ''}`}
                  onClick={() => applyTheme(theme)}
                  style={{ '--theme-color': theme.accent }}
                  title={theme.name}
                >
                  <span className="theme-color-dot" style={{ backgroundColor: theme.bgPrimary, border: `2px solid ${theme.accent}` }}></span>
                  <span className="theme-name">{theme.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        className="theme-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle theme selector"
      >
        <Palette size={24} />
      </button>
    </div>
  );
};

export default ThemeSwitcher;
