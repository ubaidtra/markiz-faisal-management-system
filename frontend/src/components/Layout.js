import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  FiLayout, FiUsers, FiUser, FiBook, FiDollarSign, 
  FiTrendingDown, FiBarChart2, FiBell 
} from 'react-icons/fi';
import { FaMosque } from 'react-icons/fa';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiLayout, color: 'var(--primary-color)', roles: ['admin', 'teacher', 'accountant'] },
    { path: '/students', label: 'Students', icon: FiUsers, color: 'var(--color-indigo)', roles: ['admin', 'teacher'] },
    { path: '/teachers', label: 'Teachers', icon: FiUser, color: 'var(--color-purple)', roles: ['admin'] },
    { path: '/halqas', label: 'Halqas', icon: FaMosque, color: 'var(--color-teal)', roles: ['admin'] },
    { path: '/quran-progress', label: 'Quran Progress', icon: FiBook, color: 'var(--secondary-color)', roles: ['admin', 'teacher'] },
    { path: '/fees', label: 'Fees', icon: FiDollarSign, color: 'var(--color-amber)', roles: ['admin', 'accountant'] },
    { path: '/withdrawals', label: 'Withdrawals', icon: FiTrendingDown, color: 'var(--color-rose)', roles: ['admin', 'accountant'] },
    { path: '/reports', label: 'Reports', icon: FiBarChart2, color: 'var(--color-cyan)', roles: ['admin', 'teacher', 'accountant'] },
    { path: '/notifications', label: 'Notifications', icon: FiBell, color: 'var(--color-pink)', roles: ['admin', 'teacher', 'accountant'] }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-left">
            <Link to="/dashboard" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
              <img src="/logo.jpg" alt="Logo" className="logo-img" />
              <span className="logo-text">Faisal Center</span>
            </Link>
            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
          <div className={`nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            {filteredMenuItems.map(item => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ '--nav-color': item.color }}
                >
                  <span className="nav-icon">
                    <IconComponent />
                  </span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="nav-user">
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{user?.role}</span>
            </div>
            <Link to="/profile" className="profile-link">Profile</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;

