// src/services/authService.ts
import { apiClient } from './apiClient'
import { LoginRequest, LoginResponse } from '../types/auth'

class AuthService {
  async login(username: string, password: string): Promise<LoginResponse> {
    const loginData: LoginRequest = { username, password }
    const response = await apiClient.post<LoginResponse>('/auth/json-login', loginData)
    
    if (response.access_token) {
      localStorage.setItem('token', response.access_token)
    }
    
    return response
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token')
  }

  async getCurrentUser(): Promise<any> {
    return apiClient.get('/auth/me')
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token')
  }
}

export const authService = new AuthService()
