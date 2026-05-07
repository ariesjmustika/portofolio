import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X, Code, Briefcase, Mail, Globe } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Experience', href: '#experience', id: 'experience' },
    { name: 'Projects', href: '#projects', id: 'projects' },
    { name: 'Lab', href: '#explorations', id: 'explorations' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  const socialLinks = [
    { icon: <Code size={20} />, href: 'https://github.com/ariesjmustika' },
    { icon: <Briefcase size={20} />, href: 'https://linkedin.com/in/ariesjmustika' },
    { icon: <Globe size={20} />, href: 'https://twitter.com' },
    { icon: <Mail size={20} />, href: 'mailto:aries@ariesjakaradytia.com' },
  ];

  return (
    <header className={`navbar ${isScrolled ? 'nav-scrolled' : ''}`}>
      <motion.div 
        className="scroll-progress" 
        style={{ scaleX, transformOrigin: "0%" }} 
        animate={{ opacity: isScrolled ? 1 : 0 }}
      />
      
      <div className="container nav-container">
        <a href="#about" className="nav-logo">
          Aries <span className="logo-thin">Jakaradytia Mustika</span>
        </a>

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

        {/* Mobile Nav Toggle */}
        <button 
          className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="mobile-menu-content">
                <nav className="mobile-nav">
                  {navLinks.map((link, index) => (
                    <motion.a 
                      key={link.name} 
                      href={link.href} 
                      className={`mobile-nav-link ${activeSection === link.id ? 'active' : ''}`}
                      onClick={() => setIsMenuOpen(false)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                    >
                      <span className="nav-number">0{index + 1}</span>
                      <span className="nav-text">{link.name}</span>
                    </motion.a>
                  ))}
                </nav>

                <motion.div 
                  className="mobile-menu-footer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="mobile-socials">
                    {socialLinks.map((social, i) => (
                      <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="social-icon">
                        {social.icon}
                      </a>
                    ))}
                  </div>
                  <a href="#contact" className="btn btn-primary w-full mt-8" onClick={() => setIsMenuOpen(false)}>
                    Start a Project
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
