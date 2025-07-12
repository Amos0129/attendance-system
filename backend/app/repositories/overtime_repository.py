from app.db import db
from datetime import datetime, timezone
from bson import ObjectId

overtimes = db["overtimes"]

def create_overtime(user_id: str, overtime_data: dict):
    start = overtime_data["overtime_start"]
    end = overtime_data["overtime_end"]
    duration = int((end - start).total_seconds() // 60)

    now = datetime.now(timezone.utc)
    overtime_data.update({
        "user_id": ObjectId(user_id),
        "total_hours": duration,
        "status": "待批准",
        "created_at": now,
        "updated_at": now,
    })

    result = overtimes.insert_one(overtime_data)
    return str(result.inserted_id)

def get_overtimes_by_user(user_id: str):
    records = overtimes.find({"user_id": ObjectId(user_id)})
    result = []
    for ot in records:
        ot["_id"] = str(ot["_id"])
        ot["user_id"] = str(ot["user_id"])
        result.append(ot)
    return result

def get_all_overtimes():
    records = overtimes.find()
    result = []
    for ot in records:
        ot["_id"] = str(ot["_id"])
        ot["user_id"] = str(ot["user_id"])
        result.append(ot)
    return result

def update_overtime_status(overtime_id: str, status: str):
    result = overtimes.update_one(
        {"_id": ObjectId(overtime_id)},
        {"$set": {
            "status": status,
            "updated_at": datetime.now(timezone.utc)
        }}
    )
    return result.modified_count
