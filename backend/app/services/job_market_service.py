import json
import os
import requests

from openai import OpenAI
from dotenv import load_dotenv


load_dotenv()


JOB_API_URL = "https://api.jobopportunitiesapi.org/public/jobs"

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

if not OPENROUTER_API_KEY:
    raise RuntimeError(
        "OPENROUTER_API_KEY is not set in .env"
    )


ai_client = OpenAI(
    api_key=OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1",
)


# =========================================================
# GET LIVE JOBS
# =========================================================

def get_live_jobs(
    country: str = "IN",
    city: str | None = None,
    limit: int = 20,
):
    params = {
        "country": country,
        "limit": limit,
    }

    response = requests.get(
        JOB_API_URL,
        params=params,
        timeout=20,
    )

    response.raise_for_status()

    data = response.json()

    jobs = data.get("data", [])

    if not isinstance(jobs, list):
        return []

    if city:
        city_lower = city.lower()

        jobs = [
            job
            for job in jobs
            if city_lower in (
                job.get("city") or ""
            ).lower()
        ]

    return jobs


# =========================================================
# GET JOB DETAILS
# =========================================================

def get_job_details(job_id: str):

    url = f"{JOB_API_URL}/{job_id}"

    response = requests.get(
        url,
        timeout=20,
    )

    response.raise_for_status()

    data = response.json()

    if not isinstance(data, dict):
        return {}

    # API response structure:
    #
    # {
    #     "data": {
    #         ...
    #     },
    #     "description": "..."
    # }
    #

    job_data = data.get("data", {})

    if isinstance(job_data, list):

        if job_data:
            job_data = job_data[0]
        else:
            job_data = {}

    if not isinstance(job_data, dict):
        job_data = {}

    # -----------------------------------------------------
    # IMPORTANT:
    # Description is outside "data"
    # -----------------------------------------------------

    description = data.get(
        "description"
    )

    if description:
        job_data["description"] = description

    return job_data


# =========================================================
# EXTRACT SKILLS FROM JOB
# =========================================================

def extract_skills_from_job(
    job: dict,
) -> list[str]:

    if not isinstance(job, dict):
        return []

    job_id = job.get("id")

    details = {}

    # -----------------------------------------------------
    # Get complete job details
    # -----------------------------------------------------

    if job_id:

        try:

            details = get_job_details(
                str(job_id)
            )

        except Exception as error:

            print(
                f"Job detail error for {job_id}: {error}"
            )

            details = {}

    if not isinstance(details, dict):
        details = {}

    # -----------------------------------------------------
    # Job title
    # -----------------------------------------------------

    title = (
        details.get("title")
        or job.get("title")
        or ""
    )

    # -----------------------------------------------------
    # Job category
    # -----------------------------------------------------

    category = (
        details.get("category")
        or job.get("category")
        or ""
    )

    # -----------------------------------------------------
    # Job description
    # -----------------------------------------------------

    description = (
        details.get("description")
        or job.get("description")
        or details.get("job_description")
        or job.get("job_description")
        or details.get("content")
        or job.get("content")
        or details.get("body")
        or job.get("body")
        or details.get("summary")
        or job.get("summary")
        or ""
    )

    if not isinstance(
        description,
        str
    ):

        description = str(
            description
        )

    description = description.strip()

    # -----------------------------------------------------
    # Check description
    # -----------------------------------------------------

    if not description:

        print(
            f"No description found for job: {title}"
        )

        return []

    print(
        f"Analyzing job: {title}"
    )

    print(
        f"Description length: "
        f"{len(description)}"
    )

    # =====================================================
    # AI PROMPT
    # =====================================================

    prompt = f"""
You are a global job-market skill extraction system.

Analyze this real job posting.

Job title:
{title}

Job category:
{category}

Job description:
{description}

Extract skills that are explicitly required,
preferred, or strongly indicated by this job posting.

IMPORTANT RULES:

- Do NOT use a fixed predefined skill list.
- Extract skills only from the supplied job information.
- Skills can belong to ANY profession or industry.
- Include technical skills.
- Include software, tools and platforms.
- Include business skills.
- Include domain-specific skills.
- Include professional skills when clearly relevant.
- Include communication and management skills when
  clearly indicated by the job.
- Include regulatory, legal, financial, healthcare,
  engineering, design, marketing, sales, operations,
  or other domain skills when present.
- Do not invent skills.
- Do not include generic words such as:
  job, work, company, team, experience.
- Keep each skill short and clear.
- Merge obvious duplicates.
- Return ONLY valid JSON.
- Do not return markdown.
- Do not return explanations.

Return exactly:

{{
    "skills": [
        "skill 1",
        "skill 2",
        "skill 3"
    ]
}}
"""

    # =====================================================
    # OPENROUTER AI REQUEST
    # =====================================================

    try:

        response = ai_client.chat.completions.create(
            model="openrouter/free",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You extract skills from real job "
                        "descriptions. Never invent skills."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.1,
        )

        # -------------------------------------------------
        # Check AI response
        # -------------------------------------------------

        if not response.choices:

            print(
                f"No AI response choices for: {title}"
            )

            return []

        content = (
            response.choices[0]
            .message
            .content
        )

        if not content:

            print(
                f"Empty AI response for: {title}"
            )

            return []

        content = content.strip()

        # -------------------------------------------------
        # Remove Markdown code block
        # -------------------------------------------------

        if content.startswith("```"):

            content = (
                content
                .replace(
                    "```json",
                    ""
                )
                .replace(
                    "```JSON",
                    ""
                )
                .replace(
                    "```",
                    ""
                )
                .strip()
            )

        # -------------------------------------------------
        # Parse JSON
        # -------------------------------------------------

        result = json.loads(
            content
        )

        if not isinstance(
            result,
            dict
        ):
            return []

        skills = result.get(
            "skills",
            []
        )

        if not isinstance(
            skills,
            list
        ):
            return []

        # -------------------------------------------------
        # Clean skills
        # -------------------------------------------------

        cleaned_skills = []

        for skill in skills:

            if not isinstance(
                skill,
                str
            ):
                continue

            skill = skill.strip()

            if not skill:
                continue

            duplicate = any(
                existing.lower() == skill.lower()
                for existing in cleaned_skills
            )

            if not duplicate:

                cleaned_skills.append(
                    skill
                )

        print(
            f"Skills extracted for "
            f"'{title}': "
            f"{cleaned_skills}"
        )

        return cleaned_skills

    # -----------------------------------------------------
    # Invalid JSON
    # -----------------------------------------------------

    except json.JSONDecodeError as error:

        print(
            f"Invalid AI JSON for "
            f"'{title}': {error}"
        )

        return []

    # -----------------------------------------------------
    # Other AI error
    # -----------------------------------------------------

    except Exception as error:

        print(
            f"AI skill extraction error for "
            f"'{title}': {error}"
        )

        return []


# =========================================================
# MARKET SKILLS
# =========================================================

def get_market_skills(
    country: str = "IN",
    city: str | None = None,
    limit: int = 10,
):

    jobs = get_live_jobs(
        country=country,
        city=city,
        limit=limit,
    )

    skill_counts: dict[str, int] = {}

    analyzed_jobs = 0
    live_jobs = 0

    # =====================================================
    # PROCESS JOBS
    # =====================================================

    for job in jobs:

        if not isinstance(
            job,
            dict
        ):
            continue

        status = (
            job.get("status")
            or ""
        ).lower()

        # Only live jobs
        if status and status != "live":
            continue

        live_jobs += 1

        skills = extract_skills_from_job(
            job
        )

        if skills:

            analyzed_jobs += 1

        # -------------------------------------------------
        # Count skills
        # -------------------------------------------------

        for skill in skills:

            normalized = skill.strip()

            if not normalized:
                continue

            key = normalized.lower()

            if key not in skill_counts:

                skill_counts[key] = 0

            skill_counts[key] += 1

    # =====================================================
    # BUILD MARKET SKILL LIST
    # =====================================================

    market_skills = []

    for skill, count in skill_counts.items():

        market_skills.append(
            {
                "skill": skill,
                "job_count": count,
            }
        )

    # =====================================================
    # SORT BY JOB COUNT
    # =====================================================

    market_skills.sort(
        key=lambda item: item["job_count"],
        reverse=True,
    )

    # =====================================================
    # RETURN RESULT
    # =====================================================

    return {
        "country": country,
        "city": city,
        "jobs_found": len(jobs),
        "live_jobs": live_jobs,
        "jobs_analyzed": analyzed_jobs,
        "skills": market_skills,
    }