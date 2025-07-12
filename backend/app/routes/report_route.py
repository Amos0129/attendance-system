from fastapi import APIRouter, Depends, HTTPException
from app.schemas.attendance_report_schema import ReportGenerateIn, AttendanceReportOut
from app.utils.auth_dependency import get_current_user
from app.repositories import attendance_report_repository
from typing import List

router = APIRouter(prefix="/report", tags=["Attendance Report"])

@router.get("/my", response_model=List[AttendanceReportOut])
def get_my_reports(current_user=Depends(get_current_user)):
    return attendance_report_repository.get_report_by_user(current_user["id"])

@router.post("/generate", response_model=str)
def generate_report(data: ReportGenerateIn, current_user=Depends(get_current_user)):
    if current_user.get("role", "").lower() != "admin":
        raise HTTPException(status_code=403, detail="No permission")
    return attendance_report_repository.generate_report(data.user_id, data.month)
