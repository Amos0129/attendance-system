import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db import db
from datetime import datetime

client = TestClient(app)
settings = db["settings"]

def setup_module(module):
    settings.delete_many({"setting_name": {"$regex": "^test_"}})

def teardown_module(module):
    settings.delete_many({"setting_name": {"$regex": "^test_"}})

def get_admin_token():
    response = client.post("/auth/login", data={
        "username": "phchuang",
        "password": "!QAZ 0okm 8uhb"
    })
    assert response.status_code == 200, f"登入失敗：{response.text}"
    return response.json()["access_token"]

def test_create_setting():
    token = get_admin_token()
    response = client.post(
        "/settings/",
        json={"setting_name": "test_grace_time", "setting_value": "10"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert isinstance(response.json(), str)

def test_get_all_settings():
    token = get_admin_token()
    response = client.get("/settings/", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_setting_by_name():
    token = get_admin_token()
    response = client.get("/settings/test_grace_time", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["setting_name"] == "test_grace_time"
    assert data["setting_value"] == "10"

def test_update_setting():
    token = get_admin_token()
    response = client.put("/settings/test_grace_time?value=15", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["setting_value"] == "15"

def test_delete_setting():
    token = get_admin_token()
    response = client.delete("/settings/test_grace_time", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json() is True
