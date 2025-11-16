import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  allowedRoles = [], 
  requireAdmin = false,
  requirePMOrAdmin = false,
  requireLeaderOrAbove = false 
}) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Hiển thị loading khi đang kiểm tra authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Đang tải...
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Kiểm tra quyền truy cập dựa trên role
  if (isAuthenticated && user) {
    const userRole = user.role;

    // Kiểm tra quyền Admin
    if (requireAdmin && userRole !== 'ad') {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '18px',
          color: 'red'
        }}>
          Bạn không có quyền truy cập trang này. Chỉ Admin mới có quyền.
        </div>
      );
    }

    // Kiểm tra quyền PM hoặc Admin
    if (requirePMOrAdmin && !['ad', 'pm'].includes(userRole)) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '18px',
          color: 'red'
        }}>
          Bạn không có quyền truy cập trang này. Chỉ Project Manager hoặc Admin mới có quyền.
        </div>
      );
    }

    // Kiểm tra quyền Team Leader trở lên
    if (requireLeaderOrAbove && !['ad', 'pm', 'tl'].includes(userRole)) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '18px',
          color: 'red'
        }}>
          Bạn không có quyền truy cập trang này. Chỉ Team Leader, Project Manager hoặc Admin mới có quyền.
        </div>
      );
    }

    // Kiểm tra danh sách role được phép
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '18px',
          color: 'red'
        }}>
          Bạn không có quyền truy cập trang này.
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;

