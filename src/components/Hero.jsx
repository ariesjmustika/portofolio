import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  // Staggering container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] } 
    }
  };

  return (
    <section id="about" className="hero-section">
      <div className="container hero-container">
        {/* Entrance staggered animations */}
        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Continuous floating animation */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 5, 
              ease: "easeInOut",
              delay: 1 // Start shortly after entrance
            }}
          >
            <motion.span className="text-accent hero-subtitle" variants={itemVariants}>
              Hello, I am
            </motion.span>
            
            <motion.h1 className="heading-xl hero-title" variants={itemVariants}>
              Aries Jakaradytia<br />
              <span className="text-gradient">Mustika.</span>
            </motion.h1>
            
            <motion.h2 className="heading-md hero-role" variants={itemVariants}>
              Fullstack Developer
            </motion.h2>
            
            <motion.p className="hero-desc" variants={itemVariants}>
              I build exceptional and accessible digital experiences for the web. 
              With over 4 years of experience, I specialize in crafting robust, 
              scalable, and eye-catching applications.
            </motion.p>
            
            <motion.div className="hero-actions" variants={itemVariants}>
              <motion.a 
                href="#projects" 
                className="btn btn-primary hero-btn"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 0 20px var(--accent)",
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
              >
                View Work <ArrowRight size={18} />
              </motion.a>
              <motion.a 
                href="/resume.pdf" 
                className="btn btn-outline hero-btn"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 0 20px rgba(255,255,255,0.1)",
                  borderColor: "var(--accent)",
                  color: "var(--accent)",
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
              >
                Resume <Download size={18} />
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Decorative Elements */}
      <motion.div 
        className="hero-glow"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      ></motion.div>
    </section>
  );
};

export default Hero;
