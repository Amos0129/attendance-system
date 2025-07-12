from fastapi.testclient import TestClient
from app.main import app
from datetime import datetime, timedelta

client = TestClient(app)

def get_token():
    response = client.post("/auth/login", data={
        "username": "stella",
        "password": "!QAZ 0okm 8uhb"
    })
    assert response.status_code == 200
    return response.json()["access_token"]

def test_apply_overtime():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}

    overtime_data = {
        "overtime_start": datetime.now().isoformat(),
        "overtime_end": (datetime.now() + timedelta(hours=2)).isoformat(),
        "reason": "專案上線準備"
    }

    response = client.post("/overtime/", json=overtime_data, headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), str)  # 應回傳加班ID

def test_get_my_overtimes():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/overtime/my", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)