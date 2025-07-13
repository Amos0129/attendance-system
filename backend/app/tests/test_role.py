import pytest
from bson import ObjectId
from fastapi.testclient import TestClient
from app.main import app
from app.db import db
from datetime import datetime, timezone

client = TestClient(app)
roles = db["roles"]

def get_token(username="phchuang", password="!QAZ 0okm 8uhb"):
    response = client.post("/auth/login", data={
        "username": username,
        "password": password
    })
    assert response.status_code == 200
    return response.json()["access_token"]

@pytest.fixture
def admin_headers():
    token = get_token()  # 預設是 admin 身份的 phchuang
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture(autouse=True)
def clean_roles():
    roles.delete_many({})  # 每次測試前清空角色表

def test_create_role(admin_headers):
    payload = {
        "role_name": "HR",
        "permissions": {"can_view": True, "can_edit": False}
    }
    response = client.post("/roles/", headers=admin_headers, json=payload)
    assert response.status_code == 200
    assert ObjectId.is_valid(response.json())

def test_get_all_roles(admin_headers):
    roles.insert_one({
        "role_name": "Tester",
        "permissions": {"can_test": True},
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    })
    response = client.get("/roles/", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert any(r["role_name"] == "Tester" for r in data)

def test_get_role_by_id(admin_headers):
    role_id = roles.insert_one({
        "role_name": "Manager",
        "permissions": {"can_manage": True},
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }).inserted_id
    response = client.get(f"/roles/{role_id}", headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["role_name"] == "Manager"

def test_update_role(admin_headers):
    role_id = roles.insert_one({
        "role_name": "Dev",
        "permissions": {"can_code": True},
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }).inserted_id
    updated = {
        "role_name": "Developer",
        "permissions": {"can_code": True, "can_deploy": True}
    }
    response = client.put(f"/roles/{role_id}", headers=admin_headers, json=updated)
    assert response.status_code == 200
    data = response.json()
    assert data["role_name"] == "Developer"
    assert "can_deploy" in data["permissions"]

def test_delete_role(admin_headers):
    role_id = roles.insert_one({
        "role_name": "Temp",
        "permissions": {"can_temp": True},
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }).inserted_id
    response = client.delete(f"/roles/{role_id}", headers=admin_headers)
    assert response.status_code == 200
    assert response.json() is True
    assert roles.find_one({"_id": ObjectId(role_id)}) is None