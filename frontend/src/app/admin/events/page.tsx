'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import AdminGuard from '@/components/AdminGuard'
import { contractABI, contractAddress } from '@/lib/contract'

interface Event {
    id: string
    name: string
    description: string
    venue: string
    totalTickets: string
    ticketsSold: string
    startDate: number
    isActive: boolean
}

export default function AdminEvents() {
    return (
        <AdminGuard>
            <AdminEventsContent />
        </AdminGuard>
    )
}

function AdminEventsContent() {
    const router = useRouter()
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [withdrawingId, setWithdrawingId] = useState<string | null>(null)

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050'
            const response = await fetch(`${apiUrl}/api/admin/events`)
            const data = await response.json()
            if (data.success) {
                setEvents(data.events || [])
            }
        } catch (error) {
            console.error('Error fetching events:', error)
            toast.error('Failed to load events from backend')
        } finally {
            setLoading(false)
        }
    }

    const handleWithdrawRevenue = async (eventId: string) => {
        try {
            if (!window.ethereum) {
                toast.error('MetaMask is not installed')
                return
            }
            setWithdrawingId(eventId)
            const { ethers } = await import('ethers')
            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner()

            const contract = new ethers.Contract(
                contractAddress,
                contractABI,
                signer
            )

            toast.loading('Claiming ticket sales ETH to your wallet...', { id: 'withdraw' })
            const tx = await contract.withdrawEventRevenue(BigInt(eventId))
            await tx.wait()

            toast.success('🎉 Event revenue successfully withdrawn to your wallet!', { id: 'withdraw' })
            fetchEvents()
        } catch (error: any) {
            console.error('Withdraw error:', error)
            toast.error(
                error?.reason ||
                error?.shortMessage ||
                error?.message ||
                'Withdrawal failed or no revenue to claim',
                { id: 'withdraw' }
            )
        } finally {
            setWithdrawingId(null)
        }
    }

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600 font-medium">Fetching organizer events...</p>
            </div>
        )
    }

    const totalSoldAcrossEvents = events.reduce((acc, ev) => acc + (parseInt(ev.ticketsSold) || 0), 0)

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Organizer <span className="gradient-text">Event Management</span>
                    </h1>
                    <p className="text-slate-600 text-sm mt-1">
                        Monitor live sales volume, capacities, gate access verification, and withdraw earned ticket ETH
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin"
                        className="px-5 py-2.5 rounded-xl btn-gradient font-semibold text-sm shadow-sm flex items-center gap-2"
                    >
                        <span>+</span>
                        <span>Create New Event</span>
                    </Link>
                </div>
            </div>

            {/* Organizer Overview Stats Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl">
                        📋
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Managed Events</p>
                        <p className="text-2xl font-extrabold text-slate-900">{events.length}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl">
                        🎟️
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tickets Sold</p>
                        <p className="text-2xl font-extrabold text-indigo-700">{totalSoldAcrossEvents}</p>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
                        💰
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">On-Chain Payout Status</p>
                        <p className="text-sm font-bold text-emerald-700">Direct Contract Earnings</p>
                    </div>
                </div>
            </div>

            {/* Events Content */}
            {events.length === 0 ? (
                <div className="text-center py-16 px-6 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-lg mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl mx-auto mb-4">
                        📋
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Events Created Yet</h3>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
                        Deploy your first smart-contract powered event to start selling tickets.
                    </p>
                    <button
                        onClick={() => router.push('/admin')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-gradient font-semibold text-sm"
                    >
                        <span>Deploy First Event</span>
                        <span>→</span>
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => {
                        const total = parseInt(event.totalTickets) || 1
                        const sold = parseInt(event.ticketsSold) || 0
                        const percentSold = Math.min(100, Math.round((sold / total) * 100))
                        const formattedDate = new Date(event.startDate * 1000).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })

                        return (
                            <div
                                key={event.id}
                                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                            ID #{event.id}
                                        </span>
                                        <span
                                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                event.isActive
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                    : 'bg-rose-50 text-rose-700 border border-rose-100'
                                            }`}
                                        >
                                            {event.isActive ? '● Active' : '● Inactive'}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-1">
                                        {event.name}
                                    </h3>
                                    <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                                        {event.description || 'Smart contract ticket event'}
                                    </p>

                                    <div className="space-y-2.5 text-xs text-slate-600 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-indigo-500">📍</span>
                                            <span className="font-medium text-slate-800 truncate">{event.venue}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-indigo-500">📅</span>
                                            <span className="font-medium text-slate-800">{formattedDate}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-slate-500">Tickets Claimed</span>
                                            <span className="text-slate-800 font-semibold">{sold} / {total} ({percentSold}%)</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                                                style={{ width: `${percentSold}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 pt-0 space-y-2">
                                    <button
                                        onClick={() => handleWithdrawRevenue(event.id)}
                                        disabled={withdrawingId === event.id}
                                        className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-emerald-200/80 disabled:opacity-50"
                                    >
                                        <span>💰</span>
                                        <span>{withdrawingId === event.id ? 'Claiming ETH...' : 'Withdraw Event Revenue'}</span>
                                    </button>

                                    <button
                                        onClick={() => router.push('/admin/verify')}
                                        className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                                    >
                                        <span>📷</span>
                                        <span>Verify Tickets at Gate</span>
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}