# G-SCORES — Hệ Thống Tra Cứu Điểm THPT Quốc Gia 2024

---

## 📁 Cấu Trúc Dự Án

```
Code_Test/
├── backend/          # REST API (Express + Drizzle ORM)
└── frontend/         # SPA (React + Vite + TailwindCSS v4)
```

---

## ⚙️ Yêu Cầu Hệ Thống

| Công cụ    | Phiên bản tối thiểu |
| ---------- | ------------------- |
| Node.js    | v18+                |
| PostgreSQL | v14+                |
| npm        | v9+                 |

---

## 🗄️ Backend

### Công Nghệ Sử Dụng

| Thư viện    | Mục đích                            |
| ----------- | ----------------------------------- |
| Express.js  | HTTP server & routing               |
| Drizzle ORM | Query builder & type-safe DB access |
| PostgreSQL  | Cơ sở dữ liệu chính                 |
| TypeScript  | Type safety                         |

### API Endpoints

| Method | Endpoint                         | Mô tả                           |
| ------ | -------------------------------- | ------------------------------- |
| `GET`  | `/api/score/look-up/:sbd`        | Tra cứu điểm theo Số Báo Danh   |
| `GET`  | `/api/score/reports/statistics`  | Thống kê phổ điểm theo 4 cấp độ |
| `GET`  | `/api/score/reports/top-group-a` | Top 10 thí sinh khối A          |

### Cấu Trúc Backend

```
backend/src/
├── index.ts                   # Entry point, khởi động Express server
├── config/                    # Cấu hình ứng dụng
├── controllers/
│   └── diemthi.controller.ts  # Xử lý request/response HTTP
├── services/
│   └── diemthi.service.ts     # Business logic & DB queries
├── routes/
│   └── diemthi.routes.ts      # Định nghĩa route
├── database/
│   ├── database.service.ts    # Singleton kết nối DB
│   ├── schema/                # Drizzle schema definitions
│   ├── migrations/            # SQL migration files
│   └── seeds/                 # Script & data để seed DB
├── core/
└── middlewares/
    └── errorHandler.ts        # Global error handler middleware
```

---

## 🖥️ Frontend

### Công Nghệ Sử Dụng

| Thư viện              | Mục đích                  |
| --------------------- | ------------------------- |
| React 18 + TypeScript | UI framework              |
| Vite                  | Build tool                |
| TailwindCSS v4        | Styling với design tokens |
| React Router v6       | Client-side routing       |
| Axios                 | HTTP client               |
| Recharts              | Biểu đồ thống kê          |
| Lucide React          | Icon set                  |

### Cấu Trúc Frontend

```
frontend/src/
├── App.tsx                    # Root component
├── main.tsx                   # Entry point
├── index.css                  # Design tokens (TailwindCSS @theme)
├── routes/
│   └── AppRoutes.tsx          # Định nghĩa tất cả client-side routes
├── layouts/
│   └── MainLayout.tsx         # Layout chính (Header + Sidebar + Outlet)
├── components/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── LoadingSpinner.tsx
├── pages/
│   ├── DashboardPage.tsx      # Trang tổng quan
│   ├── SearchScoresPage.tsx   # Tra cứu điểm theo SBD
│   └── ReportsPage.tsx        # Biểu đồ phổ điểm & Top 10 Khối A
├── hooks/
│   ├── useScoreSearch.ts      # Hook tra cứu điểm + xử lý lỗi API
│   ├── useStatistics.ts       # Hook lấy dữ liệu thống kê phổ điểm
│   └── useTopGroupA.ts        # Hook lấy Top 10 thí sinh Khối A
├── services/
│   ├── api.ts                 # Axios instance với interceptors
│   └── scoreService.ts        # Các hàm gọi API & TypeScript interfaces
└── commons/
    └── subjects.ts            # Map mã môn → tên hiển thị (SUBJECT_MAP)
```

---

## 🚀 Cài Đặt & Khởi Động

### 1. Cài Đặt Dependencies

Mở 2 terminal để cài đặt cho cả backend và frontend:

```bash
# Terminal 1 - Backend
cd backend
npm install

# Terminal 2 - Frontend
cd frontend
npm install
```

### 2. Cấu Hình Biến Môi Trường

**Backend:** Sao chép file mẫu trong thư mục `backend/`:

```bash
cd backend
cp .env.example .env
```

**Frontend:** Sao chép file mẫu trong thư mục `frontend/`:

```bash
cd frontend
cp .env.example .env
```

### 3. Thiết Lập Database (Backend)

Khởi tạo cơ sở dữ liệu PostgreSQL bằng Docker Compose:

```bash
cd backend
docker-compose up -d
```

Sau đó, đặt file CSV dữ liệu điểm thi vào `backend/src/database/seeds/data/` và chạy:

```bash
cd backend
npm run db:migrate  # Chạy migration
npm run seed        # Thêm dữ liệu mẫu
```

### 4. Khởi Động Ứng Dụng

Mở 2 terminal để chạy song song:

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- Frontend: **http://localhost:5173**
- Backend API: **http://localhost:3000**

### 5. Build Production

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
```
