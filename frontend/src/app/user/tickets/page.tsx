'use client'

import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import TicketCard from '@/components/TicketCard'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Ticket {
    id: string
    eventName: string
    eventDate: number
    venue: string
    tierName: string
    price: string
    isUsed: boolean
    isValid: boolean
    owner?: string
    eventId?: string
}

export default function UserTickets() {
    const { address, isConnected } = useAccount()
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isConnected && address) {
            fetchUserTickets()
        } else {
            setLoading(false)
        }
    }, [isConnected, address])

    const fetchUserTickets = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/user/tickets/${address}`)
            const data = await response.json()
            if (data.success) {
                setTickets(data.tickets || [])
            }
        } catch (error) {
            console.error('Error fetching tickets:', error)
            toast.error('Failed to load your tickets')
        } finally {
            setLoading(false)
        }
    }

    if (!isConnected) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="text-center py-16 px-6 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-lg mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl mx-auto mb-4">
                        👛
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Connect Your Wallet</h2>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
                        Connect your Web3 wallet using the top navigation bar to view your purchased tickets.
                    </p>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600 font-medium">Loading your NFT tickets...</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        My <span className="gradient-text">Event Tickets</span>
                    </h1>
                    <p className="text-slate-600 text-sm mt-1">
                        Display and present your digital QR pass for gate check-in
                    </p>
                </div>

                <Link
                    href="/user/events"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-sm transition-colors self-start sm:self-auto"
                >
                    <span>+ Explore More Events</span>
                </Link>
            </div>

            {/* Tickets Grid or Empty State */}
            {tickets.length === 0 ? (
                <div className="text-center py-16 px-6 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-lg mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl mx-auto mb-4">
                        🎟️
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Tickets in Wallet</h3>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
                        You haven&apos;t purchased any event tickets yet on this account.
                    </p>
                    <Link
                        href="/user/events"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-gradient font-semibold text-sm"
                    >
                        <span>Browse Available Events</span>
                        <span>→</span>
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tickets.map((ticket) => (
                        <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                </div>
            )}
        </div>
    )
}