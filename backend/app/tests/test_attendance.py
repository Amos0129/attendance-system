from fastapi.testclient import TestClient
from datetime import datetime
from app.main import app

client = TestClient(app)

def get_token():
    response = client.post("/auth/login", data={
        "username": "stella",
        "password": "!QAZ 0okm 8uhb"
    })
    assert response.status_code == 200
    return response.json()["access_token"]

def test_clock_in():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "device_id": "test-device-1",
        "location": "總公司"
    }

    response = client.post("/attendance/clock-in", json=payload, headers=headers)
    
    # 第一次打卡應成功
    assert response.status_code == 200
    assert response.json()["message"] == "上班打卡成功"
    assert "id" in response.json()

    # 第二次打卡應失敗（重複）
    response2 = client.post("/attendance/clock-in", json=payload, headers=headers)
    assert response2.status_code == 400
    assert response2.json()["detail"] == "今天已打過上班卡"

def test_clock_out():
    token = get_token()
    headers = {"Authorization": f"Bearer {token}"}

    response = client.post("/attendance/clock-out", headers=headers)

    if response.status_code == 400:
        # 可能還沒上班打卡
        assert response.json()["detail"] in ["尚未上班打卡或已打過下班卡"]
    else:
        assert response.status_code == 200
        assert response.json()["message"] == "下班打卡成功"
