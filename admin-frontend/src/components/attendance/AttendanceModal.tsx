// src/components/attendance/AttendanceModal.tsx
import React from 'react'
import { X, Clock, Users, Calendar } from 'lucide-react'
import { AttendanceRecord } from './AttendanceCard'

interface AttendanceModalProps {
  attendanceRecords: AttendanceRecord[]
  onClose: () => void
}

export const AttendanceModal: React.FC<AttendanceModalProps> = ({ attendanceRecords, onClose }) => {
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
      case 'present': return '正常'
      case 'late': return '遲到'
      case 'absent': return '缺勤'
      case 'leave': return '請假'
      default: return '未知'
    }
  }

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '--:--'
    
    try {
      const date = new Date(timeString)
      return date.toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    } catch (error) {
      return '--:--'
    }
  }

  const formatDate = (timeString: string | null) => {
    if (!timeString) return '未知日期'
    
    try {
      const date = new Date(timeString)
      return date.toLocaleDateString('zh-TW', {
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      return '未知'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl border border-gray-200">
        {/* 標題欄 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">所有出勤記錄</h2>
              <p className="text-sm text-gray-600">共 {attendanceRecords.length} 筆記錄</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 內容區域 */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
          {attendanceRecords.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">目前沒有出勤記錄</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {attendanceRecords.map((record) => (
                <div
                  key={record.id}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-sm transition-shadow"
                >
                  {/* 員工資訊 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {(record.user_name || `用戶${record.user_id}`).charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {record.user_name || `用戶${record.user_id}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(record.clock_in)}
                        </p>
                      </div>
                    </div>
                    
                    {/* 狀態標籤 */}
                    <span className={`px-2 py-1 text-xs font-medium rounded-lg border ${getStatusColor(record.status || 'present')}`}>
                      {getStatusText(record.status || 'present')}
                    </span>
                  </div>

                  {/* 時間資訊 */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-600">簽到</p>
                        <p className="font-medium text-gray-900">
                          {formatTime(record.clock_in)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-600">簽退</p>
                        <p className="font-medium text-gray-900">
                          {formatTime(record.clock_out)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 工時與標記 */}
                  <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-gray-600">工時: </span>
                      <span className="font-medium text-gray-900">
                        {record.working_hours || 0}h
                      </span>
                    </div>
                    
                    {/* 遲到早退標記 */}
                    <div className="flex gap-1">
                      {record.is_late && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
                          遲到
                        </span>
                      )}
                      {record.is_early_leave && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded-full">
                          早退
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 地點資訊 */}
                  {record.location && (
                    <div className="mt-2 text-xs text-gray-500">
                      📍 {record.location}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部操作欄 */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            滑動查看更多記錄
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  )
}