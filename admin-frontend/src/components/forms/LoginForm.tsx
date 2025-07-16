// src/components/forms/LoginForm.tsx
import React from 'react'
import { Input, Button, Alert } from '../ui'
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
        <Alert type="error">{error}</Alert>
      )}

      {/* 表單輸入 */}
      <div className="space-y-4">
        <Input
          label="使用者名稱"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="請輸入使用者名稱"
          icon={<span className="text-lg">👤</span>}
          required
        />

        <Input
          label="密碼"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="請輸入密碼"
          icon={<span className="text-lg">🔒</span>}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <span className="text-lg">{showPassword ? '🙈' : '👁️'}</span>
            </button>
          }
          required
        />
      </div>

      {/* 登入按鈕 */}
      <Button
        type="submit"
        loading={loading}
        className="w-full"
        size="lg"
      >
        {loading ? '登入中...' : '登入'}
      </Button>

      {/* 額外資訊 */}
      <div className="text-center">
        <p className="text-slate-400 text-xs">
          請使用管理員帳號登入系統
        </p>
      </div>
    </form>
  )
}