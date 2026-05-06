import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { supabase } from '../../lib/supabaseClient';
import './AdminHero.css';

const AdminHero = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState({
    greeting: 'Hello, my name is',
    name: 'Aries Jakaradytia Mustika',
    role: 'Full Stack Web Developer',
    description: 'I build modern, scalable web applications with a focus on user experience and performance.',
    ctaText: 'View My Work',
    ctaLink: '#projects'
  });

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('portfolio_content')
        .select('value')
        .eq('key', 'hero_section')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setContent(data.value);
      }
    } catch (error) {
      console.error('Error fetching hero data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('portfolio_content')
        .upsert({ 
          key: 'hero_section', 
          value: content,
          updated_at: new Date()
        }, { onConflict: 'key' });

      if (error) throw error;

      Swal.fire({
        title: 'Saved!',
        text: 'Hero section updated successfully.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <Loader2 className="animate-spin" size={40} />
        <p>Loading Hero settings...</p>
      </div>
    );
  }

  return (
    <div className="admin-hero">
      <motion.div 
        className="admin-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="card-header">
          <h3>Edit Hero Section</h3>
          <p>Customize the main introduction on your public site.</p>
        </div>

        <form onSubmit={handleSave} className="admin-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Greeting Text</label>
              <input 
                type="text" 
                value={content.greeting}
                onChange={(e) => setContent({...content, greeting: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Your Name</label>
              <input 
                type="text" 
                value={content.name}
                onChange={(e) => setContent({...content, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group full-width">
              <label>Main Role / Headline</label>
              <input 
                type="text" 
                value={content.role}
                onChange={(e) => setContent({...content, role: e.target.value})}
                required
              />
            </div>
            <div className="form-group full-width">
              <label>Description</label>
              <textarea 
                rows="4"
                value={content.description}
                onChange={(e) => setContent({...content, description: e.target.value})}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label>CTA Button Text</label>
              <input 
                type="text" 
                value={content.ctaText}
                onChange={(e) => setContent({...content, ctaText: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>CTA Button Link</label>
              <input 
                type="text" 
                value={content.ctaLink}
                onChange={(e) => setContent({...content, ctaLink: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminHero;
