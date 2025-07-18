// src/hooks/useEmployees.ts
import { useState, useEffect } from 'react'
import { employeeService, EmployeeCreateRequest, EmployeeUpdateRequest, EmployeeSearchParams } from '../services/employeeService'
import { User } from '../types'

export const useEmployees = () => {
  const [employees, setEmployees] = useState<User[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useState<EmployeeSearchParams>({
    search: '',
    role: 'all',
    sortBy: 'created_at',
    sortOrder: 'desc'
  })

  // 載入員工列表
  const fetchEmployees = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await employeeService.getAllEmployees()
      setEmployees(data)
      console.log('📋 員工資料載入完成:', data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '載入員工列表失敗'
      setError(errorMessage)
      console.error('❌ 載入員工失敗:', err)
    } finally {
      setLoading(false)
    }
  }

  // 搜尋和篩選
  const updateSearch = (newParams: Partial<EmployeeSearchParams>) => {
    const updatedParams = { ...searchParams, ...newParams }
    setSearchParams(updatedParams)
    console.log('🔍 更新搜尋參數:', updatedParams)
  }

  // 新增員工
  const createEmployee = async (data: EmployeeCreateRequest) => {
    try {
      setLoading(true)
      await employeeService.createEmployee(data)
      await fetchEmployees() // 重新載入列表
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '新增員工失敗'
      setError(errorMessage)
      console.error('❌ 新增員工失敗:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  // 更新員工
  const updateEmployee = async (id: string, data: EmployeeUpdateRequest) => {
    try {
      setLoading(true)
      await employeeService.updateEmployee(id, data)
      await fetchEmployees() // 重新載入列表
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新員工失敗'
      setError(errorMessage)
      console.error('❌ 更新員工失敗:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  // 刪除員工
  const deleteEmployee = async (id: string) => {
    try {
      setLoading(true)
      await employeeService.deleteEmployee(id)
      await fetchEmployees() // 重新載入列表
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '刪除員工失敗'
      setError(errorMessage)
      console.error('❌ 刪除員工失敗:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  // 清除錯誤
  const clearError = () => setError(null)

  // 初始載入
  useEffect(() => {
    fetchEmployees()
  }, [])

  // 當搜尋參數或員工列表變化時，更新篩選結果
  useEffect(() => {
    const filtered = employeeService.searchAndSortEmployees(employees, searchParams)
    setFilteredEmployees(filtered)
    console.log('🔄 篩選結果更新:', filtered.length, '筆資料')
  }, [employees, searchParams])

  return {
    employees: filteredEmployees,
    allEmployees: employees,
    loading,
    error,
    searchParams,
    updateSearch,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    refreshEmployees: fetchEmployees,
    clearError
  }
}