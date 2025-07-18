// src/pages/LeavePage.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Clock,
  TrendingUp,
  Users
} from 'lucide-react'
import { StatCard, Loading } from '../components/ui'
import { LeaveCard } from '../components/leave/LeaveCard'
import { LeaveFilters } from '../components/leave/LeaveFilters'
import { LeaveQuickActions } from '../components/leave/LeaveQuickActions'
import { useLeave } from '../hooks/useLeave'

export const LeavePage: React.FC = () => {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  
  const {
    leaveRecords,
    allRecords,
    stats,
    todayStats,
    loading,
    error,
    searchParams,
    updateSearch,
    updateLeaveStatus,
    deleteLeave,
    refreshRecords,
    clearError
  } = useLeave()

  // 批准請假
  const handleApprove = async (id: string) => {
    const result = await updateLeaveStatus(id, { status: '已批准' })
    if (result.success) {
      console.log(result.message)
    }
  }

  // 拒絕請假
  const handleReject = async (id: string) => {
    const result = await updateLeaveStatus(id, { status: '已拒絕' })
    if (result.success) {
      console.log(result.message)
    }
  }

  // 刪除請假記錄
  const handleDelete = async (id: string) => {
    if (window.confirm('確定要刪除這筆請假記錄嗎？')) {
      const result = await deleteLeave(id)
      if (result.success) {
        console.log(result.message)
      }
    }
  }

  // 批量操作（暫時未實現）
  const handleBatchApprove = () => {
    console.log('批量批准功能開發中...')
  }

  const handleBatchReject = () => {
    console.log('批量拒絕功能開發中...')
  }

  // 查看報告
  const handleViewReports = () => {
    console.log('跳轉到請假報告頁面...')
    // navigate('/reports/leave')
  }

  // 查看員工管理
  const handleViewUsers = () => {
    console.log('跳轉到員工管理頁面...')
    navigate('/employees')
  }

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">請假管理</h1>
          <p className="text-gray-600 mt-1">管理員工請假申請與審核</p>
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
          title="總申請數" 
          value={stats.total_leaves} 
          icon={Calendar} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="待批准" 
          value={stats.pending_leaves} 
          icon={AlertCircle} 
          color="bg-orange-500" 
        />
        <StatCard 
          title="已批准" 
          value={stats.approved_leaves} 
          icon={CheckCircle} 
          color="bg-green-500" 
        />
        <StatCard 
          title="已拒絕" 
          value={stats.rejected_leaves} 
          icon={XCircle} 
          color="bg-red-500" 
        />
      </div>

      {/* 搜尋和篩選 */}
      <LeaveFilters
        searchParams={searchParams}
        onSearchParamsChange={updateSearch}
        totalCount={allRecords.length}
        filteredCount={leaveRecords.length}
      />

      {/* 管理操作 + 請假記錄 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <LeaveQuickActions
            onApproveAll={handleBatchApprove}
            onRejectAll={handleBatchReject}
            onViewReports={handleViewReports}
            onViewUsers={handleViewUsers}
            todayStats={todayStats}
          />
        </div>
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">請假記錄</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>共 {leaveRecords.length} 筆記錄</span>
                </div>
                {leaveRecords.length > 0 && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    查看全部
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loading size="lg" text="載入請假記錄中..." />
              </div>
            ) : leaveRecords.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchParams.search || searchParams.status !== 'all' ? '沒有找到符合條件的記錄' : '還沒有請假記錄'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchParams.search || searchParams.status !== 'all' ? '請試試調整搜尋條件' : '員工申請請假後會顯示在這裡'}
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[450px] overflow-y-auto">
                {leaveRecords.slice(0, 10).map((record) => (
                  <LeaveCard
                    key={record.id}
                    record={record}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onDelete={handleDelete}
                    showActions={true} // 管理員頁面顯示操作按鈕
                  />
                ))}
                {leaveRecords.length > 10 && (
                  <div className="text-center py-4 border-t border-gray-100">
                    <button
                      onClick={() => setShowModal(true)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      還有 {leaveRecords.length - 10} 筆記錄，點擊查看全部
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
          <h3 className="text-lg font-semibold text-gray-900 mb-6">請假趨勢分析</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">圖表功能開發中</p>
              <p className="text-sm text-gray-500 mt-1">即將推出請假統計圖表</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}