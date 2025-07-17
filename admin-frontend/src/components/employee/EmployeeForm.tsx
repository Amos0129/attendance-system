// src/components/employee/EmployeeForm.tsx
import React from 'react'
import { User, Lock, Mail, Shield } from 'lucide-react'

interface Props {
  form: {
    username: string
    password: string
    name: string
    email: string
    role: string
  }
  onChange: (key: string, value: string) => void
  editMode?: boolean // 是否為編輯模式
}

export const EmployeeForm = ({ form, onChange, editMode = false }: Props) => {
  return (
    <div className="space-y-4">
      {/* 使用者名稱 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">使用者名稱 *</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
            placeholder="請輸入使用者名稱"
            value={form.username}
            onChange={(e) => onChange('username', e.target.value)}
            disabled={editMode} // 編輯時不能改 username
          />
        </div>
      </div>

      {/* 姓名 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">姓名 *</label>
        <input
          type="text"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
          placeholder="請輸入真實姓名"
          value={form.name}
          onChange={(e) => onChange('name', e.target.value)}
        />
      </div>

      {/* 密碼（新增才顯示） */}
      {!editMode && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">密碼 *</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
              placeholder="請輸入密碼"
              value={form.password}
              onChange={(e) => onChange('password', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
            placeholder="請輸入 email 地址"
            value={form.email}
            onChange={(e) => onChange('email', e.target.value)}
          />
        </div>
      </div>

      {/* 角色 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">角色</label>
        <div className="relative">
          <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={form.role}
            onChange={(e) => onChange('role', e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="user">一般員工</option>
            <option value="Admin">管理員</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default EmployeeForm