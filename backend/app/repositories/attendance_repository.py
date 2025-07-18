import pytz
from app.db import db
from datetime import datetime, time, timezone, timedelta
from app.utils.time_utils import to_taipei, now_taipei, today_range_in_utc
from bson import ObjectId

attendances = db["attendances"]
settings = db["attendance_settings"]

def parse_time_string(value: str) -> time:
    try:
        return datetime.strptime(value, "%H:%M:%S").time()
    except ValueError:
        return datetime.strptime(value, "%H:%M").time()

def get_all_attendance():
    records = attendances.find().sort("clock_in", -1)
    result = []
    for record in records:
        record["_id"] = str(record["_id"])
        record["user_id"] = str(record["user_id"])
        
        # 轉換為台灣時間
        if record.get("clock_in"):
            record["clock_in"] = to_taipei(record["clock_in"]).isoformat()
        if record.get("clock_out"):
            record["clock_out"] = to_taipei(record["clock_out"]).isoformat()
            
        result.append(record)
    return result

def get_today_attendance(user_id: str):
    start, end = today_range_in_utc()
    return attendances.find_one({
        "user_id": ObjectId(user_id),
        "clock_in": {
            "$gte": start,
            "$lte": end
        }
    })

def get_setting():
    setting = settings.find_one()
    if not setting:
        # 若找不到設定，使用預設值（for testing）
        return {
            "work_start_time": "09:00",
            "work_end_time": "18:00",
            "grace_period": 10
        }
    return setting

def clock_in(user_id: str, device_id=None, location=None):
    if get_today_attendance(user_id):
        return None  # 已打過卡

    now_utc = datetime.now(timezone.utc)
    now_local = to_taipei(now_utc)

    setting = get_setting()
    work_start = parse_time_string(setting["work_start_time"])
    grace = setting.get("grace_period", 0)

    work_start_with_grace = (datetime.combine(now_local.date(), work_start) + timedelta(minutes=grace)).time()
    is_late = now_local.time() > work_start_with_grace

    data = {
        "user_id": ObjectId(user_id),
        "clock_in": now_utc,
        "clock_out": None,
        "is_late": is_late,
        "is_early_leave": False,
        "device_id": device_id,
        "location": location,
        "created_at": now_utc,
        "updated_at": now_utc
    }

    result = attendances.insert_one(data)
    return str(result.inserted_id)

def clock_out(user_id: str):
    record = get_today_attendance(user_id)
    if not record or record.get("clock_out"):
        return False  # 沒打卡或已打下班卡

    now_utc = datetime.now(timezone.utc)
    now_local = to_taipei(now_utc)

    setting = get_setting()
    work_end = parse_time_string(setting["work_end_time"])
    is_early = now_local.time() < work_end

    attendances.update_one(
        {"_id": record["_id"]},
        {"$set": {
            "clock_out": now_utc,
            "is_early_leave": is_early,
            "updated_at": now_utc
        }}
    )
    return True

def get_attendance_by_user(user_id: ObjectId):
    records = attendances.find(
        {"user_id": user_id},
        sort=[("clock_in", -1)]
    )

    result = []
    for record in records:
        record["_id"] = str(record["_id"])
        record["user_id"] = str(record["user_id"])
        result.append(record)
    return result
