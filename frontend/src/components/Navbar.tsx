'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import WalletConnect from './WalletConnect'

export default function Navbar() {
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Events', href: '/user/events' },
        { name: 'My Tickets', href: '/user/tickets' },
        { name: 'Admin Dashboard', href: '/admin' },
        { name: 'Manage Events', href: '/admin/events' },
        { name: 'Verify QR', href: '/admin/verify' },
    ]

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Brand Logo */}
                    <div className="flex items-center space-x-8">
                        <Link
                            href="/"
                            className="flex items-center gap-2.5 group transition-transform hover:scale-105"
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
                                <span className="text-xl">🎫</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-extrabold text-lg bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 bg-clip-text text-transparent leading-tight tracking-tight">
                                    TicketBlock
                                </span>
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-500">
                                    Web3 Verification
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <nav className="hidden lg:flex items-center space-x-1">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                                                : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>

                    {/* Right side Actions */}
                    <div className="flex items-center gap-3">
                        <WalletConnect />

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-colors"
                            aria-label="Toggle Navigation Menu"
                        >
                            {mobileMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top-2">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${isActive
                                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                        : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        )
                    })}
                </div>
            )}
        </header>
    )
}
