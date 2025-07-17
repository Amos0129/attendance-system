// src/pages/EmployeePage.tsx
import React from 'react'
import { useEmployees } from '../hooks/useEmployees'
import { EmployeeCard } from '../components/employee/EmployeeCard'
import { Loading } from '../components/ui/Loading'

export const EmployeePage = () => {
  const { employees, loading, error } = useEmployees()

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">員工列表</h1>
      {loading ? (
        <Loading text="載入員工資料中..." />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((emp: any) => (
            <EmployeeCard key={emp.id} employee={emp} />
          ))}
        </div>
      )}
    </>
  )
}