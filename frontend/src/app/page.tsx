'use client'

import Link from 'next/link'

export default function Home() {
    return (
        <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-purple-50/40 to-slate-50 min-h-screen">
            {/* Background Decorative Blur Orbs */}
            <div className="absolute top-12 left-1/4 w-96 h-96 bg-indigo-300/25 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow"></div>
            <div className="absolute top-48 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-indigo-200/80 shadow-xs mb-8 text-xs font-semibold text-indigo-700 tracking-wide uppercase">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <span>Decentralized & Fraud-Proof Ticketing</span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                        The Future of <span className="gradient-text">Event Ticketing</span> on Blockchain
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-10">
                        Eliminate counterfeit tickets, secure transparent event access, and verify attendee check-ins instantly with on-chain cryptographic signatures.
                    </p>

                    {/* Quick Call-to-Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Link 
                            href="/user/events" 
                            className="w-full sm:w-auto px-8 py-3.5 rounded-xl btn-gradient font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-[1.02]"
                        >
                            <span>Explore Events</span>
                            <span>→</span>
                        </Link>
                        <Link 
                            href="/admin" 
                            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-200 font-semibold text-base shadow-sm hover:shadow transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                        >
                            <span>Organizer Portal</span>
                            <span>🔐</span>
                        </Link>
                    </div>
                </div>

                {/* Key Value Propositions Grid */}
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
                    <div className="glass-card glass-card-hover p-6 rounded-2xl border border-white/80 shadow-sm relative overflow-hidden group">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                            🔗
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Blockchain Powered</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Every ticket is minted as a verifiable digital asset on Ethereum, ensuring guaranteed authenticity and immutability.
                        </p>
                    </div>

                    <div className="glass-card glass-card-hover p-6 rounded-2xl border border-white/80 shadow-sm relative overflow-hidden group">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                            🛡️
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">100% Anti-Fraud</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            No duplicate copies or unauthorized scalping. Direct cryptographic ownership linked directly to the buyer's wallet.
                        </p>
                    </div>

                    <div className="glass-card glass-card-hover p-6 rounded-2xl border border-white/80 shadow-sm relative overflow-hidden group">
                        <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                            ⚡
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Instant QR Check-in</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Organizers can scan dynamically signed QR codes at venue doors with single-second validation and instant status sync.
                        </p>
                    </div>
                </div>

                {/* Interactive Portal Hub Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
                    {/* Buyer Portal Card */}
                    <Link href="/user/events" className="group">
                        <div className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between group-hover:-translate-y-1">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full pointer-events-none"></div>
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                    🎟️
                                </div>
                                <div className="inline-block px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-2">
                                    Attendees & Fans
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                    Browse & Buy Tickets
                                </h2>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                    Explore upcoming music concerts, tech conferences, and sports events. Connect your wallet to purchase tickets with zero intermediaries.
                                </p>
                            </div>
                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-indigo-600 font-semibold text-sm">
                                <span>Browse Events Collection</span>
                                <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                            </div>
                        </div>
                    </Link>

                    {/* Organizer Portal Card */}
                    <Link href="/admin" className="group">
                        <div className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between group-hover:-translate-y-1">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full pointer-events-none"></div>
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                                    🔐
                                </div>
                                <div className="inline-block px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-semibold uppercase tracking-wider mb-2">
                                    Event Organizers
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">
                                    Organizer Management
                                </h2>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                    Publish smart contracts for your events, configure custom pricing tiers, track ticket sales, and verify attendee QR entry passes.
                                </p>
                            </div>
                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-purple-600 font-semibold text-sm">
                                <span>Access Admin Dashboard</span>
                                <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Footer Section */}
                <div className="mt-12 text-center border-t border-slate-200/80 pt-8 text-sm text-slate-500">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="font-medium text-slate-600">Smart Contract System Live & Ready</span>
                    </div>
                    <p>© 2026 TicketBlock Verification Protocol. Powered by Wagmi, Viem, and Next.js.</p>
                </div>
            </div>
        </div>
    )
}