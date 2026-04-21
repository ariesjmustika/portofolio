import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Code, Briefcase, MessageSquare } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <motion.div 
          className="contact-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-accent text-sm font-heading mb-4">03. What's Next?</p>
          <h2 className="heading-lg mb-6">Get In Touch</h2>
          
          <p className="contact-desc mb-10">
            I'm currently looking for new opportunities. Whether you have a question, 
            a project proposal, or just want to say hi, I'll try my best to get back to you!
          </p>
          
          <form className="contact-form mb-12">
            <div className="form-group">
              <input type="text" className="form-input" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <input type="email" className="form-input" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <textarea className="form-input form-textarea" placeholder="Your Message" rows="5" required></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-full">
              Send Message <Mail size={18} />
            </button>
          </form>
          
          <div className="social-links">
            <a href="#" className="social-link" aria-label="GitHub">
              <Code size={24} />
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <Briefcase size={24} />
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <MessageSquare size={24} />
            </a>
          </div>
        </motion.div>
      </div>
      
      <footer className="footer">
        <p>Designed & Built by Aries Jakaradytia Mustika</p>
      </footer>
    </section>
  );
};

export default Contact;
