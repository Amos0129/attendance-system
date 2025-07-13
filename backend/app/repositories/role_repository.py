from app.db import db
from datetime import datetime, timezone
from bson import ObjectId

roles = db["roles"]

def create_role(data: dict):
    now = datetime.now(timezone.utc)
    data["created_at"] = now
    data["updated_at"] = now
    result = roles.insert_one(data)
    return str(result.inserted_id)

def get_all_roles():
    result = []
    for r in roles.find():
        r["id"] = str(r["_id"])
        del r["_id"]
        result.append(r)
    return result

def get_role_by_id(role_id: str):
    role = roles.find_one({"_id": ObjectId(role_id)})
    if role:
        role["id"] = str(role["_id"])
        del role["_id"]
    return role

def update_role(role_id: str, update: dict):
    update["updated_at"] = datetime.now(timezone.utc)
    roles.update_one({"_id": ObjectId(role_id)}, {"$set": update})
    return get_role_by_id(role_id)

def delete_role(role_id: str):
    return roles.delete_one({"_id": ObjectId(role_id)}).deleted_count
