import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';
import './Experience.css';

const Experience = () => {
  const experiences = [
    {
      id: 1,
      role: "Senior Fullstack Developer",
      company: "Tech Innovators Inc.",
      duration: "2023 - Present",
      description: "Leading the development of highly scalable enterprise web applications. Architected responsive frontend solutions using React and robust backend APIs with Node.js.",
      techStack: ["React", "Node.js", "MongoDB", "AWS"]
    },
    {
      id: 2,
      role: "Fullstack Developer",
      company: "Digital Solutions LLC",
      duration: "2020 - 2023",
      description: "Developed and maintained full-stack web applications. Improved application performance by 40% through code optimization and efficient database queries.",
      techStack: ["Vue.js", "Express", "PostgreSQL", "Docker"]
    },
    {
      id: 3,
      role: "Frontend Developer",
      company: "Creative Web Agency",
      duration: "2019 - 2020",
      description: "Collaborated with designers to build pixel-perfect, interactive, and eye-catching landing pages for various clients.",
      techStack: ["HTML/CSS", "JavaScript", "React", "Figma"]
    }
  ];

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
          <p className="section-subtitle">Over 4 years of professional journey</p>
        </motion.div>

        <div className="experience-timeline">
          {experiences.map((exp, index) => (
            <motion.div 
              key={exp.id}
              className="timeline-item"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="timeline-marker">
                <div className="timeline-dot"></div>
                <div className="timeline-line"></div>
              </div>
              
              <div className="card timeline-content">
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
                  {exp.techStack.map(tech => (
                    <span key={tech} className="tech-badge">{tech}</span>
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
