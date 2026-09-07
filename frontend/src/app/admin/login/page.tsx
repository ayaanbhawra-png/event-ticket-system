'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
    const router = useRouter()
    const { loginAdmin, isAdmin, adminUser } = useAuth()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isAdmin) {
            router.push('/admin')
        }
    }, [isAdmin, router])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!username.trim() || !password) {
            toast.error('Please enter both username and password')
            return
        }

        setLoading(true)
        const success = await loginAdmin({ username: username.trim(), password })
        setLoading(false)

        if (success) {
            router.push('/admin')
        }
    }

    const fillDemoCredentials = () => {
        setUsername('admin')
        setPassword('admin123')
        toast('Demo credentials auto-filled', { icon: '⚡' })
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white">
            <div className="max-w-md w-full mx-auto">
                <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl shadow-indigo-950/50">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-indigo-600/20">
                            🛡️
                        </div>
                        <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-bold uppercase tracking-wider text-indigo-400 mb-2">
                            Restricted Access
                        </div>
                        <h1 className="text-2xl font-extrabold text-white tracking-tight">Organizer & Admin Portal</h1>
                        <p className="text-slate-400 text-xs mt-1.5">
                            Sign in to manage smart contract events and gate check-ins
                        </p>
                    </div>

                    {/* Admin Sign In Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                Username or Admin ID
                            </label>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="e.g. admin"
                                className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    Admin Password
                                </label>
                                <button
                                    type="button"
                                    onClick={fillDemoCredentials}
                                    className="text-[11px] text-indigo-400 hover:text-indigo-300 underline font-medium"
                                >
                                    Auto-fill Demo Credentials
                                </button>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Authenticating...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>🔐</span>
                                        <span>Authorize & Open Admin Dashboard</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Quick Demo Helper Card */}
                    <div className="mt-6 p-4 rounded-2xl bg-slate-800/50 border border-slate-800 text-xs text-slate-400">
                        <div className="flex items-center gap-2 font-semibold text-slate-300 mb-1">
                            <span>💡</span>
                            <span>Development Credentials:</span>
                        </div>
                        <p className="font-mono text-slate-400">
                            Username: <span className="text-indigo-400">admin</span> | Password: <span className="text-indigo-400">admin123</span>
                        </p>
                    </div>

                    {/* Footer Switch Link */}
                    <div className="mt-8 pt-6 border-t border-slate-800/80 text-center space-y-2">
                        <Link href="/user/login" className="block text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                            Looking to buy tickets? Go to Attendee Login →
                        </Link>
                        <Link href="/" className="block text-xs text-slate-500 hover:text-slate-400">
                            ← Return to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
