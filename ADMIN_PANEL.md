# 🚀 TaskHub Admin Panel - Hướng dẫn sử dụng

## 📋 Tổng quan

Admin Panel là giao diện quản trị toàn diện cho hệ thống TaskHub, cho phép administrators giám sát và quản lý tất cả các khía cạnh của ứng dụng.

## 🔑 Truy cập Admin Panel

### URL
```
http://localhost:3000/admin
```

### Yêu cầu
- Đăng nhập với tài khoản có role `admin`
- Token JWT hợp lệ

### Tạo tài khoản Admin
```sql
-- Cập nhật user hiện tại thành admin
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

## 📊 Các tính năng chính

### 1. Dashboard (Tổng quan)
**Path:** `/admin` (view mặc định)

**Chức năng:**
- ✅ Thống kê tổng quan (Users, Workspaces, Projects, Tasks)
- ✅ Biểu đồ tăng trưởng người dùng (6 tháng gần nhất)
- ✅ Top 5 người dùng hoạt động nhiều nhất
- ✅ Phân bố người dùng theo role
- ✅ Phân bố dự án theo trạng thái
- ✅ 10 hoạt động gần nhất

**Metrics hiển thị:**
- Total Users
- Total Workspaces
- Total Projects
- Total Tasks
- User growth trend
- User by roles (admin, pm, tl, mb, user)
- Projects by status
- Recent activities timeline

---

### 2. User Management (Quản lý người dùng)
**Path:** `/admin` → Click "Quản lý người dùng"

**Chức năng:**

#### ✅ Xem danh sách users
- Pagination (20 users/page)
- Search theo tên hoặc email
- Filter theo role
- Hiển thị thống kê: workspaces, projects, tasks count

#### ✅ Xem chi tiết user
- Thông tin cơ bản (ID, username, email, role, created_at)
- Thống kê tổng quan
- Danh sách workspaces
- Danh sách projects
- Danh sách tasks
- 20 hoạt động gần nhất

#### ✅ Thay đổi role
- Nâng cấp user → admin
- Hạ cấp admin → user
- **Không thể tự hạ cấp chính mình**

#### ✅ Xóa user
- Xóa vĩnh viễn (CASCADE delete)
- Confirmation required
- **Không thể xóa chính mình**

**Keyboard shortcuts:**
- `Ctrl+F` / `Cmd+F`: Focus search input
- `Enter`: Submit search

---

### 3. Workspace Monitoring (Giám sát Workspaces)
**Path:** `/admin` → Click "Workspaces"

**Chức năng:**

#### ✅ Xem tất cả workspaces
- Grid layout (card-based)
- Search theo tên
- Pagination
- Hiển thị:
  - Tên workspace
  - Description
  - Owner info
  - Members count
  - Projects count
  - Created date

#### ✅ Xem chi tiết workspace
- Thông tin workspace
- Owner details
- Danh sách members (với role trong workspace)
- Danh sách projects

#### ✅ Xóa workspace
- Xóa vĩnh viễn (CASCADE delete)
- Confirmation required
- **Lưu ý:** Sẽ xóa tất cả projects, tasks liên quan

---

### 4. Activity Logs (Nhật ký hoạt động)
**Path:** `/admin` → Click "Activity Logs"

**Chức năng:**

#### ✅ Xem activity logs
- Timeline view
- Pagination (50 logs/page)
- Real-time updates

#### ✅ Filters nâng cao
- **Action:** Tìm theo action name
- **Target Table:** Filter theo bảng (users, workspaces, prj, tasks...)
- **Date Range:** Từ ngày → Đến ngày
- **Clear filters:** Xóa tất cả bộ lọc

#### ✅ Thông tin hiển thị
- Action type (create, update, delete, login...)
- Target table
- Description
- Username
- Target ID
- Timestamp (relative time)
- Color coding theo action type

**Action colors:**
- 🟢 Create: Green
- 🔵 Update: Blue
- 🔴 Delete: Red
- 🟣 Login/Logout: Purple
- ⚪ Other: Gray

---

### 5. System Settings (Cài đặt hệ thống)
**Path:** `/admin` → Click "Cài đặt hệ thống"

**Chức năng:**

#### ✅ System Information
- Node.js version
- MySQL version
- Environment (development/production)
- Server uptime

#### ✅ Database Tables
- Danh sách tất cả tables
- Số lượng rows
- Kích thước (MB)
- Sorted by size (descending)

#### ✅ Configuration Info
- Environment details
- Runtime information
- Database connection info

---

## 🎨 UI Components & Design

### Color Scheme
- **Primary:** `#3b82f6` (Blue)
- **Success:** `#10b981` (Green)
- **Warning:** `#f59e0b` (Orange)
- **Danger:** `#ef4444` (Red)
- **Purple:** `#8b5cf6`

### Sidebar
- Fixed position
- Width: 280px
- Gradient background (Blue theme)
- Sticky user info
- Active state indicators

### Cards
- Border radius: 12px
- Box shadow: subtle
- Hover effects: lift & shadow
- Responsive grid

### Badges
- Role badges: Color coded
- Status badges: Dynamic colors
- Rounded corners

---

## 🔒 Security & Permissions

### Authentication
```javascript
// Backend middleware chain
authenticateToken → requireAdmin → controller
```

### Authorization
- Tất cả admin routes yêu cầu `role = 'admin'`
- Global scope only (không áp dụng trong workspace)
- Token validation qua JWT
- Session expiration: 7 days (default)

### Protected Actions
- ❌ Admin không thể xóa chính mình
- ❌ Admin không thể hạ cấp chính mình
- ✅ Admin có thể xem tất cả workspaces
- ✅ Admin có thể xóa bất kỳ user/workspace nào (trừ chính mình)

---

## 📡 API Endpoints

### Dashboard
```
GET /api/admin/dashboard/stats
```

### User Management
```
GET    /api/admin/users                 # List users
GET    /api/admin/users/:id             # User detail
PUT    /api/admin/users/:id/role        # Update role
PUT    /api/admin/users/:id/status      # Block/Unblock
DELETE /api/admin/users/:id             # Delete user
```

### Workspace Monitoring
```
GET    /api/admin/workspaces            # List workspaces
GET    /api/admin/workspaces/:id        # Workspace detail
DELETE /api/admin/workspaces/:id        # Delete workspace
```

### Activity Logs
```
GET /api/admin/logs                     # List logs
GET /api/admin/logs/stats               # Log statistics
```

### System Settings
```
GET /api/admin/system/info              # System information
```

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd PMTweb_be

# Ensure admin routes are imported
# File: server.js
# Line: app.use('/api/admin', adminRoutes);
```

### 2. Frontend Setup
```bash
cd PMTweb_fe

# Ensure admin pages are created
# Path: src/pages/admin/
```

### 3. Create Admin User
```sql
-- Method 1: Update existing user
UPDATE users SET role = 'admin' WHERE id = 1;

-- Method 2: Register and then update
-- Register via /api/auth/register
-- Then update role in database
```

### 4. Access Admin Panel
```
1. Login với tài khoản admin
2. Navigate to http://localhost:3000/admin
3. Hoặc click "Admin Panel" trong menu (nếu có)
```

---

## 🎯 Use Cases

### Case 1: Quản lý User mới đăng ký
```
1. Vào User Management
2. Tìm user mới (search by email)
3. Xem chi tiết user
4. Nếu cần: Thay đổi role hoặc xóa nếu spam
```

### Case 2: Giám sát Workspace hoạt động
```
1. Vào Workspace Monitoring
2. Xem tổng quan workspaces
3. Click vào workspace để xem detail
4. Kiểm tra members và projects
5. Xóa nếu workspace vi phạm policy
```

### Case 3: Điều tra sự cố
```
1. Vào Activity Logs
2. Filter theo user_id hoặc date range
3. Tìm action gây ra issue
4. Xem details (target_table, target_id)
5. Take action (xóa user, restore data...)
```

### Case 4: Kiểm tra hiệu suất hệ thống
```
1. Vào System Settings
2. Check uptime
3. Review database table sizes
4. Identify largest tables
5. Plan optimization
```

---

## 📊 Metrics & Analytics

### Dashboard Metrics
- **User Growth:** Line chart (6 months)
- **Top Active Users:** Ranked by task count
- **Role Distribution:** Pie chart data
- **Status Distribution:** Project status breakdown

### User Metrics
- Workspaces count per user
- Projects count per user
- Tasks assigned per user
- Activity count per user

### Workspace Metrics
- Members count per workspace
- Projects count per workspace
- Age of workspace

---

## 🛠️ Troubleshooting

### Issue: "Không có quyền truy cập"
**Giải pháp:**
```sql
-- Check user role
SELECT id, username, email, role FROM users WHERE email = 'your-email';

-- Update to admin
UPDATE users SET role = 'admin' WHERE email = 'your-email';
```

### Issue: "Token đã hết hạn"
**Giải pháp:**
1. Logout
2. Login lại
3. Token mới sẽ được tạo (7 days expiry)

### Issue: "Cannot read properties of undefined"
**Giải pháp:**
1. Kiểm tra backend đang chạy
2. Check network tab (F12)
3. Verify API endpoint responses
4. Check console for errors

---

## 🔄 Future Enhancements

### Planned Features
- [ ] Bulk user operations (delete multiple, change roles)
- [ ] Export logs to CSV/PDF
- [ ] Real-time notifications
- [ ] Email configuration UI
- [ ] Backup & Restore UI
- [ ] Advanced analytics dashboard
- [ ] IP whitelist/blacklist management
- [ ] Session management (force logout)
- [ ] Custom reports builder

---

## 📞 Support

### Liên hệ
- **Email:** hannd@rikkeisoft.com
- **Division:** DN1

### Documentation
- Backend API: `PMTweb_be/README.md`
- Frontend: `PMTweb_fe/README.md`
- Setup Guide: `PMTweb_be/SETUP.md`

---

## 🎉 Congratulations!

Bạn đã có một **Admin Panel hoàn chỉnh** với:
- ✅ Dashboard tổng quan
- ✅ User Management (CRUD + role management)
- ✅ Workspace Monitoring
- ✅ Activity Logs Viewer
- ✅ System Settings

**Happy Managing! 🚀**

