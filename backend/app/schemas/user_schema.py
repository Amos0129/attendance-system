from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    password: str
    name: str
    email: Optional[EmailStr] = None
    role: Optional[str] = "user"

class UserOut(BaseModel):
    id: str
    username: str
    name: str
    email: Optional[EmailStr]
    role: str
    created_at: datetime
    updated_at: datetime
    
class UserLogin(BaseModel):
    username: str
    password: str
