// src/components/ui/DashboardHeader.tsx
import React from 'react'
import { Search, Bell } from 'lucide-react'

interface DashboardHeaderProps {
  title?: string
  subtitle?: string
  showSearch?: boolean
  showNotifications?: boolean
  userName?: string
  userRole?: string
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title = '總覽',
  subtitle,
  showSearch = true,
  showNotifications = true,
  userName = '管理員',
  userRole = 'Admin'
}) => {
  const defaultSubtitle = `今天是 ${new Date().toLocaleDateString('zh-TW', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long' 
  })}`

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-600 mt-1">{subtitle || defaultSubtitle}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {showSearch && (
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="搜尋..." 
                  className="pl-10 pr-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
            
            {showNotifications && (
              <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            )}
            
            <div className="flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {userName.charAt(0)}
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">{userName}</p>
                <p className="text-gray-500">{userRole}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}