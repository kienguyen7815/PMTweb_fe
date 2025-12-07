import { io } from 'socket.io-client';

let socket = null;
let currentSocketWorkspaceId = null; // Lưu workspace_id của socket hiện tại

const getSocket = () => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    console.error('No token found for socket connection');
    return null;
  }

  // Lấy workspace_id hiện tại từ localStorage
  const currentWorkspaceId = localStorage.getItem('currentWorkspaceId');
  const newWorkspaceId = currentWorkspaceId ? parseInt(currentWorkspaceId) : null;
  
  // Kiểm tra xem workspace_id có thay đổi không
  if (socket && socket.connected) {
    // Nếu workspace_id thay đổi, disconnect và tạo socket mới
    if (currentSocketWorkspaceId !== newWorkspaceId) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Workspace changed, reconnecting socket. Old:', currentSocketWorkspaceId, 'New:', newWorkspaceId);
      }
      socket.disconnect();
      socket = null;
      currentSocketWorkspaceId = null;
    } else {
      // Workspace không đổi, return socket hiện tại
      return socket;
    }
  }

  // If socket exists but not connected, try to reconnect
  if (socket && !socket.connected) {
    console.log('Socket exists but not connected, attempting to reconnect...');
    socket.connect();
    return socket;
  }

  // Create new socket
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3036';
  
  // Lấy workspace_id từ localStorage nếu có
  const workspaceId = localStorage.getItem('currentWorkspaceId');
  
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('Socket connecting with workspace_id:', workspaceId);
  }
  
  const workspaceIdForSocket = workspaceId ? parseInt(workspaceId) : null;
  currentSocketWorkspaceId = workspaceIdForSocket; // Lưu workspace_id của socket này
  
  socket = io(API_BASE_URL, {
    auth: {
      token: token,
      workspace_id: workspaceIdForSocket
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 2000, // Tăng delay từ 1s lên 2s
    reconnectionDelayMax: 10000, // Tăng max delay từ 5s lên 10s
    reconnectionAttempts: 3, // Giảm từ 5 xuống 3 attempts
    timeout: 20000 // Thêm timeout 20s
  });

  socket.on('connect', () => {
    console.log('Socket connected, ID:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    if (reason === 'io server disconnect') {
      // Server disconnected, need to reconnect manually
      socket.connect();
    }
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('Socket reconnected after', attemptNumber, 'attempts');
  });

  socket.on('reconnect_error', (error) => {
    console.error('Socket reconnection error:', error);
  });

  socket.on('reconnect_failed', () => {
    console.error('Socket reconnection failed');
  });

  return socket;
};

const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentSocketWorkspaceId = null;
  }
};

export { getSocket, disconnectSocket };

