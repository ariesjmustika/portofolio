import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Code } from 'lucide-react';
import './Projects.css';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "E-Commerce Dashboard",
      description: "A comprehensive admin dashboard for e-commerce platforms. Features real-time sales tracking, inventory management, and analytics visualization.",
      techStack: ["React", "Redux", "TailwindCSS", "Chart.js"],
      githubUrl: "#",
      liveUrl: "#"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "A collaborative project management tool with real-time updates, drag-and-drop kanban boards, and team chat capabilities.",
      techStack: ["Next.js", "Socket.io", "MongoDB", "Framer Motion"],
      githubUrl: "#",
      liveUrl: "#"
    },
    {
      id: 3,
      title: "AI Content Generator",
      description: "A SaaS platform leveraging OpenAI API to generate marketing copy, blog posts, and social media content automatically.",
      techStack: ["React", "Node.js", "OpenAI API", "Stripe"],
      githubUrl: "#",
      liveUrl: "#"
    },
    {
      id: 4,
      title: "Crypto Tracker",
      description: "A real-time cryptocurrency tracking application featuring live price updates, portfolio management, and market news.",
      techStack: ["React", "TypeScript", "CoinGecko API"],
      githubUrl: "#",
      liveUrl: "#"
    }
  ];

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
                  <motion.a 
                    href={project.githubUrl} 
                    className="project-link" 
                    aria-label="Source Code"
                    whileHover={{ y: -2, color: "var(--accent)" }}
                  >
                    <Code size={20} />
                  </motion.a>
                  <motion.a 
                    href={project.liveUrl} 
                    className="project-link" 
                    aria-label="Live Demo Link"
                    whileHover={{ y: -2, color: "var(--accent)" }}
                  >
                    <ExternalLink size={20} />
                  </motion.a>
                </div>
              </div>
              
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.description}</p>
              
              <div className="project-tech">
                {project.techStack.map(tech => (
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
