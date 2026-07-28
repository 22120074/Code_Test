# G-SCORES — 2024 National High School Exam Scores System

---

## 📁 Project Structure

```
Code_Test/
├── backend/          # REST API (Express + Drizzle ORM)
└── frontend/         # SPA (React + Vite + TailwindCSS v4)
```

---

## ⚙️ System Requirements

| Tool       | Minimum Version |
| ---------- | --------------- |
| Node.js    | v18+            |
| PostgreSQL | v14+            |
| npm        | v9+             |
| Docker     | Required        |

---

## 🗄️ Backend

### Technologies Used

| Library     | Purpose                             |
| ----------- | ----------------------------------- |
| Express.js  | HTTP server & routing               |
| Drizzle ORM | Query builder & type-safe DB access |
| PostgreSQL  | Main database                       |
| TypeScript  | Type safety                         |

### API Endpoints

| Method | Endpoint                                 | Description                         |
| ------ | ---------------------------------------- | ----------------------------------- |
| `GET`  | `/api/score/look-up/:registrationNumber` | Lookup score by Registration Number |
| `GET`  | `/api/score/reports/statistics`          | Statistics across 4 score levels    |
| `GET`  | `/api/score/reports/top-group-a`         | Top 10 students in Group A          |

### Backend Structure

```
backend/src/
├── index.ts                     # Entry point, starts Express server
├── config/                      # Application config
├── controllers/
│   └── examScore.controller.ts  # HTTP request/response handling
├── services/
│   └── examScore.service.ts     # Business logic & DB queries
├── routes/
│   └── examScore.routes.ts      # Route definitions
├── database/
│   ├── database.service.ts      # DB connection singleton
│   ├── schema/                  # Drizzle schema definitions
│   ├── migrations/              # SQL migration files
│   └── seeds/                   # Scripts & data for DB seeding
├── core/
└── middlewares/
    └── errorHandler.ts          # Global error handler middleware
```

---

## 🖥️ Frontend

### Technologies Used

| Library               | Purpose                    |
| --------------------- | -------------------------- |
| React 18 + TypeScript | UI framework               |
| Vite                  | Build tool                 |
| TailwindCSS v4        | Styling with design tokens |
| React Router v6       | Client-side routing        |
| Axios                 | HTTP client                |
| Recharts              | Statistical charts         |
| Lucide React          | Icon set                   |

### Frontend Structure

```
frontend/src/
├── App.tsx                    # Root component
├── main.tsx                   # Entry point
├── index.css                  # Design tokens (TailwindCSS @theme)
├── routes/
│   └── AppRoutes.tsx          # Defines all client-side routes
├── layouts/
│   └── MainLayout.tsx         # Main layout (Header + Sidebar + Outlet)
├── components/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── LoadingSpinner.tsx
├── pages/
│   ├── DashboardPage.tsx      # Overview page
│   ├── SearchScoresPage.tsx   # Search score by registration number
│   └── ReportsPage.tsx        # Score distribution charts & Top 10
├── hooks/
│   ├── useScoreSearch.ts      # Score search hook + API error handling
│   ├── useStatistics.ts       # Hook for fetching distribution stats
│   └── useTopGroupA.ts        # Hook for fetching Top 10 Group A
├── services/
│   ├── api.ts                 # Axios instance with interceptors
│   └── scoreService.ts        # API call functions & TypeScript interfaces
└── commons/
    └── subjects.ts            # Subject code → Display name map (SUBJECT_MAP)
```

---

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

**Frontend:** Copy the example file in the `frontend/` directory:

```bash
cd frontend
cp .env.example .env
```

**Backend:** Copy the example file in the `backend/` directory:

```bash
cd backend
cp .env.example .env
```

### 3. Setup Backend & Database with Docker

Start the PostgreSQL database and Backend API using Docker Compose:

```bash
cd backend
docker-compose up -d --build
```

> The API will automatically connect to the database when it's ready. The API runs on port 3000.

After the containers are up and running, place your CSV data file `exam_scores_2024.csv` into `backend/src/database/seeds/data/` (or ensure it's there), and run the following to migrate and seed the database:

```bash
cd backend
# Run schema migrations
docker exec -it exam_scores_api npm run db:migrate
# Seed sample data
docker exec -it exam_scores_api npm run seed
```

### 4. Start Frontend Application

With the backend running via Docker, you only need to start the frontend locally:

```bash
cd frontend
npm run dev
```

- Frontend: **http://localhost:5173**
- Backend API (via Docker): **http://localhost:3000**

### 5. Production Build

```bash
# Frontend
cd frontend
npm run build
```
