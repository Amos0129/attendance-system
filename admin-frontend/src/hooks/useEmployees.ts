// src/hooks/useEmployees.ts
import { useEffect, useState } from 'react'
import { apiClient } from '../services/apiClient'
import { User } from '../types/user'

export const useEmployees = () => {
  const [employees, setEmployees] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchEmployees = async () => {
    try {
      const res = await apiClient.get<User[]>('/users/')
      console.log('員工 API 回傳資料：', res)
      setEmployees(res)
    } catch (err: any) {
      console.error(err)
      setError('無法載入員工資料')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  return { employees, loading, error, refetch: fetchEmployees }
}