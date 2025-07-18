// src/layouts/DashboardLayoutWrapper.tsx
import React, { useEffect, useState } from 'react'
import { DashboardLayout } from './DashboardLayout'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

export const DashboardLayoutWrapper: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeMenu, setActiveMenu] = useState('dashboard')

  // 根據當前路由設定 active menu
  useEffect(() => {
    const path = location.pathname
    if (path.startsWith('/dashboard')) setActiveMenu('dashboard')
    else if (path.startsWith('/employees')) setActiveMenu('users')
    else if (path.startsWith('/attendance')) setActiveMenu('attendance')
    else if (path.startsWith('/leave')) setActiveMenu('leave')
    else if (path.startsWith('/overtime')) setActiveMenu('overtime')
    else if (path.startsWith('/reports')) setActiveMenu('reports')
    else if (path.startsWith('/settings')) setActiveMenu('settings')
  }, [location.pathname])

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId)
    switch (menuId) {
      case 'dashboard':
        navigate('/dashboard')
        break
      case 'users':
        navigate('/employees')
        break
      case 'attendance':
        navigate('/attendance')
        break
      case 'leave':
        navigate('/leave')
        break
      case 'overtime':
        navigate('/overtime')
        break
      case 'reports':
        navigate('/reports')
        break
      case 'settings':
        navigate('/settings')
        break
      default:
        break
    }
  }

  return (
    <DashboardLayout
      activeMenu={activeMenu}
      onMenuClick={handleMenuClick}
    >
      <Outlet />
    </DashboardLayout>
  )
}