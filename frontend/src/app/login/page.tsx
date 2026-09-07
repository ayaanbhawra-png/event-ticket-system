'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useAccount } from 'wagmi'

export default function LoginGateway() {
    const { isAdmin, adminUser } = useAuth()
    const { isConnected, address } = useAccount()

    return (
        <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-indigo-50/50 via-purple-50/30 to-slate-50 overflow-hidden">
            {/* Background Blur Elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow"></div>

            <div className="max-w-4xl w-full mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-100 shadow-xs mb-4 text-xs font-semibold text-indigo-700">
                        <span>🔐</span>
                        <span>TicketBlock Authentication Gateway</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                        Choose Your <span className="gradient-text">Portal Sign-in</span>
                    </h1>
                    <p className="text-slate-600 text-sm max-w-md mx-auto">
                        Select your role below to access event ticket purchasing or organizer administrative controls.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    {/* User / Attendee Option */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
                        <div>
                            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:scale-105 transition-transform">
                                🎟️
                            </div>
                            <div className="inline-block px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
                                For Attendees
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                Attendee Sign-In
                            </h2>
                            <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                Connect your crypto wallet to browse verified events, purchase NFT passes, and access your QR entry tickets.
                            </p>

                            {isConnected && (
                                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    <span className="truncate">Wallet Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
                                </div>
                            )}
                        </div>

                        <Link
                            href="/user/login"
                            className="w-full py-3.5 px-4 rounded-xl btn-gradient font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20"
                        >
                            <span>Continue as Attendee</span>
                            <span>→</span>
                        </Link>
                    </div>

                    {/* Organizer / Admin Option */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
                        <div>
                            <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:scale-105 transition-transform">
                                🛡️
                            </div>
                            <div className="inline-block px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">
                                For Event Organizers
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">
                                Organizer & Admin Portal
                            </h2>
                            <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                Sign in with organizer credentials to publish new events, configure ticket tiers, and verify entry passes at venue gates.
                            </p>

                            {isAdmin && (
                                <div className="mb-4 p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-800 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                                    <span className="truncate">Logged in as {adminUser?.username}</span>
                                </div>
                            )}
                        </div>

                        <Link
                            href="/admin/login"
                            className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-slate-900/20 transition-colors"
                        >
                            <span>Organizer Access</span>
                            <span>🔐</span>
                        </Link>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
                        ← Back to Homepage
                    </Link>
                </div>
            </div>
        </div>
    )
}
