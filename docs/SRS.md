# Cinema Ticket Management System (CTMS)
## Software Requirements Specification (SRS)
### Theo chuẩn IEEE 830-1998

---

**Version:** 1.0  
**Date:** April 28, 2026  
**Author:** CTMS Development Team  

---

## Mục lục

1. [Giới thiệu](#1-giới-thiệu)
2. [Mô tả tổng quan](#2-mô-tả-tổng-quan)
3. [Yêu cầu chức năng](#3-yêu-cầu-chức-năng)
4. [Yêu cầu phi chức năng](#4-yêu-cầu-phi-chức-năng)
5. [Giao diện](#5-giao-diện)
6. [Ràng buộc thiết kế](#6-ràng-buộc-thiết-kế)
7. [Phụ lục](#7-phụ-lục)

---

## 1. Giới thiệu

### 1.1 Mục đích

Tài liệu này mô tả đầy đủ các yêu cầu về phần mềm cho hệ thống **Cinema Ticket Management System (CTMS)**. Mục đích của hệ thống là cung cấp một nền tảng trực tuyến cho phép khách hàng xem thông tin phim, đặt vé xem phim và quản lý các hoạt động rạp chiếu phim một cách hiệu quả.

### 1.2 Phạm vi

CTMS là một ứng dụng web cho phép:
- Khách hàng xem danh sách phim đang chiếu và sắp chiếu
- Đặt vé xem phim trực tuyến
- Chọn ghế ngồi theo sơ đồ phòng chiếu
- Thực hiện thanh toán vé
- Quản lý tài khoản cá nhân
- Quản trị viên quản lý phim, suất chiếu, phòng chiếu

### 1.3 Định nghĩa, từ viết tắt

| Thuật ngữ | Định nghĩa |
|-----------|------------|
| CTMS | Cinema Ticket Management System |
| SRS | Software Requirements Specification |
| User | Người dùng hệ thống (khách hàng) |
| Admin | Quản trị viên hệ thống |
| Movie | Phim |
| Showtime | Suất chiếu |
| Booking | Đặt vé |
| Seat | Ghế ngồi |
| Payment | Thanh toán |

### 1.4 Tài liệu tham khảo

- IEEE Std 830-1998: IEEE Recommended Practice for Software Requirements Specifications
- ISO/IEC 25010:2011 - Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE)

---

## 2. Mô tả tổng quan

### 2.1 Góc nhìn sản phẩm

CTMS là hệ thống quản lý bán vé xem phim trực tuyến, hoạt động như một cầu nối giữa:
- **Khách hàng**: Người muốn xem phim và đặt vé
- **Rạp phim**: Quản lý lịch chiếu, phòng chiếu, vé bán ra

### 2.2 Người dùng mục tiêu

| Loại người dùng | Mô tả | Vai trò |
|-----------------|-------|---------|
| Guest | Khách chưa có tài khoản | Xem phim, thông tin suất chiếu |
| Customer | Khách có tài khoản | Đặt vé, thanh toán, xem lịch sử đặt vé |
| Admin | Quản trị viên | Quản lý phim, suất chiếu, phòng chiếu, xem báo cáo |

### 2.3 Chức năng chính

```
┌─────────────────────────────────────────────────────────────────┐
│                    Cinema Ticket Management System               │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │
│  │  Khách hàng │  │   Đặt vé   │  │  Thanh toán │  │   Admin  │ │
│  │   (User)    │  │  (Booking) │  │  (Payment)  │  │ (Admin)  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └──────────┘ │
│         │                │                │            │       │
│         ▼                ▼                ▼            ▼       │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Database (SQLite)                        ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### 2.4 Luồng hoạt động chính

```
[Khách xem phim] → [Chọn phim] → [Chọn suất chiếu] → [Chọn ghế]
        ↓                                                        ↓
[Xem thông tin] ← ← ← ← ← ← [Thanh toán] → [Xác nhận] → [Gửi vé]
```

---

## 3. Yêu cầu chức năng

### 3.1 Module Quản lý Phim (Movies)

#### FR-3.1.1: Xem danh sách phim
- **Mô tả**: Hiển thị danh sách tất cả phim đang chiếu và sắp chiếu
- **Dữ liệu hiển thị**: 
  - Poster phim
  - Tên phim
  - Thể loại
  - Thời lượng (phút)
  - Rating (sao)
  - Ngày khởi chiếu
- **Sắp xếp**: Theo ngày khởi chiếu, theo rating
- **Lọc**: Theo thể loại, theo ngày

#### FR-3.1.2: Tìm kiếm phim
- **Mô tả**: Tìm kiếm phim theo tên
- **Kết quả**: Danh sách phim phù hợp với từ khóa
- **Độ trễ**: Kết quả hiển thị trong vòng 500ms

#### FR-3.1.3: Xem chi tiết phim
- **Mô tả**: Hiển thị thông tin chi tiết của một bộ phim
- **Thông tin hiển thị**:
  - Tên phim, poster, trailer
  - Mô tả nội dung
  - Đạo diễn, diễn viên
  - Thể loại, thời lượng
  - Rating, ngôn ngữ
  - Danh sách suất chiếu

#### FR-3.1.4: Quản lý phim (Admin)
- **Thêm phim mới**: Thông tin đầy đủ bao gồm hình ảnh
- **Sửa thông tin phim**: Cập nhật nội dung, poster
- **Xóa phim**: Chỉ xóa được nếu không có suất chiếu liên quan
- **Cập nhật trạng thái**: Đang chiếu / Sắp chiếu / Đã kết thúc

### 3.2 Module Quản lý Phòng chiếu (Rooms)

#### FR-3.2.1: Xem sơ đồ phòng chiếu
- **Mô tả**: Hiển thị sơ đồ ghế ngồi của phòng chiếu
- **Thông tin**: Tên phòng, số lượng ghế, loại ghế (thường/VIP)
- **Trạng thái ghế**: Trống / Đã đặt / Đang chọn

#### FR-3.2.2: Quản lý phòng chiếu (Admin)
- **Thêm phòng chiếu**: Tên, số lượng hàng, số ghế mỗi hàng
- **Sửa thông tin phòng**: Cập nhật cấu hình ghế
- **Xóa phòng chiếu**: Chỉ xóa được nếu không có lịch chiếu

### 3.3 Module Quản lý Suất chiếu (Showtimes)

#### FR-3.3.1: Xem lịch chiếu
- **Mô tả**: Hiển thị danh sách suất chiếu theo ngày/phim
- **Thông tin**: Phim, phòng, giờ bắt đầu, giá vé cơ bản
- **Lọc**: Theo ngày, theo phim, theo phòng

#### FR-3.3.2: Quản lý suất chiếu (Admin)
- **Tạo suất chiếu**: Chọn phim, phòng, ngày, giờ
- **Sửa suất chiếu**: Thay đổi giờ, phòng (nếu chưa có vé bán)
- **Xóa suất chiếu**: Hủy suất chiếu (hoàn tiền cho khách đã đặt)

### 3.4 Module Đặt vé (Booking)

#### FR-3.4.1: Chọn ghế
- **Mô tả**: Cho phép khách hàng chọn ghế trên sơ đồ
- **Ràng buộc**:
  - Tối đa 10 ghế mỗi lần đặt
  - Ghế phải còn trống
  - Không chọn ghế đã có người đặt
- **Loại ghế**:
  - Ghế thường: Giá vé cơ bản
  - Ghế VIP: Giá vé cơ bản + 50%

#### FR-3.4.2: Tạo đơn đặt vé
- **Mô tả**: Tạo đơn đặt vé với thông tin:
  - Suất chiếu đã chọn
  - Danh sách ghế
  - Tổng tiền
  - Thời hạn thanh toán: 15 phút

#### FR-3.4.3: Xem/Quản lý đơn đặt vé
- **Xem danh sách vé đã đặt**: Lịch sử đặt vé
- **Hủy đơn**: Trước 2 giờ so với giờ chiếu
- **In vé**: Hiển thị mã QR để check-in

### 3.5 Module Thanh toán (Payment)

#### FR-3.5.1: Thanh toán đơn hàng
- **Phương thức thanh toán**:
  - Thẻ tín dụng/Ghi nợ
  - Ví điện tử (Momo, ZaloPay, VNPay)
- **Quy trình**:
  1. Chọn phương thức thanh toán
  2. Nhập thông tin thanh toán
  3. Xác nhận thanh toán
  4. Nhận vé điện tử

#### FR-3.5.2: Xác nhận thanh toán
- **Thành công**: Cập nhật trạng thái đơn hàng, gửi email xác nhận
- **Thất bại**: Thông báo lỗi, cho phép thử lại
- **Hết hạn**: Tự động hủy đơn, giải phóng ghế

### 3.6 Module Người dùng (Users)

#### FR-3.6.1: Đăng ký
- **Thông tin bắt buộc**: Email, mật khẩu, họ tên, số điện thoại
- **Xác thực**: Email xác nhận

#### FR-3.6.2: Đăng nhập/Đăng xuất
- **Đăng nhập**: Email + Mật khẩu
- **Đăng xuất**: Xóa session, quay về trang chủ
- **Quên mật khẩu**: Gửi email đặt lại mật khẩu

#### FR-3.6.3: Quản lý tài khoản
- **Cập nhật thông tin**: Họ tên, số điện thoại
- **Đổi mật khẩu**: Mật khẩu cũ + Mật khẩu mới
- **Xem lịch sử đặt vé**: Danh sách vé đã mua

### 3.7 Module Admin Dashboard

#### FR-3.7.1: Dashboard tổng quan
- **Thống kê**:
  - Doanh thu theo ngày/tuần/tháng
  - Số vé bán ra
  - Số lượng phim đang chiếu
  - Tỷ lệ lấp đầy ghế

#### FR-3.7.2: Quản lý người dùng (Admin)
- **Xem danh sách người dùng**: Phân trang, tìm kiếm
- **Phân quyền**: Admin / Customer
- **Khóa/Mở tài khoản**: Vô hiệu hóa tài khoản vi phạm

#### FR-3.7.3: Báo cáo
- **Báo cáo doanh thu**: Theo ngày, phim, phòng chiếu
- **Báo cáo khách hàng**: Số lượng khách mới, khách quen
- **Xuất báo cáo**: PDF, Excel

---

## 4. Yêu cầu phi chức năng

### 4.1 Hiệu suất (Performance)

| Chỉ tiêu | Yêu cầu | Độ ưu tiên |
|----------|---------|------------|
| Thời gian phản hồi trang chủ | < 2 giây | Cao |
| Thời gian tải trang chi tiết phim | < 1.5 giây | Cao |
| Thời gian tìm kiếm | < 500ms | Cao |
| Thời gian xử lý đặt vé | < 3 giây | Rất cao |
| Số người dùng đồng thời | 1000+ | Cao |
| Uptime hệ thống | 99.5% | Cao |

### 4.2 Tính khả dụng (Usability)

| Chỉ tiêu | Yêu cầu |
|----------|---------|
| Giao diện thân thiện | Dễ sử dụng, trực quan |
| Responsive | Hỗ trợ Desktop, Tablet, Mobile |
| Hỗ trợ đa ngôn ngữ | Tiếng Việt, Tiếng Anh |
| Hỗ trợ trình duyệt | Chrome, Firefox, Safari, Edge |
| Khả năng tiếp cận | WCAG 2.1 Level A |

### 4.3 Bảo mật (Security)

| Chỉ tiêu | Yêu cầu |
|----------|---------|
| Mã hóa dữ liệu | HTTPS cho tất cả kết nối |
| Bảo mật mật khẩu | Hash với bcrypt (cost factor 12) |
| Bảo vệ CSRF | Token validation |
| Bảo vệ XSS | Input sanitization |
| Bảo vệ SQL Injection | Parameterized queries |
| Rate limiting | Giới hạn request API |
| Session management | JWT với refresh token |

### 4.4 Độ tin cậy (Reliability)

| Chỉ tiêu | Yêu cầu |
|----------|---------|
| Backup dữ liệu | Hàng ngày tự động |
| Khôi phục | Có kế hoạch disaster recovery |
| Error handling | Xử lý lỗi graceful |
| Logging | Ghi log hoạt động hệ thống |

### 4.5 Khả năng bảo trì (Maintainability)

| Chỉ tiêu | Yêu cầu |
|----------|---------|
| Code quality | ESLint, Prettier |
| Testing coverage | > 70% unit tests |
| Documentation | JSDoc cho functions |
| Version control | Git với conventional commits |

---

## 5. Giao diện

### 5.1 Giao diện người dùng (UI)

#### 5.1.1 Header/Navigation
```
┌──────────────────────────────────────────────────────────────┐
│  🎬 CINEMA     │ Trang chủ │ Phim │ Lịch chiếu │  🔍 │ 👤 │
└──────────────────────────────────────────────────────────────┘
```

#### 5.1.2 Trang chủ (Home)
- Banner quảng cáo phim nổi bật (Carousel)
- Danh sách phim đang chiếu
- Danh sách phim sắp chiếu
- Footer với thông tin liên hệ

#### 5.1.3 Trang chi tiết phim
- Poster + Trailer video
- Thông tin phim (tên, đạo diễn, diễn viên, thể loại)
- Mô tả nội dung
- Lịch chiếu (group theo ngày)
- Đánh giá

#### 5.1.4 Trang đặt vé
- Chọn suất chiếu
- Sơ đồ ghế (Interactive)
- Thông tin đơn hàng
- Nút "Thanh toán"

### 5.2 Giao diện Admin

#### 5.2.1 Admin Sidebar
```
┌──────────────┐
│  📊 Dashboard│
│  🎬 Phim     │
│  🏠 Phòng    │
│  📅 Suất chiếu│
│  🎟️ Đơn hàng │
│  👥 Người dùng│
│  📈 Báo cáo  │
│  ⚙️ Cài đặt  │
└──────────────┘
```

#### 5.2.2 Trang Dashboard
- Biểu đồ doanh thu
- Thống kê nhanh (cards)
- Đơn hàng gần đây

### 5.3 Giao diện hệ thống (API)

#### 5.3.1 REST API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /api/movies | Danh sách phim |
| GET | /api/movies/[id] | Chi tiết phim |
| POST | /api/movies | Tạo phim mới |
| PUT | /api/movies/[id] | Cập nhật phim |
| DELETE | /api/movies/[id] | Xóa phim |
| GET | /api/showtimes | Danh sách suất chiếu |
| GET | /api/showtimes/[id] | Chi tiết suất chiếu |
| GET | /api/showtimes/[id]/seats | Sơ đồ ghế |
| POST | /api/bookings | Tạo đơn đặt vé |
| GET | /api/bookings/[id] | Chi tiết đơn |
| POST | /api/payments | Thanh toán |
| POST | /api/auth/register | Đăng ký |
| POST | /api/auth/login | Đăng nhập |
| GET | /api/users/me | Thông tin user |

---

## 6. Ràng buộc thiết kế

### 6.1 Ràng buộc công nghệ

| Loại | Lựa chọn |
|------|----------|
| Frontend Framework | Next.js 14 (App Router) |
| UI Library | Tailwind CSS + shadcn/ui |
| Backend | Next.js API Routes |
| Database | SQLite (prisma ORM) |
| Authentication | NextAuth.js |
| State Management | React Context / Zustand |

### 6.2 Ràng buộc thời gian

- Phase 1: SRS + Prototype UI - 1 tuần
- Phase 2: Backend API - 2 tuần
- Phase 3: Frontend User - 2 tuần
- Phase 4: Admin Dashboard - 1 tuần
- Phase 5: Testing & Deploy - 1 tuần

### 6.3 Ràng buộc ngân sách

- Chi phí hosting: Tự host hoặc Vercel (free tier)
- Chi phí domain: $10-15/năm
- Không phát sinh chi phí license

---

## 7. Phụ lục

### 7.1 Database Schema (ER Diagram)

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    users     │       │    movies    │       │    rooms     │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id           │       │ id           │       │ id           │
│ email        │       │ title        │       │ name         │
│ password     │       │ poster       │       │ rows         │
│ name         │       │ trailer      │       │ seats_per_row│
│ phone        │       │ description  │       │ created_at   │
│ role         │       │ director     │       └──────────────┘
│ created_at   │       │ cast         │              │
└──────────────┘       │ genre        │              │
        │              │ duration     │              │
        │              │ rating       │              ▼
        │              │ status       │       ┌──────────────┐
        │              │ release_date │       │  showtimes   │
        │              │ created_at   │       ├──────────────┤
        │              └──────────────┘       │ id           │
        │                                      │ movie_id     │───┐
        │                                      │ room_id      │   │
        ▼                                      │ start_time   │   │
┌──────────────┐       ┌──────────────┐        │ price        │   │
│   bookings   │       │    seats     │        │ created_at   │   │
├──────────────┤       ├──────────────┤       └──────────────┘   │
│ id           │       │ id           │              │            │
│ user_id      │───────│ showtime_id  │◄─────────────┘            │
│ showtime_id  │       │ row          │                           │
│ total_amount │       │ number       │                           │
│ status       │       │ type         │                           │
│ payment_id   │       │ is_available │                           │
│ qr_code      │       └──────────────┘                           │
│ created_at   │              │                                    │
└──────────────┘              │                                    ▼
        │              ┌──────────────┐                      ┌──────────────┐
        │              │ booking_seats│                      │   payments   │
        │              ├──────────────┤                      ├──────────────┤
        └──────────────│ booking_id   │                      │ id           │
                       │ seat_id      │                      │ booking_id   │
                       └──────────────┘                      │ amount       │
                                                             │ method       │
                                                             │ status       │
                                                             │ transaction_id│
                                                             │ created_at   │
                                                             └──────────────┘
```

### 7.2 Wireframes

(Sẽ được bổ sung trong phiên bản tiếp theo)

### 7.3 Use Case Diagram

```
                    ┌─────────────────────────────────────┐
                    │   Cinema Ticket Management System   │
                    └─────────────────────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
         ▼                           ▼                           ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     Guest       │       │    Customer     │       │     Admin       │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ • Xem phim      │       │ • Đặt vé       │       │ • Quản lý phim  │
│ • Tìm kiếm      │       │ • Thanh toán    │       │ • Quản lý phòng │
│ • Xem lịch chiếu│       │ • Quản lý TK   │       │ • Quản lý suất  │
│ • Đăng ký       │       │ • Xem vé       │       │ • Xem báo cáo   │
│ • Đăng nhập     │       │ • Hủy vé       │       │ • Quản lý user  │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

---

## Lịch sử phiên bản

| Version | Date | Description | Author |
|---------|------|-------------|--------|
| 1.0 | 2026-04-28 | Initial SRS | CTMS Team |

---

*Document End*
