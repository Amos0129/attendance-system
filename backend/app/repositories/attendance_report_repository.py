from app.db import db
from bson import ObjectId
from datetime import datetime
from app.utils.time_utils import to_taipei
from app.repositories import attendance_repository

reports = db["attendance_reports"]

def get_report_by_user(user_id: str):
    result = reports.find({"user_id": ObjectId(user_id)})
    return [
        {
            "_id": str(r["_id"]),
            "user_id": str(r["user_id"]),
            "month": r["month"],
            "total_work_time": r["total_work_time"],
            "total_overtime": r["total_overtime"],
            "total_absences": r["total_absences"],
            "created_at": r["created_at"],
        }
        for r in result
    ]

def generate_report(user_id: str, month: str):
    try:
        user_obj_id = ObjectId(user_id)
    except Exception as e:
        raise ValueError(f"無效的 user_id 格式: {e}")

    exists = reports.find_one({"user_id": user_obj_id, "month": month})
    if exists:
        return str(exists["_id"])

    attendances = attendance_repository.get_attendance_by_user(user_obj_id)
    total_work = 0
    total_ot = 0
    total_absent = 0

    for record in attendances:
        taipei_clock_in = to_taipei(record["clock_in"])
        if taipei_clock_in.strftime("%Y-%m") != month:
            continue

        if not record.get("clock_out"):
            total_absent += 1
            continue

        taipei_clock_out = to_taipei(record["clock_out"])
        duration = (taipei_clock_out - taipei_clock_in).total_seconds() / 60
        total_work += int(duration)

        # 超過480分鐘（8小時）才算加班，並排除早退/遲到
        if record.get("is_late") or record.get("is_early_leave"):
            total_ot += 0
        else:
            total_ot += max(0, int(duration) - 480)

    report = {
        "user_id": user_obj_id,
        "total_work_time": total_work,
        "total_overtime": total_ot,
        "total_absences": total_absent,
        "month": month,
        "created_at": datetime.utcnow(),
    }

    result = reports.insert_one(report)
    return str(result.inserted_id)
