// src/pages/DashboardPage.tsx
import React, { useState } from 'react'
import {
  Users,
  Calendar,
  UserCheck,
  Plus,
  BarChart3,
  Zap,
  Settings
} from 'lucide-react'
import { ActivityModal } from '../components/dashboard/ActivityModal'
import { StatCard, Loading } from '../components/ui'
import { QuickActions, ActivityList } from '../components/dashboard'
import { useDashboard } from '../hooks/useDashboard'
import CreateEmployeeModal from '../components/employee/CreateEmployeeModal'

export default function DashboardPage() {
  const [showModal, setShowModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { stats, activities, loading, error, refetch } = useDashboard()

  const quickActions = [
    {
      icon: Plus,
      label: '新增員工',
      color: 'bg-blue-500',
      onClick: () => setShowCreateModal(true),
    },
    {
      icon: BarChart3,
      label: '生成報表',
      color: 'bg-green-500',
    },
    {
      icon: Calendar,
      label: '審批請假',
      color: 'bg-orange-500',
    },
    {
      icon: Settings,
      label: '系統設定',
      color: 'bg-purple-500',
    },
  ]

  const quickSummary = [
    { label: '新增打卡記錄', value: `${stats.todayAttendance} 筆` },
    { label: '待審核申請', value: `${stats.pendingLeaves + stats.pendingOvertime} 筆`, color: 'text-orange-600' },
    {
      label: '系統運行狀態',
      value: (
        <span className="flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          <span className="font-medium text-green-600">正常</span>
        </span>
      )
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" text="載入 Dashboard 數據中..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">❌ {error}</div>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            重新載入
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* 統計卡片區域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="總員工數" value={stats.totalEmployees} icon={Users} color="bg-blue-500" trend={5} />
        <StatCard title="今日出勤" value={`${stats.todayAttendance}/${stats.totalEmployees}`} icon={UserCheck} color="bg-green-500" trend={-2} />
        <StatCard title="待處理請假" value={stats.pendingLeaves} icon={Calendar} color="bg-orange-500" />
        <StatCard title="待處理加班" value={stats.pendingOvertime} icon={Zap} color="bg-purple-500" />
      </div>

      {/* 快速操作 + 最近活動 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <QuickActions actions={quickActions} summary={quickSummary} />
        </div>
        <div className="lg:col-span-3">
          <ActivityList activities={activities.slice(0, 6)} onViewAll={() => setShowModal(true)} />
        </div>
      </div>

      {/* 圖表區域 */}
      <div className="mt-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">本週出勤趨勢</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">圖表功能開發中</p>
              <p className="text-sm text-gray-500 mt-1">即將推出更多數據視覺化功能</p>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <ActivityModal activities={activities} onClose={() => setShowModal(false)} />
      )}
      <CreateEmployeeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          refetch() // 重新抓員工資料（讓統計卡數字更新）
        }}
      />
    </>
  )
}
