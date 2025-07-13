from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.repositories import user_repository
from app.utils.jwt_handler import create_access_token
from passlib.hash import bcrypt
from pydantic import BaseModel
import traceback

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

# ✅ 原本的 login，保留給 Swagger / Postman 用（form 格式）
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        db_user = user_repository.get_user_by_username(form_data.username)
        if not db_user or not bcrypt.verify(form_data.password, db_user["password"]):
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        token = create_access_token({
            "sub": str(db_user["_id"]),
            "username": db_user["username"],
            "role": db_user.get("role", "user")
        })
        return {"access_token": token, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception:
        print("Unexpected login error:", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Something went wrong")

# ✅ 新增 JSON login 給前端用（application/json 格式）
class LoginInput(BaseModel):
    username: str
    password: str

@router.post("/json-login")
def json_login(data: LoginInput):
    try:
        db_user = user_repository.get_user_by_username(data.username)
        if not db_user or not bcrypt.verify(data.password, db_user["password"]):
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        token = create_access_token({
            "sub": str(db_user["_id"]),
            "username": db_user["username"],
            "role": db_user.get("role", "user")
        })
        return {"access_token": token, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception:
        print("Unexpected json_login error:", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Something went wrong")
