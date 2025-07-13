from app.db import db
from datetime import datetime, timezone
from bson import ObjectId

devices = db["clock_in_devices"]

def get_all_devices():
    result = []
    for device in devices.find().sort("created_at", -1):
        created = device.get("created_at")
        updated = device.get("updated_at") or created  
        result.append({
            "_id": str(device["_id"]),  
            "device_id": device.get("device_id", ""),
            "device_name": device.get("device_name", ""), 
            "device_type": device.get("device_type", ""),
            "location": device.get("location", ""),
            "is_active": device.get("is_active", True),
            "created_at": created,
            "updated_at": updated,
        })
    return result

def create_device(data: dict):
    now = datetime.now(timezone.utc)
    data["created_at"] = now
    data["updated_at"] = now
    result = devices.insert_one(data)
    return str(result.inserted_id)

def get_device_by_id(device_id: str):
    device = devices.find_one({"_id": ObjectId(device_id)})
    if device:
        created = device.get("created_at")
        updated = device.get("updated_at") or created 
        return {
            "device_id": device.get("device_id", ""),
            "device_name": device.get("device_name", ""),
            "device_type": device.get("device_type", ""),
            "location": device.get("location", ""),
            "is_active": device.get("is_active", True),
            "created_at": created,
            "updated_at": updated,
        }
    return None

def delete_device(device_id: str):
    return devices.delete_one({"_id": ObjectId(device_id)}).deleted_count