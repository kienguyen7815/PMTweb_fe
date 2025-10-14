# Frontend Authentication System

## Tính năng đã phát triển

### 1. Authentication Context
- Quản lý state authentication toàn cục
- Tự động kiểm tra token khi app khởi động
- Cung cấp các method: login, register, logout, updateProfile

### 2. Protected Routes
- Bảo vệ các route cần authentication
- Tự động redirect đến login nếu chưa đăng nhập
- Redirect về trang trước đó sau khi đăng nhập thành công

### 3. Form Validation
- Validation real-time cho form đăng ký
- Hiển thị error messages rõ ràng
- Styling cho input có lỗi

### 4. Error Handling
- Xử lý lỗi từ API một cách nhất quán
- Hiển thị thông báo lỗi user-friendly
- Logging lỗi để debug

### 5. UI/UX Improvements
- Responsive design
- Loading states
- Error styling
- User feedback

## Cách sử dụng

### 1. Cấu hình API
Tạo file `.env` trong thư mục Frontend:
```
REACT_APP_API_BASE_URL=http://localhost:3036/api
```

### 2. Chạy ứng dụng
```bash
cd Frontend
npm start
```

### 3. Test authentication
- Truy cập `/register` để đăng ký tài khoản mới
- Truy cập `/login` để đăng nhập
- Sau khi đăng nhập thành công sẽ được redirect về trang chủ
- Header sẽ hiển thị tên user và nút đăng xuất

## API Endpoints được sử dụng

- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập  
- `GET /api/auth/profile` - Lấy thông tin profile
- `PUT /api/auth/profile` - Cập nhật profile
- `PUT /api/auth/change-password` - Đổi mật khẩu

## Components chính

- `AuthContext` - Quản lý authentication state
- `ProtectedRoute` - Bảo vệ routes
- `Login` - Trang đăng nhập
- `Register` - Trang đăng ký
- `Header` - Header với thông tin user

## Styling

- CSS modules cho từng component
- Responsive design
- Error states styling
- Loading states
- Modern UI với animations
