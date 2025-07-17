// src/components/dashboard/ActivityList.tsx
import React from 'react'
import { ChevronRight } from 'lucide-react'

interface Activity {
  title: string
  time: string
  type: string
  status: 'pending' | 'approved' | 'rejected'
  user: string
}

interface ActivityListProps {
  activities: Activity[]
  onViewAll?: () => void
}

const ActivityItem: React.FC<Activity> = ({ title, time, type, status, user }) => (
  <div className="flex items-center justify-between py-3 hover:bg-gray-50 rounded-xl px-3 transition-colors duration-150">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
        <span className="text-sm font-medium text-gray-600">{user?.charAt(0) || 'U'}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <span className={`px-2 py-1 text-xs font-medium rounded-lg ${
        status === 'pending' ? 'bg-orange-50 text-orange-600' :
        status === 'approved' ? 'bg-green-50 text-green-600' :
        'bg-red-50 text-red-600'
      }`}>
        {status === 'pending' ? '待處理' : status === 'approved' ? '已批准' : '已拒絕'}
      </span>
    </div>
  </div>
)

export const ActivityList: React.FC<ActivityListProps> = ({ activities, onViewAll }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">最近活動</h3>
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center font-medium"
          >
            查看全部 <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>
      <div className="space-y-1">
        {activities.map((activity, index) => (
          <ActivityItem key={index} {...activity} />
        ))}
      </div>
    </div>
  )
}