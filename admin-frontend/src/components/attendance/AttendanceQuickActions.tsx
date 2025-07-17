// src/components/attendance/AttendanceQuickActions.tsx
import React from 'react'
import {
  UserCheck,
  UserX,
  Download,
  BarChart3,
  Calendar,
  Clock,
  TrendingUp,
  Users
} from 'lucide-react'

interface AttendanceQuickActionsProps {
  onClockIn: () => void
  onClockOut: () => void
  onExportReport: () => void
  onViewStats: () => void
  todayStats?: {
    present: number
    late: number
    absent: number
    attendanceRate: number
  }
}

export const AttendanceQuickActions: React.FC<AttendanceQuickActionsProps> = ({
  onClockIn,
  onClockOut,
  onExportReport,
  onViewStats,
  todayStats
}) => {
  const quickActions = [
    {
      icon: UserCheck,
      label: '員工簽到',
      color: 'bg-green-500',
      onClick: onClockIn,
    },
    {
      icon: UserX,
      label: '員工簽退',
      color: 'bg-blue-500',
      onClick: onClockOut,
    },
    {
      icon: Download,
      label: '匯出報表',
      color: 'bg-purple-500',
      onClick: onExportReport,
    },
    {
      icon: BarChart3,
      label: '統計分析',
      color: 'bg-orange-500',
      onClick: onViewStats,
    },
  ]

  const summaryData = [
    { 
      label: '出勤率', 
      value: `${todayStats?.attendanceRate || 0}%`,
      color: (todayStats?.attendanceRate || 0) >= 90 ? 'text-green-600' : 'text-orange-600'
    },
    { 
      label: '遲到人數', 
      value: `${todayStats?.late || 0}人`,
      color: (todayStats?.late || 0) > 0 ? 'text-orange-600' : 'text-gray-900'
    },
    { 
      label: '缺勤人數', 
      value: `${todayStats?.absent || 0}人`,
      color: (todayStats?.absent || 0) > 0 ? 'text-red-600' : 'text-gray-900'
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
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">快速操作</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>出勤管理</span>
        </div>
      </div>
      
      {/* 操作按鈕 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="bg-white rounded-xl p-4 border border-gray-100 hover:bg-gray-50 transition-colors duration-150 text-center group"
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
          <h4 className="text-sm font-medium text-gray-700">今日概覽</h4>
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
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-lg mx-auto mb-2">
              <Users className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs text-gray-600">正常出勤</p>
            <p className="text-sm font-semibold text-blue-600">{todayStats?.present || 0}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-lg mx-auto mb-2">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs text-gray-600">出勤率</p>
            <p className="text-sm font-semibold text-green-600">{todayStats?.attendanceRate || 0}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}