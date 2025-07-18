// src/components/forms/LoginForm.tsx
import React from 'react'
import { User, Lock, Eye, EyeOff } from 'lucide-react'
import { useLoginForm } from '../../hooks/useLoginForm'

export const LoginForm: React.FC = () => {
  const {
    username,
    password,
    error,
    loading,
    showPassword,
    setUsername,
    setPassword,
    setShowPassword,
    handleSubmit
  } = useLoginForm()

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 錯誤訊息 */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></div>
            {error}
          </div>
        </div>
      )}

      {/* 表單輸入 */}
      <div className="space-y-5">
        {/* 使用者名稱 */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            使用者名稱
          </label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="請輸入使用者名稱"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 shadow-sm"
              required
            />
          </div>
        </div>

        {/* 密碼 */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            密碼
          </label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="請輸入密碼"
              className="w-full pl-12 pr-12 py-3 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 shadow-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 登入按鈕 */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            登入中...
          </div>
        ) : (
          '登入'
        )}
      </button>

      {/* 額外資訊 */}
      <div className="text-center">
        <p className="text-gray-500 text-xs">
          請使用管理員帳號登入系統
        </p>
      </div>
    </form>
  )
}