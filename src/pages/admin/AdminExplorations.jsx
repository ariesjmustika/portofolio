import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, Loader2, Link as LinkIcon, Image as ImageIcon, Upload } from 'lucide-react';
import Swal from 'sweetalert2';
import { supabase } from '../../lib/supabaseClient';
import { compressImage } from '../../utils/imageCompression';
import './AdminExplorations.css';

const AdminExplorations = () => {
  const [explorations, setExplorations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExploration, setCurrentExploration] = useState({
    title: '',
    description: '',
    image_url: '',
    url: '',
    sort_order: 0
  });

  useEffect(() => {
    fetchExplorations();
  }, []);

  const fetchExplorations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('explorations')
        .select('*')
        .order('sort_order', { ascending: true });

      // Handle table not existing gracefully
      if (error && error.code !== '42P01') throw error;
      setExplorations(data || []);
    } catch (error) {
      console.error('Error fetching explorations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exp) => {
    setCurrentExploration({ ...exp });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      // Compress image before uploading
      const compressedFile = await compressImage(file, 1200, 0.7);
      
      const fileExt = compressedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `explorations/${fileName}`;

      // Upload to 'portfolio' bucket (Ensure this bucket exists in Supabase!)
      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      setCurrentExploration({ ...currentExploration, image_url: data.publicUrl });
    } catch (error) {
      console.error('Upload error:', error);
      Swal.fire('Upload Failed!', error.message + '\n(Make sure you have created a storage bucket named "portfolio" and it is public)', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Showcase?',
      text: "This cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Delete'
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase
          .from('explorations')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setExplorations(explorations.filter(e => e.id !== id));
        Swal.fire('Deleted!', 'Showcase has been removed.', 'success');
      } catch (error) {
        Swal.fire('Error!', error.message, 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (currentExploration.id) {
        const { error } = await supabase.from('explorations').update(currentExploration).eq('id', currentExploration.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('explorations').insert([currentExploration]);
        if (error) throw error;
      }

      Swal.fire({ icon: 'success', title: 'Success!', timer: 1500, showConfirmButton: false });
      setIsEditing(false);
      setCurrentExploration({ title: '', description: '', image_url: '', url: '', sort_order: 0 });
      fetchExplorations();
    } catch (error) {
      Swal.fire('Error!', error.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <Loader2 className="animate-spin" size={40} />
        <p>Loading Explorations...</p>
      </div>
    );
  }

  return (
    <div className="admin-explorations">
      <div className="section-header">
        <h2>Live Showcases Management</h2>
        {!isEditing && (
          <button className="add-btn" onClick={() => setIsEditing(true)}>
            <Plus size={20} />
            <span>Add Showcase</span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div className="admin-card mb-8" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>App Title</label>
                  <input type="text" value={currentExploration.title} onChange={(e) => setCurrentExploration({...currentExploration, title: e.target.value})} required />
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea rows="3" value={currentExploration.description} onChange={(e) => setCurrentExploration({...currentExploration, description: e.target.value})} required></textarea>
                </div>
                <div className="form-group full-width">
                  <label>Screenshot Image</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {currentExploration.image_url && (
                      <img 
                        src={currentExploration.image_url} 
                        alt="Preview" 
                        style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                      />
                    )}
                    <label className="btn btn-outline" style={{ cursor: 'pointer', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                      {uploadingImage ? 'Uploading...' : 'Upload Compressed Image'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                    <input 
                      type="text" 
                      value={currentExploration.image_url} 
                      onChange={(e) => setCurrentExploration({...currentExploration, image_url: e.target.value})} 
                      placeholder="Or paste URL here..." 
                      style={{ flexGrow: 1 }}
                    />
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Live URL</label>
                  <input type="url" value={currentExploration.url} onChange={(e) => setCurrentExploration({...currentExploration, url: e.target.value})} placeholder="https://..." required/>
                </div>
                <div className="form-group">
                  <label>Sort Order (Lower = First)</label>
                  <input type="number" value={currentExploration.sort_order} onChange={(e) => setCurrentExploration({...currentExploration, sort_order: parseInt(e.target.value) || 0})} />
                </div>
              </div>

              <div className="form-actions mt-6">
                <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="submit" className="save-btn"><Save size={20} /><span>{currentExploration.id ? 'Update' : 'Create'}</span></button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="explorations-list-admin">
        {explorations.length === 0 ? (
          <p className="empty-state">No showcases added yet. Click 'Add Showcase' to create one.</p>
        ) : (
          explorations.map(exp => (
            <div key={exp.id} className="exploration-admin-card">
              <div className="exploration-admin-img">
                {exp.image_url ? <img src={exp.image_url} alt={exp.title} /> : <div className="placeholder"><ImageIcon size={32} /></div>}
              </div>
              <div className="exploration-admin-info">
                <h4>{exp.title}</h4>
                <div className="exploration-admin-links">
                  {exp.url && <a href={exp.url} target="_blank" rel="noopener noreferrer"><LinkIcon size={14} /> {exp.url}</a>}
                </div>
              </div>
              <div className="exploration-admin-actions">
                <button className="icon-btn edit" onClick={() => handleEdit(exp)}><Edit2 size={18} /></button>
                <button className="icon-btn delete" onClick={() => handleDelete(exp.id)}><Trash2 size={18} /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminExplorations;
