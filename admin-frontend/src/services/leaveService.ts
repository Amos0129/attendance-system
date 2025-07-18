// src/services/leaveService.ts
import { apiClient } from './apiClient'

// 根據後端 leave_schema.py 定義的結構
export interface LeaveRecord {
  id: string
  user_id: string
  user_name?: string // 前端添加
  leave_type: string
  start_date: string
  end_date: string
  status: '待批准' | '已批准' | '已拒絕'
  reason?: string
  created_at: string
  updated_at: string
  // 前端計算字段
  duration_days?: number
}

export interface LeaveStats {
  total_leaves: number
  pending_leaves: number
  approved_leaves: number
  rejected_leaves: number
  total_employees: number
  leave_rate: number
}

export interface LeaveCreateRequest {
  leave_type: string
  start_date: string
  end_date: string
  reason?: string
}

export interface LeaveUpdateRequest {
  status: '待批准' | '已批准' | '已拒絕'
}

export interface LeaveSearchParams {
  search?: string
  status?: string
  leave_type?: string
  sortBy?: 'created_at' | 'start_date' | 'status' | 'leave_type'
  sortOrder?: 'asc' | 'desc'
}

class LeaveService {
  // 處理後端數據格式
  private processRawRecord(rawRecord: any): LeaveRecord {
    return {
      ...rawRecord,
      id: rawRecord.id || rawRecord._id || '',
      duration_days: this.calculateDurationDays(rawRecord.start_date, rawRecord.end_date),
      user_name: rawRecord.user_name || `用戶${rawRecord.user_id}`
    }
  }

  // 獲取所有請假記錄（管理員專用）
  async getAllLeaves(): Promise<LeaveRecord[]> {
    try {
      console.log('📋 獲取所有請假記錄...')
      const rawRecords = await apiClient.get<any[]>('/leave/all')
      
      const processedRecords = rawRecords.map(record => this.processRawRecord(record))
      
      console.log('✅ 請假記錄獲取成功:', processedRecords)
      return processedRecords
    } catch (error) {
      console.error('❌ 獲取請假記錄失敗:', error)
      throw error
    }
  }

  // 獲取我的請假記錄
  async getMyLeaves(): Promise<LeaveRecord[]> {
    try {
      console.log('📋 獲取我的請假記錄...')
      const rawRecords = await apiClient.get<any[]>('/leave/my')
      
      const processedRecords = rawRecords.map(record => ({
        ...this.processRawRecord(record),
        user_name: '我'
      }))
      
      console.log('✅ 我的請假記錄獲取成功:', processedRecords)
      return processedRecords
    } catch (error) {
      console.error('❌ 獲取我的請假記錄失敗:', error)
      throw error
    }
  }

  // 獲取特定請假記錄
  async getLeaveById(id: string): Promise<LeaveRecord> {
    try {
      console.log('🔍 獲取請假記錄詳情:', id)
      const rawRecord = await apiClient.get<any>(`/leave/${id}`)
      
      const processedRecord = this.processRawRecord(rawRecord)
      
      console.log('✅ 請假記錄詳情獲取成功:', processedRecord)
      return processedRecord
    } catch (error) {
      console.error('❌ 獲取請假記錄詳情失敗:', error)
      throw error
    }
  }

  // 申請請假
  async applyLeave(data: LeaveCreateRequest): Promise<string> {
    try {
      console.log('📝 申請請假:', data)
      const leaveId = await apiClient.post<string>('/leave/', data)
      console.log('✅ 請假申請成功:', leaveId)
      return leaveId
    } catch (error) {
      console.error('❌ 請假申請失敗:', error)
      throw error
    }
  }

  // 更新請假狀態（管理員專用）
  async updateLeaveStatus(id: string, data: LeaveUpdateRequest): Promise<void> {
    try {
      console.log('✏️ 更新請假狀態:', id, data)
      await apiClient.put(`/leave/${id}/status`, data)
      console.log('✅ 請假狀態更新成功')
    } catch (error) {
      console.error('❌ 更新請假狀態失敗:', error)
      throw error
    }
  }

  // 刪除請假記錄（管理員專用）
  async deleteLeave(id: string): Promise<void> {
    try {
      console.log('🗑️ 刪除請假記錄:', id)
      await apiClient.delete(`/leave/${id}`)
      console.log('✅ 請假記錄刪除成功')
    } catch (error) {
      console.error('❌ 刪除請假記錄失敗:', error)
      throw error
    }
  }

  // 獲取用戶列表（用於關聯用戶名稱）
  async getUsersForLeave(): Promise<Array<{ id: string; name: string; username: string }>> {
    try {
      const users = await apiClient.get<any[]>('/users/')
      return users.map(user => ({
        id: user.id,
        name: user.name,
        username: user.username
      }))
    } catch (error) {
      console.error('❌ 獲取用戶列表失敗:', error)
      return []
    }
  }

  // 獲取請假統計數據
  async getLeaveStats(): Promise<LeaveStats> {
    try {
      console.log('📊 計算請假統計...')
      
      const [users, leaveRecords] = await Promise.all([
        apiClient.get<any[]>('/users/'),
        this.getAllLeaves()
      ])
      
      const stats: LeaveStats = {
        total_leaves: leaveRecords.length,
        pending_leaves: leaveRecords.filter(r => r.status === '待批准').length,
        approved_leaves: leaveRecords.filter(r => r.status === '已批准').length,
        rejected_leaves: leaveRecords.filter(r => r.status === '已拒絕').length,
        total_employees: users.length,
        leave_rate: users.length > 0 ? Math.round((leaveRecords.length / users.length) * 100) : 0
      }

      console.log('✅ 請假統計計算完成:', stats)
      return stats
    } catch (error) {
      console.error('❌ 計算請假統計失敗:', error)
      return {
        total_leaves: 0,
        pending_leaves: 0,
        approved_leaves: 0,
        rejected_leaves: 0,
        total_employees: 0,
        leave_rate: 0
      }
    }
  }

  // 計算請假天數
  private calculateDurationDays(startDate: string, endDate: string): number {
    try {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // +1 包含開始日
      return diffDays
    } catch (error) {
      console.error('日期計算錯誤:', error)
      return 1
    }
  }

  // 前端搜尋和排序功能
  searchAndSortLeaves(
    records: LeaveRecord[],
    params: LeaveSearchParams
  ): LeaveRecord[] {
    let filtered = [...records]

    // 搜尋功能
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filtered = filtered.filter(record => 
        record.user_name?.toLowerCase().includes(searchLower) ||
        record.leave_type?.toLowerCase().includes(searchLower) ||
        record.reason?.toLowerCase().includes(searchLower)
      )
    }

    // 狀態篩選
    if (params.status && params.status !== 'all') {
      filtered = filtered.filter(record => record.status === params.status)
    }

    // 請假類型篩選
    if (params.leave_type && params.leave_type !== 'all') {
      filtered = filtered.filter(record => record.leave_type === params.leave_type)
    }

    // 排序功能
    if (params.sortBy) {
      filtered.sort((a, b) => {
        let aValue: any = a[params.sortBy!]
        let bValue: any = b[params.sortBy!]

        // 處理日期排序
        if (params.sortBy === 'created_at' || params.sortBy === 'start_date') {
          aValue = aValue ? new Date(aValue).getTime() : 0
          bValue = bValue ? new Date(bValue).getTime() : 0
        } else {
          // 字串排序
          aValue = String(aValue || '').toLowerCase()
          bValue = String(bValue || '').toLowerCase()
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

export const leaveService = new LeaveService()