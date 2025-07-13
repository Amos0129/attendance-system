from fastapi import APIRouter, Depends, HTTPException
from app.utils.auth_dependency import require_admin
from app.schemas.attendance_setting_schema import AttendanceSettingCreate, AttendanceSettingOut
from app.repositories import attendance_setting_repository

router = APIRouter(prefix="/settings/attendance", tags=["Attendance Setting"])

@router.get("/", response_model=AttendanceSettingOut)
def get_attendance_setting(user=Depends(require_admin)):
    setting = attendance_setting_repository.get_setting()
    if not setting:
        raise HTTPException(status_code=404, detail="尚未設定打卡時間")
    return {
        "id": str(setting["_id"]),
        "work_start_time": setting["work_start_time"],
        "work_end_time": setting["work_end_time"],
        "grace_period": setting["grace_period"],
        "lunch_break_time": setting["lunch_break_time"],
        "created_at": setting["created_at"],
        "updated_at": setting["updated_at"],
    }

@router.put("/", response_model=str)
def update_attendance_setting(setting: AttendanceSettingCreate, user=Depends(require_admin)):
    setting_dict = setting.model_dump()
    setting_id = attendance_setting_repository.upsert_setting(setting_dict)
    return str(setting_id)

