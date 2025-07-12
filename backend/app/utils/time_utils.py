from datetime import datetime, time, timezone
import pytz

tz_taipei = pytz.timezone("Asia/Taipei")

def to_taipei(dt: datetime) -> datetime:
    """轉換 UTC 或其他時區時間為台灣時間"""
    return dt.astimezone(tz_taipei)

def now_taipei() -> datetime:
    """取得台灣當前時間（datetime with tzinfo）"""
    return datetime.now(tz_taipei)

def today_range_in_utc():
    """取得今天（台灣時間）在 UTC 中的時間區間"""
    today = now_taipei().date()
    start = tz_taipei.localize(datetime.combine(today, time.min)).astimezone(timezone.utc)
    end = tz_taipei.localize(datetime.combine(today, time.max)).astimezone(timezone.utc)
    return start, end