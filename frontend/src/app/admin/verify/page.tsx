'use client'

import { useState } from 'react'
import QRScanner from '@/components/QRScanner'
import toast from 'react-hot-toast'
import { useAccount } from 'wagmi'
import AdminGuard from '@/components/AdminGuard'

interface VerificationResult {
    isValid: boolean
    isUsed: boolean
    owner: string
    eventId: string
    ticketId: string
    eventName?: string
    tierName?: string
}

export default function AdminVerify() {
    return (
        <AdminGuard>
            <AdminVerifyContent />
        </AdminGuard>
    )
}

function AdminVerifyContent() {
    const { address } = useAccount()
    const [result, setResult] = useState<VerificationResult | null>(null)
    const [verifying, setVerifying] = useState(false)
    const [markingUsed, setMarkingUsed] = useState(false)
    const [manualTicketId, setManualTicketId] = useState('')

    const handleQRScan = async (rawQR: string) => {
        try {
            setVerifying(true)
            let qrPayload = rawQR

            // Try decoding base64 if encoded
            let parsedData: any = null
            try {
                parsedData = JSON.parse(atob(rawQR))
            } catch {
                try {
                    parsedData = JSON.parse(rawQR)
                } catch {
                    // raw string
                }
            }

            const ticketId = parsedData?.ticketId || rawQR

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050'
            const response = await fetch(`${apiUrl}/api/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ qrData: qrPayload })
            })

            const data = await response.json()
            if (data.success) {
                setResult({
                    ...data,
                    ticketId: String(ticketId),
                    eventName: data.eventName || parsedData?.eventName || 'Verified Event',
                    tierName: data.tierName || 'General Admission'
                })
                if (data.isValid && !data.isUsed) {
                    toast.success('✅ Ticket is 100% Valid and Authorized!')
                } else if (data.isUsed) {
                    toast.error('⛔ Ticket was ALREADY REDEEMED / USED!')
                } else {
                    toast.error('❌ Ticket is INVALID!')
                }
            } else {
                toast.error(data.error || 'Verification failed')
            }
        } catch (error) {
            console.error('Verification error:', error)
            toast.error('Failed to parse or verify QR code')
        } finally {
            setVerifying(false)
        }
    }

    const handleManualVerify = async () => {
        if (!manualTicketId.trim()) {
            toast.error('Please enter a ticket ID')
            return
        }

        try {
            setVerifying(true)
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050'
            const response = await fetch(`${apiUrl}/api/user/ticket/${manualTicketId.trim()}`)
            const data = await response.json()

            if (data.success && data.ticket) {
                setResult({
                    ...data.ticket,
                    ticketId: manualTicketId.trim()
                })
                if (data.ticket.isValid && !data.ticket.isUsed) {
                    toast.success('✅ Ticket is Valid and Unused!')
                } else if (data.ticket.isUsed) {
                    toast.error('⛔ Ticket is already marked as USED!')
                } else {
                    toast.error('❌ Ticket is INVALID!')
                }
            } else {
                toast.error(data.error || 'Ticket not found in system')
            }
        } catch (error) {
            console.error('Verification error:', error)
            toast.error('Failed to query ticket verification endpoint')
        } finally {
            setVerifying(false)
        }
    }

    const handleMarkAsUsed = async () => {
        if (!result) return
        try {
            setMarkingUsed(true)
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050'
            const response = await fetch(`${apiUrl}/api/admin/verify-ticket`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ticketId: parseInt(result.ticketId),
                    verifierAddress: address || '0x0000000000000000000000000000000000000000'
                })
            })
            const data = await response.json()
            if (data.success) {
                toast.success('🎉 Attendee checked in! Ticket marked as used on chain.')
                setResult({
                    ...result,
                    isUsed: true
                })
            } else {
                toast.error(data.error || 'Failed to mark ticket as used')
            }
        } catch (error) {
            console.error('Error verifying ticket:', error)
            toast.error('Failed to execute gate check-in')
        } finally {
            setMarkingUsed(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="mb-8 pb-6 border-b border-slate-200">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Gate Access <span className="gradient-text">Verification Center</span>
                </h1>
                <p className="text-slate-600 text-sm mt-1">
                    Scan cryptographic QR tickets or enter ticket IDs manually to grant entrance and update check-in status
                </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Left: Camera Scanner */}
                <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2.5 mb-4">
                            <span className="text-xl">📷</span>
                            <h2 className="text-lg font-bold text-slate-900">Live Camera QR Scanner</h2>
                        </div>
                        <QRScanner onScanSuccess={handleQRScan} />
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span>On-Chain Cryptographic Validator</span>
                        </span>
                        <span>Auto-decoding enabled</span>
                    </div>
                </div>

                {/* Right: Manual Entry & Live Verification Status */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Manual Input Box */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg">⌨️</span>
                            <h2 className="text-base font-bold text-slate-900">Manual ID Lookup</h2>
                        </div>
                        <p className="text-xs text-slate-500 mb-3">
                            In case of damaged phone screens, enter the numeric ticket token ID directly:
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="e.g. 1, 2, 3..."
                                className="flex-1 px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono"
                                value={manualTicketId}
                                onChange={(e) => setManualTicketId(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleManualVerify()}
                            />
                            <button
                                onClick={handleManualVerify}
                                disabled={verifying}
                                className="btn-gradient px-4 py-2.5 rounded-xl font-semibold text-xs transition-all disabled:opacity-50"
                            >
                                {verifying ? 'Checking...' : 'Verify'}
                            </button>
                        </div>
                    </div>

                    {/* Verification Result Card */}
                    {result ? (
                        <div
                            className={`p-6 rounded-3xl border-2 shadow-lg transition-all animate-in fade-in-50 ${
                                result.isValid && !result.isUsed
                                    ? 'bg-emerald-50/70 border-emerald-400 text-emerald-950'
                                    : result.isUsed
                                    ? 'bg-amber-50/70 border-amber-400 text-amber-950'
                                    : 'bg-rose-50/70 border-rose-400 text-rose-950'
                            }`}
                        >
                            <div className="flex items-center justify-between pb-3 border-b border-black/10 mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">
                                        {result.isValid && !result.isUsed ? '✅' : result.isUsed ? '⛔' : '❌'}
                                    </span>
                                    <h3 className="font-extrabold text-base">
                                        {result.isValid && !result.isUsed
                                            ? 'VALID PASS - ENTRY ALLOWED'
                                            : result.isUsed
                                            ? 'ALREADY USED / CHECKED IN'
                                            : 'INVALID TICKET PASS'}
                                    </h3>
                                </div>
                            </div>

                            <div className="space-y-2.5 text-xs font-medium">
                                <div className="flex justify-between py-1 border-b border-black/5">
                                    <span className="opacity-70">Ticket Token ID:</span>
                                    <span className="font-mono font-bold">#{result.ticketId}</span>
                                </div>
                                {result.eventName && (
                                    <div className="flex justify-between py-1 border-b border-black/5">
                                        <span className="opacity-70">Event:</span>
                                        <span className="font-bold">{result.eventName}</span>
                                    </div>
                                )}
                                {result.eventId && (
                                    <div className="flex justify-between py-1 border-b border-black/5">
                                        <span className="opacity-70">Event ID:</span>
                                        <span className="font-mono font-bold">#{result.eventId}</span>
                                    </div>
                                )}
                                {result.owner && (
                                    <div className="py-1 border-b border-black/5">
                                        <span className="opacity-70 block mb-0.5">Holder Address:</span>
                                        <span className="font-mono text-[10px] break-all block">
                                            {result.owner}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Mark As Used Action */}
                            <div className="mt-5">
                                {result.isValid && !result.isUsed ? (
                                    <button
                                        onClick={handleMarkAsUsed}
                                        disabled={markingUsed}
                                        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                                    >
                                        {markingUsed ? (
                                            <>
                                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Registering Gate Entry...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>✓</span>
                                                <span>Mark as Used (Admit Attendee)</span>
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <div className="text-center py-2.5 bg-black/5 rounded-xl text-xs font-semibold opacity-75">
                                        {result.isUsed ? 'Attendee already admitted' : 'Entry Forbidden'}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50/80 p-8 rounded-3xl border border-dashed border-slate-200 text-center text-slate-400">
                            <div className="text-3xl mb-2">🔍</div>
                            <p className="text-xs font-semibold text-slate-600">No ticket currently scanned</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Scan a QR code or enter an ID to view live status</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
