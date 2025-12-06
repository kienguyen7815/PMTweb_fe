import api from './api';

const authService = {
  // Đăng nhập
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.success && response.data.data.token) {
        sessionStorage.setItem('token', response.data.data.token);
        sessionStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Login error:', error);
      }
      
      // Xử lý validation errors từ backend
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map(err => err.message).join(', ');
        throw new Error(errorMessages);
      }
      
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi kết nối đến server';
      throw new Error(errorMessage);
    }
  },

  // Đăng ký
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.success && response.data.data.token) {
        sessionStorage.setItem('token', response.data.data.token);
        sessionStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Register error:', error);
      }
      
      // Xử lý validation errors từ backend
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map(err => err.message).join(', ');
        throw new Error(errorMessages);
      }
      
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi kết nối đến server';
      throw new Error(errorMessage);
    }
  },

  // Đăng xuất
  logout: () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: () => {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Kiểm tra token có hợp lệ không
  isAuthenticated: () => {
    return !!sessionStorage.getItem('token');
  },

  // Lấy thông tin profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Get profile error:', error);
      }
      throw error.response?.data || { success: false, message: 'Lỗi kết nối' };
    }
  },

  // Cập nhật profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      
      if (response.data.success && response.data.data.user) {
        sessionStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Profile update error:', error);
      }
      
      // Xử lý validation errors từ backend
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map(err => err.message).join(', ');
        throw new Error(errorMessages);
      }
      
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi kết nối đến server';
      throw new Error(errorMessage);
    }
  },

  // Đổi mật khẩu
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Lỗi kết nối' };
    }
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    try {
      // Validate file trước khi upload
      if (!file) {
        throw new Error('Không có file được chọn');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('File phải là ảnh (jpeg, jpg, png, gif, webp)');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Kích thước file không được vượt quá 5MB');
      }

      const formData = new FormData();
      formData.append('avatar', file);

      // Không set Content-Type, để axios tự động set với boundary cho FormData
      const response = await api.post('/auth/profile/avatar', formData);
      
      if (response.data.success && response.data.data.user) {
        sessionStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Upload avatar error:', error);
        console.error('Error response:', error.response?.data);
      }
      
      // Xử lý validation errors từ backend
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map(err => err.message).join(', ');
        throw new Error(errorMessages);
      }
      
      // Xử lý multer errors
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      const errorMessage = error.message || 'Lỗi kết nối đến server';
      throw new Error(errorMessage);
    }
  },
};

export default authService; 