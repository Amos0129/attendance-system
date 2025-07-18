// src/components/leave/LeaveQuickActions.tsx
import React from 'react'
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  BarChart3,
  Users,
  Calendar,
  Clock,
  TrendingUp,
  Eye
} from 'lucide-react'

interface LeaveQuickActionsProps {
  onApproveAll?: () => void
  onRejectAll?: () => void
  onViewReports: () => void
  onViewUsers: () => void
  todayStats?: {
    pending: number
    approved: number
    rejected: number
    total: number
  }
}

export const LeaveQuickActions: React.FC<LeaveQuickActionsProps> = ({
  onApproveAll,
  onRejectAll,
  onViewReports,
  onViewUsers,
  todayStats
}) => {
  const quickActions = [
    {
      icon: CheckCircle,
      label: '批量批准',
      color: 'bg-green-500',
      onClick: onApproveAll,
      disabled: !onApproveAll
    },
    {
      icon: XCircle,
      label: '批量拒絕',
      color: 'bg-red-500',
      onClick: onRejectAll,
      disabled: !onRejectAll
    },
    {
      icon: FileText,
      label: '請假報告',
      color: 'bg-purple-500',
      onClick: onViewReports,
    },
    {
      icon: Users,
      label: '員工管理',
      color: 'bg-blue-500',
      onClick: onViewUsers,
    },
  ]

  const summaryData = [
    { 
      label: '待批准', 
      value: `${todayStats?.pending || 0}筆`,
      color: (todayStats?.pending || 0) > 0 ? 'text-orange-600' : 'text-gray-900'
    },
    { 
      label: '已批准', 
      value: `${todayStats?.approved || 0}筆`,
      color: 'text-green-600'
    },
    { 
      label: '已拒絕', 
      value: `${todayStats?.rejected || 0}筆`,
      color: 'text-red-600'
    },
    {
      label: '系統狀態',
      value: (
        <span className="flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          <span className="font-medium text-green-600">正常</span>
        </span>
      )
    },
  ]

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">管理操作</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Eye className="w-4 h-4" />
          <span>請假管理</span>
        </div>
      </div>
      
      {/* 操作按鈕 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`bg-white rounded-xl p-4 border border-gray-100 hover:bg-gray-50 transition-colors duration-150 text-center group ${
              action.disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${action.color} mb-3 group-hover:scale-110 transition-transform`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-800">{action.label}</p>
          </button>
        ))}
      </div>

      {/* 今日概覽 */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-gray-600" />
          <h4 className="text-sm font-medium text-gray-700">請假概覽</h4>
        </div>
        <div className="space-y-3">
          {summaryData.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{item.label}</span>
              <span className={`font-medium ${item.color || 'text-gray-900'}`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 快速統計卡片 */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex-1 flex flex-col justify-end">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-orange-500 rounded-lg mx-auto mb-2">
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs text-gray-600">待處理</p>
            <p className="text-sm font-semibold text-orange-600">{todayStats?.pending || 0}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-lg mx-auto mb-2">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs text-gray-600">總申請</p>
            <p className="text-sm font-semibold text-green-600">{todayStats?.total || 0}</p>
          </div>
        </div>
      </div>
    </div>
  )
}