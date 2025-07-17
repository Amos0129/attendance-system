// src/components/employee/EmployeeCard.tsx
import React from 'react'
import { User, Edit2, Trash2, Mail, Shield } from 'lucide-react'

interface Props {
  employee: any
  onEdit?: (employee: any) => void
  onDelete?: (id: string) => void
}

export const EmployeeCard = ({ employee, onEdit, onDelete }: Props) => {
  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'bg-red-100 text-red-700'
      case 'manager': return 'bg-purple-100 text-purple-700'
      case 'hr': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return <Shield className="w-3 h-3" />
      default: return <User className="w-3 h-3" />
    }
  }

  // 頭像顏色根據使用者名稱生成
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-teal-500'
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group relative">
      {/* 操作按鈕 */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {onEdit && (
          <button 
            onClick={() => onEdit(employee)}
            className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
        {onDelete && (
          <button 
            onClick={() => onDelete(employee.id)}
            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 員工資訊 */}
      <div className="flex items-start space-x-4">
        {/* 簡潔頭像 */}
        <div className={`w-12 h-12 ${getAvatarColor(employee.name || employee.username)} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <span className="text-white font-semibold text-lg">
            {employee.name?.charAt(0) || employee.username?.charAt(0) || 'U'}
          </span>
        </div>

        {/* 基本資訊 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {employee.name || employee.username}
            </h3>
            {employee.role && (
              <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg ${getRoleColor(employee.role)}`}>
                {getRoleIcon(employee.role)}
                {employee.role === 'Admin' ? '管理員' : '一般員工'}
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-3">
            @{employee.username}
          </p>

          {/* 聯絡資訊 */}
          {employee.email && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Mail className="w-4 h-4" />
              <span className="truncate">{employee.email}</span>
            </div>
          )}
        </div>
      </div>

      {/* 底部資訊 */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>建立時間</span>
          <span>
            {employee.created_at ? 
              new Date(employee.created_at).toLocaleDateString('zh-TW') : 
              '未知'
            }
          </span>
        </div>
      </div>
    </div>
  )
}