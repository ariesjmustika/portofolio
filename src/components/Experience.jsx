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
                  {exp.techStack.map(tech => (
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
