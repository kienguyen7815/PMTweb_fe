import { Routes, Route } from 'react-router-dom';
import Home from '../pages/home/Home';
import NotFound from '../pages/notFound/NotFound';
import Login from '../pages/auth/login/Login';
import Register from '../pages/auth/register/Register';
import ProtectedRoute from '../components/protectedRoute/ProtectedRoute';
import Dashboard from '../pages/dashboard/Dashboard';
import Projects from '../pages/projects/Projects';
import Tasks from '../pages/tasks/Tasks';
import MyTasks from '../pages/myTasks/MyTasks';
import Team from '../pages/team/Team';
import Notifications from '../pages/notifications/Notifications';
import Reports from '../pages/reports/Reports';
import Chat from '../pages/chat/Chat';
import Profile from '../pages/profile/Profile';
import AIChat from '../pages/aiChat/AIChat';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      {/* Dashboard - Tất cả role đã đăng nhập */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['ad', 'pm', 'tl', 'mb']}>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* Projects - Tất cả role có thể xem */}
      <Route path="/projects" element={
        <ProtectedRoute allowedRoles={['ad', 'pm', 'tl', 'mb']}>
          <Projects />
        </ProtectedRoute>
      } />
      
      {/* Tasks - Tất cả role có thể xem */}
      <Route path="/tasks" element={
        <ProtectedRoute allowedRoles={['ad', 'pm', 'tl', 'mb']}>
          <Tasks />
        </ProtectedRoute>
      } />
      
      {/* My Tasks - Tất cả role */}
      <Route path="/my-tasks" element={
        <ProtectedRoute allowedRoles={['ad', 'pm', 'tl', 'mb']}>
          <MyTasks />
        </ProtectedRoute>
      } />
      
      {/* Team - Chỉ TL, PM, Admin */}
      <Route path="/team" element={
        <ProtectedRoute requireLeaderOrAbove={true}>
          <Team />
        </ProtectedRoute>
      } />
      
      {/* Notifications - Tất cả role */}
      <Route path="/notifications" element={
        <ProtectedRoute allowedRoles={['ad', 'pm', 'tl', 'mb']}>
          <Notifications />
        </ProtectedRoute>
      } />
      
      {/* Reports - Chỉ TL, PM, Admin */}
      <Route path="/reports" element={
        <ProtectedRoute requireLeaderOrAbove={true}>
          <Reports />
        </ProtectedRoute>
      } />
      
      {/* Chat - Tất cả role */}
      <Route path="/chat" element={
        <ProtectedRoute allowedRoles={['ad', 'pm', 'tl', 'mb']}>
          <Chat />
        </ProtectedRoute>
      } />
      
      {/* AI Chat - Tất cả role */}
      <Route path="/ai-chat" element={
        <ProtectedRoute allowedRoles={['ad', 'pm', 'tl', 'mb']}>
          <AIChat />
        </ProtectedRoute>
      } />
      
      {/* Profile - Tất cả role */}
      <Route path="/profile" element={
        <ProtectedRoute allowedRoles={['ad', 'pm', 'tl', 'mb']}>
          <Profile />
        </ProtectedRoute>
      } />
      
      {/* Auth routes - Không cần đăng nhập */}
      <Route path="/login" element={
        <ProtectedRoute requireAuth={false}>
          <Login />
        </ProtectedRoute>
      } />
      <Route path="/register" element={
        <ProtectedRoute requireAuth={false}>
          <Register />
        </ProtectedRoute>
      } />
      
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter; 