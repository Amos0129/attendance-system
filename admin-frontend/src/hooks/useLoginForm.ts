// src/hooks/useLoginForm.ts
import { useState } from 'react'
import { authService } from '../services/authService'
import { useNavigate } from 'react-router-dom'

export const useLoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await authService.login(username, password)
      navigate('/dashboard') // ✅ 登入成功後跳轉
    } catch (err: any) {
      setError(err.message || '登入失敗')
    } finally {
      setLoading(false)
    }
  }

  return {
    username,
    password,
    error,
    loading,
    showPassword,
    setUsername,
    setPassword,
    setShowPassword,
    handleSubmit
  }
}