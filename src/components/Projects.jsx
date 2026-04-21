import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Code, Loader2, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  if (loading) {
    return (
      <div className="section-loading">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="heading-lg section-title">
            <span className="text-accent">02.</span> Featured Projects
          </h2>
          <p className="section-subtitle">Some things I've built</p>
        </motion.div>

        <motion.div 
          className="projects-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              className="card project-card"
              variants={cardVariants}
              whileHover={{ 
                y: -12,
                scale: 1.02,
                boxShadow: "0 20px 40px -20px var(--accent-glow)",
                borderColor: "var(--accent)"
              }}
            >
              <div className="project-header">
                <div className="project-folder text-accent">
                  <ExternalLink size={32} />
                </div>
                <div className="project-links">
                  {project.github_link && (
                    <motion.a 
                      href={project.github_link} 
                      className="project-link" 
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Source Code"
                      whileHover={{ y: -2, color: "var(--accent)" }}
                    >
                      <Code size={20} />
                    </motion.a>
                  )}
                  {project.live_link && (
                    <motion.a 
                      href={project.live_link} 
                      className="project-link" 
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Live Demo Link"
                      whileHover={{ y: -2, color: "var(--accent)" }}
                    >
                      <ExternalLink size={20} />
                    </motion.a>
                  )}
                </div>
              </div>
              
              <h3 className="project-title">{project.title}</h3>
              {project.duration && (
                <div className="project-duration">
                  <Calendar size={14} /> <span>{project.duration}</span>
                </div>
              )}
              <p className="project-desc">{project.description}</p>

              
              <div className="project-tech">
                {project.tags?.map(tech => (
                  <motion.span 
                    key={tech} 
                    className="project-tech-item"
                    whileHover={{ scale: 1.1, color: "var(--accent)" }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;

