// src/services/attendanceService.ts
import { apiClient } from './apiClient'

// 後端返回的原始數據結構（根據 attendance_schema.py）
interface RawAttendanceRecord {
  _id?: string
  id?: string
  user_id: string
  clock_in: string
  clock_out?: string | null
  is_late: boolean
  is_early_leave: boolean
  device_id?: string | null
  location?: string | null
  created_at: string
  updated_at: string
}

// 前端使用的數據結構
export interface AttendanceRecord {
  id: string
  user_id: string
  user_name?: string // 前端添加，用於顯示
  clock_in: string
  clock_out: string | null
  is_late: boolean
  is_early_leave: boolean
  device_id?: string
  location?: string
  created_at: string
  updated_at: string
  // 前端計算字段
  date?: string
  status?: 'present' | 'absent' | 'late' | 'leave'
  working_hours?: number
  overtime_hours?: number
  notes?: string
}

export interface AttendanceStats {
  total_employees: number
  present_today: number
  absent_today: number
  late_today: number
  leave_today: number
  attendance_rate: number
  average_working_hours: number
}

export interface ClockInRequest {
  device_id?: string
  location?: string
}

export interface AttendanceSearchParams {
  search?: string
  status?: string
  date?: string
  sortBy?: 'date' | 'user_name' | 'status' | 'working_hours'
  sortOrder?: 'asc' | 'desc'
}

class AttendanceService {
  // 處理後端數據格式
  private processRawRecord(rawRecord: RawAttendanceRecord): AttendanceRecord {
    return {
      ...rawRecord,
      id: rawRecord.id || rawRecord._id || '', // 處理 ID 字段
      clock_out: rawRecord.clock_out || null, // 確保 null 值正確處理
      device_id: rawRecord.device_id || undefined,
      location: rawRecord.location || undefined,
      date: rawRecord.clock_in ? new Date(rawRecord.clock_in).toISOString().split('T')[0] : '',
      status: this.determineStatus(rawRecord),
      working_hours: this.calculateWorkingHours(rawRecord.clock_in, rawRecord.clock_out),
      overtime_hours: 0, // 需要根據業務邏輯計算
      user_name: `用戶${rawRecord.user_id}` // 暫時處理，實際需要關聯用戶數據
    }
  }

  // 獲取所有出勤記錄（管理員專用）
  async getAllAttendance(): Promise<AttendanceRecord[]> {
    try {
      console.log('📋 獲取所有出勤記錄...')
      const rawRecords = await apiClient.get<RawAttendanceRecord[]>('/attendance/all')
      
      // 處理數據格式，添加前端需要的字段
      const processedRecords = rawRecords.map(record => this.processRawRecord(record))
      
      console.log('✅ 出勤記錄獲取成功:', processedRecords)
      return processedRecords
    } catch (error) {
      console.error('❌ 獲取出勤記錄失敗:', error)
      throw error
    }
  }

  // 獲取我的出勤記錄
  async getMyAttendance(): Promise<AttendanceRecord[]> {
    try {
      console.log('📋 獲取我的出勤記錄...')
      const rawRecords = await apiClient.get<RawAttendanceRecord[]>('/attendance/my')
      
      const processedRecords = rawRecords.map(record => ({
        ...this.processRawRecord(record),
        user_name: '我' // 當前用戶
      }))
      
      console.log('✅ 我的出勤記錄獲取成功:', processedRecords)
      return processedRecords
    } catch (error) {
      console.error('❌ 獲取我的出勤記錄失敗:', error)
      throw error
    }
  }

  // 獲取特定用戶的出勤記錄（管理員專用）
  async getUserAttendance(userId: string): Promise<AttendanceRecord[]> {
    try {
      console.log('🔍 獲取用戶出勤記錄:', userId)
      const rawRecords = await apiClient.get<RawAttendanceRecord[]>(`/attendance/user/${userId}`)
      
      const processedRecords = rawRecords.map(record => this.processRawRecord(record))
      
      console.log('✅ 用戶出勤記錄獲取成功:', processedRecords)
      return processedRecords
    } catch (error) {
      console.error('❌ 獲取用戶出勤記錄失敗:', error)
      throw error
    }
  }

  // 簽到
  async clockIn(data: ClockInRequest): Promise<{ message: string; id: string }> {
    try {
      console.log('🕒 簽到:', data)
      const response = await apiClient.post<{ message: string; id: string }>('/attendance/clock-in', data)
      console.log('✅ 簽到成功:', response)
      return response
    } catch (error) {
      console.error('❌ 簽到失敗:', error)
      throw error
    }
  }

  // 簽退
  async clockOut(): Promise<{ message: string }> {
    try {
      console.log('🕕 簽退')
      const response = await apiClient.post<{ message: string }>('/attendance/clock-out', {})
      console.log('✅ 簽退成功:', response)
      return response
    } catch (error) {
      console.error('❌ 簽退失敗:', error)
      throw error
    }
  }

  // 獲取用戶列表（用於關聯用戶名稱）
  async getUsersForAttendance(): Promise<Array<{ id: string; name: string; username: string }>> {
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

  // 獲取統計數據（需要自行計算，因為後端沒有專門的統計 API）
  async getAttendanceStats(): Promise<AttendanceStats> {
    try {
      console.log('📊 計算出勤統計...')
      
      // 需要獲取用戶列表和出勤記錄來計算統計
      const [users, attendanceRecords] = await Promise.all([
        apiClient.get<any[]>('/users/'),
        this.getAllAttendance()
      ])

      const today = new Date().toISOString().split('T')[0]
      const todayRecords = attendanceRecords.filter(record => record.date === today)
      
      const stats: AttendanceStats = {
        total_employees: users.length,
        present_today: todayRecords.filter(r => r.status === 'present').length,
        absent_today: todayRecords.filter(r => r.status === 'absent').length,
        late_today: todayRecords.filter(r => r.status === 'late').length,
        leave_today: todayRecords.filter(r => r.status === 'leave').length,
        attendance_rate: users.length > 0 ? Math.round((todayRecords.length / users.length) * 100) : 0,
        average_working_hours: this.calculateAverageWorkingHours(todayRecords)
      }

      console.log('✅ 出勤統計計算完成:', stats)
      return stats
    } catch (error) {
      console.error('❌ 計算出勤統計失敗:', error)
      // 返回預設值
      return {
        total_employees: 0,
        present_today: 0,
        absent_today: 0,
        late_today: 0,
        leave_today: 0,
        attendance_rate: 0,
        average_working_hours: 0
      }
    }
  }

  // 判斷出勤狀態
  private determineStatus(record: RawAttendanceRecord): 'present' | 'absent' | 'late' | 'leave' {
    if (!record.clock_in) return 'absent'
    if (record.is_late) return 'late'
    return 'present'
  }

  // 計算工作時間（小時）
  private calculateWorkingHours(clockIn: string | null, clockOut: string | null | undefined): number {
    if (!clockIn || !clockOut) return 0
    
    const startTime = new Date(clockIn).getTime()
    const endTime = new Date(clockOut).getTime()
    
    if (endTime <= startTime) return 0
    
    const diffMs = endTime - startTime
    const diffHours = diffMs / (1000 * 60 * 60)
    
    return Math.round(diffHours * 100) / 100 // 保留兩位小數
  }

  // 計算平均工作時間
  private calculateAverageWorkingHours(records: AttendanceRecord[]): number {
    if (records.length === 0) return 0
    
    const totalHours = records.reduce((sum, record) => sum + (record.working_hours || 0), 0)
    return Math.round((totalHours / records.length) * 100) / 100
  }

  // 前端搜尋和排序功能
  searchAndSortAttendance(
    records: AttendanceRecord[],
    params: AttendanceSearchParams
  ): AttendanceRecord[] {
    let filtered = [...records]

    // 搜尋功能
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filtered = filtered.filter(record => 
        record.user_name?.toLowerCase().includes(searchLower)
      )
    }

    // 狀態篩選
    if (params.status && params.status !== 'all') {
      filtered = filtered.filter(record => record.status === params.status)
    }

    // 日期篩選
    if (params.date) {
      filtered = filtered.filter(record => record.date === params.date)
    }

    // 排序功能
    if (params.sortBy) {
      filtered.sort((a, b) => {
        let aValue: any = a[params.sortBy!]
        let bValue: any = b[params.sortBy!]

        // 處理日期排序
        if (params.sortBy === 'date') {
          aValue = aValue ? new Date(aValue).getTime() : 0
          bValue = bValue ? new Date(bValue).getTime() : 0
        } else if (params.sortBy === 'working_hours') {
          aValue = Number(aValue) || 0
          bValue = Number(bValue) || 0
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

  // 匯出出勤報表（如果後端有相應 API）
  async exportAttendanceReport(params: {
    startDate: string
    endDate: string
    format: 'csv' | 'xlsx'
  }): Promise<Blob> {
    try {
      console.log('📊 匯出出勤報表:', params)
      
      // 暫時使用模擬數據
      const mockData = `出勤報表 ${params.startDate} 至 ${params.endDate}`
      const blob = new Blob([mockData], { type: 'text/plain' })
      console.log('✅ 模擬報表匯出成功')
      return blob
      
    } catch (error) {
      console.error('❌ 匯出報表失敗:', error)
      throw error
    }
  }
}

export const attendanceService = new AttendanceService()