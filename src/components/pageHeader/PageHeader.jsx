import React from 'react';
import './PageHeader.css';

const PageHeader = ({ 
  icon = 'fa-folder', 
  title, 
  subtitle, 
  badge, 
  badgeIcon,
  actions = [],
  className = '' 
}) => {
  return (
    <div className={`page-header ${className}`}>
      <div className="header-content">
        <div className="header-icon-wrapper">
          <i className={`fas ${icon}`}></i>
        </div>
        <div>
          <h1>{title}</h1>
          {subtitle && <p className="subtitle">{subtitle}</p>}
        </div>
      </div>
      {(badge || actions.length > 0) && (
        <div className="header-actions">
          {badge && (
            <span className="badge-prj">
              {badgeIcon && <i className={`fas ${badgeIcon}`}></i>}
              {badge}
            </span>
          )}
          {actions.map((action, index) => (
            <button
              key={index}
              className={action.className || 'primary'}
              onClick={action.onClick}
              type={action.type || 'button'}
              disabled={action.disabled}
            >
              {action.icon && <i className={`fas ${action.icon}`}></i>}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PageHeader;

