from pydantic import BaseModel, Field


class SkillCreate(BaseModel):
    skill_name: str = Field(
        min_length=1,
        max_length=120
    )

    skill_level: int = Field(
        default=1,
        ge=1,
        le=5
    )


class SkillResponse(BaseModel):
    id: int
    user_id: int
    skill_name: str
    skill_level: int

    class Config:
        from_attributes = True