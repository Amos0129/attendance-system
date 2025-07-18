// src/components/dashboard/QuickActions.tsx
import React from 'react'
import { LucideIcon } from 'lucide-react'

interface QuickActionButtonProps {
  icon: LucideIcon
  label: string
  color: string
  onClick?: () => void
}

interface QuickActionsSummary {
  label: string
  value: string | number | React.ReactNode
  color?: string
}

interface QuickActionsProps {
  actions: QuickActionButtonProps[]
  summary?: QuickActionsSummary[]
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon: Icon, label, color, onClick }) => (
  <button 
    onClick={onClick}
    className="bg-white rounded-xl p-4 border border-gray-100 hover:bg-gray-50 transition-colors duration-150 text-center"
  >
    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${color} mb-3`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <p className="text-sm font-medium text-gray-800">{label}</p>
  </button>
)

export const QuickActions: React.FC<QuickActionsProps> = ({ actions, summary }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">快速操作</h3>
      
      {/* 操作按鈕 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {actions.map((action, index) => (
          <QuickActionButton key={index} {...action} />
        ))}
      </div>
      
      {/* 快速統計 */}
      {summary && (
        <div className="pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-4">今日概覽</h4>
          <div className="space-y-3">
            {summary.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{item.label}</span>
                <span className={`font-medium ${item.color || 'text-gray-900'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}