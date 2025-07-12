from pydantic import BaseModel, Field
from datetime import datetime

class ReportGenerateIn(BaseModel):
    user_id: str
    month: str  # 格式：YYYY-MM

class AttendanceReportOut(BaseModel):
    id: str = Field(..., alias="_id")
    user_id: str
    total_work_time: int
    total_overtime: int
    total_absences: int
    month: str
    created_at: datetime
