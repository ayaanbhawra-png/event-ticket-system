'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { useAuth } from '@/context/AuthContext'
import WalletConnect from '@/components/WalletConnect'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function UserLoginPage() {
    const router = useRouter()
    const { isConnected, address } = useAccount()
    const { loginUser, userProfile } = useAuth()
    const [email, setEmail] = useState('')

    useEffect(() => {
        if (isConnected && address) {
            loginUser({ address })
        }
    }, [isConnected, address, loginUser])

    const handleContinueWithEmail = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !email.includes('@')) {
            toast.error('Please enter a valid email address')
            return
        }
        loginUser({ email })
        toast.success(`Signed in as ${email}`)
        router.push('/user/events')
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-indigo-50/60 via-slate-50 to-slate-50">
            <div className="max-w-md w-full mx-auto">
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl mx-auto mb-4 shadow-inner">
                            🎟️
                        </div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Attendee Sign-In</h1>
                        <p className="text-slate-500 text-xs mt-1.5">
                            Connect your Web3 crypto wallet to purchase & view NFT tickets
                        </p>
                    </div>

                    {/* Web3 Wallet Method */}
                    <div className="space-y-4">
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                                Web3 Wallet Connection
                            </label>
                            
                            <div className="flex justify-center mb-2">
                                <WalletConnect />
                            </div>

                            {isConnected ? (
                                <div className="mt-3">
                                    <p className="text-xs text-emerald-600 font-semibold mb-3 flex items-center justify-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Wallet Connected
                                    </p>
                                    <button
                                        onClick={() => router.push('/user/events')}
                                        className="w-full py-3 px-4 rounded-xl btn-gradient font-bold text-xs shadow-md"
                                    >
                                        Proceed to Events Catalog →
                                    </button>
                                </div>
                            ) : (
                                <p className="text-[11px] text-slate-400 mt-2">
                                    Supports MetaMask, Coinbase Wallet, Rainbow & Injected Web3 Wallets
                                </p>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="flex items-center my-6">
                            <div className="flex-1 border-t border-slate-200"></div>
                            <span className="px-3 text-xs text-slate-400 font-medium uppercase">Or Attendee Email</span>
                            <div className="flex-1 border-t border-slate-200"></div>
                        </div>

                        {/* Email Sign In */}
                        <form onSubmit={handleContinueWithEmail} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="attendee@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
                            >
                                Continue with Email →
                            </button>
                        </form>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-2">
                        <Link href="/admin/login" className="block text-xs font-semibold text-purple-600 hover:text-purple-700">
                            Are you an Organizer? Switch to Admin Login →
                        </Link>
                        <Link href="/" className="block text-xs text-slate-400 hover:text-slate-600">
                            ← Return to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
