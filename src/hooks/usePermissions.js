import { useAuth } from '../contexts/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();

  if (!user) {
    return {
      isAdmin: false,
      isPM: false,
      isTL: false,
      isMember: false,
      canView: false,
      canEdit: false,
      canManageMembers: false,
      canDelete: false,
      canCreateProject: false,
      canCreateTask: false,
      canViewProjects: false,
      canViewTasks: false,
      canViewMembers: false,
      canViewReports: false,
      canViewNotifications: false,
      canViewChat: false,
      canViewMyTasks: false,
      canViewTeam: false
    };
  }

  const role = user.role;

  return {
    // Role checks
    isAdmin: role === 'ad',
    isPM: role === 'pm',
    isTL: role === 'tl',
    isMember: role === 'mb',

    // Basic permissions
    canView: ['ad', 'pm', 'tl', 'mb'].includes(role),
    canEdit: ['ad', 'pm', 'tl'].includes(role),
    canManageMembers: ['ad', 'pm', 'tl'].includes(role),
    canDelete: ['ad', 'pm', 'tl'].includes(role),

    // Project permissions
    canCreateProject: ['ad', 'pm', 'tl'].includes(role),
    canEditProject: ['ad', 'pm', 'tl'].includes(role),
    canDeleteProject: ['ad', 'pm', 'tl'].includes(role),
    canViewProjects: ['ad', 'pm', 'tl', 'mb'].includes(role),

    // Task permissions
    canCreateTask: ['ad', 'pm', 'tl'].includes(role),
    canEditTask: ['ad', 'pm', 'tl'].includes(role),
    canDeleteTask: ['ad', 'pm', 'tl'].includes(role),
    canViewTasks: ['ad', 'pm', 'tl', 'mb'].includes(role),

    // Member permissions
    canViewMembers: ['ad', 'pm', 'tl', 'mb'].includes(role),
    canAddMembers: ['ad', 'pm', 'tl'].includes(role),
    canRemoveMembers: ['ad', 'pm', 'tl'].includes(role),
    canEditUserRole: role === 'ad',

    // Feature permissions
    canViewReports: ['ad', 'pm', 'tl'].includes(role),
    canViewNotifications: ['ad', 'pm', 'tl', 'mb'].includes(role),
    canViewChat: ['ad', 'pm', 'tl', 'mb'].includes(role),
    canViewMyTasks: ['ad', 'pm', 'tl', 'mb'].includes(role),
    canViewTeam: ['ad', 'pm', 'tl'].includes(role),

    // Admin only features
    canManageUsers: ['ad', 'pm'].includes(role),
    canDeleteUsers: role === 'ad',
    canViewAllUsers: ['ad', 'pm'].includes(role),

    // Helper functions
    hasRole: (roles) => {
      if (Array.isArray(roles)) {
        return roles.includes(role);
      }
      return role === roles;
    },

    hasAnyRole: (roles) => {
      return roles.some(r => r === role);
    },

    hasAllRoles: (roles) => {
      return roles.every(r => r === role);
    },

    // Get role display name
    getRoleDisplayName: () => {
      const roleNames = {
        'ad': 'Admin',
        'pm': 'Project Manager',
        'tl': 'Team Leader',
        'mb': 'Member'
      };
      return roleNames[role] || 'Unknown';
    },

    // Get role color for UI
    getRoleColor: () => {
      const roleColors = {
        'ad': '#dc3545', // Red
        'pm': '#007bff', // Blue
        'tl': '#28a745', // Green
        'mb': '#6c757d'  // Gray
      };
      return roleColors[role] || '#6c757d';
    }
  };
};

export default usePermissions;
