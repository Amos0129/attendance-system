// src/services/employeeService.ts
import { apiClient } from './apiClient'
import { User } from '../types'

export interface EmployeeCreateRequest {
    username: string
    password: string
    name: string
    email?: string
    role?: string
}

export interface EmployeeUpdateRequest {
    username?: string
    name?: string
    email?: string
    role?: string
}

export interface EmployeeSearchParams {
    search?: string
    role?: string
    sortBy?: 'name' | 'username' | 'role' | 'created_at'
    sortOrder?: 'asc' | 'desc'
}

class EmployeeService {
    async getAllEmployees(): Promise<User[]> {
        try {
            console.log('📋 獲取所有員工...')
            const employees = await apiClient.get<User[]>('/users/')
            console.log('✅ 員工列表獲取成功:', employees)
            return employees
        } catch (error) {
            console.error('❌ 獲取員工列表失敗:', error)
            throw error
        }
    }

    async getEmployeeById(id: string): Promise<User> {
        try {
            console.log('🔍 獲取員工詳情:', id)
            const employee = await apiClient.get<User>(`/users/${id}`)
            console.log('✅ 員工詳情獲取成功:', employee)
            return employee
        } catch (error) {
            console.error('❌ 獲取員工詳情失敗:', error)
            throw error
        }
    }

    async createEmployee(data: EmployeeCreateRequest): Promise<string> {
        try {
            console.log('➕ 創建新員工:', data)
            const employeeId = await apiClient.post<string>('/users/', data)
            console.log('✅ 員工創建成功:', employeeId)
            return employeeId
        } catch (error) {
            console.error('❌ 創建員工失敗:', error)
            throw error
        }
    }

    async updateEmployee(id: string, data: EmployeeUpdateRequest): Promise<void> {
        try {
            console.log('✏️ 更新員工:', id, data)
            await apiClient.put(`/users/${id}`, data)
            console.log('✅ 員工更新成功')
        } catch (error) {
            console.error('❌ 更新員工失敗:', error)
            throw error
        }
    }

    async deleteEmployee(id: string): Promise<void> {
        try {
            console.log('🗑️ 刪除員工:', id)
            await apiClient.delete(`/users/${id}`)
            console.log('✅ 員工刪除成功')
        } catch (error) {
            console.error('❌ 刪除員工失敗:', error)
            throw error
        }
    }

    // 前端搜尋和排序（如果後端不支援）
    searchAndSortEmployees(
        employees: User[],
        params: EmployeeSearchParams
    ): User[] {
        let filtered = [...employees]

        // 搜尋功能
        if (params.search) {
            const searchLower = params.search.toLowerCase()
            filtered = filtered.filter(emp =>
                emp.name?.toLowerCase().includes(searchLower) ||
                emp.username?.toLowerCase().includes(searchLower) ||
                emp.email?.toLowerCase().includes(searchLower)
            )
        }

        // 角色篩選
        if (params.role && params.role !== 'all') {
            filtered = filtered.filter(emp => emp.role === params.role)
        }

        // 排序功能
        if (params.sortBy) {
            filtered.sort((a, b) => {
                let aValue: any = a[params.sortBy!]
                let bValue: any = b[params.sortBy!]

                // 處理日期排序
                if (params.sortBy === 'created_at') {
                    aValue = new Date(aValue).getTime()
                    bValue = new Date(bValue).getTime()
                } else {
                    // 字串排序
                    aValue = String(aValue).toLowerCase()
                    bValue = String(bValue).toLowerCase()
                }

                if (params.sortOrder === 'desc') {
                    return aValue < bValue ? 1 : -1
                } else {
                    return aValue > bValue ? 1 : -1
                }
            })
        }

        return filtered
    }
}

export const employeeService = new EmployeeService()