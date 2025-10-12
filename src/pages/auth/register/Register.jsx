import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    district: '',
    address: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý đăng ký ở đây
    console.log('Register form data:', formData);
  };

  const handleGoogleRegister = () => {
    // Xử lý đăng ký Google
    console.log('Google register');
  };

  const handleFacebookRegister = () => {
    // Xử lý đăng ký Facebook
    console.log('Facebook register');
  };

  return (
    <div className="reg-container">
      <div className="reg-card">
        <div className="reg-header">
          <h2>Đăng Ký</h2>
          <p>Tạo tài khoản mới của bạn!</p>
        </div>

        <form onSubmit={handleSubmit} className="reg-form">
          <div className="reg-row">
            <div className="reg-group">
              <label htmlFor="firstName">Họ</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Nhập họ của bạn"
                required
              />
            </div>
            <div className="reg-group">
              <label htmlFor="lastName">Tên</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Nhập tên của bạn"
                required
              />
            </div>
          </div>

          <div className="reg-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Nhập email của bạn"
              required
            />
          </div>

          <div className="reg-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Nhập số điện thoại"
              required
            />
          </div>

          <div className="reg-row">
            <div className="reg-group">
              <label htmlFor="city">Thành phố (Tỉnh)</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Nhập thành phố/tỉnh"
                required
              />
            </div>
            <div className="reg-group">
              <label htmlFor="district">Quận/Huyện</label>
              <input
                type="text"
                id="district"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                placeholder="Nhập quận/huyện"
                required
              />
            </div>
          </div>

          <div className="reg-group">
            <label htmlFor="address">Địa chỉ</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Nhập địa chỉ chi tiết"
              required
            />
          </div>

          <div className="reg-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="reg-password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu"
                required
              />
              <button
                type="button"
                className="reg-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button type="submit" className="reg-button">
            Đăng Ký
          </button>
        </form>

        <div className="reg-divider">
          <span>Hoặc đăng ký bằng</span>
        </div>

        <div className="reg-social">
          <button
            type="button"
            className="reg-social-btn reg-google-btn"
            onClick={handleGoogleRegister}
          >
            <svg className="reg-social-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>

          <button
            type="button"
            className="reg-social-btn reg-facebook-btn"
            onClick={handleFacebookRegister}
          >
            <svg className="reg-social-icon" viewBox="0 0 24 24">
              <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        <div className="reg-footer">
          <p>Đã có tài khoản? <a href="/login">Đăng nhập ngay</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
