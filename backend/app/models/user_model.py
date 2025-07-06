from app.db import db
from datetime import datetime
from bson import ObjectId
from datetime import datetime, timezone

users = db["users"]

def get_user_by_username(username: str):
    return users.find_one({"username": username})

def create_user(user_data: dict):
    now = datetime.now(timezone.utc)
    user_data["created_at"] = now
    user_data["updated_at"] = now
    result = users.insert_one(user_data)
    return str(result.inserted_id)

def get_all_users():
    return list(users.find())

def get_user_by_id(user_id: str):
    return users.find_one({"_id": ObjectId(user_id)})

def update_user(user_id: str, update_data: dict):
    update_data["updated_at"] = datetime.now(timezone.utc)
    result = users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )
    return result.modified_count

def delete_user(user_id: str):
    result = users.delete_one({"_id": ObjectId(user_id)})
    return result.deleted_count
