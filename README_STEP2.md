# SkillBridge — Step 2

## PostgreSQL + SQLAlchemy

1. Create a PostgreSQL database named `skillbridge` in pgAdmin/psql.
2. Copy `backend/.env.example` to `backend/.env` and set your password.
3. From the SkillBridge root, activate your venv:

Windows PowerShell:
`\.\\venv\\Scripts\\Activate.ps1`

4. Install:
`pip install -r backend/requirements.txt`

5. Run:
`python -m uvicorn backend.app.main:app --reload`

6. Open `http://127.0.0.1:8000` and then `/docs`.

POST `/api/users/` with:
`{"name":"Test User","email":"test@example.com"}`

V1 creates `users` and `profiles` tables automatically. Later we will replace this with Alembic migrations.
