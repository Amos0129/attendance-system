from app.db import db

def test_connection():
    users = db["users"]
    print("📦 已連接到 MongoDB，user 集合筆數：", users.count_documents({}))

if __name__ == "__main__":
    test_connection()
