import { io } from 'socket.io-client';

let socket = null;

const getSocket = () => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    console.error('No token found for socket connection');
    return null;
  }

  // If socket exists and is connected, return it
  if (socket && socket.connected) {
    return socket;
  }

  // If socket exists but not connected, try to reconnect
  if (socket && !socket.connected) {
    console.log('Socket exists but not connected, attempting to reconnect...');
    socket.connect();
    return socket;
  }

  // Create new socket
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3036';
  
  socket = io(API_BASE_URL, {
    auth: {
      token: token
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
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
  }
};

export { getSocket, disconnectSocket };

