from fastapi import APIRouter, Depends, HTTPException
from app.repositories import leave_repository
from app.schemas.leave_schema import LeaveCreate, LeaveOut, LeaveUpdate
from app.utils.auth_dependency import get_current_user
from typing import List

router = APIRouter(prefix="/leave", tags=["Leave"])

@router.post("/", response_model=str)
def apply_leave(leave: LeaveCreate, current_user = Depends(get_current_user)):
    return leave_repository.create_leave(current_user["id"], leave.model_dump())

@router.get("/my", response_model=List[LeaveOut])
def get_my_leaves(current_user = Depends(get_current_user)):
    return leave_repository.get_leaves_by_user(current_user["id"])

@router.get("/all", response_model=List[LeaveOut])
def get_all_leaves(current_user = Depends(get_current_user)):
    if current_user["role"] != "Admin":
        raise HTTPException(status_code=403, detail="No permission")
    return leave_repository.get_all_leaves()

@router.put("/{leave_id}/status")
def update_status(leave_id: str, update: LeaveUpdate, current_user = Depends(get_current_user)):
    if current_user["role"] != "Admin":
        raise HTTPException(status_code=403, detail="No permission")
    modified = leave_repository.update_leave_status(leave_id, update.status)
    if modified == 0:
        raise HTTPException(status_code=404, detail="Leave not found")
    return {"message": "Status updated"}

@router.get("/{leave_id}", response_model=LeaveOut)
def get_leave(leave_id: str, current_user = Depends(get_current_user)):
    leave = leave_repository.get_leave_by_id(leave_id)
    if not leave:
        raise HTTPException(status_code=404, detail="Leave not found")
    if current_user["role"] != "Admin" and str(leave["user_id"]) != current_user["id"]:
        raise HTTPException(status_code=403, detail="No permission to view this leave")
    return leave

@router.delete("/{leave_id}")
def delete_leave(leave_id: str, current_user = Depends(get_current_user)):
    if current_user["role"] != "Admin":
        raise HTTPException(status_code=403, detail="No permission")
    deleted = leave_repository.delete_leave(leave_id)
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Leave not found")
    return {"message": "Leave deleted"}