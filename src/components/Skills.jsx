import React from 'react';
import { motion } from 'framer-motion';
import { Server, Layout, Cpu, Database } from 'lucide-react';
import './Skills.css';

const skillGroups = [
  {
    title: "Backend Ecosystem",
    icon: <Server size={20} />,
    skills: ["Laravel", "PHP 8.x", "Node.js", "Express", "RESTful APIs"]
  },
  {
    title: "Data & Performance",
    icon: <Database size={20} />,
    skills: ["PostgreSQL", "MySQL", "Redis", "Query Optimization"]
  },
  {
    title: "Frontend Engineering",
    icon: <Layout size={20} />,
    skills: ["React", "JavaScript (ES6+)", "Vite", "Framer Motion", "Tailwind CSS"]
  },
  {
    title: "Engineering Concepts",
    icon: <Cpu size={20} />,
    skills: ["System Design", "MVC Architecture", "JWT Authentication", "WebSockets", "CI/CD Basics"]
  }
];

const Skills = () => {
  return (
    <section id="skills" className="section skills-section">
      <div className="container">
        <motion.div 
          className="section-title text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-md mb-4">The Technical Ecosystem</h2>
          <p className="text-secondary max-w-2xl">
            My skill set is curated for building robust, scalable enterprise systems. 
            I focus on architecture, performance, and long-term maintainability.
          </p>
        </motion.div>

        <div className="skills-grid">
          {skillGroups.map((group, index) => (
            <motion.div 
              key={group.title}
              className="skill-group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="group-header">
                <div className="group-icon">{group.icon}</div>
                <h3>{group.title}</h3>
              </div>
              <ul className="skill-list">
                {group.skills.map(skill => (
                  <li key={skill} className="skill-item">
                    <span className="skill-dot"></span>
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
