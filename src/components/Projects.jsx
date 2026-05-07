import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Code, CheckCircle2, Calendar, AlertCircle, Monitor, Smartphone, Cpu, Database, Layers } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
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
        setFilteredProjects(data || []);
        
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(data.map(p => p.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleFilter = (category) => {
    setActiveCategory(category);
    if (category === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.category === category));
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  if (loading) {
    return (
      <section className="section projects-section">
        <div className="container">
          <div className="section-title">
            <div className="skeleton h-12 w-64 mx-auto mb-4"></div>
            <div className="skeleton h-6 w-48 mx-auto"></div>
          </div>
          <div className="projects-grid">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton-card">
                <div className="skeleton h-48 w-full mb-4"></div>
                <div className="skeleton h-8 w-3-4 mb-2"></div>
                <div className="skeleton h-4 w-full mb-2"></div>
                <div className="skeleton h-4 w-5-6"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <motion.div
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-lg mb-4">Selected Systems</h2>
          <p className="text-secondary">Engineering solutions for complex business workflows.</p>
        </motion.div>

        <div className="project-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => handleFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="projects-list">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} variants={cardVariants} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project, index, variants }) => {
  const [imageError, setImageError] = useState(false);

  const getPlaceholderIcon = () => {
    const category = project.category?.toLowerCase() || '';
    if (category.includes('web')) return <Monitor size={40} className="text-accent" />;
    if (category.includes('mobile')) return <Smartphone size={40} className="text-accent" />;
    if (category.includes('db') || category.includes('database')) return <Database size={40} className="text-accent" />;
    if (category.includes('system') || category.includes('architecture')) return <Layers size={40} className="text-accent" />;
    return <Cpu size={40} className="text-accent" />;
  };

  return (
    <motion.div
      layout
      className="project-case-study"
      variants={variants}
      initial="hidden"
      whileInView="visible"
      exit={{ opacity: 0, scale: 0.95 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="project-grid">
        <div className="project-visual">
          <div className="visual-container">
            {project.image_url && !imageError ? (
              <img 
                src={project.image_url} 
                alt={project.title} 
                loading="lazy" 
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="visual-placeholder">
                <div className="placeholder-icon-wrap">
                  {getPlaceholderIcon()}
                  <span className="placeholder-text">Internal Case Study</span>
                </div>
              </div>
            )}
            <div className="visual-overlay"></div>
          </div>
        </div>

        <div className="project-info">
          <div className="project-meta">
            <span className="project-number">0{index + 1}</span>
            <span className="project-tech-main">{project.category || 'System Architecture'}</span>
          </div>
          
          <h3 className="project-case-title">{project.title}</h3>
          
          <div className="project-description">
            <div className="desc-section">
              <div className="desc-header">
                <AlertCircle size={14} className="text-muted" />
                <h4>The Challenge</h4>
              </div>
              <p>{project.problem || project.description}</p>
            </div>
            
            <div className="desc-section">
              <div className="desc-header">
                <CheckCircle2 size={14} className="text-accent" />
                <h4>Engineering Solution</h4>
              </div>
              <p>{project.solution || 'Architected a scalable solution focusing on modularity and performance.'}</p>
            </div>
          </div>

          <div className="engineering-highlights">
            <div className="highlights-title">Key Systems Built:</div>
            <div className="highlights-list-inline">
              {project.highlights?.map(highlight => (
                <span key={highlight} className="highlight-tag">
                  {highlight}
                </span>
              )) || (
                <>
                  <span className="highlight-tag">Scalable Architecture</span>
                  <span className="highlight-tag">Performance Optimized</span>
                </>
              )}
            </div>
          </div>

          <div className="project-actions">
            {project.live_link && (
              <a href={project.live_link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Visit Project <ExternalLink size={16} />
              </a>
            )}
            {project.github_link && (
              <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                Source Code
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default Projects;
