from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ClockInOut(BaseModel):
    device_id: Optional[str] = None
    location: Optional[str] = None

class AttendanceOut(BaseModel):
    id: str = Field(..., alias="_id")
    user_id: str
    clock_in: datetime
    clock_out: Optional[datetime] = None
    is_late: bool
    is_early_leave: bool
    device_id: Optional[str]
    location: Optional[str]
    created_at: datetime
    updated_at: datetime
