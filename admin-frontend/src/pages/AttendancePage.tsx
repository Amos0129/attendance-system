// src/pages/AttendancePage.tsx
import React, { useState } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { Button } from '../components/ui'

// 簡化的 Input 組件 (或者您可以保留原本的)
const Input = ({ placeholder, value, onChange, icon }) => (
  <div className="relative">
    {icon && (
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        {icon}
      </div>
    )}
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
        icon ? 'pl-12' : ''
      }`}
    />
  </div>
)

// 簡化的 Card 組件
const Card = ({ children }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    {children}
  </div>
)

export const AttendancePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const attendanceData = [
    { id: 1, name: '張三', checkIn: '09:00', checkOut: '18:00', status: 'present' },
    { id: 2, name: '李四', checkIn: '09:15', checkOut: '18:05', status: 'late' },
    { id: 3, name: '王五', checkIn: '-', checkOut: '-', status: 'leave' },
    { id: 4, name: '趙六', checkIn: '-', checkOut: '-', status: 'absent' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-green-600'
      case 'late': return 'text-yellow-600'
      case 'leave': return 'text-blue-600'
      case 'absent': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present': return '正常'
      case 'late': return '遲到'
      case 'leave': return '請假'
      case 'absent': return '缺勤'
      default: return '未知'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-50'
      case 'late': return 'bg-yellow-50'
      case 'leave': return 'bg-blue-50'
      case 'absent': return 'bg-red-50'
      default: return 'bg-gray-50'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">出勤記錄</h1>
          <Button>匯出報表</Button>
        </div>

        {/* 搜尋和篩選 */}
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="搜尋員工姓名..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<span>🔍</span>}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">今日</Button>
              <Button variant="outline" size="sm">本週</Button>
              <Button variant="outline" size="sm">本月</Button>
            </div>
          </div>
        </Card>

        {/* 出勤列表 */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-700 font-medium">員工姓名</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-medium">簽到時間</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-medium">簽退時間</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-medium">狀態</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record) => (
                  <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-medium">{record.name}</td>
                    <td className="py-3 px-4 text-gray-600">{record.checkIn}</td>
                    <td className="py-3 px-4 text-gray-600">{record.checkOut}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getStatusBg(record.status)} ${getStatusColor(record.status)}`}>
                        {getStatusText(record.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="outline" size="sm">編輯</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}