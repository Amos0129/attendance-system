// src/hooks/useAttendance.ts
import { useState, useEffect } from 'react'
import { 
  attendanceService, 
  AttendanceRecord,
  ClockInRequest,
  AttendanceSearchParams,
  AttendanceStats
} from '../services/attendanceService'

export const useAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([])
  const [stats, setStats] = useState<AttendanceStats>({
    total_employees: 0,
    present_today: 0,
    absent_today: 0,
    late_today: 0,
    leave_today: 0,
    attendance_rate: 0,
    average_working_hours: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useState<AttendanceSearchParams>({
    search: '',
    status: 'all',
    date: new Date().toISOString().split('T')[0],
    sortBy: 'date',
    sortOrder: 'desc'
  })

  // 載入出勤記錄（管理員查看所有記錄）
  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // 獲取所有出勤記錄和用戶列表來關聯用戶名稱
      const [records, users] = await Promise.all([
        attendanceService.getAllAttendance(),
        attendanceService.getUsersForAttendance()
      ])

      // 關聯用戶名稱
      const recordsWithUserNames = records.map(record => ({
        ...record,
        user_name: users.find(u => u.id === record.user_id)?.name || `用戶${record.user_id}`
      }))

      setAttendanceRecords(recordsWithUserNames)
      console.log('📋 出勤記錄載入完成:', recordsWithUserNames)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '載入出勤記錄失敗'
      setError(errorMessage)
      console.error('❌ 載入出勤記錄失敗:', err)
    } finally {
      setLoading(false)
    }
  }

  // 載入統計數據
  const fetchStats = async () => {
    try {
      const statsData = await attendanceService.getAttendanceStats()
      setStats(statsData)
      console.log('📊 統計數據載入完成:', statsData)
    } catch (err) {
      console.error('❌ 載入統計數據失敗:', err)
      // 不設置錯誤狀態，統計數據失敗不影響主要功能
    }
  }

  // 搜尋和篩選
  const updateSearch = (newParams: Partial<AttendanceSearchParams>) => {
    const updatedParams = { ...searchParams, ...newParams }
    setSearchParams(updatedParams)
    console.log('🔍 更新搜尋參數:', updatedParams)
  }

  // 員工簽到
  const clockIn = async (data: ClockInRequest) => {
    try {
      setLoading(true)
      const response = await attendanceService.clockIn(data)
      await fetchAttendanceRecords() // 重新載入記錄
      await fetchStats() // 重新載入統計
      return { success: true, message: response.message }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '簽到失敗'
      setError(errorMessage)
      console.error('❌ 簽到失敗:', err)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // 員工簽退
  const clockOut = async () => {
    try {
      setLoading(true)
      const response = await attendanceService.clockOut()
      await fetchAttendanceRecords() // 重新載入記錄
      await fetchStats() // 重新載入統計
      return { success: true, message: response.message }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '簽退失敗'
      setError(errorMessage)
      console.error('❌ 簽退失敗:', err)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // 匯出報表
  const exportReport = async (params: {
    startDate: string
    endDate: string
    format: 'csv' | 'xlsx'
  }) => {
    try {
      setLoading(true)
      const blob = await attendanceService.exportAttendanceReport(params)
      
      // 創建下載鏈接
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `attendance_report_${params.startDate}_${params.endDate}.${params.format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      return { success: true, message: '報表匯出成功' }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '匯出報表失敗'
      setError(errorMessage)
      console.error('❌ 匯出報表失敗:', err)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // 清除錯誤
  const clearError = () => setError(null)

  // 初始載入
  useEffect(() => {
    fetchAttendanceRecords()
    fetchStats()
  }, [])

  // 當搜尋參數或記錄變化時，更新篩選結果
  useEffect(() => {
    const filtered = attendanceService.searchAndSortAttendance(attendanceRecords, searchParams)
    setFilteredRecords(filtered)
    console.log('🔄 篩選結果更新:', filtered.length, '筆資料')
  }, [attendanceRecords, searchParams])

  // 計算今日統計數據
  const todayStats = {
    present: stats.present_today,
    late: stats.late_today,
    absent: stats.absent_today,
    attendanceRate: Math.round(stats.attendance_rate)
  }

  return {
    attendanceRecords: filteredRecords,
    allRecords: attendanceRecords,
    stats,
    todayStats,
    loading,
    error,
    searchParams,
    updateSearch,
    clockIn,
    clockOut,
    exportReport,
    refreshRecords: fetchAttendanceRecords,
    refreshStats: fetchStats,
    clearError
  }
}