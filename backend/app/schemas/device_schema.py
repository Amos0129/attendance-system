from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class DeviceCreate(BaseModel):
    device_name: str
    device_type: str
    location: Optional[str] = None

class DeviceOut(BaseModel):
    id: str = Field(..., alias="_id")
    device_name: str
    device_type: str
    location: Optional[str]
    created_at: datetime
    updated_at: datetime
