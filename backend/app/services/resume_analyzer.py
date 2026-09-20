import json

from openai import OpenAI
from dotenv import load_dotenv

import os

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

if not OPENROUTER_API_KEY:
    raise RuntimeError("OPENROUTER_API_KEY is not set in .env")


client = OpenAI(
    api_key=OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1"
)


def analyze_resume(
    resume_text: str,
    target_career: str | None = None
):

    career_instruction = ""

    if target_career:
        career_instruction = f"""
The user's target career is:
{target_career}

Analyze the resume specifically for this target career.
"""
    else:
        career_instruction = """
There is no target career provided.

Analyze the resume and identify the most suitable career
or professional domain based only on the resume evidence.
"""


    prompt = f"""
You are an expert global career advisor and resume analyzer.

Analyze the following resume.

{career_instruction}

IMPORTANT:
- Do not use a fixed predefined skill list.
- Identify skills from the actual resume.
- Skills may belong to ANY industry or profession.
- Consider technical, professional, business, creative,
  communication, leadership and domain-specific skills.
- Identify realistic missing or recommended skills.
- Create a practical learning roadmap.
- Do not invent experience that is not present in the resume.
- Base the analysis on evidence from the resume.
- Return ONLY valid JSON.
- Do not use markdown.
- Do not add explanations outside the JSON.

Return exactly this structure:

{{
  "career": {{
    "title": "",
    "reason": ""
  }},
  "resume_summary": "",
  "skills_found": [],
  "skills_recommended": [],
  "skill_gap": [],
  "strengths": [],
  "improvement_areas": [],
  "roadmap": [
    {{
      "step": 1,
      "title": "",
      "skills": [],
      "description": ""
    }}
  ]
}}

Resume:

{resume_text}
"""


    response = client.chat.completions.create(
        model="openrouter/free",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a professional global career "
                    "and skill-gap analysis AI."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2,
    )


    content = response.choices[0].message.content

    if not content:
        raise ValueError(
            "AI returned an empty response"
        )


    content = content.strip()

    if content.startswith("```"):
        content = content.replace(
            "```json",
            ""
        ).replace(
            "```",
            ""
        ).strip()


    try:
        return json.loads(content)

    except json.JSONDecodeError as error:
        raise ValueError(
            f"AI returned invalid JSON: {error}"
        )