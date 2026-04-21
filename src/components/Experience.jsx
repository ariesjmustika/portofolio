import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import './Experience.css';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const { data, error } = await supabase
          .from('experience')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setExperiences(data || []);
      } catch (error) {
        console.error('Error fetching experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (loading) {
    return (
      <div className="section-loading">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="section experience-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="heading-lg section-title">
            <span className="text-accent">01.</span> Experience
          </h2>
          <p className="section-subtitle">Over {new Date().getFullYear() - 2021} years of professional journey</p>
        </motion.div>

        <div className="experience-timeline">
          {experiences.map((exp, index) => (
            <motion.div 
              key={exp.id}
              className="timeline-item"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: index * 0.15 
              }}
            >
              <div className="timeline-marker">
                <motion.div 
                  className="timeline-dot"
                  whileInView={{ 
                    scale: [1, 1.5, 1],
                    boxShadow: [
                      "0 0 0px var(--accent-glow)",
                      "0 0 20px var(--accent)",
                      "0 0 10px var(--accent-glow)"
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                ></motion.div>
                <div className="timeline-line"></div>
              </div>
              
              <motion.div 
                className="card timeline-content"
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 10px 30px -10px var(--accent-glow)",
                  borderColor: "var(--accent)"
                }}
              >
                <div className="timeline-header">
                  <h3 className="timeline-role">{exp.role}</h3>
                  <div className="timeline-duration">
                    <Calendar size={16} /> {exp.duration}
                  </div>
                </div>
                <h4 className="timeline-company">
                  <Briefcase size={18} className="text-accent" /> {exp.company}
                </h4>
                <p className="timeline-desc">{exp.description}</p>
                
                <div className="timeline-tech">
                  {exp.skills?.map(tech => (
                    <motion.span 
                      key={tech} 
                      className="tech-badge"
                      whileHover={{ scale: 1.1, color: "var(--accent)", borderColor: "var(--accent)" }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;

