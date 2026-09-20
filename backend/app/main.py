from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database.session import Base, engine
from .models import User, Profile, Skill, Resume

from .api.users import router as users_router
from .api.profile import router as profile_router
from .api.skills import router as skills_router
from .api.resume import router as resume_router
from .api.market import router as market_router
from .ai import router as ai_router


app = FastAPI(
    title="SkillBridge API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create database tables
Base.metadata.create_all(bind=engine)


# API routes
app.include_router(users_router)
app.include_router(profile_router)
app.include_router(skills_router)
app.include_router(resume_router)
app.include_router(market_router)
app.include_router(ai_router)


@app.get("/")
def home():
    return {
        "message": "SkillBridge API is running",
        "database": "connected"
    }