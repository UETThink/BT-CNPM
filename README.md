# Cinema Ticket Management System (CTMS)

Hệ thống quản lý bán vé xem phim trực tuyến được xây dựng theo chuẩn SRS (Software Requirements Specification) IEEE 830.

## Tính năng

### Người dùng (User)
- Xem danh sách phim đang chiếu và sắp chiếu
- Tìm kiếm và xem chi tiết phim
- Xem lịch chiếu theo ngày
- Đặt vé trực tuyến với chọn ghế ngồi
- Thanh toán qua nhiều phương thức
- Quản lý tài khoản cá nhân
- Xem lịch sử đặt vé

### Quản trị viên (Admin)
- Dashboard tổng quan với thống kê
- Quản lý phim (CRUD)
- Quản lý phòng chiếu
- Quản lý suất chiếu
- Xem danh sách đơn hàng
- Quản lý người dùng

## Công nghệ sử dụng

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite với Prisma ORM
- **Authentication**: JWT

## Cài đặt

### Yêu cầu
- Node.js 18+
- npm hoặc yarn

### Các bước cài đặt

1. **Clone/Download dự án**

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Tạo database và chạy migrations**
```bash
npm run db:push
```

4. **Seed data (tùy chọn)**
```bash
npm run db:seed
```

5. **Chạy development server**
```bash
npm run dev
```

6. **Mở trình duyệt**
```
http://localhost:3000
```

## Tài khoản Demo

### Admin
- Email: `admin@cinema.com`
- Password: `admin123`

### User
- Email: `user@cinema.com`
- Password: `user123`

## Cấu trúc dự án

```
cinema-ticket-system/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data script
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── admin/         # Admin pages
│   │   ├── booking/       # Booking pages
│   │   ├── dashboard/     # User dashboard
│   │   ├── movies/        # Movie pages
│   │   └── ...
│   ├── components/        # React components
│   ├── lib/               # Utilities
│   └── types/             # TypeScript types
├── docs/
│   └── SRS.md             # SRS Documentation
└── ...
```

## API Endpoints

### Movies
- `GET /api/movies` - Danh sách phim
- `GET /api/movies/[id]` - Chi tiết phim
- `POST /api/movies` - Tạo phim mới (Admin)
- `PUT /api/movies/[id]` - Cập nhật phim (Admin)
- `DELETE /api/movies/[id]` - Xóa phim (Admin)

### Showtimes
- `GET /api/showtimes` - Danh sách suất chiếu
- `GET /api/showtimes/[id]` - Chi tiết suất chiếu (kèm sơ đồ ghế)
- `POST /api/showtimes` - Tạo suất chiếu (Admin)

### Bookings
- `GET /api/bookings` - Danh sách đơn đặt vé
- `POST /api/bookings` - Tạo đơn đặt vé
- `GET /api/bookings/[id]` - Chi tiết đơn
- `PATCH /api/bookings/[id]` - Cập nhật/Hủy đơn

### Payments
- `POST /api/payments` - Thanh toán

### Auth
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập

### Dashboard
- `GET /api/dashboard` - Thống kê dashboard

## Tài liệu SRS

Xem chi tiết tài liệu SRS tại: `docs/SRS.md`

---

© 2026 CinemaTicket System
