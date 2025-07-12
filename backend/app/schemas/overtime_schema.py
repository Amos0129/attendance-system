from pydantic import BaseModel, Field, ConfigDict, field_serializer
from datetime import datetime
from typing import Optional
from bson import ObjectId

class OvertimeCreate(BaseModel):
    overtime_start: datetime
    overtime_end: datetime
    reason: Optional[str] = None

class OvertimeUpdate(BaseModel):
    status: str  # "待批准", "已批准", "已拒絕"

class OvertimeOut(BaseModel):
    id: str = Field(..., alias="_id")
    user_id: str
    overtime_start: datetime
    overtime_end: datetime
    total_hours: int
    reason: Optional[str]
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={ObjectId: str},
    )

    @field_serializer("id", when_used="json")
    def serialize_id(self, v: ObjectId) -> str:
        return str(v)

    @field_serializer("user_id", when_used="json")
    def serialize_user_id(self, v: ObjectId) -> str:
        return str(v)