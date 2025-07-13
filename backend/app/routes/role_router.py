# app/routes/role_router.py
from fastapi import APIRouter, HTTPException, Depends
from app.schemas.role_schema import RoleCreate, RoleOut
from app.repositories import role_repository
from app.utils.auth_dependency import require_admin
from typing import List

router = APIRouter(prefix="/roles", tags=["Roles"])

@router.post("/", response_model=str)
def create(role: RoleCreate, user=Depends(require_admin)):
    return role_repository.create_role(role.model_dump())

@router.get("/", response_model=List[RoleOut])
def list_roles(user=Depends(require_admin)):
    return role_repository.get_all_roles()

@router.get("/{role_id}", response_model=RoleOut)
def get(role_id: str, user=Depends(require_admin)):
    role = role_repository.get_role_by_id(role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return role

@router.put("/{role_id}", response_model=RoleOut)
def update(role_id: str, update: RoleCreate, user=Depends(require_admin)):
    return role_repository.update_role(role_id, update.model_dump())

@router.delete("/{role_id}", response_model=bool)
def delete(role_id: str, user=Depends(require_admin)):
    deleted = role_repository.delete_role(role_id)
    return deleted == 1
