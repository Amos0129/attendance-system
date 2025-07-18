// src/components/attendance/AttendanceFilters.tsx
import React from 'react'
import { Search, Filter, SortAsc, SortDesc, Calendar, Users } from 'lucide-react'

export interface AttendanceSearchParams {
  search?: string
  status?: string
  date?: string
  sortBy?: 'date' | 'user_name' | 'status' | 'working_hours'
  sortOrder?: 'asc' | 'desc'
}

interface AttendanceFiltersProps {
  searchParams: AttendanceSearchParams
  onSearchParamsChange: (params: Partial<AttendanceSearchParams>) => void
  totalCount: number
  filteredCount: number
}

export const AttendanceFilters: React.FC<AttendanceFiltersProps> = ({
  searchParams,
  onSearchParamsChange,
  totalCount,
  filteredCount
}) => {
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* 搜尋框 */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="搜尋員工姓名..."
              value={searchParams.search || ''}
              onChange={(e) => onSearchParamsChange({ search: e.target.value })}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* 日期選擇 */}
        <div className="lg:w-48">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={searchParams.date || today}
              onChange={(e) => onSearchParamsChange({ date: e.target.value })}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
            />
          </div>
        </div>

        {/* 狀態篩選 */}
        <div className="lg:w-48">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={searchParams.status || 'all'}
              onChange={(e) => onSearchParamsChange({ status: e.target.value })}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white text-gray-900"
            >
              <option value="all">所有狀態</option>
              <option value="present">正常出勤</option>
              <option value="late">遲到</option>
              <option value="absent">缺勤</option>
              <option value="leave">請假</option>
            </select>
          </div>
        </div>

        {/* 排序選項 */}
        <div className="lg:w-48">
          <select
            value={`${searchParams.sortBy}-${searchParams.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-')
              onSearchParamsChange({
                sortBy: sortBy as any,
                sortOrder: sortOrder as 'asc' | 'desc'
              })
            }}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white text-gray-900"
          >
            <option value="date-desc">最新日期</option>
            <option value="date-asc">最舊日期</option>
            <option value="user_name-asc">姓名 A-Z</option>
            <option value="user_name-desc">姓名 Z-A</option>
            <option value="status-asc">狀態 A-Z</option>
            <option value="working_hours-desc">工時高到低</option>
            <option value="working_hours-asc">工時低到高</option>
          </select>
        </div>

        {/* 排序方向按鈕 */}
        <button
          onClick={() => onSearchParamsChange({
            sortOrder: searchParams.sortOrder === 'asc' ? 'desc' : 'asc'
          })}
          className="px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center"
          title={`當前排序: ${searchParams.sortOrder === 'asc' ? '升序' : '降序'}`}
        >
          {searchParams.sortOrder === 'asc' ?
            <SortAsc className="w-5 h-5 text-gray-600" /> :
            <SortDesc className="w-5 h-5 text-gray-600" />
          }
        </button>
      </div>

      {/* 快速日期篩選 */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => onSearchParamsChange({ date: today })}
          className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          今天
        </button>
        <button
          onClick={() => {
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            onSearchParamsChange({ date: yesterday.toISOString().split('T')[0] })
          }}
          className="px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          昨天
        </button>
        <button
          onClick={() => {
            const weekAgo = new Date()
            weekAgo.setDate(weekAgo.getDate() - 7)
            onSearchParamsChange({ date: weekAgo.toISOString().split('T')[0] })
          }}
          className="px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          一週前
        </button>
      </div>

      {/* 結果統計 */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          顯示 {filteredCount} 筆，共 {totalCount} 筆出勤記錄
        </span>

        {/* 清除篩選 */}
        {(searchParams.search || searchParams.status !== 'all' || searchParams.date !== today) && (
          <button
            onClick={() => onSearchParamsChange({ 
              search: '', 
              status: 'all', 
              date: today 
            })}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            清除篩選
          </button>
        )}
      </div>
    </div>
  )
}