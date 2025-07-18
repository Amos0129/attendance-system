// src/components/employee/EmployeeFilters.tsx
import React from 'react'
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react'
import { EmployeeSearchParams } from '../../services/employeeService'

interface EmployeeFiltersProps {
    searchParams: EmployeeSearchParams
    onSearchParamsChange: (params: Partial<EmployeeSearchParams>) => void
    totalCount: number
    filteredCount: number
}

export const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
    searchParams,
    onSearchParamsChange,
    totalCount,
    filteredCount
}) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* 搜尋框 */}
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="搜尋員工姓名、使用者名稱或 Email..."
                            value={searchParams.search || ''}
                            onChange={(e) => onSearchParamsChange({ search: e.target.value })}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* 角色篩選 */}
                <div className="lg:w-48">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                            value={searchParams.role || 'all'}
                            onChange={(e) => onSearchParamsChange({ role: e.target.value })}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white  text-gray-900"
                        >
                            <option value="all">所有角色</option>
                            <option value="user">一般員工</option>
                            <option value="Admin">管理員</option>
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
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white  text-gray-900"
                    >
                        <option value="created_at-desc">最新建立</option>
                        <option value="created_at-asc">最舊建立</option>
                        <option value="name-asc">姓名 A-Z</option>
                        <option value="name-desc">姓名 Z-A</option>
                        <option value="username-asc">帳號 A-Z</option>
                        <option value="username-desc">帳號 Z-A</option>
                        <option value="role-asc">角色 A-Z</option>
                        <option value="role-desc">角色 Z-A</option>
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

            {/* 結果統計 */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <span>
                    顯示 {filteredCount} 筆，共 {totalCount} 筆員工資料
                </span>

                {/* 清除篩選 */}
                {(searchParams.search || searchParams.role !== 'all') && (
                    <button
                        onClick={() => onSearchParamsChange({ search: '', role: 'all' })}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        清除篩選
                    </button>
                )}
            </div>
        </div>
    )
}