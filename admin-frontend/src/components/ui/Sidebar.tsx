// src/components/ui/Sidebar.tsx
import React from 'react'
import { TrendingUp, Menu, LogOut, LucideIcon } from 'lucide-react'

interface MenuItem {
  id: string
  label: string
  icon: LucideIcon
}

interface SidebarProps {
  isOpen: boolean
  activeMenu: string
  menuItems: MenuItem[]
  onToggle: () => void
  onMenuClick: (menuId: string) => void
  onLogout?: () => void
}

interface SidebarItemProps {
  icon: LucideIcon
  label?: string
  active: boolean
  onClick: () => void
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors duration-150 text-left ${
      !label && 'justify-center space-x-0'
    } ${active 
        ? 'bg-blue-500 text-white' 
        : 'text-gray-700 hover:bg-gray-100'}`}
  >
    <Icon className="w-5 h-5" />
    {label && <span className="font-medium">{label}</span>}
  </button>
)

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  activeMenu, 
  menuItems, 
  onToggle, 
  onMenuClick,
  onLogout 
}) => {
  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}>
      <div className="h-full bg-white border-r border-gray-200 relative">
        {/* 頂部 Logo 區域 */}
        <div className="p-6 border-b border-gray-100">
          <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'}`}>
            {isOpen ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900">WorkFlow</h1>
                    <p className="text-xs text-gray-500">出勤管理系統</p>
                  </div>
                </div>
                <button
                  onClick={onToggle}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
              </>
            ) : (
              <button
                onClick={onToggle}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
        </div>
        
        {/* 導航選單 */}
        <nav className="p-4 space-y-2">
          {menuItems.map(item => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={isOpen ? item.label : undefined}
              active={activeMenu === item.id}
              onClick={() => onMenuClick(item.id)}
            />
          ))}
        </nav>

        {/* 底部登出按鈕 */}
        <div className="absolute bottom-4 left-4 right-4">
          <button 
            onClick={onLogout}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors ${!isOpen && 'justify-center'}`}
          >
            <LogOut className="w-5 h-5" />
            {isOpen && <span className="font-medium">登出</span>}
          </button>
        </div>
      </div>
    </div>
  )
}