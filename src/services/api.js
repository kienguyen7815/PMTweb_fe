import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3036/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor để thêm token và workspace_id
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Thêm workspace_id từ localStorage nếu có (được set bởi WorkspaceContext)
    const workspaceId = localStorage.getItem('currentWorkspaceId');
    if (workspaceId) {
      config.headers['x-workspace-id'] = workspaceId;
      // Nếu là POST/PUT và có body, thêm workspace_id vào body nếu chưa có
      if ((config.method === 'post' || config.method === 'put') && config.data && typeof config.data === 'object' && !(config.data instanceof FormData)) {
        if (!config.data.workspace_id) {
          config.data.workspace_id = parseInt(workspaceId);
        }
      }
      // Nếu là GET, thêm vào query params nếu chưa có
      if (config.method === 'get' && !config.params?.workspace_id) {
        if (!config.params) config.params = {};
        config.params.workspace_id = workspaceId;
      }
    }
    
    // Đảm bảo Content-Type được set đúng (trừ khi là FormData)
    // Với FormData, để browser tự động set Content-Type với boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    // Logging chỉ trong development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        workspaceId: workspaceId || 'none'
      });
    }
    
    return config;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Request interceptor error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
      });
    }
    return response;
  },
  (error) => {
    // Logging chỉ trong development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
      });
    }
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      // Chỉ redirect nếu không phải đang ở trang login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 