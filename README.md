# Student Task Manager (MERN)

A full-stack task management app built for students — create, edit, delete,
and complete tasks with priority, due dates, search, filtering, and a small
points-based motivation system, all gated behind JWT authentication so every
user's tasks stay private.

**Live app:** https://task-manager-lunorsoft.vercel.app

## Stack
- **Frontend:** React (Vite) + Tailwind CSS + React Router
- **Backend:** Node.js + Express
- **Database:** MongoDB (Atlas) via Mongoose
- **Auth:** JWT (email/password, bcrypt-hashed passwords)

## Features

**Core**
- Register / log in with email + password
- Create, edit, delete tasks
- Mark tasks complete / pending
- Filter by status (all / pending / completed)
- Form validation and error handling on both client and server

**Beyond the base spec**
- Task priority (low / medium / high) with priority-based filtering
- Due dates, with overdue tasks visually highlighted and sortable by due date
- Search across task titles/descriptions
- Stats dashboard — completion counts and a quick visual breakdown of your task load
- A lightweight points system: **+5** for completing a task, **-3** for leaving one incomplete past its due date, as a small nudge to actually clear the list
- Custom color theme

## Project structure
```
task-manager-lunorsoft/
  backend/     Express API, MongoDB models, JWT auth
  frontend/    React (Vite) frontend
```

## Setup

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm run dev             # starts on http://localhost:5000
```

`MONGO_URI` comes from a free MongoDB Atlas cluster — create a cluster, add a
database user, whitelist your IP (or 0.0.0.0/0 for quick testing), and copy
the connection string.

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL if backend isn't on localhost:5000
npm run dev              # starts on http://localhost:5173
```

## API overview
| Method | Route                    | Auth | Description                          |
|--------|--------------------------|------|----------------------------------------|
| POST   | /api/auth/register       | No   | Create account                        |
| POST   | /api/auth/login          | No   | Log in, get JWT                       |
| GET    | /api/tasks               | Yes  | List tasks (`?status=`, `?priority=`, `?search=`, `?sort=dueDate`) |
| POST   | /api/tasks               | Yes  | Create task                           |
| PUT    | /api/tasks/:id           | Yes  | Update task                           |
| PATCH  | /api/tasks/:id/toggle    | Yes  | Toggle complete/pending (adjusts points) |
| DELETE | /api/tasks/:id           | Yes  | Delete task                           |
| GET    | /api/tasks/stats         | Yes  | Completion counts + points summary    |

## Architecture notes
- Tasks are scoped to `owner` (the logged-in user's ID) at the query level —
  every read/write is filtered server-side, so a valid token for one user can
  never touch another user's tasks even with a guessed task ID.
- JWT is stored in `localStorage` and attached via an Axios request
  interceptor; a `ProtectedRoute` wrapper redirects unauthenticated users to
  `/login`.
- Passwords are hashed with bcrypt before storage; plaintext passwords never
  touch the database.
- Search, priority filtering, and due-date sorting are handled server-side
  (query params on `GET /api/tasks`) rather than client-side, so the payload
  stays small as task counts grow.
- The points system is calculated server-side on task mutation, not trusted
  from the client, to keep it tamper-resistant.

## With more time, I'd add
- Cloudinary-hosted attachments per task
- Recurring tasks
- httpOnly-cookie-based auth instead of localStorage, with refresh token rotation
- TypeScript across both client and server

## Note on AI tool usage
Parts of this project's boilerplate (route scaffolding, component structure)
were generated with AI assistance to move faster under a tight deadline.
Architecture decisions, schema design, scope cuts, and feature logic were my
own — happy to walk through any part of the codebase and the reasoning behind
it.
