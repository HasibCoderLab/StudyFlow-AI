<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/Node-20+-green?style=flat-square" alt="Node" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Gemini AI-8E75B2?style=flat-square&logo=google" alt="Gemini AI" />
</div>

<br />

<h1 align="center">📚 StudyFlow AI</h1>
<p align="center">
  <strong>AI-Powered Smart Study Platform</strong><br />
  Plan smarter, track progress, quiz yourself, and learn with an AI tutor — all in one place.
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-documentation">API Docs</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

## ✨ Features

### 🧠 AI-Powered Study Plan Generator
Generate personalized study plans using **Google Gemini AI**. Input your exam date, subjects, and daily availability — the AI creates a day-by-day schedule with specific topics and time allocations. Falls back gracefully to a smart dummy generator when AI is unavailable.

### 📝 AI-Generated Quizzes
Take dynamically generated multiple-choice quizzes on any subject. Questions are created on-the-fly by Gemini AI with real-time grading and detailed result tracking. Falls back to a curated question bank when needed.

### 🤖 AI Tutor (Chat Assistant)
Get instant academic help from an AI tutor. The assistant maintains conversation context, adapts to your class level, and ends each response with a practice question. Includes daily rate limiting (20 messages/day on Free plan).

### 📊 Progress Analytics
- **Study Streak Tracking** — Consecutive day counter
- **Weekly/Monthly Reports** — Hours studied with daily & subject breakdown
- **Quiz Performance** — Average scores over time
- **Gamification** — Points system (10 pts per quiz, 5 pts per study hour)

### 📚 Subject & Chapter Management
- Add/remove subjects with auto-generated chapters
- Track chapter status: Not Started → Learning → Completed
- Soft-delete support for safe removals
- Visual progress indicators

### 🎯 Dashboard
Centralized view of all key metrics: current study plan, weekly chart, subject progress, task list, and AI tips.

### 🔐 Enterprise-Grade Security
- JWT with **access + refresh token rotation**
- Password hashing (bcrypt, 12 rounds)
- **Helmet** security headers
- **Rate limiting** (200 req/15min per IP)
- **NoSQL injection prevention** (mongo-sanitize)
- **Zod** request validation
- **HTTP-only cookies** for refresh tokens
- Payload size limits (10kb)

---

## 🛠 Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js 20+ |
| **Framework** | Express.js 4.21 |
| **Database** | MongoDB + Mongoose 8.x ODM |
| **Auth** | JWT (access 15m, refresh 7d) + bcryptjs |
| **Validation** | Zod 4.x |
| **AI** | Google Gemini AI (`@google/generative-ai`) |
| **Logging** | Winston 3.x |
| **Security** | Helmet, CORS, express-rate-limit, express-mongo-sanitize |
| **Architecture** | Modular MVC (controllers, services, routes, models) |

### Frontend
| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 |
| **Build Tool** | Vite 8.x |
| **Routing** | React Router 7.x |
| **Styling** | Tailwind CSS 4.x |
| **Icons** | Lucide React |
| **Charts** | Recharts 3.x |
| **HTTP Client** | Axios 1.x |
| **Linting** | ESLint 10.x |
| **Deployment** | Vercel (with SPA rewrites) |

---

## 🏗 Architecture

### Production-Grade Directory Structure

```
studyflow-ai/
│
├── backend/                          # 🖥 Express API Server
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                 # MongoDB connection
│   │   │   └── env.js                # Zod-enforced env validation
│   │   │
│   │   ├── middleware/
│   │   │   ├── validate.js           # Zod schema validation middleware
│   │   │   └── verifyToken.js        # JWT access token verification
│   │   │
│   │   ├── models/                   # Mongoose schemas
│   │   │   ├── User.js               # User with password hashing & refreshToken
│   │   │   ├── Subject.js            # Subjects with soft-delete
│   │   │   ├── Chapter.js            # Chapters with status tracking
│   │   │   ├── StudyPlan.js          # Day-by-day study plans
│   │   │   ├── StudyLog.js           # Study session logs
│   │   │   └── QuizAttempt.js        # Quiz attempt records
│   │   │
│   │   ├── modules/                  # 🧩 Feature modules (bounded contexts)
│   │   │   ├── auth/                 # Authentication & authorization
│   │   │   │   ├── auth.controller.js
│   │   │   │   ├── auth.service.js   # Business logic + transactions
│   │   │   │   ├── auth.route.js
│   │   │   │   └── auth.validator.js # Zod schemas
│   │   │   │
│   │   │   ├── users/                # User profile management
│   │   │   │   ├── users.controller.js
│   │   │   │   └── users.route.js
│   │   │   │
│   │   │   ├── subjects/             # Subject CRUD with soft-delete
│   │   │   │   ├── subjects.controller.js
│   │   │   │   └── subjects.route.js
│   │   │   │
│   │   │   ├── chapters/             # Chapter management & status
│   │   │   │   ├── chapters.controller.js
│   │   │   │   └── chapters.route.js
│   │   │   │
│   │   │   ├── studyPlan/            # AI + fallback plan generation
│   │   │   │   ├── studyPlan.controller.js
│   │   │   │   ├── studyPlan.service.js  # Dummy plan generator
│   │   │   │   └── studyPlan.route.js
│   │   │   │
│   │   │   ├── quiz/                 # AI + fallback quiz engine
│   │   │   │   ├── quiz.controller.js
│   │   │   │   └── quiz.route.js
│   │   │   │
│   │   │   ├── studyLogs/            # Study session tracking
│   │   │   │   ├── studyLogs.controller.js
│   │   │   │   └── studyLogs.route.js
│   │   │   │
│   │   │   ├── dashboard/            # Aggregated stats
│   │   │   │   ├── dashboard.controller.js
│   │   │   │   └── dashboard.route.js
│   │   │   │
│   │   │   └── aiChat/               # Gemini AI tutor
│   │   │       ├── aiChat.controller.js
│   │   │       └── aiChat.route.js
│   │   │
│   │   └── utils/
│   │       ├── ApiError.js           # Custom operational error class
│   │       ├── catchAsync.js         # Async error wrapper
│   │       ├── geminiClient.js       # Gemini API client (timeout, truncation guard)
│   │       ├── helpers.js            # Markdown stripper, quiz validator
│   │       └── logger.js             # Winston logger (console + file transports)
│   │
│   ├── server.js                     # 🚀 Entry point (env validation, security, routes)
│   ├── package.json
│   └── .env.example                  # Template for environment variables
│
├── frontend/                         # 🎨 React SPA
│   ├── src/
│   │   ├── api/                      # 🕸 API client layer (Axios)
│   │   │   ├── axios.js              # Configured instance with interceptors
│   │   │   ├── auth.js               # Auth endpoints
│   │   │   ├── subjects.js
│   │   │   ├── chapters.js
│   │   │   ├── studyPlan.js
│   │   │   ├── quiz.js
│   │   │   ├── studyLogs.js
│   │   │   ├── dashboard.js
│   │   │   ├── aiChat.js
│   │   │   └── users.js
│   │   │
│   │   ├── context/                  # 🔄 React contexts
│   │   │   └── AuthContext.jsx       # Auth state + token management
│   │   │
│   │   ├── components/               # 🧩 Reusable UI components
│   │   │   ├── Dashboard.jsx         # Dashboard layout
│   │   │   ├── Sidebar.jsx           # Navigation sidebar
│   │   │   ├── Topbar.jsx            # Top navigation bar
│   │   │   ├── Navbar.jsx            # Landing page navbar
│   │   │   ├── Hero.jsx              # Landing page hero
│   │   │   ├── Features.jsx
│   │   │   ├── Pricing.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── StatsRow.jsx
│   │   │   ├── WeeklyChart.jsx       # Recharts weekly chart
│   │   │   ├── StudyPlanner.jsx
│   │   │   ├── StudyPlanCard.jsx
│   │   │   ├── PlanGeneratorForm.jsx
│   │   │   ├── PlanSummaryPanel.jsx
│   │   │   ├── SubjectCard.jsx
│   │   │   ├── SubjectProgress.jsx
│   │   │   ├── ChapterDrawer.jsx
│   │   │   ├── ChapterRow.jsx
│   │   │   ├── TaskList.jsx
│   │   │   ├── TaskRow.jsx
│   │   │   ├── QuizForm.jsx
│   │   │   ├── QuizPage.jsx
│   │   │   ├── QuizResultCard.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── AiAssistant.jsx
│   │   │   ├── ChatBubble.jsx
│   │   │   ├── ChatTab.jsx
│   │   │   ├── TypingIndicator.jsx
│   │   │   ├── AITipCard.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Gamification.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── AccountTab.jsx
│   │   │   ├── ProfileTab.jsx
│   │   │   ├── NotificationsTab.jsx
│   │   │   ├── PreferencesTab.jsx
│   │   │   ├── SubscriptionTab.jsx
│   │   │   ├── DangerZoneTab.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── AddSubjectModal.jsx
│   │   │   ├── DayCard.jsx
│   │   │   ├── OnboardingFlow.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── ToggleSwitch.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── ... more
│   │   │
│   │   ├── pages/                    # 📄 Route pages (re-export from components)
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Planner.jsx
│   │   │   ├── Subjects.jsx
│   │   │   ├── AiAssistant.jsx
│   │   │   ├── Quiz.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Onboarding.jsx
│   │   │   └── NotFound.jsx
│   │   │
│   │   ├── App.jsx                   # 🧭 Root component (routing + providers)
│   │   ├── main.jsx                  # 🚀 Entry point
│   │   └── index.css                 # Tailwind + custom animations
│   │
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json                   # SPA rewrites for Vercel
│   └── package.json
│
├── doc/
│   └── implementation_plan.md        # Refactoring plan documentation
│
├── setup.md                          # Deployment guide (Bengali)
├── .gitignore
└── README.md                         # 📘 You are here
```

### Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **Modular monolith (modules/)** | Feature-based grouping instead of technical layers — higher cohesion, easier to extract microservices later |
| **Service layer** | Business logic extracted from controllers → testable, reusable, keeps controllers thin |
| **Soft delete** | Subjects & chapters use `isDeleted` flag + query middleware → reversible, audit-friendly |
| **AI fallback chain** | Gemini AI → dummy generator / question bank → zero-downtime resilience |
| **Token rotation** | Refresh tokens are rotated on each use → limits stolen-token window |
| **MongoDB transactions** | Registration uses transactions for data consistency; falls back gracefully on single-node setups |
| **JWT split secrets** | Separate `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` → compartmentalized compromise |
| **Rate limiting** | Global (200/15min) + per-feature (AI chat: 20/day) → multi-layer abuse prevention |
| **Zod validation** | Runtime + type safety without TypeScript compilation overhead |
| **Lazy loading** | React.lazy() for all page components → smaller initial bundle |

### Data Flow

```
┌──────────┐      HTTPS       ┌──────────────────┐      Mongoose       ┌──────────┐
│  Browser  │ ──────────────▶ │  Express Server   │ ──────────────────▶ │ MongoDB  │
│  (React)  │ ◀────────────── │  (backend/)       │ ◀────────────────── │          │
└──────────┘                  │                   │                    └──────────┘
                              │  ┌─────────────┐  │
                              │  │ JWT Auth    │  │
                              │  │ Middleware   │  │
                              │  └──────┬──────┘  │
                              │         │         │
                              │  ┌──────▼──────┐  │     ┌──────────────┐
                              │  │ Controllers │  │     │  Google      │
                              │  └──────┬──────┘  │     │  Gemini AI   │
                              │         │         │     │              │
                              │  ┌──────▼──────┐  │     └──────┬───────┘
                              │  │  Services   │ ─┼───────────▶│
                              │  └──────┬──────┘  │     ◀──────┤
                              │         │         │
                              │  ┌──────▼──────┐  │
                              │  │   Models    │  │
                              │  └─────────────┘  │
                              └──────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ (with `--env-file` support)
- **MongoDB** (local or [Atlas](https://www.mongodb.com/atlas))
- **Google Gemini API Key** ([Get one free](https://aistudio.google.com/apikey))

### 1️⃣ Clone & Install

```bash
git clone https://github.com/yourusername/studyflow-ai.git
cd studyflow-ai

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2️⃣ Configure Environment

```bash
# Backend environment
cp .env.example .env
# Edit .env with your values
```

**.env file** (backend/):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/studyflow?retryWrites=true
JWT_SECRET=your-super-secret-key-min-8-chars
JWT_ACCESS_SECRET=your-access-secret-min-8-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-8-chars
GEMINI_API_KEY=your-gemini-api-key
FRONTEND_URL=http://localhost:5173
```

### 3️⃣ Run Development Servers

```bash
# Terminal 1: Backend (auto-restart on changes)
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

- **Backend**: http://localhost:5000/api/v1/health
- **Frontend**: http://localhost:5173

### 4️⃣ Run Production

```bash
# Backend
cd backend && npm start

# Frontend
cd frontend && npm run build && npm run preview
```

---

## 📡 API Documentation

All API routes are prefixed with `/api/v1`.

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Create account + generate plan | ❌ |
| POST | `/auth/login` | Login | ❌ |
| POST | `/auth/refresh` | Refresh access token | ❌ (cookie) |
| POST | `/auth/logout` | Logout (clear refresh token) | ✅ |
| GET | `/auth/me` | Get current user | ✅ |

### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/profile` | Get user profile | ✅ |
| PUT | `/users/profile` | Update profile | ✅ |

### Subjects

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/subjects` | List all subjects | ✅ |
| POST | `/subjects` | Create subject (auto-creates chapters) | ✅ |
| PUT | `/subjects/:id` | Update subject | ✅ |
| DELETE | `/subjects/:id` | Soft-delete subject | ✅ |

### Chapters

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/chapters/:subjectId` | List chapters for subject | ✅ |
| POST | `/chapters` | Create chapter | ✅ |
| PATCH | `/chapters/:id/status` | Update chapter status | ✅ |
| DELETE | `/chapters/:id` | Soft-delete chapter | ✅ |

### Study Plan

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/study-plan` | Get current plan | ✅ |
| POST | `/study-plan/generate` | Generate new AI plan | ✅ |
| PATCH | `/study-plan/:planId/day/:dayIndex/task/:taskId` | Toggle task completion | ✅ |

### Quiz

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/quiz/questions?subject=X&count=5&difficulty=medium` | Get sample questions | ✅ |
| POST | `/quiz/submit` | Submit quiz attempt | ✅ |
| GET | `/quiz/history?limit=20` | Get quiz history | ✅ |

### Study Logs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/study-logs` | Log study session | ✅ |
| GET | `/study-logs/weekly` | Get weekly summary | ✅ |
| GET | `/study-logs/monthly` | Get monthly summary | ✅ |

### Dashboard

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/dashboard` | Aggregated stats (streak, points, avg score, hours) | ✅ |

### AI Chat

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/ai-chat/ask` | Ask AI tutor (rate-limited: 20/day) | ✅ |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check (no prefix) |

---

## 🧪 Database Models

### User
| Field | Type | Notes |
|-------|------|-------|
| `name` | String | Required |
| `email` | String | Unique, lowercase |
| `password` | String | bcrypt(12), `select: false` |
| `classLevel` | String | e.g., "HSC", "Undergraduate" |
| `goal` | String | e.g., "Exam preparation" |
| `subjects` | [String] | Array of subject names |
| `examDate` | Date | Target exam date |
| `plan` | "free" \| "pro" | Subscription tier |
| `dailyAiMessages` | Number | Resets daily |
| `refreshToken` | String | `select: false` |

### Subject
| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | Ref → User |
| `name` | String | Required |
| `totalChapters` | Number | Default 0 |
| `color` | String | UI color indicator |
| `isDeleted` | Boolean | Soft-delete, `select: false` |

### Chapter
| Field | Type | Notes |
|-------|------|-------|
| `subjectId` | ObjectId | Ref → Subject |
| `name` | String | Required |
| `status` | "not-started" \| "learning" \| "completed" | Progress tracking |
| `order` | Number | Display ordering |
| `isDeleted` | Boolean | Soft-delete, `select: false` |

### StudyPlan
| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | Ref → User |
| `examDate` | Date | Target date |
| `dailyHours` | Number | Default 4 |
| `days` | [Day] | Sub-documents with tasks |

### QuizAttempt
| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | Ref → User |
| `subject` | String | Quiz subject |
| `questions` | [QuestionResult] | Full question data |
| `score` | Number | Correct answers |
| `totalQuestions` | Number | Total questions |

### StudyLog
| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | Ref → User |
| `date` | Date | Session date |
| `hoursStudied` | Number | ≥ 0 |
| `subject` | String | Subject name |
| `topic` | String | Optional topic |

---

## 🌐 Deployment

### Backend → Render

1. Push code to GitHub
2. Create **Web Service** on [Render](https://render.com)
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add all environment variables in Render dashboard
5. Deploy

### Frontend → Vercel

1. Import repo on [Vercel](https://vercel.com)
2. Configure:
   - **Root Directory**: `frontend`
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add `VITE_API_URL` environment variable pointing to your Render backend
4. Deploy

> 📖 See [`setup.md`](./setup.md) for detailed deployment instructions (Bengali).

---

## 🔒 Security Hardening

| Measure | Implementation |
|---------|---------------|
| **Password hashing** | bcrypt with 12 salt rounds |
| **JWT access tokens** | 15-minute expiry |
| **JWT refresh tokens** | 7-day expiry, rotated on use |
| **HTTP-only cookies** | Refresh tokens stored in cookies |
| **Request validation** | Zod middleware rejects malformed input |
| **Rate limiting** | 200 requests per 15 minutes per IP |
| **NoSQL injection** | `express-mongo-sanitize` strips `$` and `.` |
| **Security headers** | Helmet sets CSP, X-Frame-Options, etc. |
| **Payload limit** | JSON body limited to 10kb |
| **CORS** | Explicit whitelist + credentials: true |
| **Soft delete** | Data never truly lost |

---

## 🧹 Code Quality & Patterns

- **ES Modules** (`"type": "module"`) throughout
- **`catchAsync` wrapper** — no try-catch boilerplate in controllers
- **Custom `ApiError` class** — consistent operational error handling
- **Sentry-ready error format** — global error handler produces structured JSON
- **Graceful AI fallbacks** — Gemini → dummy logic → zero-downtime
- **Query middleware** — automatic soft-delete filtering via Mongoose `pre(/^find/)`
- **Indexed queries** — All frequent queries have MongoDB indexes
- **Environment validation** — Zod schema at startup catches misconfiguration early
- **Auto-cleanup** — Quiz cache purges entries older than 1 hour

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` — New feature
- `fix:` — Bug fix
- `refactor:` — Code restructuring
- `docs:` — Documentation
- `chore:` — Maintenance

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Built with ❤️ using React, Node.js, MongoDB & Google Gemini AI
</p>
