from fastapi import APIRouter, Depends, HTTPException
from app.schemas.device_schema import DeviceCreate, DeviceOut
from app.repositories import device_repository
from app.utils.auth_dependency import require_admin
from typing import List

router = APIRouter(prefix="/devices", tags=["Devices"])

@router.get("/", response_model=List[DeviceOut])
def list_devices(current_user=Depends(require_admin)):
    return device_repository.get_all_devices()

@router.post("/", response_model=str)
def create_device(device: DeviceCreate, current_user=Depends(require_admin)):
    return device_repository.create_device(device.model_dump())

@router.delete("/{device_id}")
def delete_device(device_id: str, current_user=Depends(require_admin)):
    deleted = device_repository.delete_device(device_id)
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Device not found")
    return {"message": "Device deleted"}
