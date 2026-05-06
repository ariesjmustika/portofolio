import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, Loader2, GripVertical } from 'lucide-react';
import Swal from 'sweetalert2';
import { supabase } from '../../lib/supabaseClient';
import './AdminExperience.css';

const AdminExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExp, setCurrentExp] = useState({
    company: '',
    role: '',
    duration: '',
    description: '',
    skills: '',
    sort_order: 0
  });


  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exp) => {
    setCurrentExp({
      ...exp,
      skills: exp.skills?.join(', ') || ''
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase
          .from('experience')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setExperiences(experiences.filter(exp => exp.id !== id));
        Swal.fire('Deleted!', 'Experience item has been removed.', 'success');
      } catch (error) {
        Swal.fire('Error!', error.message, 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...currentExp,
      skills: currentExp.skills.split(',').map(s => s.trim()).filter(s => s !== '')
    };

    try {
      if (currentExp.id) {
        // Update
        const { error } = await supabase
          .from('experience')
          .update(payload)
          .eq('id', currentExp.id);
        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('experience')
          .insert([payload]);
        if (error) throw error;
      }

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: currentExp.id ? 'Experience updated.' : 'Experience added.',
        timer: 1500,
        showConfirmButton: false
      });
      
      setIsEditing(false);
      setCurrentExp({ company: '', role: '', duration: '', description: '', skills: '' });
      fetchExperiences();
    } catch (error) {
      Swal.fire('Error!', error.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <Loader2 className="animate-spin" size={40} />
        <p>Loading Experience data...</p>
      </div>
    );
  }

  return (
    <div className="admin-experience">
      <div className="section-header">
        <h2>Experience Management</h2>
        {!isEditing && (
          <button className="add-btn" onClick={() => setIsEditing(true)}>
            <Plus size={20} />
            <span>Add Experience</span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div 
            className="admin-card mb-8"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Company</label>
                  <input 
                    type="text" 
                    value={currentExp.company}
                    onChange={(e) => setCurrentExp({...currentExp, company: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input 
                    type="text" 
                    value={currentExp.role}
                    onChange={(e) => setCurrentExp({...currentExp, role: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>Duration (e.g., 2021 - Present)</label>
                  <input 
                    type="text" 
                    value={currentExp.duration}
                    onChange={(e) => setCurrentExp({...currentExp, duration: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea 
                    rows="4"
                    value={currentExp.description}
                    onChange={(e) => setCurrentExp({...currentExp, description: e.target.value})}
                    required
                  ></textarea>
                </div>
                <div className="form-group full-width">
                  <label>Skills (comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="React, Node.js, Supabase"
                    value={currentExp.skills}
                    onChange={(e) => setCurrentExp({...currentExp, skills: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Sort Order (Lower = First)</label>
                  <input 
                    type="number" 
                    value={currentExp.sort_order}
                    onChange={(e) => setCurrentExp({...currentExp, sort_order: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>


              <div className="form-actions mt-6">
                <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  <Save size={20} />
                  <span>{currentExp.id ? 'Update Experience' : 'Save Experience'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="experience-list">
        {experiences.length === 0 ? (
          <div className="empty-state">No experience items found.</div>
        ) : (
          experiences.map((exp) => (
            <motion.div 
              key={exp.id}
              className="experience-item-card"
              layout
            >
              <div className="exp-info">
                <h4>{exp.role} @ {exp.company}</h4>
                <p className="exp-duration">{exp.duration}</p>
                <p className="exp-desc">{exp.description.substring(0, 100)}...</p>
                <div className="exp-tags">
                  {exp.skills?.map((skill, idx) => (
                    <span key={idx} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="exp-actions">
                <button className="icon-btn edit" onClick={() => handleEdit(exp)}>
                  <Edit2 size={18} />
                </button>
                <button className="icon-btn delete" onClick={() => handleDelete(exp.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminExperience;
