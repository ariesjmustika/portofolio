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
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-accent text-sm font-heading mb-4">03. What's Next?</p>
          <h2 className="heading-lg mb-6">Get In Touch</h2>
          
          <p className="contact-desc mb-10">
            I'm currently looking for new opportunities. Whether you have a question, 
            a project proposal, or just want to say hi, I'll try my best to get back to you!
          </p>
          
          <form className="contact-form mb-12" onSubmit={handleSubmit}>
            <div className="form-group">
              <input 
                type="text" 
                name="name"
                className="form-input" 
                placeholder="Your Name" 
                value={formData.name}
                onChange={handleChange}
                required 
                disabled={status === 'loading'}
              />
            </div>
            <div className="form-group">
              <input 
                type="email" 
                name="email"
                className="form-input" 
                placeholder="Your Email" 
                value={formData.email}
                onChange={handleChange}
                required 
                disabled={status === 'loading'}
              />
            </div>
            <div className="form-group">
              <textarea 
                name="message"
                className="form-input form-textarea" 
                placeholder="Your Message" 
                rows="5" 
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
                  if (status === 'error' && errorMessage === 'Please complete the CAPTCHA.') {
                    setStatus('idle');
                    setErrorMessage('');
                  }
                }}
                onExpire={() => setCaptchaToken(null)}
                onError={() => setCaptchaToken(null)}
                theme="dark"
              />
            </div>

            <AnimatePresence mode="wait">
              {status === 'success' && (
                <motion.div 
                  className="status-message success-message mb-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <CheckCircle size={20} />
                  <span>Message sent successfully! I'll get back to you soon.</span>
                </motion.div>
              )}
              
              {status === 'error' && (
                <motion.div 
                  className="status-message error-message mb-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <AlertCircle size={20} />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button 
              type="submit" 
              className={`btn btn-primary btn-lg w-full ${status === 'loading' ? 'loading' : ''}`}
              whileHover={status === 'loading' || !captchaToken ? {} : { 
                scale: 1.02,
                boxShadow: "0 0 25px var(--accent)"
              }}
              whileTap={status === 'loading' || !captchaToken ? {} : { scale: 0.98 }}
              disabled={status === 'loading' || !captchaToken}
              style={{ opacity: !captchaToken && status !== 'loading' ? 0.6 : 1, cursor: !captchaToken && status !== 'loading' ? 'not-allowed' : 'pointer' }}
            >
              {status === 'loading' ? (
                <>
                  Sending... 
                  <Loader2 className="animate-spin ml-2" size={18} />
                </>
              ) : (
                <>
                  Send Message 
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    style={{ display: "inline-flex", marginLeft: "0.5rem" }}
                  >
                    <Mail size={18} />
                  </motion.span>
                </>
              )}
            </motion.button>
          </form>

          
          <div className="social-links">
            <motion.a 
              href="#" 
              className="social-link" 
              aria-label="GitHub"
              whileHover={{ y: -5, scale: 1.2, color: "var(--accent)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Code size={24} />
            </motion.a>
            <motion.a 
              href="#" 
              className="social-link" 
              aria-label="LinkedIn"
              whileHover={{ y: -5, scale: 1.2, color: "var(--accent)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Briefcase size={24} />
            </motion.a>
            <motion.a 
              href="#" 
              className="social-link" 
              aria-label="Twitter"
              whileHover={{ y: -5, scale: 1.2, color: "var(--accent)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <MessageSquare size={24} />
            </motion.a>
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

