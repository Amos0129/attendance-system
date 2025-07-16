// src/pages/LoginPage.tsx (簡化版本，使用新組件)
import React from 'react'
import { AuthLayout } from '../layouts/AuthLayout'
import { Card } from '../components/ui'
import { LoginForm } from '../components/forms'

export const LoginPage: React.FC = () => {
  return (
    <AuthLayout>
      <div className="flex items-center justify-center w-full px-4">
        <div className="w-full max-w-md">
          <Card>
            {/* 標題區域 */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4 transform hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🕒</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
                出勤管理系統
              </h1>
              <p className="text-slate-300 text-sm mt-2">管理員登入入口</p>
            </div>

            {/* 登入表單 */}
            <LoginForm />
          </Card>

          {/* 底部裝飾 */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-2 text-slate-500">
              <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
              <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
