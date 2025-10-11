import React from 'react';
import { useSelector } from 'react-redux';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: '📊',
      path: '/dashboard',
      roles: ['admin', 'pm', 'team_leader', 'member', 'client']
    },
    {
      title: 'Projects',
      icon: '📁',
      path: '/projects',
      roles: ['admin', 'pm', 'team_leader', 'member', 'client']
    },
    {
      title: 'Tasks',
      icon: '✅',
      path: '/tasks',
      roles: ['admin', 'pm', 'team_leader', 'member']
    },
    {
      title: 'My Tasks',
      icon: '📋',
      path: '/my-tasks',
      roles: ['admin', 'pm', 'team_leader', 'member']
    },
    {
      title: 'Users',
      icon: '👥',
      path: '/users',
      roles: ['admin', 'pm', 'team_leader']
    },
    {
      title: 'Reports',
      icon: '📈',
      path: '/reports',
      roles: ['admin', 'pm']
    },
    {
      title: 'Settings',
      icon: '⚙️',
      path: '/settings',
      roles: ['admin']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Menu</h3>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {filteredMenuItems.map((item, index) => (
            <li key={index} className="sidebar-item">
              <a href={item.path} className="sidebar-link">
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-text">{item.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
          <div className="user-details">
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 