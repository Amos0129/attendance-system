// src/pages/LoginPage.tsx (簡化版本，使用新組件)
import React from 'react'
import { AuthLayout } from '../layouts/AuthLayout'
import { LoginForm } from '../components/forms'
import { TrendingUp } from 'lucide-react'

export const LoginPage: React.FC = () => {
  return (
    <AuthLayout>
      <div className="flex items-center justify-center w-full px-4">
        <div className="w-full max-w-md">
          {/* 現代化白色卡片 - 增加陰影和邊框效果 */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 relative overflow-hidden">
            {/* 卡片內部裝飾 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-100/50 to-transparent rounded-full blur-2xl"></div>
            
            {/* 標題區域 */}
            <div className="flex flex-col items-center mb-8 relative z-10">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4 transform hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                WorkFlow
              </h1>
              <p className="text-gray-600 text-sm font-medium">出勤管理系統</p>
              <p className="text-gray-500 text-xs mt-1">管理員登入入口</p>
            </div>

            {/* 登入表單 */}
            <div className="relative z-10">
              <LoginForm />
            </div>
          </div>

          {/* 底部裝飾 */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-100"></div>
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}