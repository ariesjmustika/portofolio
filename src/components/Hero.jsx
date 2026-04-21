import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  return (
    <section id="about" className="hero-section">
      <div className="container hero-container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.span 
            className="text-accent hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Hello, I am
          </motion.span>
          
          <motion.h1 
            className="heading-xl hero-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Aries Jakaradytia<br />
            <span className="text-gradient">Mustika.</span>
          </motion.h1>
          
          <motion.h2 
            className="heading-md hero-role"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Fullstack Developer
          </motion.h2>
          
          <motion.p 
            className="hero-desc"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            I build exceptional and accessible digital experiences for the web. 
            With over 4 years of experience, I specialize in crafting robust, 
            scalable, and eye-catching applications.
          </motion.p>
          
          <motion.div 
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <a href="#projects" className="btn btn-primary">
              View Work <ArrowRight size={18} />
            </a>
            <a href="/resume.pdf" className="btn btn-outline">
              Resume <Download size={18} />
            </a>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Decorative Elements */}
      <div className="hero-glow"></div>
    </section>
  );
};

export default Hero;
