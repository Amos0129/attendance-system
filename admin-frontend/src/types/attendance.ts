// src/types/attendance.ts
export interface AttendanceRecord {
  id: string
  user_id: string
  clock_in: string
  clock_out?: string
  date: string
  status: 'present' | 'absent' | 'late' | 'leave'
  is_late: boolean
  is_early_leave: boolean
  device_id?: string
  location?: string
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

export interface ClockInRequest {
  device_id?: string
  location?: string
}

export interface ClockInResponse {
  message: string
  id: string
}

export interface ClockOutResponse {
  message: string
}