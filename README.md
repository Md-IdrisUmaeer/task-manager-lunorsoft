# Student Task Manager (MERN)

A full-stack task management app for students — create, edit, delete, complete,
and filter tasks, with JWT-based authentication so tasks stay private per user.

## Stack
- **Frontend:** React (Vite) + Tailwind CSS + React Router
- **Backend:** Node.js + Express
- **Database:** MongoDB (Atlas) via Mongoose
- **Auth:** JWT (email/password, bcrypt-hashed passwords)

## Features
- Register / log in with email + password
- Create, edit, delete tasks
- Mark tasks complete / pending
- Filter by status (all / pending / completed)
- Task priority (low/medium/high) and optional due date
- Form validation and error handling on both client and server

## Project structure
```
mern-task-app/
  server/     Express API, MongoDB models, JWT auth
  client/     React (Vite) frontend
```

## Setup

### 1. Backend
```bash
cd server
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm run dev             # starts on http://localhost:5000
```

`MONGO_URI` comes from a free MongoDB Atlas cluster — create a cluster, add a
database user, whitelist your IP (or 0.0.0.0/0 for quick testing), and copy
the connection string.

### 2. Frontend
```bash
cd client
npm install
cp .env.example .env   # set VITE_API_URL if backend isn't on localhost:5000
npm run dev              # starts on http://localhost:5173
```

## API overview
| Method | Route               | Auth | Description            |
|--------|----------------------|------|-------------------------|
| POST   | /api/auth/register   | No   | Create account          |
| POST   | /api/auth/login      | No   | Log in, get JWT         |
| GET    | /api/tasks           | Yes  | List tasks (optional `?status=`) |
| POST   | /api/tasks           | Yes  | Create task             |
| PUT    | /api/tasks/:id       | Yes  | Update task             |
| PATCH  | /api/tasks/:id/toggle| Yes  | Toggle complete/pending |
| DELETE | /api/tasks/:id       | Yes  | Delete task             |

## Architecture notes
- Tasks are scoped to `owner` (the logged-in user's ID) at the query level —
  users can only ever read/write their own tasks.
- JWT is stored in `localStorage` and attached via an Axios request
  interceptor; a `ProtectedRoute` wrapper redirects unauthenticated users to
  `/login`.
- Passwords are hashed with bcrypt before storage; plaintext passwords never
  touch the database.

## With more time, I'd add
- Cloudinary-hosted attachments per task
- Search across task titles/descriptions
- A stats dashboard (tasks completed per week, overdue count)
- TypeScript across both client and server
