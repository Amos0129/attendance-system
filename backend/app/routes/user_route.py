from fastapi import APIRouter, HTTPException, Depends
from app.schemas.user_schema import UserCreate, UserOut
from app.utils.auth_dependency import get_current_user
from app.utils.security import hash_password
from app.utils.time_utils import to_taipei
from app.repositories import user_repository
from datetime import datetime, timezone
from typing import List
from bson import ObjectId

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserOut)
def get_me(current_user: dict = Depends(get_current_user)):
    return UserOut(
        id=current_user["id"],
        username=current_user["username"],
        name=current_user["name"],
        email=current_user.get("email"),
        role=current_user["role"],
        created_at=current_user["created_at"],
        updated_at=current_user["updated_at"]
    )

@router.post("/", response_model=str)
def create(user: UserCreate):
    if user_repository.get_user_by_username(user.username):
        raise HTTPException(status_code=400, detail="Username already exists")
    user_dict = user.model_dump()
    user_dict["password"] = hash_password(user.password)
    now = datetime.now(timezone.utc)
    user_dict["created_at"] = now
    user_dict["updated_at"] = now
    return user_repository.create_user(user_dict)

@router.get("/", response_model=List[UserOut])
def get_all():
    users = user_repository.get_all_users()
    return [UserOut(
        id=str(u["_id"]),
        username=u["username"],
        name=u["name"],
        email=u.get("email"),
        role=u["role"],
        created_at=to_taipei(u["created_at"]),
        updated_at=to_taipei(u["updated_at"])
    ) for u in users]

@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: str):
    user = user_repository.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserOut(
        id=str(user["_id"]),
        username=user["username"],
        name=user["name"],
        email=user.get("email"),
        role=user["role"],
        created_at=to_taipei(user["created_at"]),
        updated_at=to_taipei(user["updated_at"])
    )

@router.put("/{user_id}")
def update_user(user_id: str, user: UserCreate):
    update_data = user.model_dump()
    update_data["password"] = hash_password(user.password)
    update_data["updated_at"] = datetime.now(timezone.utc)
    updated = user_repository.update_user(user_id, update_data)
    if updated == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User updated"}

@router.delete("/{user_id}")
def delete_user(user_id: str):
    deleted = user_repository.delete_user(user_id)
    if deleted == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}