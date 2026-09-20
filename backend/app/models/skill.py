from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from ..database.session import Base


class Skill(Base):
    __tablename__ = "skills"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    skill_name = Column(
        String(120),
        nullable=False
    )

    skill_level = Column(
        Integer,
        nullable=False,
        default=1
    )

    user = relationship(
        "User"
    )