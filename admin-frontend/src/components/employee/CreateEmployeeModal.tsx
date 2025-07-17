import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { X, User, Lock, Mail, Shield } from 'lucide-react'
import { apiClient } from '../../services/apiClient'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CreateEmployeeModal({ isOpen, onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    role: 'user',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value })
    setError(null)
  }

  const handleSubmit = async () => {
    const { username, password, name, email } = form

    if (!username || !password || !name || !email) {
      setError('所有欄位皆為必填')
      return
    }

    setLoading(true)
    try {
      await apiClient.post('/users/', form)
      // 重置表單
      setForm({
        username: '',
        password: '',
        name: '',
        email: '',
        role: 'user',
      })
      onSuccess()
      onClose()
    } catch (err) {
      setError('建立失敗，請檢查欄位或稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <div className="relative z-50">
        <Dialog onClose={onClose}>
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              {/* 標題 */}
              <div className="flex items-center justify-between mb-6">
                <Dialog.Title className="text-xl font-semibold text-gray-900">
                  新增員工
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 表單 */}
              <div className="space-y-4">
                {/* 使用者名稱 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    使用者名稱 *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder:text-gray-400"
                      placeholder="請輸入使用者名稱"
                      value={form.username}
                      onChange={(e) => handleChange('username', e.target.value)}
                    />
                  </div>
                </div>

                {/* 姓名 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    姓名 *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder:text-gray-400"
                    placeholder="請輸入真實姓名"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>

                {/* 密碼 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    密碼 *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder:text-gray-400"
                      placeholder="請輸入密碼"
                      value={form.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder:text-gray-400"
                      placeholder="請輸入 email 地址"
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                  </div>
                </div>

                {/* 角色 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    角色
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={form.role}
                      onChange={(e) => handleChange('role', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white text-gray-900"
                    >
                      <option value="user">一般員工</option>
                      <option value="Admin">管理員</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 錯誤訊息 */}
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                </div>
              )}

              {/* 操作按鈕 */}
              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-4 py-3 text-white bg-blue-500 rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? '建立中...' : '建立'}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </Transition>
  )
}