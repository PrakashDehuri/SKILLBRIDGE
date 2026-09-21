# ============================================================
# SkillBridge - Live Job Market Service
# ============================================================

from __future__ import annotations

import re
from collections import Counter
from typing import Any

import requests


# ============================================================
# CONFIG
# ============================================================

JOB_API_BASE = "https://api.jobopportunitiesapi.org/public/jobs"

REQUEST_TIMEOUT = 20


# ============================================================
# IGNORED TERMS
# ============================================================

IGNORED_TERMS = {
    "nice to have",
    "preferred",
    "preferred skills",
    "requirements",
    "qualifications",
    "responsibilities",
    "responsibility",
    "job description",
    "description",
    "about",
    "about the role",
    "location",
    "salary",
    "benefits",

    # Days
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",

    # Generic job terms
    "experience",
    "knowledge",
    "understanding",
    "skills",
    "skill",
    "ability",
    "candidate",
    "role",
    "team",
    "company",
    "environment",
    "process",
    "platform",
    "system",
    "technology",

    # Non-skills
    "new baby gift",
    "apply",
    "apply now",
    "full time",
    "part time",
    "remote",
    "hybrid",
}


# ============================================================
# SKILL ALIASES
# ============================================================

SKILL_ALIASES = {

    # --------------------------------------------------------
    # Programming
    # --------------------------------------------------------

    "python": "Python",
    "java": "Java",
    "javascript": "JavaScript",
    "js": "JavaScript",
    "typescript": "TypeScript",
    "ts": "TypeScript",

    "c++": "C++",
    "cpp": "C++",

    "c#": "C#",
    "c sharp": "C#",

    # .NET
    ".net": ".NET",
    "dotnet": ".NET",
    "dot net": ".NET",

    # --------------------------------------------------------
    # Frontend
    # --------------------------------------------------------

    "html": "HTML",
    "html5": "HTML",

    "css": "CSS",
    "css3": "CSS",

    "scss": "SCSS",
    "sass": "Sass",

    "react": "React",
    "reactjs": "React",
    "react.js": "React",

    "next.js": "Next.js",
    "nextjs": "Next.js",

    "vue": "Vue.js",
    "vue.js": "Vue.js",

    "angular": "Angular",

    "tailwind": "Tailwind CSS",
    "tailwind css": "Tailwind CSS",

    "bootstrap": "Bootstrap",

    "handlebars": "Handlebars",

    # --------------------------------------------------------
    # Backend
    # --------------------------------------------------------

    "node": "Node.js",
    "node.js": "Node.js",
    "nodejs": "Node.js",

    "express": "Express.js",
    "express.js": "Express.js",

    "fastapi": "FastAPI",
    "django": "Django",
    "flask": "Flask",

    "spring": "Spring Boot",
    "spring boot": "Spring Boot",

    # --------------------------------------------------------
    # Database
    # --------------------------------------------------------

    "sql": "SQL",
    "mysql": "MySQL",
    "postgres": "PostgreSQL",
    "postgresql": "PostgreSQL",
    "mongodb": "MongoDB",
    "redis": "Redis",
    "sqlite": "SQLite",
    "oracle": "Oracle",
    "sql server": "SQL Server",

    # --------------------------------------------------------
    # Cloud
    # --------------------------------------------------------

    "aws": "AWS",
    "amazon web services": "AWS",

    "azure": "Azure",
    "microsoft azure": "Azure",

    "gcp": "Google Cloud",
    "google cloud": "Google Cloud",

    # --------------------------------------------------------
    # DevOps
    # --------------------------------------------------------

    "docker": "Docker",

    "kubernetes": "Kubernetes",
    "k8s": "Kubernetes",

    "git": "Git",
    "github": "GitHub",
    "gitlab": "GitLab",

    "ci/cd": "CI/CD",
    "ci cd": "CI/CD",
    "continuous integration": "CI/CD",
    "continuous delivery": "CI/CD",

    "devops": "DevOps",

    # --------------------------------------------------------
    # Data
    # --------------------------------------------------------

    "excel": "Excel",
    "power bi": "Power BI",
    "powerbi": "Power BI",

    "tableau": "Tableau",

    "pandas": "Pandas",
    "numpy": "NumPy",
    "matplotlib": "Matplotlib",

    "data analysis": "Data Analysis",
    "data analytics": "Data Analytics",
    "data science": "Data Science",

    # --------------------------------------------------------
    # AI / ML
    # --------------------------------------------------------

    "artificial intelligence": "AI",
    "machine learning": "Machine Learning",
    "deep learning": "Deep Learning",

    "tensorflow": "TensorFlow",
    "pytorch": "PyTorch",
    "scikit-learn": "scikit-learn",

    # --------------------------------------------------------
    # Testing
    # --------------------------------------------------------

    "jest": "Jest",
    "vitest": "Vitest",
    "playwright": "Playwright",
    "cypress": "Cypress",
    "selenium": "Selenium",

    "unit testing": "Unit Testing",
    "integration testing": "Integration Testing",
    "api testing": "API Testing",
    "automation testing": "Automation Testing",
    "software testing": "Software Testing",
    "performance testing": "Performance Testing",
    "regression testing": "Regression Testing",

    # --------------------------------------------------------
    # Salesforce
    # --------------------------------------------------------

    "salesforce": "Salesforce",
    "salesforce commerce cloud": "Salesforce Commerce Cloud",
    "sfcc": "Salesforce Commerce Cloud",

    "sfra": "SFRA",
    "isml": "ISML",
    "apex": "Apex",
    "soql": "SOQL",
    "sosl": "SOSL",
    "lwc": "LWC",

    # --------------------------------------------------------
    # API / Web
    # --------------------------------------------------------

    "rest": "REST API",
    "rest api": "REST API",

    "graphql": "GraphQL",

    "soap": "SOAP",
    "soap api": "SOAP API",

    "ocapi": "OCAPI",
    "scapi": "SCAPI",

    # --------------------------------------------------------
    # Business
    # --------------------------------------------------------

    "seo": "SEO",
    "crm": "CRM",
    "erp": "ERP",
    "sap": "SAP",

    # --------------------------------------------------------
    # Design
    # --------------------------------------------------------

    "figma": "Figma",
    "photoshop": "Photoshop",
    "illustrator": "Illustrator",

    # --------------------------------------------------------
    # Methodologies
    # --------------------------------------------------------

    "agile": "Agile",
    "scrum": "Scrum",

    # --------------------------------------------------------
    # Accessibility
    # --------------------------------------------------------

    "wcag": "WCAG",

    # --------------------------------------------------------
    # Other Web / Engineering
    # --------------------------------------------------------

    "cms": "CMS",
    "headless cms": "Headless CMS",
    "a/b testing": "A/B Testing",
    "ab testing": "A/B Testing",
}


# ============================================================
# NORMALIZATION
# ============================================================

def _normalize_skill(skill: str) -> str:
    """
    Clean and normalize a raw skill name.
    """

    if not skill:
        return ""

    skill = str(skill).strip()

    skill = " ".join(skill.split())

    skill = skill.strip(" ,;:|-_/")

    return skill


# ============================================================
# SKILL VALIDATION
# ============================================================

def _is_valid_skill(skill: str) -> bool:
    """
    Check whether a candidate looks like a genuine skill.
    """

    if not skill:
        return False

    normalized = _normalize_skill(skill)

    if not normalized:
        return False

    lower = normalized.lower().strip()
    words = normalized.split()

    # --------------------------------------------------------
    # Exact ignored terms
    # --------------------------------------------------------

    if lower in IGNORED_TERMS:
        return False

    # --------------------------------------------------------
    # Length protection
    # --------------------------------------------------------

    if len(normalized) > 50:
        return False

    if len(words) > 5:
        return False

    # --------------------------------------------------------
    # Known sentence starts
    # --------------------------------------------------------

    bad_starts = (
        "and ",
        "or ",
        "along with ",
        "with ",
        "for ",
        "to ",
        "from ",
        "including ",
        "such as ",
        "what to ",
        "how to ",
        "write ",
        "review ",
        "troubleshoot ",
        "stay current ",
        "interface with ",
        "responsible for ",
        "ability to ",
        "must be ",
        "should be ",
        "may be ",
        "can be ",
        "will be ",
        "where applicable",
        "a plus",
        "nice to have",
        "preferred ",
        "required ",
        "working with ",
        "experience with ",
        "experience in ",
        "knowledge of ",
        "understanding of ",
        "proficiency in ",
        "proficient in ",
    )

    if lower.startswith(bad_starts):
        return False

    # --------------------------------------------------------
    # Sentence punctuation
    # --------------------------------------------------------

    if normalized.endswith(
        (".", "!", "?", ";", ":")
    ):
        return False

    if ":" in normalized:
        return False

    # --------------------------------------------------------
    # Connector words
    # --------------------------------------------------------

    connector_words = {
        "and",
        "or",
        "with",
        "for",
        "to",
        "the",
        "a",
        "an",
        "is",
        "are",
        "be",
        "of",
        "in",
        "on",
        "from",
        "into",
        "will",
        "can",
        "should",
        "must",
        "where",
        "such",
        "as",
        "along",
    }

    connector_count = sum(
        1
        for word in words
        if word.lower().strip(",.()")
        in connector_words
    )

    if len(words) >= 3 and connector_count >= 2:
        return False

    # --------------------------------------------------------
    # Action verbs
    # --------------------------------------------------------

    action_words = {
        "write",
        "review",
        "troubleshoot",
        "stay",
        "interface",
        "monitor",
        "manage",
        "build",
        "create",
        "develop",
        "maintain",
        "ensure",
        "provide",
        "support",
        "implement",
        "drive",
        "give",
        "configure",
        "coordinate",
        "analyze",
        "analyse",
        "handle",
        "work",
        "use",
        "using",
    }

    if any(
        word.lower().strip(",.()")
        in action_words
        for word in words
    ):
        return False

    # --------------------------------------------------------
    # Valid testing skills
    # --------------------------------------------------------

    allowed_test_skills = {
        "jest",
        "vitest",
        "playwright",
        "cypress",
        "selenium",
        "integration testing",
        "unit testing",
        "automation testing",
        "software testing",
        "api testing",
        "performance testing",
        "regression testing",
    }

    if lower in allowed_test_skills:
        return True

    # --------------------------------------------------------
    # Sentence fragments
    # --------------------------------------------------------

    bad_fragments = (
        "a plus",
        "is a plus",
        "as a plus",
        "where applicable",
        "where needed",
        "where required",
        "if required",
        "as needed",
        "may be required",
        "will be required",
        "must have",
        "should have",
        "nice to have",
    )

    if lower in bad_fragments:
        return False

    # --------------------------------------------------------
    # Generic-only terms
    # --------------------------------------------------------

    generic_words = {
        "experience",
        "knowledge",
        "understanding",
        "skills",
        "skill",
        "ability",
        "candidate",
        "role",
        "team",
        "company",
        "environment",
        "process",
        "platform",
        "system",
        "technology",
    }

    generic_count = sum(
        1
        for word in words
        if word.lower().strip(",.()")
        in generic_words
    )

    if len(words) >= 2 and generic_count >= 2:
        return False

    return True


# ============================================================
# CANONICAL SKILL
# ============================================================

def _canonical_skill(skill: str) -> str:
    """
    Convert aliases into one canonical skill name.
    """

    normalized = _normalize_skill(skill)

    if not normalized:
        return ""

    key = normalized.lower()

    # .NET special handling
    if key in {
        ".net",
        "dotnet",
        "dot net",
    }:
        return ".NET"

    if key in SKILL_ALIASES:
        return SKILL_ALIASES[key]

    return normalized


# ============================================================
# JOB RESPONSE HELPERS
# ============================================================

def _unwrap_jobs(
    payload: Any,
) -> list[dict[str, Any]]:
    """
    Convert different API response shapes into a list of jobs.
    """

    if isinstance(payload, list):
        return [
            item
            for item in payload
            if isinstance(item, dict)
        ]

    if not isinstance(payload, dict):
        return []

    possible_keys = (
        "data",
        "jobs",
        "results",
        "items",
    )

    for key in possible_keys:
        value = payload.get(key)

        if isinstance(value, list):
            return [
                item
                for item in value
                if isinstance(item, dict)
            ]

    return []


def _safe_text(value: Any) -> str:
    """
    Safely convert API values to text.
    """

    if value is None:
        return ""

    if isinstance(value, str):
        return value

    return str(value)


# ============================================================
# LIVE JOBS
# ============================================================

def get_live_jobs(
    country: str = "IN",
    city: str | None = None,
    limit: int = 20,
) -> list[dict[str, Any]]:
    """
    Fetch live jobs including descriptions.
    """

    try:
        limit = max(
            1,
            min(int(limit), 100),
        )
    except Exception:
        limit = 20

    # IMPORTANT:
    # include_description=true gives us the actual
    # job description for skill extraction.
    params: dict[str, Any] = {
        "country": country,
        "limit": limit,
        "include_description": "true",
    }

    if city:
        params["city"] = city

    response = requests.get(
        JOB_API_BASE,
        params=params,
        timeout=REQUEST_TIMEOUT,
    )

    response.raise_for_status()

    payload = response.json()

    jobs = _unwrap_jobs(payload)

    # --------------------------------------------------------
    # City filtering
    # --------------------------------------------------------

    if city:
        city_lower = city.lower().strip()

        filtered_jobs = []

        for job in jobs:
            job_city = _safe_text(
                job.get("city")
                or job.get("location")
                or ""
            ).lower()

            if city_lower in job_city:
                filtered_jobs.append(job)

        jobs = filtered_jobs

    return jobs[:limit]


# ============================================================
# JOB DETAILS
# ============================================================

def get_job_details(
    job_id: str,
) -> dict[str, Any]:
    """
    Fetch details for one live job.
    """

    if not job_id:
        raise ValueError(
            "job_id is required"
        )

    url = f"{JOB_API_BASE}/{job_id}"

    response = requests.get(
        url,
        timeout=REQUEST_TIMEOUT,
    )

    response.raise_for_status()

    payload = response.json()

    if isinstance(payload, dict):

        if isinstance(
            payload.get("data"),
            dict,
        ):
            return payload["data"]

        if isinstance(
            payload.get("job"),
            dict,
        ):
            return payload["job"]

        return payload

    return {
        "id": job_id,
        "data": payload,
    }


# ============================================================
# JOB TEXT
# ============================================================

def _job_text(
    job: dict[str, Any],
) -> str:
    """
    Combine useful job fields into searchable text.
    """

    fields = (
        "title",
        "name",
        "description",
        "summary",
        "requirements",
        "qualifications",
        "responsibilities",
        "skills",
        "skills_required",
        "job_description",
    )

    parts: list[str] = []

    for field in fields:

        value = job.get(field)

        if value is None:
            continue

        if isinstance(value, list):

            for item in value:

                if isinstance(item, dict):

                    parts.extend(
                        str(v)
                        for v in item.values()
                        if v is not None
                    )

                else:
                    parts.append(
                        str(item)
                    )

        elif isinstance(value, dict):

            parts.extend(
                str(v)
                for v in value.values()
                if v is not None
            )

        else:

            parts.append(
                str(value)
            )

    return "\n".join(parts)


# ============================================================
# KNOWN SKILL EXTRACTION
# ============================================================

def _extract_known_skills(
    text: str,
) -> set[str]:
    """
    Find known skills from job description.
    """

    if not text:
        return set()

    text_lower = text.lower()

    found: set[str] = set()

    # Longest aliases first
    aliases = sorted(
        SKILL_ALIASES.items(),
        key=lambda item: len(item[0]),
        reverse=True,
    )

    for alias, canonical in aliases:

        escaped = re.escape(alias)

        # Special handling for .NET
        if alias == ".net":

            pattern = r"(?<![a-zA-Z0-9])\.net(?![a-zA-Z0-9])"

        else:

            pattern = (
                rf"(?<![a-zA-Z0-9+#.])"
                rf"{escaped}"
                rf"(?![a-zA-Z0-9+#.])"
            )

        try:

            if re.search(
                pattern,
                text_lower,
            ):
                found.add(canonical)

        except re.error:
            continue

    return found


# ============================================================
# STRUCTURED SKILL EXTRACTION
# ============================================================

def _extract_structured_skills(
    job: dict[str, Any],
) -> set[str]:
    """
    Extract skills from structured API fields.
    """

    found: set[str] = set()

    fields = (
        "skills",
        "skills_required",
        "technical_skills",
        "required_skills",
        "skill",
    )

    for field in fields:

        value = job.get(field)

        if value is None:
            continue

        values: list[Any] = []

        if isinstance(value, list):

            values = value

        elif isinstance(value, str):

            values = re.split(
                r"[,|;/\n]+",
                value,
            )

        elif isinstance(value, dict):

            values = list(
                value.values()
            )

        for item in values:

            if isinstance(item, dict):

                for nested in item.values():

                    candidate = (
                        _normalize_skill(
                            str(nested)
                        )
                    )

                    if _is_valid_skill(
                        candidate
                    ):

                        found.add(
                            _canonical_skill(
                                candidate
                            )
                        )

            else:

                candidate = (
                    _normalize_skill(
                        str(item)
                    )
                )

                if _is_valid_skill(
                    candidate
                ):

                    found.add(
                        _canonical_skill(
                            candidate
                        )
                    )

    return found


# ============================================================
# MARKET SKILL ANALYSIS
# ============================================================

def get_market_skills(
    country: str = "IN",
    city: str | None = None,
    limit: int = 10,
) -> dict[str, Any]:
    """
    Analyze live jobs and return trending market skills.

    No OpenRouter call is used.
    """

    jobs = get_live_jobs(
        country=country,
        city=city,
        limit=limit,
    )

    skill_counter: Counter[str] = Counter()

    jobs_analyzed = 0

    for job in jobs:

        try:

            text = _job_text(job)

            skills: set[str] = set()

            # ------------------------------------------------
            # Structured skills
            # ------------------------------------------------

            skills.update(
                _extract_structured_skills(
                    job
                )
            )

            # ------------------------------------------------
            # Skills from description
            # ------------------------------------------------

            skills.update(
                _extract_known_skills(
                    text
                )
            )

            # ------------------------------------------------
            # Final validation
            # ------------------------------------------------

            clean_skills: set[str] = set()

            for skill in skills:

                canonical = (
                    _canonical_skill(
                        skill
                    )
                )

                if _is_valid_skill(
                    canonical
                ):

                    clean_skills.add(
                        canonical
                    )

            # Count once per job
            for skill in clean_skills:

                skill_counter[
                    skill
                ] += 1

            jobs_analyzed += 1

        except Exception:

            # One bad job should not
            # break the complete analysis.
            continue

    # ========================================================
    # SORT
    # ========================================================

    sorted_skills = sorted(
        skill_counter.items(),
        key=lambda item: (
            -item[1],
            item[0].lower(),
        ),
    )

    skills = [
        {
            "skill": skill,
            "job_count": count,
        }
        for skill, count in sorted_skills
    ]

    # ========================================================
    # RESPONSE
    # ========================================================

    return {
        "country": country,
        "city": city,
        "jobs_found": len(jobs),
        "live_jobs": len(jobs),
        "jobs_analyzed": jobs_analyzed,
        "skills": skills,
    }