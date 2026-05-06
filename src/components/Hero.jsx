import React, { useEffect, useState } from 'react';
import { m } from 'framer-motion';
import { ArrowRight, Download, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import './Hero.css';

const Hero = () => {
  const [content, setContent] = useState({
    greeting: 'Hello, I am',
    name: 'Aries Jakaradytia Mustika.',
    role: 'Fullstack Developer',
    description: 'I build exceptional and accessible digital experiences for the web. With over 5 years of experience, I specialize in crafting robust, scalable, and eye-catching applications.',
    ctaText: 'View Work',
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
        if (data) setContent(data.value);
      } catch (error) {
        console.error('Error fetching hero data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

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

  // We no longer block rendering with a loading spinner to drastically improve LCP.
  // The initial state already contains the fallback/default content.

  return (
    <section id="about" className="hero-section">
      <div className="container hero-container">
        <m.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <m.div
            animate={{ y: [0, -10, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 5, 
              ease: "easeInOut",
              delay: 1
            }}
          >
            <m.span className="text-accent hero-subtitle" variants={itemVariants}>
              {content.greeting}
            </m.span>
            
            <m.h1 className="heading-xl hero-title" variants={itemVariants}>
              {content.name}
            </m.h1>
            
            <m.h2 className="heading-md hero-role" variants={itemVariants}>
              {content.role}
            </m.h2>
            
            <m.p className="hero-desc" variants={itemVariants}>
              {content.description}
            </m.p>
            
            <m.div className="hero-actions" variants={itemVariants}>
              <m.a 
                href={content.ctaLink}
                className="btn btn-primary hero-btn"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 0 20px var(--accent)",
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
              >
                {content.ctaText} <ArrowRight size={18} />
              </m.a>
              <m.a 
                href="/cv.pdf" 
                className="btn btn-outline hero-btn"
                download="Aries_Jakardytia_Mustika_CV.pdf"

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
              </m.a>
            </m.div>
          </m.div>
        </m.div>
      </div>
      
      <m.div 
        className="hero-glow"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      ></m.div>
    </section>
  );
};

export default Hero;

