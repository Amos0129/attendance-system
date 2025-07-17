// src/pages/AttendancePage.tsx
import React, { useState } from 'react'
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  UserCheck,
  Calendar,
  TrendingUp,
  MapPin,
  Timer,
  X
} from 'lucide-react'
import { StatCard, Loading } from '../components/ui'
import { AttendanceCard } from '../components/attendance/AttendanceCard'
import { AttendanceFilters } from '../components/attendance/AttendanceFilters'
import { AttendanceQuickActions } from '../components/attendance/AttendanceQuickActions'
import { useAttendance } from '../hooks/useAttendance'

// 簽到 Modal 組件
const ClockInModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  onClockIn: (data: { location?: string; device_id?: string }) => Promise<{ success: boolean; message: string }>
}> = ({ isOpen, onClose, onClockIn }) => {
  const [location, setLocation] = useState('')
  const [deviceId, setDeviceId] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const result = await onClockIn({ 
      location: location || undefined, 
      device_id: deviceId || undefined 
    })
    
    setLoading(false)
    setMessage(result.message)
    
    if (result.success) {
      setTimeout(() => {
        onClose()
        setLocation('')
        setDeviceId('')
        setMessage('')
      }, 1500)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">員工簽到</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              地點
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="請輸入簽到地點（可選）"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              設備 ID
            </label>
            <div className="relative">
              <Timer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                placeholder="請輸入設備 ID（可選）"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-xl text-sm ${
              message.includes('成功') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 text-white bg-blue-500 rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {loading ? '簽到中...' : '確認簽到'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const AttendancePage: React.FC = () => {
  const {
    attendanceRecords,
    allRecords,
    stats,
    todayStats,
    loading,
    error,
    searchParams,
    updateSearch,
    clockIn,
    clockOut,
    exportReport,
    refreshRecords,
    clearError
  } = useAttendance()

  const [showClockInModal, setShowClockInModal] = useState(false)

  // 簽到處理
  const handleClockIn = async (data: { location?: string; device_id?: string }) => {
    return await clockIn(data)
  }

  // 簽退處理
  const handleClockOut = async () => {
    const result = await clockOut()
    if (result.success) {
      // 可以顯示成功訊息或通知
      console.log(result.message)
    }
  }

  // 匯出報表
  const handleExportReport = async () => {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30) // 過去30天
    const endDate = new Date()
    
    const result = await exportReport({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      format: 'xlsx'
    })
    
    if (result.success) {
      console.log(result.message)
    }
  }

  // 查看統計分析
  const handleViewStats = () => {
    console.log('統計分析功能開發中...')
    // 這裡可以跳轉到統計分析頁面
  }

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">出勤管理</h1>
          <p className="text-gray-600 mt-1">管理員工出勤記錄與統計</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={refreshRecords}
            disabled={loading}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            重新整理
          </button>
          <button
            onClick={() => setShowClockInModal(true)}
            className="px-4 py-2 text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            員工簽到
          </button>
        </div>
      </div>

      {/* 錯誤訊息 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-red-700">{error}</span>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              關閉
            </button>
          </div>
        </div>
      )}

      {/* 統計卡片區域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="總員工數" 
          value={stats.total_employees} 
          icon={Users} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="今日出勤" 
          value={`${stats.present_today}/${stats.total_employees}`} 
          icon={CheckCircle} 
          color="bg-green-500" 
          trend={todayStats.attendanceRate >= 90 ? 5 : -2}
        />
        <StatCard 
          title="遲到人數" 
          value={stats.late_today} 
          icon={AlertCircle} 
          color="bg-orange-500" 
        />
        <StatCard 
          title="缺勤人數" 
          value={stats.absent_today} 
          icon={XCircle} 
          color="bg-red-500" 
        />
      </div>

      {/* 搜尋和篩選 */}
      <AttendanceFilters
        searchParams={searchParams}
        onSearchParamsChange={updateSearch}
        totalCount={allRecords.length}
        filteredCount={attendanceRecords.length}
      />

      {/* 快速操作 + 出勤記錄 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <AttendanceQuickActions
            onClockIn={() => setShowClockInModal(true)}
            onClockOut={handleClockOut}
            onExportReport={handleExportReport}
            onViewStats={handleViewStats}
            todayStats={todayStats}
          />
        </div>
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">出勤記錄</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>共 {attendanceRecords.length} 筆記錄</span>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loading size="lg" text="載入出勤記錄中..." />
              </div>
            ) : attendanceRecords.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchParams.search || searchParams.status !== 'all' ? '沒有找到符合條件的記錄' : '還沒有出勤記錄'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchParams.search || searchParams.status !== 'all' ? '請試試調整搜尋條件' : '員工可以開始進行簽到'}
                </p>
                {!(searchParams.search || searchParams.status !== 'all') && (
                  <button
                    onClick={() => setShowClockInModal(true)}
                    className="px-6 py-3 text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    員工簽到
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {attendanceRecords.slice(0, 10).map((record) => (
                  <AttendanceCard
                    key={record.id}
                    record={record}
                    showActions={false} // 不顯示編輯和刪除按鈕
                  />
                ))}
                {attendanceRecords.length > 10 && (
                  <div className="text-center py-4">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      顯示更多記錄...
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 圖表區域 */}
      <div className="mt-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">出勤趨勢分析</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">圖表功能開發中</p>
              <p className="text-sm text-gray-500 mt-1">即將推出更多數據視覺化功能</p>
            </div>
          </div>
        </div>
      </div>

      {/* 簽到 Modal */}
      <ClockInModal
        isOpen={showClockInModal}
        onClose={() => setShowClockInModal(false)}
        onClockIn={handleClockIn}
      />
    </div>
  )
}