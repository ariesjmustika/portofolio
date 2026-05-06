import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Mail, User, Clock, Search, AlertCircle, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { supabase } from '../../lib/supabaseClient';
import './AdminMessages.css';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0f172a',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase
          .from('contact_messages')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setMessages(messages.filter(m => m.id !== id));
        
        Swal.fire({
          title: 'Deleted!',
          text: 'The message has been deleted.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error'
        });
      }
    }
  };


  const filteredMessages = messages.filter(m => 
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-messages">
      <div className="messages-toolbar">
        <div className="search-wrapper">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search messages..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="refresh-btn" onClick={fetchMessages} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={18} /> : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="error-alert">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <Loader2 className="animate-spin" size={40} />
          <p>Loading messages...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="empty-state">
          <Mail size={48} />
          <p>{searchTerm ? 'No messages match your search.' : 'No messages yet.'}</p>
        </div>
      ) : (
        <div className="messages-list">
          <AnimatePresence>
            {filteredMessages.map((msg) => (
              <motion.div 
                key={msg.id}
                className="message-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
              >
                <div className="message-header">
                  <div className="sender-info">
                    <div className="sender-avatar">
                      {msg.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4>{msg.name}</h4>
                      <p className="sender-email">{msg.email}</p>
                    </div>
                  </div>
                  <div className="message-actions">
                    <span className="message-date">
                      <Clock size={14} />
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDelete(msg.id)}
                      title="Delete message"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="message-body">
                  <p>{msg.message}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
