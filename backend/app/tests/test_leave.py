from fastapi.testclient import TestClient
from app.main import app
from datetime import datetime, timedelta

client = TestClient(app)

# 模擬登入，取得 JWT Token（視你系統而定）
def get_token():
    response = client.post("/auth/login", data={
        "username": "stella",
        "password": "!QAZ 0okm 8uhb"
    })
    assert response.status_code == 200
    return response.json()["access_token"]

def test_apply_leave():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    leave_data = {
        "leave_type": "病假",
        "start_date": datetime.now().isoformat(),
        "end_date": (datetime.now() + timedelta(days=2)).isoformat()
    }

    response = client.post("/leave/", json=leave_data, headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), str)  # 回傳 leave id

def test_get_my_leaves():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/leave/my", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)
