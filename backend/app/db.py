from pymongo import MongoClient
from dotenv import load_dotenv
import os

# 讀取 .env 中的變數
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["phchuang"]  # 這裡是你 MongoDB 的 database 名稱
