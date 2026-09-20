from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from ..database.session import get_db
from ..models.profile import Profile
from ..models.user import User
from ..schemas.profile import ProfileResponse, ProfileUpdate
from ..security import verify_access_token


router = APIRouter(
    prefix="/api/profile",
    tags=["Profile"]
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
    response_model=ProfileResponse
)
def get_profile(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    user = get_logged_in_user(
        credentials,
        db
    )

    profile = db.query(Profile).filter(
        Profile.user_id == user.id
    ).first()

    if not profile:
        profile = Profile(
            user_id=user.id
        )

        db.add(profile)
        db.commit()
        db.refresh(profile)

    return profile


@router.put(
    "/",
    response_model=ProfileResponse
)
def update_profile(
    payload: ProfileUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    user = get_logged_in_user(
        credentials,
        db
    )

    profile = db.query(Profile).filter(
        Profile.user_id == user.id
    ).first()

    if not profile:
        profile = Profile(
            user_id=user.id
        )

        db.add(profile)

    profile.headline = payload.headline
    profile.target_career = payload.target_career

    db.commit()
    db.refresh(profile)

    return profile