// src/types/user.ts
export interface User {
  id: string
  username: string
  name: string
  email?: string
  role: string
  created_at: string
  updated_at: string
}

export interface UserRequest {
  username: string
  password: string
  name: string
  email?: string
  role?: string
}

export interface UserStats {
  total_users: number
  active_users: number
  admin_users: number
  regular_users: number
}