from pathlib import Path
import uuid

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
)
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from ..database.session import get_db
from ..models.resume import Resume
from ..api.users import get_current_user


router = APIRouter(
    prefix="/api/resume",
    tags=["Resume"]
)


BASE_UPLOAD_DIR = Path("uploads/resumes")
BASE_UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True
)

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".docx"
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected"
        )

    original_filename = Path(file.filename).name
    extension = Path(original_filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are allowed"
        )

    file_content = await file.read()

    if not file_content:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty"
        )

    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File size must be 10 MB or less"
        )

    user_id = int(current_user["id"])

    user_upload_dir = BASE_UPLOAD_DIR / str(user_id)
    user_upload_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    stored_filename = (
        f"{uuid.uuid4().hex}{extension}"
    )

    file_path = user_upload_dir / stored_filename

    with open(file_path, "wb") as buffer:
        buffer.write(file_content)

    # Remove previous resume
    old_resume = (
        db.query(Resume)
        .filter(Resume.user_id == user_id)
        .first()
    )

    if old_resume:
        old_path = Path(old_resume.file_path)

        if old_path.exists():
            old_path.unlink()

        db.delete(old_resume)
        db.commit()

    resume = Resume(
        user_id=user_id,
        original_filename=original_filename,
        stored_filename=stored_filename,
        file_path=str(file_path),
        file_type=extension.replace(".", ""),
        file_size=len(file_content)
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return {
        "message": "Resume uploaded successfully",
        "resume": {
            "id": resume.id,
            "filename": resume.original_filename,
            "file_type": resume.file_type,
            "file_size": resume.file_size,
            "created_at": resume.created_at
        }
    }


@router.get("/")
def get_resume(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = int(current_user["id"])

    resume = (
        db.query(Resume)
        .filter(Resume.user_id == user_id)
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    return {
        "id": resume.id,
        "filename": resume.original_filename,
        "file_type": resume.file_type,
        "file_size": resume.file_size,
        "created_at": resume.created_at
    }


@router.get("/download")
def download_resume(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = int(current_user["id"])

    resume = (
        db.query(Resume)
        .filter(Resume.user_id == user_id)
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    file_path = Path(resume.file_path)

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Resume file not found"
        )

    return FileResponse(
        path=str(file_path),
        filename=resume.original_filename,
        media_type="application/octet-stream"
    )


@router.delete("/")
def delete_resume(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = int(current_user["id"])

    resume = (
        db.query(Resume)
        .filter(Resume.user_id == user_id)
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    file_path = Path(resume.file_path)

    if file_path.exists():
        file_path.unlink()

    db.delete(resume)
    db.commit()

    return {
        "message": "Resume deleted successfully"
    }