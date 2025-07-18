// src/pages/AttendancePage.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Users,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    RefreshCw,
    Calendar,
    TrendingUp
} from 'lucide-react'
import { StatCard, Loading } from '../components/ui'
import { AttendanceCard } from '../components/attendance/AttendanceCard'
import { AttendanceFilters } from '../components/attendance/AttendanceFilters'
import { AttendanceQuickActions } from '../components/attendance/AttendanceQuickActions'
import { AttendanceModal } from '../components/attendance/AttendanceModal'
import { useAttendance } from '../hooks/useAttendance'

export const AttendancePage: React.FC = () => {
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false)
    
    const {
        attendanceRecords,
        allRecords,
        stats,
        todayStats,
        loading,
        error,
        searchParams,
        updateSearch,
        exportReport,
        refreshRecords,
        clearError
    } = useAttendance()

    // 匯出報表
    const handleExportReport = async () => {
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - 30) // 過去30天
        const endDate = new Date()

        const result = await exportReport({
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            format: 'xlsx'
        })

        if (result.success) {
            console.log(result.message)
        }
    }

    // 查看統計分析
    const handleViewStats = () => {
        console.log('跳轉到統計分析頁面...')
        // navigate('/reports/attendance')
    }

    // 查看員工管理
    const handleViewUsers = () => {
        console.log('跳轉到員工管理頁面...')
        navigate('/employees')
    }

    // 查看詳細報告
    const handleViewReports = () => {
        console.log('跳轉到報告頁面...')
        // navigate('/reports')
    }

    return (
        <div className="space-y-6">
            {/* 頁面標題 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">出勤管理</h1>
                    <p className="text-gray-600 mt-1">監控和管理員工出勤狀況</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={refreshRecords}
                        disabled={loading}
                        className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        重新整理
                    </button>
                </div>
            </div>

            {/* 錯誤訊息 */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-red-700">{error}</span>
                        </div>
                        <button
                            onClick={clearError}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                            關閉
                        </button>
                    </div>
                </div>
            )}

            {/* 統計卡片區域 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="總員工數"
                    value={stats.total_employees}
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatCard
                    title="今日出勤"
                    value={`${todayStats.present + todayStats.late}/${stats.total_employees}`}
                    icon={CheckCircle}
                    color="bg-green-500"
                    trend={todayStats.attendanceRate >= 90 ? 5 : -2}
                />
                <StatCard
                    title="遲到人數"
                    value={stats.late_today}
                    icon={AlertCircle}
                    color="bg-orange-500"
                />
                <StatCard
                    title="缺勤人數"
                    value={stats.absent_today}
                    icon={XCircle}
                    color="bg-red-500"
                />
            </div>

            {/* 搜尋和篩選 */}
            <AttendanceFilters
                searchParams={searchParams}
                onSearchParamsChange={updateSearch}
                totalCount={allRecords.length}
                filteredCount={attendanceRecords.length}
            />

            {/* 管理操作 + 出勤記錄 */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2">
                    <AttendanceQuickActions
                        onExportReport={handleExportReport}
                        onViewStats={handleViewStats}
                        onViewUsers={handleViewUsers}
                        onViewReports={handleViewReports}
                        todayStats={todayStats}
                    />
                </div>
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">出勤記錄</h3>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Clock className="w-4 h-4" />
                                    <span>共 {attendanceRecords.length} 筆記錄</span>
                                </div>
                                {attendanceRecords.length > 0 && (
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                    >
                                        查看全部
                                    </button>
                                )}
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loading size="lg" text="載入出勤記錄中..." />
                            </div>
                        ) : attendanceRecords.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {searchParams.search || searchParams.status !== 'all' ? '沒有找到符合條件的記錄' : '還沒有出勤記錄'}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {searchParams.search || searchParams.status !== 'all' ? '請試試調整搜尋條件' : '員工開始使用系統後會顯示出勤記錄'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[450px] overflow-y-auto">
                                {attendanceRecords.slice(0, 10).map((record) => (
                                    <AttendanceCard
                                        key={record.id}
                                        record={record}
                                        showActions={false} // 管理員頁面不顯示編輯刪除按鈕
                                    />
                                ))}
                                {attendanceRecords.length > 10 && (
                                    <div className="text-center py-4 border-t border-gray-100">
                                        <button
                                            onClick={() => setShowModal(true)}
                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                        >
                                            還有 {attendanceRecords.length - 10} 筆記錄，點擊查看全部
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 圖表區域 */}
            <div className="mt-8">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">出勤趨勢分析</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-600 font-medium">圖表功能開發中</p>
                            <p className="text-sm text-gray-500 mt-1">即將推出更多數據視覺化功能</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 出勤記錄 Modal */}
            {showModal && (
                <AttendanceModal
                    attendanceRecords={attendanceRecords}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    )
}