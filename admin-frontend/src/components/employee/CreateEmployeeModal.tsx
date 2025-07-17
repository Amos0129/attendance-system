import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
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
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-bold text-slate-800 mb-4">
              新增員工
            </Dialog.Title>

            <div className="space-y-3">
              <input
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-black"
                placeholder="帳號"
                value={form.username}
                onChange={(e) => handleChange('username', e.target.value)}
              />
              <input
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-black"
                type="password"
                placeholder="密碼"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
              />
              <input
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-black"
                placeholder="姓名"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
              <input
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-black"
                placeholder="Email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm mt-3">{error}</p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="text-sm px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
                onClick={onClose}
              >
                取消
              </button>
              <button
                className="text-sm px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? '建立中...' : '建立'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  )
}