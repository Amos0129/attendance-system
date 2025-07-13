import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# 登入拿 token（用真帳號）
def get_token(username: str, password: str):
    resp = client.post("/auth/login", data={
        "username": username,
        "password": password
    })
    assert resp.status_code == 200
    return resp.json()["access_token"]

# admin 權限 header
@pytest.fixture
def admin_headers():
    token = get_token("phchuang", "!QAZ 0okm 8uhb")
    return {"Authorization": f"Bearer {token}"}

# user 權限 header
@pytest.fixture
def user_headers():
    token = get_token("stella", "!QAZ 0okm 8uhb")
    return {"Authorization": f"Bearer {token}"}

# 測試 admin 可以讀
def test_get_attendance_setting_as_admin(admin_headers):
    response = client.get("/settings/attendance/", headers=admin_headers)
    assert response.status_code in [200, 404]
    if response.status_code == 200:
        data = response.json()
        assert "work_start_time" in data
        assert "work_end_time" in data
        assert "grace_period" in data
        assert "lunch_break_time" in data

# 測試 admin 可以更新
def test_update_attendance_setting_as_admin(admin_headers):
    setting_data = {
        "work_start_time": "09:00",
        "work_end_time": "18:00",
        "grace_period": 15,
        "lunch_break_time": 60
    }
    response = client.put("/settings/attendance/", headers=admin_headers, json=setting_data)
    assert response.status_code == 200
    assert isinstance(response.json(), str)

# 測試 admin 更新後可以讀到一樣的內容
def test_update_and_get_attendance_setting_consistency(admin_headers):
    new_data = {
        "work_start_time": "08:30",
        "work_end_time": "17:30",
        "grace_period": 10,
        "lunch_break_time": 45
    }
    put_resp = client.put("/settings/attendance/", headers=admin_headers, json=new_data)
    assert put_resp.status_code == 200

    get_resp = client.get("/settings/attendance/", headers=admin_headers)
    assert get_resp.status_code == 200
    returned = get_resp.json()
    for key in new_data:
        assert str(new_data[key]) == str(returned[key])

# 一般使用者應該被擋下
def test_get_attendance_setting_as_user_should_fail(user_headers):
    response = client.get("/settings/attendance/", headers=user_headers)
    assert response.status_code == 403

# 一般使用者不能更新
def test_update_attendance_setting_as_user_should_fail(user_headers):
    setting_data = {
        "work_start_time": "09:30",
        "work_end_time": "17:30",
        "grace_period": 5,
        "lunch_break_time": 45
    }
    response = client.put("/settings/attendance/", headers=user_headers, json=setting_data)
    assert response.status_code == 403