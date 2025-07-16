// src/pages/DashboardPage.tsx
import React from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { Card, Button } from '../components/ui'
import { useAuth } from '../hooks/useAuth'

export const DashboardPage: React.FC = () => {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 歡迎區域 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            歡迎回來，{user?.username || '管理員'}！
          </h1>
          <p className="text-slate-400">
            今天是 {new Date().toLocaleDateString('zh-TW', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              weekday: 'long' 
            })}
          </p>
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">今日出勤</p>
                <p className="text-2xl font-bold text-white">24</p>
              </div>
              <div className="text-3xl">👥</div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">遲到人數</p>
                <p className="text-2xl font-bold text-yellow-400">3</p>
              </div>
              <div className="text-3xl">⏰</div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">請假人數</p>
                <p className="text-2xl font-bold text-blue-400">2</p>
              </div>
              <div className="text-3xl">📝</div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">缺勤人數</p>
                <p className="text-2xl font-bold text-red-400">1</p>
              </div>
              <div className="text-3xl">❌</div>
            </div>
          </Card>
        </div>

        {/* 快速操作 */}
        <Card>
          <h2 className="text-xl font-bold text-white mb-4">快速操作</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="p-4 h-auto">
              <div className="text-center">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm">查看報表</div>
              </div>
            </Button>
            <Button variant="outline" className="p-4 h-auto">
              <div className="text-center">
                <div className="text-2xl mb-2">👤</div>
                <div className="text-sm">員工管理</div>
              </div>
            </Button>
            <Button variant="outline" className="p-4 h-auto">
              <div className="text-center">
                <div className="text-2xl mb-2">⚙️</div>
                <div className="text-sm">系統設定</div>
              </div>
            </Button>
          </div>
        </Card>

        {/* 最近活動 */}
        <Card>
          <h2 className="text-xl font-bold text-white mb-4">最近活動</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-white">張三 已簽到</span>
              </div>
              <span className="text-slate-400 text-sm">09:00</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-white">李四 遲到簽到</span>
              </div>
              <span className="text-slate-400 text-sm">09:15</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-white">王五 申請請假</span>
              </div>
              <span className="text-slate-400 text-sm">08:30</span>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}