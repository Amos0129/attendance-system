// src/hooks/useDashboard.ts
import { useState, useEffect } from 'react'
import { dashboardService, DashboardStats, ActivityItem } from '../services/dashboardService'

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    todayAttendance: 0,
    pendingLeaves: 0,
    pendingOvertime: 0
  })
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [statsData, activitiesData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentActivities()
      ])

      setStats(statsData)
      setActivities(activitiesData)
    } catch (err) {
      console.error('Dashboard 數據載入失敗:', err)
      setError('載入數據失敗，請重新整理頁面')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const refetch = () => {
    fetchData()
  }

  return {
    stats,
    activities,
    loading,
    error,
    refetch
  }
}