// src/types/attendance.ts
export interface AttendanceRecord {
  id: number
  user_id: number
  check_in: string
  check_out?: string
  date: string
  status: 'present' | 'absent' | 'late' | 'leave'
  notes?: string
  created_at: string
  updated_at: string
}

export interface AttendanceStats {
  total_days: number
  present_days: number
  absent_days: number
  late_days: number
  leave_days: number
  attendance_rate: number
}