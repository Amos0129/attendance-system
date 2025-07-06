from fastapi import FastAPI
from app.routes import user_route
from app.routes import user_route, auth_route 
from app.routes import admin_route

app = FastAPI()

# 註冊路由
app.include_router(user_route.router)
app.include_router(auth_route.router)
app.include_router(admin_route.router)

@app.get("/")
def root():
    return {"message": "Hello from Attendance System"}
