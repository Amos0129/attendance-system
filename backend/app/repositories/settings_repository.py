from app.db import db
from datetime import datetime, timezone
from bson import ObjectId

collection = db["settings"]

def _convert_id(doc):
    if not doc:
        return None
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

def create_setting(setting: dict) -> str:
    now = datetime.now(timezone.utc)
    setting["created_at"] = now
    setting["updated_at"] = now
    result = collection.insert_one(setting)
    return str(result.inserted_id)

def get_all_settings():
    return [_convert_id(doc) for doc in collection.find()]

def get_setting_by_name(name: str):
    return _convert_id(collection.find_one({"setting_name": name}))

def update_setting(name: str, value: str):
    result = collection.find_one_and_update(
        {"setting_name": name},
        {"$set": {"setting_value": value, "updated_at": datetime.now(timezone.utc)}},
        return_document=True
    )
    return _convert_id(result)

def delete_setting(name: str):
    result = collection.delete_one({"setting_name": name})
    return result.deleted_count == 1