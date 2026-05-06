import React, { useEffect, useState } from 'react';
import { m } from 'framer-motion';
import { ExternalLink, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import './Explorations.css';

const Explorations = () => {
  const [explorations, setExplorations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExplorations = async () => {
      try {
        const { data, error } = await supabase
          .from('explorations')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) {
          console.error('Supabase Error (Explorations):', error);
          // Fallback for development if table doesn't exist yet
          if (import.meta.env.DEV && error.code === '42P01') {
            setExplorations([
              {
                id: 1,
                title: 'Save Money App',
                description: 'A personal finance tracker to manage your daily expenses and income effectively.',
                url: 'https://savemoney.ariesjakaradytia.com/login',
                image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800'
              },
              {
                id: 2,
                title: 'Sales Page Generator',
                description: 'AI-powered tool to generate high-converting sales pages in minutes.',
                url: 'https://salespagegenerator.ariesjakaradytia.com/',
                image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
              },
              {
                id: 3,
                title: 'Phone Specs',
                description: 'Comprehensive database for mobile phone specifications and comparisons.',
                url: 'https://phonespecs.ariesjakaradytia.com/',
                image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800'
              }
            ]);
            return;
          }
          throw error;
        }

        console.log('Fetched Explorations:', data);
        setExplorations(data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchExplorations();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 20 }
    }
  };

  if (loading) {
    return (
      <div className="section-loading" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin text-accent" size={40} />
      </div>
    );
  }

  // If database is empty but we want to show something
  const displayData = explorations.length > 0 ? explorations : [
    {
      id: 'dummy-1',
      title: 'Project Preview',
      description: 'Data sedang disinkronkan dari database...',
      url: 'https://ariesjakaradytia.com',
      image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <section id="explorations" className="section explorations-section">
      <div className="container">
        <m.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="heading-lg section-title">
            <span className="text-accent">03.</span> Live App Showcases
          </h2>
          <p className="section-subtitle">Production-ready web applications I've built</p>
        </m.div>

        <m.div 
          className="explorations-grid"
          variants={containerVariants}
          initial="visible"
          animate="visible"
        >
          {displayData.map((app) => (
            <m.div key={app.id} className="browser-mockup" variants={cardVariants}>
              <div className="browser-header">
                <div className="browser-dots">
                  <div className="dot red"></div>
                  <div className="dot yellow"></div>
                  <div className="dot green"></div>
                </div>
                <div className="browser-url-bar">
                  {app.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </div>
              </div>
              
              <div className="browser-content">
                <img 
                  src={app.image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'} 
                  alt={app.title} 
                  loading="lazy"
                />
                <div className="browser-overlay">
                  <h3 className="exploration-title">{app.title}</h3>
                  <p className="exploration-desc">{app.description}</p>
                  <div className="exploration-actions">
                    <a 
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ padding: '0.8rem 2rem', fontSize: '1rem', width: '100%' }}
                    >
                      <ExternalLink size={18} /> Visit Project
                    </a>
                  </div>
                </div>
              </div>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
};

export default Explorations;
