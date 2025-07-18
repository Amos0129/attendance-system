// src/components/attendance/AttendanceCard.tsx
import React from 'react'
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Clock,
  Timer,
  TrendingUp,
  MapPin,
  Edit,
  Trash2
} from 'lucide-react'

export interface AttendanceRecord {
  id: string
  user_id: string
  user_name?: string
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

interface AttendanceCardProps {
  record: AttendanceRecord
  onEdit?: (record: AttendanceRecord) => void
  onDelete?: (id: string) => void
  showActions?: boolean
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({ 
  record, 
  onEdit, 
  onDelete, 
  showActions = false 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-50 text-green-600 border-green-200'
      case 'late': return 'bg-orange-50 text-orange-600 border-orange-200'
      case 'absent': return 'bg-red-50 text-red-600 border-red-200'
      case 'leave': return 'bg-blue-50 text-blue-600 border-blue-200'
      default: return 'bg-gray-50 text-gray-600 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present': return '正常出勤'
      case 'late': return '遲到'
      case 'absent': return '缺勤'
      case 'leave': return '請假'
      default: return '未知'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-4 h-4" />
      case 'late': return <AlertCircle className="w-4 h-4" />
      case 'absent': return <XCircle className="w-4 h-4" />
      case 'leave': return <Calendar className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '--:--'
    try {
      return new Date(timeString).toLocaleTimeString('zh-TW', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } catch (error) {
      return '--:--'
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) {
      // 如果沒有 date 字段，從 clock_in 提取日期
      if (record.clock_in) {
        try {
          return new Date(record.clock_in).toLocaleDateString('zh-TW')
        } catch (error) {
          return '未知日期'
        }
      }
      return '未知日期'
    }
    try {
      return new Date(dateString).toLocaleDateString('zh-TW')
    } catch (error) {
      return '未知日期'
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
            <p className="text-sm text-gray-500">{formatDate(record.date)}</p>
          </div>
        </div>
        
        {showActions && onEdit && onDelete && (
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(record)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(record.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${getStatusColor(record.status || 'present')}`}>
          {getStatusIcon(record.status || 'present')}
          {getStatusText(record.status || 'present')}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">簽到: {formatTime(record.clock_in)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">簽退: {formatTime(record.clock_out)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">工時: {record.working_hours || 0}h</span>
          </div>
          {record.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span className="text-gray-500 text-xs">{record.location}</span>
            </div>
          )}
        </div>

        {/* 顯示遲到和早退標記 */}
        {(record.is_late || record.is_early_leave) && (
          <div className="flex gap-2 text-xs">
            {record.is_late && (
              <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full">
                遲到
              </span>
            )}
            {record.is_early_leave && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full">
                早退
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}