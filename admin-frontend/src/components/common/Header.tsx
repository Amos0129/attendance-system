// src/components/common/Header.tsx
import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'

interface HeaderProps {
  title?: string
}

export const Header: React.FC<HeaderProps> = ({ title = '出勤管理系統' }) => {
  const { logout } = useAuth()

  return (
    <header className="bg-white/10 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl mr-2">🕒</span>
              <h1 className="text-xl font-bold text-white">{title}</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-white/70 text-sm">歡迎回來，管理員</span>
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