# SkillBridge 🚀

Career-learning platform connecting skills, careers, roadmaps, jobs, resumes and AI-assisted recommendations.

## Step 1 — checks
```bash
python --version
node --version
npm --version
git --version
psql --version
```

## Python environment
```bash
python -m venv venv
```
Windows CMD:
```bat
venv\Scripts\activate
```
Windows PowerShell:
```powershell
.\venv\Scripts\Activate.ps1
```

## Backend
```bash
pip install -r backend/requirements.txt
python -m uvicorn backend.app.main:app --reload
```
Open: http://127.0.0.1:8000 and /docs

## Web
```bash
cd web
npm install
npm run dev
```
Open: http://localhost:3000

## PostgreSQL / Redis
Docker Compose is included for the local services:
```bash
docker compose up -d
```

The ZIP intentionally excludes `venv` and `node_modules`; create them locally with the commands above.
