from fastapi import APIRouter, Depends
from app.utils.auth_dependency import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/dashboard", dependencies=[Depends(require_admin)])
def get_admin_dashboard():
    return {"message": "Welcome, admin!"}
