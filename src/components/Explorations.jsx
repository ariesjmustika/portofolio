import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Code } from 'lucide-react';
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
          if (import.meta.env.DEV && error.code === '42P01') {
            setExplorations([
              {
                id: 1,
                title: 'Real-time Monitoring Node',
                description: 'Experimenting with WebSocket throughput for high-frequency data systems.',
                url: '#',
                tags: ['Node.js', 'Redis']
              }
            ]);
          }
        } else {
          setExplorations(data || []);
        }
      } catch (error) {
        console.error('Error fetching explorations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExplorations();
  }, []);

  if (loading || explorations.length === 0) return null;

  return (
    <section id="explorations" className="section lab-section">
      <div className="container">
        <div className="section-title text-left">
          <h2 className="heading-md mb-2">The Lab</h2>
          <p className="text-secondary">Technical experiments and engineering prototypes.</p>
        </div>

        <div className="lab-grid">
          {explorations.map((item, index) => (
            <motion.a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="lab-item"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="lab-item-header">
                <Code size={20} className="text-accent" />
                <ExternalLink size={16} className="text-muted" />
              </div>
              <h3 className="lab-title">{item.title}</h3>
              <p className="lab-desc">{item.description}</p>
              <div className="lab-tags">
                {item.tags?.map(tag => (
                  <span key={tag} className="lab-tag">{tag}</span>
                )) || <span className="lab-tag">Prototype</span>}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Explorations;
