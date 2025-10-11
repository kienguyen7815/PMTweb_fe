import React from 'react';
import { useSelector } from 'react-redux';
import './TaskCard.css';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const { user } = useSelector((state) => state.auth);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'in_progress':
        return 'status-progress';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  const canEdit = user?.role === 'admin' || user?.role === 'pm' || user?.role === 'team_leader';
  const canDelete = user?.role === 'admin' || user?.role === 'pm';

  return (
    <div className="task-card">
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="task-actions">
          {canEdit && (
            <button 
              onClick={() => onEdit(task)} 
              className="btn btn-secondary btn-sm"
            >
              ✏️
            </button>
          )}
          {canDelete && (
            <button 
              onClick={() => onDelete(task.id)} 
              className="btn btn-danger btn-sm"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      <div className="task-content">
        <p className="task-description">{task.description}</p>
        
        <div className="task-meta">
          <div className="task-info">
            <span className="task-label">Project:</span>
            <span className="task-value">{task.project?.name || 'N/A'}</span>
          </div>
          
          <div className="task-info">
            <span className="task-label">Assigned to:</span>
            <span className="task-value">{task.assignedTo?.name || 'Unassigned'}</span>
          </div>
          
          <div className="task-info">
            <span className="task-label">Due Date:</span>
            <span className="task-value">
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
            </span>
          </div>
        </div>

        <div className="task-tags">
          <span className={`task-status ${getStatusColor(task.status)}`}>
            {task.status.replace('_', ' ')}
          </span>
          <span className={`task-priority ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>

        {canEdit && (
          <div className="task-status-actions">
            <select 
              value={task.status} 
              onChange={(e) => onStatusChange(task.id, e.target.value)}
              className="status-select"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        )}
      </div>

      <div className="task-footer">
        <div className="task-progress">
          <span className="progress-label">Progress:</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${task.progress || 0}%` }}
            ></div>
          </div>
          <span className="progress-text">{task.progress || 0}%</span>
        </div>
        
        <div className="task-comments">
          <span className="comment-count">
            💬 {task.commentCount || 0} comments
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard; 