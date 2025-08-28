# Finance App

Full‑stack personal finance tracker built with a Django REST API backend and a Next.js frontend.

- Backend: Django 5 + DRF, JWT auth (SimpleJWT), Google sign‑in, Swagger docs
- Frontend: Next.js 15, React 19, Tailwind CSS 4, Recharts
- Monorepo: `backend/` and `frontend/`

## Repository
`https://github.com/ARBRABBIT/Finance-app`

## Directory structure
```
backend/   # Django REST API
frontend/  # Next.js web app
```

## Backend (Django)

### Prerequisites
- Python 3.11+

### Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install django djangorestframework drf-spectacular django-cors-headers django-filter django-environ django-axes djangorestframework-simplejwt django-redis django-oauth-toolkit
```

Create `.env` in `backend/core` (same folder as `settings.py`):
```env
DEBUG=true
SECRET_KEY=change-me
ALLOWED_HOSTS=[]
CORS_ALLOWED_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]
CSRF_TRUSTED_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]
# Optional
REDIS_URL=
GOOGLE_CLIENT_ID=
# DB override (optional)
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3
```

Run migrations and start:
```bash
python manage.py migrate
python manage.py runserver 8000
```

Useful endpoints:
- Health: `GET /health/`
- API root: `GET /api/`
- Auth (JWT): `POST /api/auth/token/`, `POST /api/auth/token/refresh/`
- Google login: `POST /api/auth/google/`
- OpenAPI schema: `GET /api/schema/`
- Swagger UI: `GET /api/docs/`

Resources: `transactions`, `budgets`, `categories` via `/api/<resource>/`

## Frontend (Next.js)

### Prerequisites
- Node.js 18+

### Setup & run
```bash
cd frontend
npm install
npm run dev
```
The app runs at `http://localhost:3000`.

## Development notes
- `backend/db.sqlite3` is ignored in git.
- If enabling branch protection on `main`, require PRs and status checks.

## License
MIT
