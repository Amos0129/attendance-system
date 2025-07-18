// src/components/leave/LeaveCard.tsx
import React from 'react'
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  FileText,
  Edit,
  Trash2
} from 'lucide-react'

export interface LeaveRecord {
  id: string
  user_id: string
  user_name?: string
  leave_type: string
  start_date: string
  end_date: string
  status: '待批准' | '已批准' | '已拒絕'
  reason?: string
  created_at: string
  updated_at: string
  duration_days?: number
}

interface LeaveCardProps {
  record: LeaveRecord
  onEdit?: (record: LeaveRecord) => void
  onDelete?: (id: string) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  showActions?: boolean
}

export const LeaveCard: React.FC<LeaveCardProps> = ({ 
  record, 
  onEdit, 
  onDelete, 
  onApprove,
  onReject,
  showActions = false 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case '已批准': return 'bg-green-50 text-green-600 border-green-200'
      case '待批准': return 'bg-orange-50 text-orange-600 border-orange-200'
      case '已拒絕': return 'bg-red-50 text-red-600 border-red-200'
      default: return 'bg-gray-50 text-gray-600 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '已批准': return <CheckCircle className="w-4 h-4" />
      case '待批准': return <AlertCircle className="w-4 h-4" />
      case '已拒絕': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case '病假': return 'bg-red-100 text-red-700'
      case '事假': return 'bg-blue-100 text-blue-700'
      case '年假': return 'bg-green-100 text-green-700'
      case '特休': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('zh-TW', {
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      return '未知日期'
    }
  }

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('zh-TW', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return '未知時間'
    }
  }

  // 頭像顏色根據使用者名稱生成
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-teal-500'
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${getAvatarColor(record.user_name || 'U')} rounded-full flex items-center justify-center`}>
            <span className="text-white font-semibold text-sm">
              {(record.user_name || `用戶${record.user_id}`).charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{record.user_name || `用戶${record.user_id}`}</h3>
            <p className="text-sm text-gray-500">申請時間: {formatDateTime(record.created_at)}</p>
          </div>
        </div>
        
        {showActions && (onEdit || onDelete || onApprove || onReject) && (
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {record.status === '待批准' && onApprove && (
              <button
                onClick={() => onApprove(record.id)}
                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="批准"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
            {record.status === '待批准' && onReject && (
              <button
                onClick={() => onReject(record.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="拒絕"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(record)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="編輯"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(record.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="刪除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {/* 請假類型和狀態 */}
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 text-sm font-medium rounded-lg ${getLeaveTypeColor(record.leave_type)}`}>
            {record.leave_type}
          </span>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${getStatusColor(record.status)}`}>
            {getStatusIcon(record.status)}
            {record.status}
          </div>
        </div>

        {/* 請假日期 */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-gray-600">開始</p>
              <p className="font-medium text-gray-900">{formatDate(record.start_date)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-gray-600">結束</p>
              <p className="font-medium text-gray-900">{formatDate(record.end_date)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-gray-600">天數</p>
              <p className="font-medium text-gray-900">{record.duration_days || 1} 天</p>
            </div>
          </div>
        </div>

        {/* 請假理由 */}
        {record.reason && (
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-600 text-sm">請假理由</p>
                <p className="text-gray-900 text-sm mt-1">{record.reason}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}