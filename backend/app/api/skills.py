from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from ..database.session import get_db
from ..models.skill import Skill
from ..models.user import User
from ..schemas.skill import SkillCreate, SkillResponse
from ..security import verify_access_token


router = APIRouter(
    prefix="/api/skills",
    tags=["Skills"]
)

security = HTTPBearer()


def get_logged_in_user(
    credentials: HTTPAuthorizationCredentials,
    db: Session
):
    token = credentials.credentials

    payload = verify_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = db.query(User).filter(
        User.id == int(user_id)
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


@router.get(
    "/",
    response_model=list[SkillResponse]
)
def get_skills(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    user = get_logged_in_user(
        credentials,
        db
    )

    skills = db.query(Skill).filter(
        Skill.user_id == user.id
    ).all()

    return skills


@router.post(
    "/",
    response_model=SkillResponse
)
def create_skill(
    payload: SkillCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    user = get_logged_in_user(
        credentials,
        db
    )

    existing_skill = db.query(Skill).filter(
        Skill.user_id == user.id,
        Skill.skill_name == payload.skill_name
    ).first()

    if existing_skill:
        raise HTTPException(
            status_code=409,
            detail="Skill already exists"
        )

    skill = Skill(
        user_id=user.id,
        skill_name=payload.skill_name,
        skill_level=payload.skill_level
    )

    db.add(skill)
    db.commit()
    db.refresh(skill)

    return skill


@router.delete(
    "/{skill_id}"
)
def delete_skill(
    skill_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    user = get_logged_in_user(
        credentials,
        db
    )

    skill = db.query(Skill).filter(
        Skill.id == skill_id,
        Skill.user_id == user.id
    ).first()

    if not skill:
        raise HTTPException(
            status_code=404,
            detail="Skill not found"
        )

    db.delete(skill)
    db.commit()

    return {
        "message": "Skill deleted successfully"
    }