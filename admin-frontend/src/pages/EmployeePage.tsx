// src/pages/EmployeePage.tsx
import React, { useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { Loading } from '../components/ui'
import { EmployeeCard } from '../components/employee/EmployeeCard'
import { EmployeeFilters } from '../components/employee/EmployeeFilters'
import { useEmployees } from '../hooks/useEmployees'
import CreateEmployeeModal from '../components/employee/CreateEmployeeModal'
import { User } from '../types'

export const EmployeePage: React.FC = () => {
  const {
    employees,
    allEmployees,
    loading,
    error,
    searchParams,
    updateSearch,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    refreshEmployees,
    clearError
  } = useEmployees()

  const [showForm, setShowForm] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleCreate = () => {
    setFormMode('create')
    setSelectedEmployee(null)
    setShowForm(true)
  }

  const handleEdit = (employee: User) => {
    setFormMode('edit')
    setSelectedEmployee(employee)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setDeleteConfirm(id)
  }

  const confirmDelete = async () => {
    if (!deleteConfirm) return
    const success = await deleteEmployee(deleteConfirm)
    if (success) setDeleteConfirm(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">員工管理</h1>
          <p className="text-gray-600 mt-1">管理公司員工資訊</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={refreshEmployees}
            disabled={loading}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            重新整理
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            新增員工
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-red-700">{error}</span>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              關閉
            </button>
          </div>
        </div>
      )}

      <EmployeeFilters
        searchParams={searchParams}
        onSearchParamsChange={updateSearch}
        totalCount={allEmployees.length}
        filteredCount={employees.length}
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <Loading size="lg" text="載入員工資料中..." />
        </div>
      ) : employees.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchParams.search || searchParams.role !== 'all'
              ? '沒有找到符合條件的員工'
              : '還沒有員工資料'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchParams.search || searchParams.role !== 'all'
              ? '請試試調整搜尋條件'
              : '點擊上方按鈕新增第一個員工'}
          </p>
          {!(searchParams.search || searchParams.role !== 'all') && (
            <button
              onClick={handleCreate}
              className="px-6 py-3 text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors"
            >
              新增員工
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {employees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* 刪除確認 */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">確認刪除</h3>
            <p className="text-gray-600 mb-6">確定要刪除這位員工嗎？此操作無法復原。</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmDelete}
                disabled={loading}
                className="flex-1 px-4 py-3 text-white bg-red-500 rounded-xl hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                {loading ? '刪除中...' : '確認刪除'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ 新增/編輯員工 Modal */}
      <CreateEmployeeModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={refreshEmployees}
        initialData={formMode === 'edit' ? selectedEmployee : undefined}
      />
    </div>
  )
}