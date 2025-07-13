from pydantic import BaseModel, Field, field_serializer
from datetime import time, datetime

class AttendanceSettingCreate(BaseModel):
    work_start_time: time = Field(..., json_schema_extra={"example": "09:00:00"})
    work_end_time: time = Field(..., json_schema_extra={"example": "18:00:00"})    
    grace_period: int = Field(..., json_schema_extra={"example": 10})
    lunch_break_time: int = Field(..., json_schema_extra={"example": 60})

class AttendanceSettingOut(AttendanceSettingCreate):
    id: str
    created_at: datetime
    updated_at: datetime

    @field_serializer("work_start_time", "work_end_time")
    def serialize_time(self, value: time) -> str:
        return value.strftime("%H:%M")

    @field_serializer("created_at", "updated_at")
    def serialize_datetime(self, value: datetime) -> str:
        return value.strftime("%Y-%m-%d %H:%M:%S")