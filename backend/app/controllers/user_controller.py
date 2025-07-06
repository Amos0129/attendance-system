from datetime import datetime, timezone
from app.utils.security import hash_password
from app.schemas.user_schema import UserCreate
from app.models import user_model

def create_user(user_data: UserCreate) -> str:
    user_dict = user_data.model_dump()
    user_dict["password"] = hash_password(user_data.password)
    user_dict["created_at"] = datetime.now(timezone.utc)
    user_dict["updated_at"] = datetime.now(timezone.utc)
    return user_model.create_user(user_dict)

def get_user_by_username(username: str):
    return user_model.get_user_by_username(username)

def get_all_users():
    return user_model.get_all_users()

def get_user_by_id(user_id: str):
    return user_model.get_user_by_id(user_id)

def update_user(user_id: str, update_data: dict):
    update_data["updated_at"] = datetime.now(timezone.utc)
    return user_model.update_user(user_id, update_data)

def delete_user(user_id: str):
    return user_model.delete_user(user_id)