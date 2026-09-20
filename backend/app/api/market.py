from fastapi import APIRouter, HTTPException

from app.services.job_market_service import (
    get_live_jobs,
    get_job_details,
    get_market_skills,
)


router = APIRouter(
    prefix="/api/market",
    tags=["Market Jobs"],
)


@router.get("/jobs")
def live_jobs(
    country: str = "IN",
    city: str | None = None,
    limit: int = 20,
):
    try:
        jobs = get_live_jobs(
            country=country,
            city=city,
            limit=limit,
        )

        return {
            "success": True,
            "count": len(jobs),
            "jobs": jobs,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to fetch live jobs: {str(e)}",
        )


@router.get("/jobs/{job_id}")
def job_details(job_id: str):
    try:
        result = get_job_details(job_id)

        return {
            "success": True,
            "job": result,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to fetch job details: {str(e)}",
        )


@router.get("/skills")
def market_skills(
    country: str = "IN",
    city: str | None = None,
    limit: int = 10,
):
    try:
        result = get_market_skills(
            country=country,
            city=city,
            limit=limit,
        )

        return {
            "success": True,
            **result,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to analyze market skills: {str(e)}",
        )