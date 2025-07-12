from datetime import datetime, timezone
from app.utils.security import hash_password
from app.schemas.user_schema import UserCreate
from app.models import user_model
from app.utils.time_utils import to_taipei

def create_user(user_data: UserCreate) -> str:
    now = datetime.now(timezone.utc)
    user_dict = user_data.model_dump()
    user_dict["password"] = hash_password(user_data.password)
    user_dict["created_at"] = now
    user_dict["updated_at"] = now
    return user_model.create_user(user_dict)

def convert_user(user: dict) -> dict:
    user["_id"] = str(user["_id"])
    if "created_at" in user:
        user["created_at"] = to_taipei(user["created_at"])
    if "updated_at" in user:
        user["updated_at"] = to_taipei(user["updated_at"])
    return user

def get_user_by_username(username: str):
    user = user_model.get_user_by_username(username)
    return convert_user(user)

def get_all_users():
    return [convert_user(u) for u in user_model.get_all_users()]

def get_user_by_id(user_id: str):
    user = user_model.get_user_by_id(user_id)
    return convert_user(user)

def update_user(user_id: str, update_data: dict):
    update_data["updated_at"] = datetime.now(timezone.utc)
    return user_model.update_user(user_id, update_data)

def delete_user(user_id: str):
    return user_model.delete_user(user_id)