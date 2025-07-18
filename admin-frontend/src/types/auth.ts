// src/types/auth.ts
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  message?: string
}

export interface User {
  id: number
  username: string
  email?: string
  role: string
  created_at: string
  updated_at: string
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (token: string) => void
  logout: () => void
  getCurrentUser: () => Promise<User | null>
}