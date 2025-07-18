// src/components/dashboard/ActivityModal.tsx
import React from 'react'
import { X } from 'lucide-react'
import { Activity } from './ActivityList'

interface ActivityModalProps {
  activities: Activity[]
  onClose: () => void
}

export const ActivityModal: React.FC<ActivityModalProps> = ({ activities, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-lg relative border border-gray-200">
        {/* 關閉按鈕 */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">全部活動紀錄</h2>

          {activities.length === 0 ? (
            <p className="text-sm text-gray-500">目前沒有活動紀錄</p>
          ) : (
            <div className="space-y-3">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 hover:shadow-sm"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                      activity.status === 'pending'
                        ? 'bg-orange-100 text-orange-600'
                        : activity.status === 'approved'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {activity.status === 'pending'
                      ? '待處理'
                      : activity.status === 'approved'
                      ? '已批准'
                      : '已拒絕'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}