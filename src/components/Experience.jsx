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
      <section className="section experience-section">
        <div className="container">
          <div className="section-title">
            <div className="skeleton h-12 w-48 mx-auto mb-4"></div>
          </div>
          <div className="experience-timeline">
            {[1, 2].map(i => (
              <div key={i} className="skeleton-timeline-item">
                <div className="skeleton h-40 w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="section experience-section">
      <div className="container">
        <motion.div
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-lg mb-4">Experience</h2>
          <p className="text-secondary">Building scalable systems across diverse industries.</p>
        </motion.div>

        <div className="experience-timeline">
          {experiences.map((exp, index) => (
            <motion.div 
              key={exp.id}
              className="timeline-item"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="timeline-marker">
                <div className="timeline-dot"></div>
                <div className="timeline-line"></div>
              </div>
              
              <div className="timeline-content">
                <div className="timeline-header">
                  <div className="timeline-title-group">
                    <h3 className="timeline-role">{exp.role}</h3>
                    <h4 className="timeline-company">{exp.company}</h4>
                  </div>
                  <div className="timeline-duration">
                    {exp.duration}
                  </div>
                </div>

                <p className="timeline-desc">{exp.description}</p>
                
                {exp.achievements && (
                  <ul className="timeline-achievements">
                    {exp.achievements.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
                
                <div className="timeline-tech">
                  {exp.skills?.map(tech => (
                    <span key={tech} className="tech-badge">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;

