from fastapi import APIRouter, Depends, HTTPException
from app.schemas.settings_schema import SettingCreate, SettingOut
from app.repositories import settings_repository
from app.utils.auth_dependency import require_admin
from typing import List

router = APIRouter(prefix="/settings", tags=["Settings"])

@router.post("/", response_model=str)
def create(setting: SettingCreate, _=Depends(require_admin)):
    return settings_repository.create_setting(setting.model_dump())

@router.get("/", response_model=List[SettingOut])
def get_all(_=Depends(require_admin)):
    return settings_repository.get_all_settings()

@router.get("/{name}", response_model=SettingOut)
def get_by_name(name: str, _=Depends(require_admin)):
    setting = settings_repository.get_setting_by_name(name)
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    return setting

@router.put("/{name}", response_model=SettingOut)
def update(name: str, value: str, _=Depends(require_admin)):
    setting = settings_repository.update_setting(name, value)
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    return setting

@router.delete("/{name}", response_model=bool)
def delete(name: str, _=Depends(require_admin)):
    return settings_repository.delete_setting(name)