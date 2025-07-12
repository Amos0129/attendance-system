from fastapi.testclient import TestClient
from app.main import app
from app.utils.jwt_handler import decode_access_token

client = TestClient(app)

def get_token(username="phchuang", password="!QAZ 0okm 8uhb"):
    res = client.post("/auth/login", data={"username": username, "password": password})
    assert res.status_code == 200
    return res.json()["access_token"]

def test_generate_attendance_report():
    token = get_token()  # 預設使用 admin 身份
    headers = {"Authorization": f"Bearer {token}"}

    # 確認 token 身分是 admin
    decoded = decode_access_token(token)
    assert decoded["sub"] == "686a367cc800123b9a8ebd05"  # phchuang 的 ObjectId

    payload = {
        "user_id": "686a6ce62be32901a8ad46f9",  # stella 的 ID
        "month": "2025-07"
    }

    res = client.post("/report/generate", json=payload, headers=headers)
    assert res.status_code == 200
    assert isinstance(res.json(), str)
    assert len(res.json()) == 24   # 成功會有 inserted_id

def test_get_my_reports():
    token = get_token("stella", "!QAZ 0okm 8uhb")  # Stella 是一般使用者
    headers = {"Authorization": f"Bearer {token}"}

    res = client.get("/report/my", headers=headers)
    assert res.status_code == 200
    assert isinstance(res.json(), list)