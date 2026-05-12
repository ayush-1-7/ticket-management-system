# 🎫 TicketFlow — Multi-Domain Ticket Management System

A production-ready, full-stack ticket management system with a **React 18 + Vite + Tailwind** frontend and **FastAPI + SQLAlchemy** backend.

---

## 🛠 Tech Stack

| Layer      | Technology                                         |
| ---------- | -------------------------------------------------- |
| Frontend   | React 18, Vite, Tailwind CSS, Axios, React Router  |
| Backend    | FastAPI, SQLAlchemy, Pydantic v2                   |
| Database   | SQLite (local) / PostgreSQL (production)           |
| Deploy     | Backend → Render, Frontend → Vercel                |

---

## ✨ Features

- **Dashboard Analytics** — Summary cards for total, open, in-progress, closed, and critical tickets
- **Multi-Domain** — Engineering, DevOps, HR, IT, Finance
- **Priorities** — Low, Medium, High, Critical (with color-coded badges)
- **Status Workflow** — Open → In Progress → Closed (with quick-action buttons)
- **Advanced Filtering** — By domain, priority, status, and keyword search
- **Full CRUD** — Create, read, update, and delete tickets
- **Responsive UI** — Works on mobile, tablet, and desktop
- **Real-time Validation** — Client and server-side form validation
- **Error Handling** — Graceful error states, loading spinners, empty states
- **Toast Notifications** — Success and error toasts for all actions

---

## 📁 Project Structure

```
Ticketing System/
├── backend/
│   ├── app/
│   │   ├── database/db.py       # SQLAlchemy setup
│   │   ├── models/ticket.py     # Ticket ORM model
│   │   ├── schemas/ticket.py    # Pydantic schemas
│   │   ├── services/ticket.py   # CRUD logic
│   │   ├── routes/ticket.py     # API endpoints
│   │   └── main.py              # FastAPI entry point
│   ├── requirements.txt         # Backend dependencies
│   └── Procfile                 # Deployment file
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── context/             # React Context (State)
│   │   ├── pages/               # Main view pages
│   │   ├── services/            # API client
│   │   └── App.jsx              # Main routing
│   ├── tailwind.config.js       # Styling theme
│   └── package.json             # Frontend dependencies
└── README.md                    # Documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/scripts/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend will run at `http://localhost:8000`.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at `http://localhost:5173`.

---

## 🏗 Key Components

- **TicketContext** — Centralized state management using React Context and Hooks.
- **FilterBar** — Dynamic filtering logic that updates the dashboard in real-time.
- **Badge System** — Semantic color tokens for priority and status visibility.
- **Glassmorphism UI** — Modern, sleek design with subtle blurs and gradients.

---

## 🌐 Deployment

### Backend → Render

1. Push `backend/` to a GitHub repo
2. Create a new **Web Service** on [Render](https://render.com)
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add env var: `DATABASE_URL` → your PostgreSQL connection string

### Frontend → Vercel

1. Push `frontend/` to a GitHub repo
2. Import project on [Vercel](https://vercel.com)
3. Set framework: **Vite**
4. Add env var: `VITE_API_URL` → your Render backend URL
5. Deploy!

---

## 📜 License

MIT License. Free to use and modify.
