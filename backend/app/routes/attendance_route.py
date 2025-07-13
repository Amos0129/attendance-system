from fastapi import APIRouter, Depends, HTTPException
from app.repositories import attendance_repository
from app.schemas.attendance_schema import ClockInOut, AttendanceOut
from app.utils.auth_dependency import get_current_user
from app.utils.auth_dependency import require_admin
from bson import ObjectId

router = APIRouter(prefix="/attendance", tags=["Attendance"])

@router.get("/my", response_model=list[AttendanceOut])
def get_my_attendance(current_user = Depends(get_current_user)):
    return attendance_repository.get_attendance_by_user(current_user["id"])

@router.get("/all", response_model=list[AttendanceOut])
def get_all_attendance(current_user = Depends(require_admin)):
    return attendance_repository.get_all_attendance()

@router.get("/user/{user_id}", response_model=list[AttendanceOut])
def get_user_attendance(user_id: str, current_user = Depends(require_admin)):
    try:
        obj_id = ObjectId(user_id)
    except:
        raise HTTPException(status_code=400, detail="無效的使用者 ID")
    
    return attendance_repository.get_attendance_by_user(obj_id)

@router.post("/clock-in")
def clock_in(data: ClockInOut, current_user = Depends(get_current_user)):
    result = attendance_repository.clock_in(
        current_user["id"],
        data.device_id,
        data.location
    )
    if result is None:
        raise HTTPException(status_code=400, detail="今天已打過上班卡")
    return {"message": "上班打卡成功", "id": result}

@router.post("/clock-out")
def clock_out(current_user = Depends(get_current_user)):
    success = attendance_repository.clock_out(current_user["id"])
    if not success:
        raise HTTPException(status_code=400, detail="尚未上班打卡或已打過下班卡")
    return {"message": "下班打卡成功"}
