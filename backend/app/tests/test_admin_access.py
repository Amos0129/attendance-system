# app/tests/test_admin_access.py

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def get_token(username, password):
    response = client.post("/login", data={
        "username": username,
        "password": password
    })
    assert response.status_code == 200
    return response.json()["access_token"]

def test_admin_access_allowed():
    token = get_token("phchuang", "!QAZ 0okm 8uhb")  # admin 帳號
    response = client.get(
        "/admin/dashboard",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Welcome, admin!"

def test_user_access_forbidden():
    token = get_token("stella", "!QAZ 0okm 8uhb")  # 一般 user
    response = client.get(
        "/admin/dashboard",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Admin access required"
