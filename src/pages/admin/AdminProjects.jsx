import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, Loader2, Link as LinkIcon, Code, Image as ImageIcon } from 'lucide-react';
import Swal from 'sweetalert2';
import { supabase } from '../../lib/supabaseClient';
import './AdminProjects.css';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState({
    title: '',
    description: '',
    image_url: '',
    duration: '',
    sort_order: 0,
    tags: '',
    live_link: '',
    github_link: ''
  });



  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setCurrentProject({
      ...project,
      tags: project.tags?.join(', ') || ''
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Project?',
      text: "This cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Delete'
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setProjects(projects.filter(p => p.id !== id));
        Swal.fire('Deleted!', 'Project has been removed.', 'success');
      } catch (error) {
        Swal.fire('Error!', error.message, 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...currentProject,
      tags: currentProject.tags.split(',').map(s => s.trim()).filter(s => s !== '')
    };

    try {
      if (currentProject.id) {
        const { error } = await supabase.from('projects').update(payload).eq('id', currentProject.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('projects').insert([payload]);
        if (error) throw error;
      }

      Swal.fire({ icon: 'success', title: 'Success!', timer: 1500, showConfirmButton: false });
      setIsEditing(false);
      setCurrentProject({ title: '', description: '', image_url: '', tags: '', live_link: '', github_link: '' });
      fetchProjects();
    } catch (error) {
      Swal.fire('Error!', error.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <Loader2 className="animate-spin" size={40} />
        <p>Loading Projects...</p>
      </div>
    );
  }

  return (
    <div className="admin-projects">
      <div className="section-header">
        <h2>Projects Management</h2>
        {!isEditing && (
          <button className="add-btn" onClick={() => setIsEditing(true)}>
            <Plus size={20} />
            <span>Add Project</span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div className="admin-card mb-8" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Project Title</label>
                  <input type="text" value={currentProject.title} onChange={(e) => setCurrentProject({...currentProject, title: e.target.value})} required />
                </div>
                <div className="form-group full-width">
                  <label>Duration (e.g., Jan 2024 - Mar 2024)</label>
                  <input type="text" value={currentProject.duration} onChange={(e) => setCurrentProject({...currentProject, duration: e.target.value})} placeholder="Project duration" />
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea rows="3" value={currentProject.description} onChange={(e) => setCurrentProject({...currentProject, description: e.target.value})} required></textarea>
                </div>
                <div className="form-group full-width">
                  <label>Image URL</label>
                  <input type="text" value={currentProject.image_url} onChange={(e) => setCurrentProject({...currentProject, image_url: e.target.value})} placeholder="https://example.com/image.jpg" />
                </div>
                <div className="form-group full-width">
                  <label>Tags (comma separated)</label>

                  <input type="text" value={currentProject.tags} onChange={(e) => setCurrentProject({...currentProject, tags: e.target.value})} placeholder="React, Three.js, GSAP" />
                </div>
                <div className="form-group">
                  <label>Live Link</label>
                  <input type="text" value={currentProject.live_link} onChange={(e) => setCurrentProject({...currentProject, live_link: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>GitHub Link</label>
                  <input type="text" value={currentProject.github_link} onChange={(e) => setCurrentProject({...currentProject, github_link: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Sort Order (Lower = First)</label>
                  <input type="number" value={currentProject.sort_order} onChange={(e) => setCurrentProject({...currentProject, sort_order: parseInt(e.target.value) || 0})} />
                </div>
              </div>

              <div className="form-actions mt-6">
                <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="submit" className="save-btn"><Save size={20} /><span>{currentProject.id ? 'Update' : 'Create'}</span></button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="projects-list-admin">
        {projects.map(project => (
          <div key={project.id} className="project-admin-card">
            <div className="project-admin-img">
              {project.image_url ? <img src={project.image_url} alt={project.title} /> : <div className="placeholder"><ImageIcon size={32} /></div>}
            </div>
            <div className="project-admin-info">
              <h4>{project.title}</h4>
              <div className="project-admin-links">
                {project.live_link && <LinkIcon size={14} />}
                {project.github_link && <Code size={14} />}
              </div>
            </div>
            <div className="project-admin-actions">
              <button className="icon-btn edit" onClick={() => handleEdit(project)}><Edit2 size={18} /></button>
              <button className="icon-btn delete" onClick={() => handleDelete(project.id)}><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProjects;
