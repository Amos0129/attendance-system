// src/components/common/Header.tsx
import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'
import { TrendingUp } from 'lucide-react'

interface HeaderProps {
  title?: string
}

export const Header: React.FC<HeaderProps> = ({ title = '出勤管理系統' }) => {
  const { logout } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 text-sm">歡迎回來，管理員</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={logout}
            >
              登出
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}