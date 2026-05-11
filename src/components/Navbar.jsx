import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Home, Briefcase, Code, Monitor, Mail } from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Scroll Spy Logic
      const sections = ['about', 'experience', 'projects', 'explorations', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            setActiveSection(section);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about', id: 'about', icon: <Home size={20} /> },
    { name: 'Exp', href: '#experience', id: 'experience', icon: <Briefcase size={20} /> },
    { name: 'Works', href: '#projects', id: 'projects', icon: <Code size={20} /> },
    { name: 'Lab', href: '#explorations', id: 'explorations', icon: <Monitor size={20} /> },
    { name: 'Contact', href: '#contact', id: 'contact', icon: <Mail size={20} /> },
  ];

  return (
    <>
      <header className={`navbar ${isScrolled ? 'nav-scrolled' : ''}`}>
        <motion.div 
          className="scroll-progress" 
          style={{ scaleX, transformOrigin: "0%" }} 
          animate={{ opacity: isScrolled ? 1 : 0 }}
        />
        
        <div className="container nav-container">
          <a href="#about" className="nav-logo">
            Aries <span className="logo-thin">J.M</span>
          </a>

          <div className="nav-actions">
            {/* Desktop Nav */}
            <nav className="nav-desktop">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
                >
                  {link.name}
                </a>
              ))}
              <a href="#contact" className="btn btn-primary nav-btn-sm">Let's Talk</a>
            </nav>
            
            {/* Theme Switcher always in the top right for mobile/desktop header */}
            <div className="nav-theme-toggle">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        {navLinks.map((link) => (
          <a 
            key={link.name} 
            href={link.href} 
            className={`bottom-nav-link ${activeSection === link.id ? 'active' : ''}`}
            onClick={() => setActiveSection(link.id)}
          >
            <div className="bottom-nav-icon">{link.icon}</div>
            <span className="bottom-nav-text">{link.name}</span>
          </a>
        ))}
      </nav>
    </>
  );
};

export default Navbar;
