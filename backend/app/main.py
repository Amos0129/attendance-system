from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import user_route, auth_route, admin_route, leave_route, overtime_route, attendance_route, report_route, device_router, attendance_setting_router, role_router, settings_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 或 ["*"] 暫時允許全部
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 註冊路由
app.include_router(user_route.router)
app.include_router(auth_route.router)
app.include_router(admin_route.router)
app.include_router(leave_route.router)
app.include_router(overtime_route.router)
app.include_router(attendance_route.router)
app.include_router(report_route.router)
app.include_router(device_router.router)
app.include_router(attendance_setting_router.router)
app.include_router(role_router.router)
app.include_router(settings_router.router)

@app.get("/")
def root():
    return {"message": "Hello from Attendance System"}
