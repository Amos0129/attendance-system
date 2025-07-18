// src/components/ui/DashboardHeader.tsx
import React, { useState, useEffect } from 'react'
import { Search, Bell, User, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { apiClient } from '../../services/apiClient'

interface DashboardHeaderProps {
  title?: string
  subtitle?: string
  showSearch?: boolean
  showNotifications?: boolean
  onSearch?: (query: string) => void
  onNotificationClick?: () => void
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title = '總覽',
  subtitle,
  showSearch = true,
  showNotifications = true,
  onSearch,
  onNotificationClick
}) => {
  const { logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const defaultSubtitle = `今天是 ${new Date().toLocaleDateString('zh-TW', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long' 
  })}`

  // 獲取當前使用者資訊
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await apiClient.get('/users/me')
        setCurrentUser(user)
        console.log('📋 當前使用者:', user)
      } catch (error) {
        console.error('❌ 無法獲取使用者資訊:', error)
        // 如果無法獲取，使用預設值
        setCurrentUser({
          name: '管理員',
          username: 'admin',
          role: 'Admin'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentUser()
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  const handleNotificationClick = () => {
    onNotificationClick?.()
    // 這裡可以顯示通知列表或跳轉到通知頁面
    console.log('通知功能待實現')
  }

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu)
  }

  const handleLogout = () => {
    logout()
  }

  // 獲取使用者顯示名稱
  const getUserDisplayName = () => {
    if (loading) return '載入中...'
    return currentUser?.name || currentUser?.username || '使用者'
  }

  // 獲取使用者角色顯示
  const getUserRoleDisplay = () => {
    if (loading) return '...'
    const role = currentUser?.role || 'user'
    return role === 'Admin' ? '管理員' : '一般員工'
  }

  // 獲取頭像字母
  const getAvatarLetter = () => {
    if (loading) return 'U'
    const name = currentUser?.name || currentUser?.username || 'User'
    return name.charAt(0).toUpperCase()
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-600 mt-1">{subtitle || defaultSubtitle}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* 搜尋功能 */}
            {showSearch && (
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="搜尋..." 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 w-64"
                />
              </form>
            )}
            
            {/* 通知按鈕 */}
            {showNotifications && (
              <button 
                onClick={handleNotificationClick}
                className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
                title="通知"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
            )}
            
            {/* 使用者選單 */}
            <div className="relative">
              <button
                onClick={handleUserMenuToggle}
                className="flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-2 hover:bg-gray-100 transition-colors"
                disabled={loading}
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {getAvatarLetter()}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{getUserDisplayName()}</p>
                  <p className="text-gray-500">{getUserRoleDisplay()}</p>
                </div>
              </button>

              {/* 下拉選單 */}
              {showUserMenu && !loading && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                    <p className="text-xs text-gray-500">@{currentUser?.username}</p>
                  </div>
                  <button
                    onClick={() => setShowUserMenu(false)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    個人資料
                  </button>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    登出
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 點擊其他地方關閉選單 */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  )
}