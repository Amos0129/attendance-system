import React from 'react'
import { Search, Filter, SortAsc, SortDesc, Users, Calendar } from 'lucide-react'

export interface LeaveSearchParams {
  search?: string
  status?: string
  leave_type?: string
  sortBy?: 'created_at' | 'start_date' | 'status' | 'leave_type'
  sortOrder?: 'asc' | 'desc'
}

interface LeaveFiltersProps {
  searchParams: LeaveSearchParams
  onSearchParamsChange: (params: Partial<LeaveSearchParams>) => void
  totalCount: number
  filteredCount: number
}

export const LeaveFilters: React.FC<LeaveFiltersProps> = ({
  searchParams,
  onSearchParamsChange,
  totalCount,
  filteredCount
}) => {
  const handleSortChange = (field: LeaveSearchParams['sortBy']) => {
    if (searchParams.sortBy === field) {
      // 如果點擊同一個欄位，切換排序方向
      onSearchParamsChange({
        sortOrder: searchParams.sortOrder === 'asc' ? 'desc' : 'asc'
      })
    } else {
      // 如果點擊不同欄位，設定新的排序欄位和預設方向
      onSearchParamsChange({
        sortBy: field,
        sortOrder: 'asc'
      })
    }
  }

  const getSortIcon = (field: LeaveSearchParams['sortBy']) => {
    if (searchParams.sortBy === field) {
      return searchParams.sortOrder === 'asc' ? SortAsc : SortDesc
    }
    return SortAsc
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* 搜尋框 */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="搜尋員工姓名、請假理由..."
              value={searchParams.search || ''}
              onChange={(e) => onSearchParamsChange({ search: e.target.value })}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* 狀態篩選 */}
        <div className="lg:w-48">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={searchParams.status || 'all'}
              onChange={(e) => onSearchParamsChange({ status: e.target.value === 'all' ? undefined : e.target.value })}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white text-gray-900"
            >
              <option value="all">全部狀態</option>
              <option value="pending">待審核</option>
              <option value="approved">已核准</option>
              <option value="rejected">已拒絕</option>
            </select>
          </div>
        </div>

        {/* 請假類型篩選 */}
        <div className="lg:w-48">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={searchParams.leave_type || 'all'}
              onChange={(e) => onSearchParamsChange({ leave_type: e.target.value === 'all' ? undefined : e.target.value })}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white text-gray-900"
            >
              <option value="all">全部類型</option>
              <option value="sick">病假</option>
              <option value="annual">年假</option>
              <option value="personal">事假</option>
              <option value="maternity">產假</option>
              <option value="paternity">陪產假</option>
              <option value="compassionate">喪假</option>
              <option value="other">其他</option>
            </select>
          </div>
        </div>

        {/* 排序選項 */}
        <div className="flex gap-2">
          <button
            onClick={() => handleSortChange('created_at')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
              searchParams.sortBy === 'created_at'
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {React.createElement(getSortIcon('created_at'), { className: 'w-4 h-4' })}
            <span className="text-sm font-medium">申請時間</span>
          </button>

          <button
            onClick={() => handleSortChange('start_date')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
              searchParams.sortBy === 'start_date'
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {React.createElement(getSortIcon('start_date'), { className: 'w-4 h-4' })}
            <span className="text-sm font-medium">開始日期</span>
          </button>

          <button
            onClick={() => handleSortChange('status')}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
              searchParams.sortBy === 'status'
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {React.createElement(getSortIcon('status'), { className: 'w-4 h-4' })}
            <span className="text-sm font-medium">狀態</span>
          </button>
        </div>
      </div>

      {/* 結果統計 */}
      <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>
            顯示 {filteredCount} 筆結果，共 {totalCount} 筆請假申請
          </span>
        </div>
        
        {filteredCount !== totalCount && (
          <button
            onClick={() => onSearchParamsChange({ search: '', status: undefined, leave_type: undefined })}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            清除篩選
          </button>
        )}
      </div>
    </div>
  )
}