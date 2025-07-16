// src/pages/AttendancePage.tsx
import React, { useState } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { Card, Button, Input } from '../components/ui'

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
      case 'present': return 'text-green-400'
      case 'late': return 'text-yellow-400'
      case 'leave': return 'text-blue-400'
      case 'absent': return 'text-red-400'
      default: return 'text-slate-400'
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">出勤記錄</h1>
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
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-slate-300">員工姓名</th>
                  <th className="text-left py-3 px-4 text-slate-300">簽到時間</th>
                  <th className="text-left py-3 px-4 text-slate-300">簽退時間</th>
                  <th className="text-left py-3 px-4 text-slate-300">狀態</th>
                  <th className="text-left py-3 px-4 text-slate-300">操作</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record) => (
                  <tr key={record.id} className="border-b border-white/5">
                    <td className="py-3 px-4 text-white">{record.name}</td>
                    <td className="py-3 px-4 text-slate-300">{record.checkIn}</td>
                    <td className="py-3 px-4 text-slate-300">{record.checkOut}</td>
                    <td className="py-3 px-4">
                      <span className={getStatusColor(record.status)}>
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