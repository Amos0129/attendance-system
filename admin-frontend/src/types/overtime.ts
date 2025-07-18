// src/types/overtime.ts
export interface Overtime {
  id: string
  user_id: string
  overtime_start: string
  overtime_end: string
  total_hours: number
  reason?: string
  status: string
  created_at: string
  updated_at: string
}

export interface OvertimeRequest {
  overtime_start: string
  overtime_end: string
  reason?: string
}

export interface OvertimeStats {
  total_overtime: number
  pending_overtime: number
  approved_overtime: number
  rejected_overtime: number
}