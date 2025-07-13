import { useState } from 'react'
import AuthLayout from '../layouts/AuthLayout'
import { login } from '../services/authService'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const message = await login(username, password)
            alert(message) // ✅ 顯示成功訊息
        } catch (err: any) {
            setError(err.message || '登入失敗') // ✅ 顯示錯誤訊息
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout>
            <div className="flex items-center justify-center w-full px-4">                <form
                onSubmit={handleSubmit}
                className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg rounded-2xl p-10 w-full max-w-sm text-white animate-fade-in"
            >
                <div className="flex flex-col items-center mb-6">
                    <div className="w-14 h-14 flex items-center justify-center bg-white/10 rounded-full shadow mb-2 text-2xl">
                        🕒
                    </div>
                    <h1 className="text-2xl font-bold">出勤管理系統</h1>
                    <p className="text-muted text-sm">管理員登入入口</p>
                </div>

                {error && (
                    <div className="bg-red-500/80 text-white text-sm px-4 py-2 rounded mb-4 text-center">
                        {error}
                    </div>
                )}

                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="使用者名稱"
                    className="w-full mb-4 px-4 py-2 rounded-lg bg-white/10 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="密碼"
                    className="w-full mb-6 px-4 py-2 rounded-lg bg-white/10 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white font-bold py-2 rounded-full shadow-button hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-transform"
                >
                    {loading ? '登入中...' : '登入'}
                </button>
            </form>
            </div>
        </AuthLayout>
    )
}