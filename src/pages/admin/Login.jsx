import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Turnstile } from '@marsidev/react-turnstile';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading: authLoading, login } = useAuth();

  const from = location.state?.from?.pathname || '/admin';

  useEffect(() => {
    if (user && !authLoading) {
      navigate('/admin', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!captchaToken) {
      newErrors.captcha = 'Please complete the CAPTCHA';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');
    
    if (!validate()) return;

    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setGlobalError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page admin-theme">
      <motion.div 
        className="login-split-container"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left Side: Visual/Text */}
        <div className="login-visual-sidebar">
          <div className="visual-content">
            <button className="back-btn-overlay" onClick={() => navigate('/')}>
              <ArrowLeft size={16} /> Back to Portfolio
            </button>
            <div className="sidebar-badge">Secure Access</div>
            <h2 className="sidebar-title">Engineering <br /><span>Command Center</span></h2>
            <p className="sidebar-desc">
              Manage core infrastructure, system architecture, and technical documentation from a centralized dashboard.
            </p>
            <div className="system-stats">
              <div className="stat-item">
                <div className="stat-dot green"></div>
                <span>Systems Active</span>
              </div>
              <div className="stat-item">
                <div className="stat-dot blue"></div>
                <span>SSL Encrypted</span>
              </div>
            </div>
          </div>
          <div className="visual-overlay-mesh"></div>
        </div>

        {/* Right Side: Form */}
        <div className="login-form-container">
          <div className="login-header">
            <div className="login-logo-circle">
              <Lock size={24} />
            </div>
            <h1>Admin Portal</h1>
            <p>Authentication required</p>
          </div>

          {globalError && (
            <motion.div 
              className="login-error global"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle size={18} />
              <span>{globalError}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="form-group">
              <label className={errors.email ? 'text-error' : ''}>Institutional Email</label>
              <div className={`input-wrapper ${errors.email ? 'input-error' : ''}`}>
                <Mail className="input-icon" size={18} />
                <input 
                  type="email" 
                  placeholder="admin@ariesjakaradytia.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                />
              </div>
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className={errors.password ? 'text-error' : ''}>Security Credential</label>
              <div className={`input-wrapper ${errors.password ? 'input-error' : ''}`}>
                <Lock className="input-icon" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                  }}
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className="form-group captcha-group">
              <Turnstile 
                siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY} 
                onSuccess={(token) => {
                  setCaptchaToken(token);
                  if (errors.captcha) setErrors(prev => ({ ...prev, captcha: '' }));
                }}
                onExpire={() => setCaptchaToken(null)}
                onError={() => setGlobalError('CAPTCHA Error. Please refresh.')}
              />
              {errors.captcha && <span className="field-error">{errors.captcha}</span>}
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Verifying Identity...
                </>
              ) : (
                'Initialize Session'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
