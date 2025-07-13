from pydantic import BaseModel, Field
from typing import Optional, Dict
from datetime import datetime

class RoleCreate(BaseModel):
    role_name: str = Field(..., json_schema_extra={"example": "HR"})
    permissions: Dict[str, bool] = Field(..., json_schema_extra={"example": {"can_edit": True, "can_view": True}})

class RoleOut(RoleCreate):
    id: str
    created_at: datetime
    updated_at: datetime
