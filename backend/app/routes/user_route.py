from fastapi import APIRouter, HTTPException
from app.controllers import user_controller  # ← 換這個
from app.schemas.user_schema import UserCreate, UserOut
from app.utils.auth_dependency import get_current_user
from app.utils.auth_dependency import get_current_user
from fastapi import Depends

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserOut)
def get_me(current_user: dict = Depends(get_current_user)):
    return UserOut(
        id=str(current_user["_id"]),
        username=current_user["username"],
        name=current_user["name"],
        email=current_user.get("email"),
        role=current_user["role"],
        created_at=current_user["created_at"],
        updated_at=current_user["updated_at"]
    )

@router.post("/", response_model=str)
def create(user: UserCreate):
    return user_controller.create_user(user)

@router.get("/", response_model=list[UserOut])
def get_all():
    users = user_controller.get_all_users()
    return [UserOut(
        id=str(u["_id"]),
        username=u["username"],
        name=u["name"],
        email=u.get("email"),
        role=u["role"],
        created_at=u["created_at"],
        updated_at=u["updated_at"]
    ) for u in users]

@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: str):
    user = user_controller.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserOut(
        id=str(user["_id"]),
        username=user["username"],
        name=user["name"],
        email=user.get("email"),
        role=user["role"],
        created_at=user["created_at"],
        updated_at=user["updated_at"]
    )

@router.put("/{user_id}")
def update_user(user_id: str, user: UserCreate):
    updated = user_controller.update_user(user_id, user.dict())
    if updated == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User updated"}

@router.delete("/{user_id}")
def delete_user(user_id: str):
    deleted = user_controller.delete_user(user_id)
    if deleted == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}