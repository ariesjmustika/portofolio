import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Eye, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMessages: 0,
    newMessages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { count, error } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;

      setStats({
        totalMessages: count || 0,
        newMessages: 0 // Logic for 'new' can be added later (e.g., status column)
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Messages', value: stats.totalMessages, icon: <MessageSquare size={24} />, color: '#6366f1' },
    { title: 'New Today', value: '0', icon: <TrendingUp size={24} />, color: '#10b981' },
    { title: 'Total Visitors', value: '1.2k', icon: <Eye size={24} />, color: '#f59e0b' },
    { title: 'Avg. Response', value: '2h', icon: <Users size={24} />, color: '#8b5cf6' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        {statCards.map((card, index) => (
          <motion.div 
            key={index}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="card-icon" style={{ backgroundColor: `${card.color}20`, color: card.color }}>
              {card.icon}
            </div>
            <div className="card-content">
              <p className="card-title">{card.title}</p>
              <h3 className="card-value">{loading ? '...' : card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-placeholder">
          <p>No recent activity to show.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
