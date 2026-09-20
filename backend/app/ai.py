import os

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(
    prefix="/api/ai",
    tags=["AI Assistant"]
)

api_key = os.getenv("OPENROUTER_API_KEY")

if not api_key:
    raise RuntimeError(
        "OPENROUTER_API_KEY is not set in .env"
    )

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=api_key,
)


class AIRequest(BaseModel):
    message: str
    context: dict | None = None


@router.get("/test")
def test_ai():
    return {
        "message": "SkillBridge AI Assistant backend is ready"
    }


@router.post("/chat")
def chat_with_ai(request: AIRequest):

    try:
        profile = {}

        if request.context:
            profile = request.context.get(
                "profile"
            ) or {}

        skills = []

        if request.context:
            skills = request.context.get(
                "skills"
            ) or []

        headline = profile.get(
            "headline"
        ) or "Not set"

        target_career = profile.get(
            "target_career"
        ) or "Not set"

        if skills:
            skills_text = ", ".join(
                [
                    f"{skill.get('skill_name', 'Unknown')} "
                    f"({skill.get('skill_level', 0)}/5)"
                    for skill in skills
                ]
            )
        else:
            skills_text = "No skills added yet."

        personalized_message = f"""
Student information:

Headline: {headline}
Target Career: {target_career}
Current Skills: {skills_text}

Student question:
{request.message}

Please answer the student's question based on
their current career goal and skills.

Give a practical, beginner-friendly answer.
If the student is missing important skills,
mention those skills and explain what to learn next.
"""

        response = client.chat.completions.create(
            model="openrouter/free",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are SkillBridge AI Assistant, "
                        "a helpful career assistant for BCA students. "
                        "Give clear, practical and beginner-friendly "
                        "career and technology guidance."
                    ),
                },
                {
                    "role": "user",
                    "content": personalized_message,
                },
            ],
        )

        if not response.choices:
            raise Exception(
                "No response choices returned by OpenRouter"
            )

        reply = response.choices[0].message.content

        if not reply:
            raise Exception(
                "OpenRouter returned an empty response"
            )

        return {
            "reply": reply
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI request failed: {str(e)}"
        )

