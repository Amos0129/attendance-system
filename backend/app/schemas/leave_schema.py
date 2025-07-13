from pydantic import BaseModel, Field, ConfigDict, field_serializer
from datetime import datetime
from typing import Optional
from enum import Enum
from bson import ObjectId

class LeaveStatus(str, Enum):
    pending = "待批准"
    approved = "已批准"
    rejected = "已拒絕"

class LeaveCreate(BaseModel):
    leave_type: str
    start_date: datetime
    end_date: datetime
    reason: Optional[str] = None  # 若你未來要加備註

class LeaveUpdate(BaseModel):
    status: LeaveStatus

class LeaveOut(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    leave_type: str
    start_date: datetime
    end_date: datetime
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
