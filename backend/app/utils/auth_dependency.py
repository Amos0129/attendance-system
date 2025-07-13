from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from app.utils.jwt_handler import decode_access_token
from app.repositories import user_repository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = payload.get("sub")
    user = user_repository.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "role": user.get("role", "user"),
        "name": user.get("name"),
        "email": user.get("email"),
        "created_at": user.get("created_at"),
        "updated_at": user.get("updated_at")
    }

def require_admin(user: dict = Depends(get_current_user)):
    print("🔐 require_admin() 接收到的 user =", user)
    if user.get("role", "").lower() != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user