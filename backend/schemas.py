from typing import Literal
from pydantic import BaseModel, ConfigDict


class ProfileItem(BaseModel):

    model_config = ConfigDict(extra="forbid")

    field: str
    value: str | None
    state: Literal["provided", "not_taken", "unknown"]
    source_quote: str


class StudentProfile(BaseModel):

    model_config = ConfigDict(extra="forbid")

    facts: list[ProfileItem]
    preferences: list[ProfileItem]