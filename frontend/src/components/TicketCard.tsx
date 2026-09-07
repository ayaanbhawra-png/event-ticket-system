'use client'

import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface TicketData {
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

interface TicketCardProps {
    ticket: TicketData
    onVerify?: (ticketId: string) => void
}

export default function TicketCard({ ticket, onVerify }: TicketCardProps) {
    const [showQR, setShowQR] = useState(false)

    // Base64 encoded payload format for QR verification scanner
    const qrData = btoa(JSON.stringify({
        ticketId: ticket.id,
        eventName: ticket.eventName,
        timestamp: Date.now(),
        hash: btoa(ticket.id + ticket.eventName + Date.now())
    }))

    const handleCopyTicketId = () => {
        navigator.clipboard.writeText(ticket.id)
        toast.success('Ticket ID copied to clipboard!')
    }

    const getStatusConfig = () => {
        if (ticket.isUsed) {
            return {
                bg: 'bg-rose-50 border-rose-200 text-rose-700',
                badgeText: 'Used / Redeemed',
                icon: '⛔',
                headerGradient: 'from-rose-500/10 to-transparent'
            }
        }
        if (ticket.isValid) {
            return {
                bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
                badgeText: 'Valid Entry Pass',
                icon: '✓',
                headerGradient: 'from-emerald-500/10 to-transparent'
            }
        }
        return {
            bg: 'bg-amber-50 border-amber-200 text-amber-700',
            badgeText: 'Verification Pending',
            icon: '⚠️',
            headerGradient: 'from-amber-500/10 to-transparent'
        }
    }

    const status = getStatusConfig()
    const formattedDate = new Date(ticket.eventDate * 1000).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })

    return (
        <div className="ticket-stub bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200/80 overflow-hidden flex flex-col justify-between group">
            {/* Top Ticket Header Banner */}
            <div className={`p-5 pb-4 bg-gradient-to-r ${status.headerGradient} border-b border-dashed border-slate-200`}>
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                {ticket.tierName || 'General'}
                            </span>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${status.bg} flex items-center gap-1`}>
                                <span>{status.icon}</span>
                                <span>{status.badgeText}</span>
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {ticket.eventName}
                        </h3>
                    </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 truncate">
                        <span className="text-indigo-500">📍</span>
                        <span className="truncate">{ticket.venue}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                        <span className="text-indigo-500">📅</span>
                        <span className="truncate">{formattedDate}</span>
                    </div>
                </div>
            </div>

            {/* Middle Ticket Info Stub */}
            <div className="p-5 space-y-4">
                <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 grid grid-cols-2 gap-3 text-xs">
                    <div>
                        <span className="text-slate-400 font-medium block mb-0.5">Ticket ID</span>
                        <button
                            onClick={handleCopyTicketId}
                            className="font-mono text-slate-700 hover:text-indigo-600 flex items-center gap-1 font-semibold transition-colors"
                            title="Click to copy full ID"
                        >
                            <span>#{ticket.id ? (ticket.id.length > 10 ? `${ticket.id.slice(0, 6)}...${ticket.id.slice(-4)}` : ticket.id) : '0'}</span>
                            <span className="text-[10px] text-slate-400">📋</span>
                        </button>
                    </div>
                    <div>
                        <span className="text-slate-400 font-medium block mb-0.5">Price Paid</span>
                        <span className="font-bold text-indigo-700">{ticket.price} ETH</span>
                    </div>
                    {ticket.owner && (
                        <div className="col-span-2 pt-1 border-t border-slate-200/60">
                            <span className="text-slate-400 font-medium block mb-0.5">Holder Address</span>
                            <span className="font-mono text-slate-600 text-[11px] truncate block">
                                {ticket.owner}
                            </span>
                        </div>
                    )}
                </div>

                {/* Actions & QR Code Toggle */}
                <div className="flex items-center gap-2.5">
                    <button
                        onClick={() => setShowQR(!showQR)}
                        className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                            showQR
                                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                        }`}
                    >
                        <span>📱</span>
                        <span>{showQR ? 'Hide Entry Pass' : 'Show Entry Pass'}</span>
                    </button>

                    {onVerify && !ticket.isUsed && ticket.isValid && (
                        <button
                            onClick={() => onVerify(ticket.id)}
                            className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                            <span>✓</span>
                            <span>Verify</span>
                        </button>
                    )}
                </div>

                {/* QR Code Reveal Container */}
                {showQR && (
                    <div className="pt-2 animate-in fade-in-50 duration-200">
                        <div className="bg-white p-4 rounded-2xl border-2 border-indigo-100 flex flex-col items-center justify-center shadow-inner">
                            <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-xs">
                                <QRCodeSVG
                                    value={qrData}
                                    size={160}
                                    level="H"
                                    includeMargin
                                    bgColor="#ffffff"
                                    fgColor="#312e81"
                                />
                            </div>
                            <p className="text-[11px] font-semibold text-slate-700 mt-2.5 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Present at gate for instant scanning
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                Token #{ticket.id}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}