from pydantic import BaseModel
from datetime import datetime

class SettingCreate(BaseModel):
    setting_name: str
    setting_value: str

class SettingOut(SettingCreate):
    id: str
    created_at: datetime
    updated_at: datetime
