import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Code, Briefcase, MessageSquare, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import { supabase } from '../lib/supabaseClient';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const turnstileRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!captchaToken) {
      setErrorMessage('Please complete the CAPTCHA.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          { 
            name: formData.name, 
            email: formData.email, 
            message: formData.message 
          }
        ]);

      if (error) throw error;

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setCaptchaToken(null);
      turnstileRef.current?.reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
      turnstileRef.current?.reset();
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <motion.div 
          className="contact-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-title">
            <h2 className="heading-lg mb-6">Let's build systems together.</h2>
            <p className="text-secondary max-w-2xl mx-auto">
              I'm always open to discussing backend architecture, scalable systems, 
              or complex business workflows. If you have a project that needs 
              engineering rigor, let's talk.
            </p>
          </div>
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  name="name"
                  className="form-input" 
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                  disabled={status === 'loading'}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email"
                  className="form-input" 
                  placeholder="john@business.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                  disabled={status === 'loading'}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Message</label>
              <textarea 
                name="message"
                className="form-input form-textarea" 
                placeholder="How can I help with your system architecture?" 
                rows="6" 
                value={formData.message}
                onChange={handleChange}
                required 
                disabled={status === 'loading'}
              ></textarea>
            </div>
            
            <div className="form-group captcha-container">
              <Turnstile 
                ref={turnstileRef}
                siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY} 
                onSuccess={(token) => {
                  setCaptchaToken(token);
                  setStatus('idle');
                }}
                onExpire={() => setCaptchaToken(null)}
                onError={() => setCaptchaToken(null)}
                theme="dark"
              />
            </div>

            <AnimatePresence mode="wait">
              {status === 'success' && (
                <motion.div className="status-message success">
                  <CheckCircle size={18} /> Message received. I'll get back to you shortly.
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div className="status-message error">
                  <AlertCircle size={18} /> {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit" 
              className={`btn btn-primary w-full ${status === 'loading' ? 'loading' : ''}`}
              disabled={status === 'loading' || !captchaToken}
            >
              {status === 'loading' ? 'Transmitting Data...' : 'Send Message'}
            </button>
          </form>

          <div className="social-links">
            <a href="https://github.com/ariesjmustika" target="_blank" rel="noopener noreferrer" className="social-link">
              <Code size={20} /> GitHub
            </a>
            <a href="https://linkedin.com/in/ariesjmustika" target="_blank" rel="noopener noreferrer" className="social-link">
              <Briefcase size={20} /> LinkedIn
            </a>
            <a href="mailto:aries@ariesjakaradytia.com" className="social-link">
              <Mail size={20} /> Email
            </a>
          </div>
        </motion.div>
      </div>
      
      <footer className="footer">
        <p>© {new Date().getFullYear()} Aries Jakaradytia Mustika. Systems Engineer Portfolio.</p>
      </footer>
    </section>
  );
};

export default Contact;

