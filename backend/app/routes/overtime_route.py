from fastapi import APIRouter, Depends, HTTPException
from app.schemas.overtime_schema import OvertimeCreate, OvertimeUpdate, OvertimeOut
from app.repositories import overtime_repository
from app.utils.auth_dependency import get_current_user
from typing import List

router = APIRouter(prefix="/overtime", tags=["Overtime"])

@router.post("/", response_model=str)
def apply_overtime(overtime: OvertimeCreate, current_user = Depends(get_current_user)):
    return overtime_repository.create_overtime(current_user["id"], overtime.model_dump())

@router.get("/my", response_model=List[OvertimeOut])
def get_my_overtimes(current_user = Depends(get_current_user)):
    return overtime_repository.get_overtimes_by_user(current_user["id"])

@router.get("/all", response_model=List[OvertimeOut])
def get_all_overtimes(current_user = Depends(get_current_user)):
    if current_user["role"] != "Admin":
        raise HTTPException(status_code=403, detail="No permission")
    return overtime_repository.get_all_overtimes()

@router.put("/{overtime_id}/status")
def update_status(overtime_id: str, update: OvertimeUpdate, current_user = Depends(get_current_user)):
    if current_user["role"] != "Admin":
        raise HTTPException(status_code=403, detail="No permission")
    modified = overtime_repository.update_overtime_status(overtime_id, update.status)
    if modified == 0:
        raise HTTPException(status_code=404, detail="Overtime not found")
    return {"message": "Status updated"}
