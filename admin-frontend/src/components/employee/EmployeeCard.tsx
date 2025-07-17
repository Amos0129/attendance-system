// src/components/employee/EmployeeCard.tsx
import React from 'react'
import { User, Edit2, Trash2 } from 'lucide-react'

interface Props {
  employee: any
  onEdit?: (employee: any) => void
  onDelete?: (id: string) => void
}

export const EmployeeCard = ({ employee, onEdit, onDelete }: Props) => (
  <div className="relative bg-white p-6 rounded-2xl shadow border border-gray-100 hover:shadow-md transition group">
    {/* 操作按鈕 */}
    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
      <button onClick={() => onEdit?.(employee)} className="text-gray-500 hover:text-blue-600">
        <Edit2 size={16} />
      </button>
      <button onClick={() => onDelete?.(employee.id)} className="text-gray-500 hover:text-red-500">
        <Trash2 size={16} />
      </button>
    </div>

    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
        <User className="text-blue-600 w-6 h-6" />
      </div>
      <div>
        <p className="text-lg font-semibold text-gray-800">{employee.name}</p>
        <p className="text-sm text-gray-500">{employee.role || '職稱未設定'}</p>
      </div>
    </div>

    <div className="mt-4 text-sm text-gray-600">
      Email: {employee.email || '無'}
    </div>
  </div>
)