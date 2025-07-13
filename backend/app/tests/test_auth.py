from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# 測試帳號
USERNAME = "phchuang"
PASSWORD = "!QAZ 0okm 8uhb"
def test_login_success():
    response = client.post("/auth/login", data={
        "username": USERNAME,
        "password": PASSWORD
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_fail():
    response = client.post("/auth/login", data={
        "username": USERNAME,
        "password": "wrongpassword"
    })
    assert response.status_code == 401

def test_get_me_with_token():
    # 登入取得 token
    login = client.post("/auth/login", data={
        "username": USERNAME,
        "password": PASSWORD
    })
    token = login.json()["access_token"]

    # 使用 token 呼叫 /users/me
    response = client.get("/users/me", headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == USERNAME

def test_get_me_with_invalid_token():
    response = client.get("/users/me", headers={
        "Authorization": "Bearer fake.token.123"
    })
    assert response.status_code == 401

def test_get_me_without_token():
    response = client.get("/users/me")
    assert response.status_code == 401
