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
        <div className="contact-grid">
          <motion.div 
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="badge">Available for Projects</div>
            <h2 className="heading-lg">Let's build scalable systems together.</h2>
            <p className="text-secondary">
              I'm currently looking for new opportunities to solve complex backend challenges 
              and build robust architectures. If you have a project that needs engineering rigor, 
              let's establish a connection.
            </p>

            <div className="contact-methods">
              <div className="method-item">
                <div className="method-icon"><Mail size={20} /></div>
                <div className="method-text">
                  <span>Email Me</span>
                  <a href="mailto:aries290814@gmail.com">aries290814@gmail.com</a>
                </div>
              </div>
              <div className="method-item">
                <div className="method-icon"><MessageSquare size={20} /></div>
                <div className="method-text">
                  <span>Direct Message</span>
                  <a href="https://www.linkedin.com/in/aries-jakaradytia-mustika-82767b107" target="_blank" rel="noopener noreferrer">LinkedIn Profile</a>
                </div>
              </div>
            </div>


          </motion.div>
          
          <motion.div 
            className="contact-form-container"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form className="contact-form-premium" onSubmit={handleSubmit}>
              <div className="form-row-premium">
                <div className="form-group-premium">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Enter your name" 
                    value={formData.name}
                    onChange={handleChange}
                    required 
                    disabled={status === 'loading'}
                  />
                </div>
                <div className="form-group-premium">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="name@company.com" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                    disabled={status === 'loading'}
                  />
                </div>
              </div>
              
              <div className="form-group-premium">
                <label>System Requirements / Message</label>
                <textarea 
                  name="message"
                  placeholder="Tell me about your project or architecture needs..." 
                  rows="5" 
                  value={formData.message}
                  onChange={handleChange}
                  required 
                  disabled={status === 'loading'}
                ></textarea>
              </div>
              
              <div className="form-group-premium captcha-wrapper">
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
                  <motion.div className="status-message success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <CheckCircle size={18} /> Protocol success. I'll respond shortly.
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div className="status-message error" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <AlertCircle size={18} /> {errorMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit" 
                className={`btn btn-primary w-full ${status === 'loading' ? 'loading' : ''}`}
                disabled={status === 'loading' || !captchaToken}
              >
                {status === 'loading' ? (
                  <><Loader2 className="animate-spin" size={18} /> Processing...</>
                ) : (
                  <><Send size={18} /> Establish Connection</>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
      
      <footer className="footer">
        <p>© {new Date().getFullYear()} Aries Jakaradytia Mustika. Systems Engineer Portfolio.</p>
      </footer>
    </section>
  );
};

export default Contact;

