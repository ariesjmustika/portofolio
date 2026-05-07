import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import './Hero.css';

const Hero = () => {
  const [content, setContent] = useState({
    subtitle: 'Systems Engineer & Backend Specialist',
    name: 'Aries Jakaradytia Mustika.',
    role: 'I architect scalable web systems for enterprise efficiency.',
    description: 'Specializing in Laravel, React, PostgreSQL, and high-throughput architectures. I bridge the gap between complex business requirements and robust technical reality.',
    ctaText: 'View Case Studies',
    ctaLink: '#projects'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_content')
          .select('value')
          .eq('key', 'hero_section')
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        if (data) setContent(prev => ({ ...prev, ...data.value }));
      } catch (error) {
        console.error('Error fetching hero data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section id="about" className="hero-section">
      <div className="grid-bg"></div>
      <div className="container hero-container">
        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero-badge" variants={itemVariants}>
            <span className="badge-dot"></span>
            Available for enterprise consultations
          </motion.div>

          <motion.span className="text-accent hero-subtitle" variants={itemVariants}>
            HELLO, MY NAME IS
          </motion.span>
          
          <motion.h1 className="heading-xl hero-title text-gradient" variants={itemVariants}>
            {content.name}
          </motion.h1>
          
          <motion.h2 className="hero-role-text" variants={itemVariants}>
            {content.role}
          </motion.h2>

          <motion.p className="hero-desc" variants={itemVariants}>
            {content.description}
          </motion.p>

          <motion.div className="hero-philosophy" variants={itemVariants}>
            <div className="philosophy-item">
              <span className="philosophy-label">Reliability</span>
              <span className="philosophy-line"></span>
              <p>System uptime is non-negotiable.</p>
            </div>
            <div className="philosophy-item">
              <span className="philosophy-label">Efficiency</span>
              <span className="philosophy-line"></span>
              <p>Automating manual toil out of existence.</p>
            </div>
          </motion.div>
          
          <motion.div className="hero-actions" variants={itemVariants}>
            <motion.a 
              href={content.ctaLink}
              className="btn btn-primary hero-btn"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {content.ctaText} <ArrowRight size={18} />
            </motion.a>
            <motion.a 
              href="/cv.pdf" 
              className="btn btn-outline hero-btn"
              download="Aries_Jakardytia_Mustika_CV.pdf"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Resume <Download size={18} />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
      
      <div className="hero-glow"></div>
    </section>
  );
};

export default Hero;

