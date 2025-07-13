from app.db import db
from datetime import datetime, timezone, time
from bson import ObjectId

collection = db["attendance_settings"]

def parse_time(t) -> time:
    return t if isinstance(t, time) else datetime.strptime(t, "%H:%M:%S").time()

def get_setting():
    setting = collection.find_one()
    if setting:
        # 轉換字串為 time 物件
        setting["work_start_time"] = parse_time(setting["work_start_time"])
        setting["work_end_time"] = parse_time(setting["work_end_time"])
    return setting

def upsert_setting(data: dict) -> ObjectId:
    now = datetime.now(timezone.utc)
    data["updated_at"] = now

    # 將 datetime.time 轉為 HH:MM:SS 字串（確保儲存格式一致）
    if isinstance(data["work_start_time"], time):
        data["work_start_time"] = data["work_start_time"].strftime("%H:%M:%S")
    if isinstance(data["work_end_time"], time):
        data["work_end_time"] = data["work_end_time"].strftime("%H:%M:%S")

    existing = collection.find_one()
    if existing:
        collection.update_one({"_id": existing["_id"]}, {"$set": data})
        return existing["_id"]
    else:
        data["created_at"] = now
        result = collection.insert_one(data)
        return result.inserted_id
