'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

interface AdminGuardProps {
    children: React.ReactNode
}

export default function AdminGuard({ children }: AdminGuardProps) {
    const { isAdmin, adminUser } = useAuth()
    const router = useRouter()
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        // Allow state to hydrate
        const timer = setTimeout(() => {
            setChecking(false)
            if (!isAdmin) {
                router.push('/admin/login')
            }
        }, 150)

        return () => clearTimeout(timer)
    }, [isAdmin, router])

    if (checking) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-medium text-slate-500">Checking Organizer Authorization...</p>
            </div>
        )
    }

    if (!isAdmin) {
        return (
            <div className="max-w-md mx-auto px-4 py-20 text-center">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
                    <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                        🔒
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Restricted Admin Area</h2>
                    <p className="text-sm text-slate-600 mb-6">
                        You must be logged in with Organizer / Admin credentials to access event management tools.
                    </p>
                    <Link
                        href="/admin/login"
                        className="inline-block w-full py-3 px-4 rounded-xl btn-gradient font-semibold text-sm shadow-md"
                    >
                        Go to Admin Login →
                    </Link>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
