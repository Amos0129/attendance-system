// src/services/dashboardService.ts
import { apiClient } from './apiClient'
import { User, Leave, Overtime, AttendanceRecord } from '../types'

export interface DashboardStats {
  totalEmployees: number
  todayAttendance: number
  pendingLeaves: number
  pendingOvertime: number
}

export interface ActivityItem {
  id: string
  title: string
  time: string
  type: string
  status: 'pending' | 'approved' | 'rejected'
  user: string
}

class DashboardService {
  async getStats(): Promise<DashboardStats> {
    try {
      console.log('🔄 開始獲取統計數據...')
      
      const [users, attendances] = await Promise.all([
        apiClient.get<User[]>('/users/'),
        apiClient.get<AttendanceRecord[]>('/attendance/all')
      ])

      console.log('📊 基本 API 響應:', { users, attendances })

      // 嘗試獲取請假和加班數據，失敗時使用預設值
      let leaves: Leave[] = []
      let overtimes: Overtime[] = []
      
      try {
        leaves = await apiClient.get<Leave[]>('/leave/all')
        console.log('✅ 請假數據獲取成功:', leaves)
      } catch (error) {
        console.warn('⚠️ 無法獲取請假數據，使用預設值:', error)
      }
      
      try {
        overtimes = await apiClient.get<Overtime[]>('/overtime/all')
        console.log('✅ 加班數據獲取成功:', overtimes)
      } catch (error) {
        console.warn('⚠️ 無法獲取加班數據，使用預設值:', error)
      }

      // 計算今日出勤
      const today = new Date().toISOString().split('T')[0]
      const todayAttendance = attendances.filter(a => 
        a.clock_in && new Date(a.clock_in).toISOString().split('T')[0] === today
      ).length

      const stats = {
        totalEmployees: users.length,
        todayAttendance,
        pendingLeaves: leaves.filter(l => l.status === '待批准').length,
        pendingOvertime: overtimes.filter(o => o.status === '待批准').length
      }

      console.log('📈 計算出的統計數據:', stats)
      return stats

    } catch (error) {
      console.error('❌ 取得統計數據失敗:', error)
      throw error
    }
  }

  async getRecentActivities(): Promise<ActivityItem[]> {
    try {
      console.log('🔄 開始獲取活動記錄...')
      
      const users = await apiClient.get<User[]>('/users/')
      console.log('👥 使用者數據:', users)
      
      // 嘗試獲取請假和加班數據
      let leaves: Leave[] = []
      let overtimes: Overtime[] = []
      
      try {
        leaves = await apiClient.get<Leave[]>('/leave/all')
        console.log('📋 請假數據:', leaves)
      } catch (error) {
        console.warn('⚠️ 無法獲取請假數據:', error)
      }
      
      try {
        overtimes = await apiClient.get<Overtime[]>('/overtime/all')
        console.log('⏰ 加班數據:', overtimes)
      } catch (error) {
        console.warn('⚠️ 無法獲取加班數據:', error)
      }

      // 建立使用者 ID 到姓名的映射
      const userMap = users.reduce((acc, user) => {
        acc[user.id] = user.name || user.username
        return acc
      }, {} as Record<string, string>)

      const activities: ActivityItem[] = []

      // 處理請假申請
      if (Array.isArray(leaves) && leaves.length > 0) {
        leaves.forEach(leave => {
          activities.push({
            id: leave.id,
            title: `申請${leave.leave_type}`,
            time: this.formatTime(leave.created_at),
            type: 'leave',
            status: this.mapStatus(leave.status),
            user: userMap[leave.user_id] || '未知使用者'
          })
        })
      }

      // 處理加班申請
      if (Array.isArray(overtimes) && overtimes.length > 0) {
        overtimes.forEach(overtime => {
          activities.push({
            id: overtime.id,
            title: '申請加班',
            time: this.formatTime(overtime.created_at),
            type: 'overtime',
            status: this.mapStatus(overtime.status),
            user: userMap[overtime.user_id] || '未知使用者'
          })
        })
      }

      // 按時間排序，最新的在前面
      const sortedActivities = activities
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 10) // 只取前10筆

      console.log('📝 處理後的活動記錄:', sortedActivities)
      return sortedActivities

    } catch (error) {
      console.error('❌ 取得活動記錄失敗:', error)
      return [] // 返回空陣列而不是拋出錯誤
    }
  }

  private mapStatus(status: string): 'pending' | 'approved' | 'rejected' {
    switch (status) {
      case '待批准': return 'pending'
      case '已批准': return 'approved'
      case '已拒絕': return 'rejected'
      default: return 'pending'
    }
  }

  private formatTime(dateString: string): string {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diff = now.getTime() - date.getTime()
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)

      if (minutes < 60) {
        return `${minutes}分鐘前`
      } else if (hours < 24) {
        return `${hours}小時前`
      } else {
        return `${days}天前`
      }
    } catch (error) {
      console.error('時間格式化錯誤:', error)
      return '未知時間'
    }
  }
}

export const dashboardService = new DashboardService()