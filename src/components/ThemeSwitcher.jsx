import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import './ThemeSwitcher.css';

export const themes = [
  {
    id: 'midnight',
    name: 'Dark',
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
    id: 'light',
    name: 'Light',
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
    
    // Set Border Color based on theme brightness
    const isLight = theme.id === 'light';
    root.style.setProperty('--border-color', isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.1)');
    
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

  const toggleTheme = () => {
    const newThemeId = activeTheme === 'light' ? 'midnight' : 'light';
    const theme = themes.find(t => t.id === newThemeId);
    if (theme) {
      applyTheme(theme);
    }
  };

  return (
    <div className="theme-switcher-container">
      <motion.button 
        className="theme-toggle-btn"
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle Theme"
        title="Toggle Theme"
      >
        <motion.div
          initial={false}
          animate={{ rotate: activeTheme === 'light' ? 0 : 360 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="toggle-icon-wrap"
        >
          {activeTheme === 'light' ? <Moon size={22} className="moon-icon" /> : <Sun size={22} className="sun-icon" />}
        </motion.div>
      </motion.button>
    </div>
  );
};

export default ThemeSwitcher;
