import pytest
from bson import ObjectId
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def get_token(username="phchuang", password="!QAZ 0okm 8uhb"):
    response = client.post("/auth/login", data={
        "username": username,
        "password": password
    })
    assert response.status_code == 200
    return response.json()["access_token"]

@pytest.fixture
def auth_headers():
    token = get_token("phchuang")  # admin 身分
    return {"Authorization": f"Bearer {token}"}

def test_create_device(auth_headers):
    payload = {
        "device_name": "測試設備 A",
        "device_type": "Mobile",
        "location": "台北辦公室"
    }
    response = client.post("/devices/", json=payload, headers=auth_headers)
    assert response.status_code == 200
    device_id = response.json()
    assert ObjectId.is_valid(device_id)

def test_list_devices(auth_headers):
    response = client.get("/devices/", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    if response.json():
        assert "device_name" in response.json()[0]

def test_delete_device(auth_headers):
    create_resp = client.post("/devices/", json={
        "device_name": "待刪除設備",
        "device_type": "打卡機",
        "location": "南部工廠"
    }, headers=auth_headers)
    device_id = create_resp.json()

    delete_resp = client.delete(f"/devices/{device_id}", headers=auth_headers)
    assert delete_resp.status_code == 200
    assert delete_resp.json()["message"] == "Device deleted"