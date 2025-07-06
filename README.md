# Attendance System

一個完整的上下班打卡系統，包含：

- FastAPI + MongoDB 後端
- Flutter 前台 App
- React Admin 後台管理界面
- JWT 登入驗證與權限機制

## 🚀 開發啟動方式

```bash
# 啟動後端 FastAPI
cd backend
uvicorn app.main:app --reload

# 安裝 Python 套件
pip install -r requirements.txt

# 測試
pytest

# Flutter app
cd mobile_app
flutter run