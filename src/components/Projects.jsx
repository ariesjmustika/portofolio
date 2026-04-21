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

        <div className="projects-grid">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="card project-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="project-header">
                <div className="project-folder text-accent">
                  <ExternalLink size={32} />
                </div>
                <div className="project-links">
                  <a href={project.githubUrl} className="project-link" aria-label="Source Code">
                    <Code size={20} />
                  </a>
                  <a href={project.liveUrl} className="project-link" aria-label="Live Demo Link">
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>
              
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.description}</p>
              
              <div className="project-tech">
                {project.techStack.map(tech => (
                  <span key={tech} className="project-tech-item">{tech}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
