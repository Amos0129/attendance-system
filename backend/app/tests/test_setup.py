# tests/test_setup.py
from datetime import datetime, timezone
from app.db import db
from app.utils.security import hash_password
from app.utils.time_utils import today_range_in_utc

def setup_test_user():
    users = db["users"]
    if not users.find_one({"username": "stella"}):
        users.insert_one({
            "username": "stella",
            "password": hash_password("!QAZ 0okm 8uhb"),
            "role": "user",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        })

def clean_today_attendance(username: str):
    user = db["users"].find_one({"username": username})
    if not user:
        return
    start, end = today_range_in_utc()
    db["attendances"].delete_many({
        "user_id": user["_id"],
        "clock_in": {"$gte": start, "$lte": end}
    })

def ensure_test_device_exists():
    devices = db["clock_in_devices"]
    if not devices.find_one({"device_id": "test-device-1"}):
        devices.insert_one({
            "device_id": "test-device-1",
            "name": "測試裝置",
            "location": "總公司",
            "is_active": True,
            "created_at": datetime.now(timezone.utc)
        })
