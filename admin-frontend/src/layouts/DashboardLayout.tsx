// src/layouts/DashboardLayout.tsx
import React, { useState } from 'react'
import { Sidebar } from '../components/ui/Sidebar'
import { DashboardHeader } from '../components/ui/DashboardHeader'
import { useAuth } from '../contexts/AuthContext'
import {
  Users,
  Clock,
  Calendar,
  TrendingUp,
  Settings,
  BarChart3,
  Zap
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
  activeMenu: string
  onMenuClick: (menuId: string) => void
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeMenu,
  onMenuClick
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { logout } = useAuth()

  const menuItems = [
    { id: 'dashboard', label: '總覽', icon: TrendingUp },
    { id: 'users', label: '員工', icon: Users },
    { id: 'attendance', label: '出勤', icon: Clock },
    { id: 'leave', label: '請假', icon: Calendar },
    { id: 'overtime', label: '加班', icon: Zap },
    { id: 'reports', label: '報表', icon: BarChart3 },
    { id: 'settings', label: '設定', icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        activeMenu={activeMenu}
        menuItems={menuItems}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onMenuClick={onMenuClick}
        onLogout={logout}
      />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}