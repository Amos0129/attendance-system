// src/types/leave.ts
export interface Leave {
  id: string
  user_id: string
  leave_type: string
  start_date: string
  end_date: string
  status: string
  reason?: string
  created_at: string
  updated_at: string
}

export interface LeaveRequest {
  leave_type: string
  start_date: string
  end_date: string
  reason?: string
}

export interface LeaveStats {
  total_leaves: number
  pending_leaves: number
  approved_leaves: number
  rejected_leaves: number
}