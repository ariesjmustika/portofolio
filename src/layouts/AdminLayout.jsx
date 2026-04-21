import React from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  LogOut, 
  User,
  Menu,
  X,
  Palette,
  Home as HomeIcon,
  Briefcase,
  Layers
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { themes } from '../components/ThemeSwitcher';
import './AdminLayout.css';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [activeTheme, setActiveTheme] = React.useState('light');

  React.useEffect(() => {
    const savedThemeId = localStorage.getItem('admin-theme') || 'light';
    const theme = themes.find(t => t.id === savedThemeId);
    if (theme) {
      setActiveTheme(theme.id);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const changeTheme = (themeId) => {
    localStorage.setItem('admin-theme', themeId);
    setActiveTheme(themeId);
  };

  const getThemeVars = () => {
    const theme = themes.find(t => t.id === activeTheme);
    if (!theme) return {};
    return {
      '--bg-primary': theme.bgPrimary,
      '--bg-secondary': theme.bgSecondary,
      '--bg-tertiary': theme.bgTertiary,
      '--text-primary': theme.textPrimary,
      '--text-secondary': theme.textSecondary,
      '--accent': theme.accent,
      '--accent-glow': theme.glow,
      '--accent-hover': theme.hover,
      '--border-color': theme.id === 'light' ? '#e2e8f0' : 'rgba(255,255,255,0.1)'
    };
  };

  return (
    <div className={`admin-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} style={getThemeVars()}>
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="logo-text">AdminPanel</div>
          <button className="mobile-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/admin" end className={({ isActive }) => isActive ? 'active' : ''}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/hero" className={({ isActive }) => isActive ? 'active' : ''}>
            <HomeIcon size={20} />
            <span>Hero Section</span>
          </NavLink>
          <NavLink to="/admin/experience" className={({ isActive }) => isActive ? 'active' : ''}>
            <Briefcase size={20} />
            <span>Experience</span>
          </NavLink>
          <NavLink to="/admin/projects" className={({ isActive }) => isActive ? 'active' : ''}>
            <Layers size={20} />
            <span>Projects</span>
          </NavLink>
          <NavLink to="/admin/messages" className={({ isActive }) => isActive ? 'active' : ''}>
            <MessageSquare size={20} />
            <span>Messages</span>
          </NavLink>
          <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'active' : ''}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="theme-selector-admin mb-6">
            <p className="section-title">Theme</p>
            <div className="theme-dots">
              {themes.map(t => (
                <button 
                  key={t.id}
                  className={`theme-dot ${activeTheme === t.id ? 'active' : ''}`}
                  style={{ backgroundColor: t.accent }}
                  onClick={() => changeTheme(t.id)}
                  title={t.name}
                />
              ))}
            </div>
          </div>

          <div className="user-info">
            <div className="avatar">
              <User size={18} />
            </div>
            <div className="details">
              <p className="email">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu size={24} />
          </button>
          <h2>{document.title.split(' | ')[1] || 'Dashboard'}</h2>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
