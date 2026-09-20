from pydantic import BaseModel, Field


class ProfileResponse(BaseModel):
    id: int
    user_id: int
    headline: str | None = None
    target_career: str | None = None

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    headline: str | None = Field(
        default=None,
        max_length=255
    )

    target_career: str | None = Field(
        default=None,
        max_length=120
    )