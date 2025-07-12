from fastapi import APIRouter, HTTPException
from app.schemas.user_schema import UserLogin
from app.controllers import user_controller
from app.utils.jwt_handler import create_access_token
from passlib.hash import bcrypt
from fastapi import Depends
from app.utils.auth_dependency import get_current_user
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import HTTPException
import traceback

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        db_user = user_controller.get_user_by_username(form_data.username)
        if not db_user or not bcrypt.verify(form_data.password, db_user["password"]):
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        token = create_access_token({
            "sub": str(db_user["_id"]),
            "username": db_user["username"],
            "role": db_user.get("role", "user")
        })
        return {"access_token": token, "token_type": "bearer"}
    except HTTPException:
        raise  # 不要攔 HTTPException，直接丟回去
    except Exception as e:
        print("Unexpected login error:", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Something went wrong")
