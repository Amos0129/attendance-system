from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class LeaveCreate(BaseModel):
    leave_type: str
    start_date: datetime
    end_date: datetime

class LeaveUpdate(BaseModel):
    status: str

class LeaveOut(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    leave_type: str
    start_date: datetime
    end_date: datetime
    status: str
    created_at: datetime
    updated_at: datetime
