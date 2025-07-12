from fastapi import FastAPI
from app.routes import user_route, auth_route, admin_route, leave_route, overtime_route, attendance_route, report_route

app = FastAPI()

# 註冊路由
app.include_router(user_route.router)
app.include_router(auth_route.router)
app.include_router(admin_route.router)
app.include_router(leave_route.router)
app.include_router(overtime_route.router)
app.include_router(attendance_route.router)
app.include_router(report_route.router)

@app.get("/")
def root():
    return {"message": "Hello from Attendance System"}
