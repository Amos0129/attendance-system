from app.db import db
from datetime import datetime, timezone
from app.utils.time_utils import to_taipei
from bson import ObjectId

leaves = db["leaves"]

def create_leave(user_id: str, leave_data: dict):
    now = datetime.now(timezone.utc)

    leave_data["user_id"] = ObjectId(user_id)
    leave_data["status"] = "待批准"
    leave_data["created_at"] = now
    leave_data["updated_at"] = now

    result = leaves.insert_one(leave_data)
    return str(result.inserted_id)

def get_leaves_by_user(user_id: str):
    return [convert_leave(l) for l in leaves.find({"user_id": ObjectId(user_id)})]

def get_all_leaves():
    return [convert_leave(l) for l in leaves.find()]

def convert_leave(leave):
    leave["_id"] = str(leave["_id"])
    leave["user_id"] = str(leave["user_id"])

    if "start_date" in leave:
        leave["start_date"] = to_taipei(leave["start_date"])
    if "end_date" in leave:
        leave["end_date"] = to_taipei(leave["end_date"])
    if "created_at" in leave:
        leave["created_at"] = to_taipei(leave["created_at"])
    if "updated_at" in leave:
        leave["updated_at"] = to_taipei(leave["updated_at"])

    return leave

def update_leave_status(leave_id: str, new_status: str):
    result = leaves.update_one(
        {"_id": ObjectId(leave_id)},
        {"$set": {
            "status": new_status,
            "updated_at": datetime.now(timezone.utc)
        }}
    )
    return result.modified_count

def get_leave_by_id(leave_id: str):
    return leaves.find_one({"_id": ObjectId(leave_id)})

def delete_leave(leave_id: str):
    result = leaves.delete_one({"_id": ObjectId(leave_id)})
    return result.deleted_count

def get_leaves_between(user_id: str, start: datetime, end: datetime):
    return [convert_leave(l) for l in leaves.find({
        "user_id": ObjectId(user_id),
        "start_date": {"$lte": end},
        "end_date": {"$gte": start}
    })]
