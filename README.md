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
│   │   ├── services/ticket_service.py  # Business logic
│   │   ├── routes/tickets.py    # API endpoints
│   │   └── main.py              # FastAPI entry point
│   ├── requirements.txt
│   ├── Procfile
│   └── render.yaml
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── context/             # React Context for state
│   │   ├── pages/               # Dashboard, Create, Detail
│   │   ├── services/api.js      # Axios API client
│   │   ├── App.jsx              # Router + layout
│   │   └── main.jsx             # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

---

## 🚀 Local Development

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API will be available at **http://localhost:8000**
- Swagger docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App will be available at **http://localhost:5173**

---

## 📡 API Endpoints

| Method   | Endpoint            | Description                |
| -------- | ------------------- | -------------------------- |
| `GET`    | `/`                 | API info                   |
| `GET`    | `/health`           | Health check               |
| `GET`    | `/tickets/summary`  | Dashboard analytics        |
| `GET`    | `/tickets/`         | List all (with filters)    |
| `GET`    | `/tickets/{id}`     | Get single ticket          |
| `POST`   | `/tickets/`         | Create ticket              |
| `PUT`    | `/tickets/{id}`     | Update ticket              |
| `DELETE` | `/tickets/{id}`     | Delete ticket              |

### Query Parameters (GET /tickets/)

- `domain` — Engineering, DevOps, HR, IT, Finance
- `priority` — Low, Medium, High, Critical
- `status` — Open, In Progress, Closed
- `search` — Full-text search on title

---

## 🚢 Deployment

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
