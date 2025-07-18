// src/hooks/useLeave.ts
import { useState, useEffect } from 'react'
import { 
  leaveService, 
  LeaveRecord,
  LeaveCreateRequest,
  LeaveUpdateRequest,
  LeaveSearchParams,
  LeaveStats
} from '../services/leaveService'

export const useLeave = () => {
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<LeaveRecord[]>([])
  const [stats, setStats] = useState<LeaveStats>({
    total_leaves: 0,
    pending_leaves: 0,
    approved_leaves: 0,
    rejected_leaves: 0,
    total_employees: 0,
    leave_rate: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useState<LeaveSearchParams>({
    search: '',
    status: 'all',
    leave_type: 'all',
    sortBy: 'created_at',
    sortOrder: 'desc'
  })

  // 載入請假記錄（管理員查看所有記錄）
  const fetchLeaveRecords = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // 獲取所有請假記錄和用戶列表來關聯用戶名稱
      const [records, users] = await Promise.all([
        leaveService.getAllLeaves(),
        leaveService.getUsersForLeave()
      ])

      // 關聯用戶名稱
      const recordsWithUserNames = records.map(record => ({
        ...record,
        user_name: users.find(u => u.id === record.user_id)?.name || `用戶${record.user_id}`
      }))

      setLeaveRecords(recordsWithUserNames)
      console.log('📋 請假記錄載入完成:', recordsWithUserNames)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '載入請假記錄失敗'
      setError(errorMessage)
      console.error('❌ 載入請假記錄失敗:', err)
    } finally {
      setLoading(false)
    }
  }

  // 載入統計數據
  const fetchStats = async () => {
    try {
      const statsData = await leaveService.getLeaveStats()
      setStats(statsData)
      console.log('📊 統計數據載入完成:', statsData)
    } catch (err) {
      console.error('❌ 載入統計數據失敗:', err)
      // 不設置錯誤狀態，統計數據失敗不影響主要功能
    }
  }

  // 搜尋和篩選
  const updateSearch = (newParams: Partial<LeaveSearchParams>) => {
    const updatedParams = { ...searchParams, ...newParams }
    setSearchParams(updatedParams)
    console.log('🔍 更新搜尋參數:', updatedParams)
  }

  // 申請請假
  const applyLeave = async (data: LeaveCreateRequest) => {
    try {
      setLoading(true)
      const leaveId = await leaveService.applyLeave(data)
      await fetchLeaveRecords() // 重新載入記錄
      await fetchStats() // 重新載入統計
      return { success: true, message: '請假申請提交成功', id: leaveId }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '申請請假失敗'
      setError(errorMessage)
      console.error('❌ 申請請假失敗:', err)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // 更新請假狀態（管理員專用）
  const updateLeaveStatus = async (id: string, data: LeaveUpdateRequest) => {
    try {
      setLoading(true)
      await leaveService.updateLeaveStatus(id, data)
      await fetchLeaveRecords() // 重新載入記錄
      await fetchStats() // 重新載入統計
      return { success: true, message: '請假狀態更新成功' }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新請假狀態失敗'
      setError(errorMessage)
      console.error('❌ 更新請假狀態失敗:', err)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // 刪除請假記錄（管理員專用）
  const deleteLeave = async (id: string) => {
    try {
      setLoading(true)
      await leaveService.deleteLeave(id)
      await fetchLeaveRecords() // 重新載入記錄
      await fetchStats() // 重新載入統計
      return { success: true, message: '請假記錄刪除成功' }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '刪除請假記錄失敗'
      setError(errorMessage)
      console.error('❌ 刪除請假記錄失敗:', err)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // 清除錯誤
  const clearError = () => setError(null)

  // 初始載入
  useEffect(() => {
    fetchLeaveRecords()
    fetchStats()
  }, [])

  // 當搜尋參數或記錄變化時，更新篩選結果
  useEffect(() => {
    const filtered = leaveService.searchAndSortLeaves(leaveRecords, searchParams)
    setFilteredRecords(filtered)
    console.log('🔄 篩選結果更新:', filtered.length, '筆資料')
  }, [leaveRecords, searchParams])

  // 計算今日統計數據
  const todayStats = {
    pending: stats.pending_leaves,
    approved: stats.approved_leaves,
    rejected: stats.rejected_leaves,
    total: stats.total_leaves
  }

  return {
    leaveRecords: filteredRecords,
    allRecords: leaveRecords,
    stats,
    todayStats,
    loading,
    error,
    searchParams,
    updateSearch,
    applyLeave,
    updateLeaveStatus,
    deleteLeave,
    refreshRecords: fetchLeaveRecords,
    refreshStats: fetchStats,
    clearError
  }
}