'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import AdminGuard from '@/components/AdminGuard'

export default function AdminDashboard() {
    return (
        <AdminGuard>
            <AdminDashboardContent />
        </AdminGuard>
    )
}

function AdminDashboardContent() {
    const router = useRouter()
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        venue: '',
        location: '',
        totalTickets: '100',
        metadataURI: 'ipfs://default-event',
        royaltyPercentage: '500', // 5%
        tierName: 'General Admission',
        tierPrice: '0.01',
        tierMaxSupply: '100',
        tierMaxPerUser: '4'
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name || !formData.startDate || !formData.endDate || !formData.venue) {
            toast.error('Please fill in all required fields')
            return
        }

        try {
            setSubmitting(true)
            const startTimestamp = Math.floor(new Date(formData.startDate).getTime() / 1000)
            const endTimestamp = Math.floor(new Date(formData.endDate).getTime() / 1000)

            if (startTimestamp <= Math.floor(Date.now() / 1000)) {
                toast.error('Start date must be in the future')
                setSubmitting(false)
                return
            }

            if (endTimestamp <= startTimestamp) {
                toast.error('End date must be after start date')
                setSubmitting(false)
                return
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050'
            const response = await fetch(`${apiUrl}/api/admin/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    startDate: startTimestamp,
                    endDate: endTimestamp,
                    venue: formData.venue,
                    location: formData.location || formData.venue,
                    totalTickets: parseInt(formData.totalTickets) || 100,
                    metadataURI: formData.metadataURI || 'ipfs://default-event',
                    royaltyPercentage: parseInt(formData.royaltyPercentage) || 500
                })
            })

            const data = await response.json()
            if (data.success && data.eventId) {
                toast.success('🎉 Event created successfully!')
                
                // Add initial tier if configured
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050'
                    await fetch(`${apiUrl}/api/admin/tiers`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            eventId: data.eventId,
                            name: formData.tierName || 'General',
                            price: formData.tierPrice || '0.01',
                            maxSupply: parseInt(formData.tierMaxSupply) || 100,
                            maxPerUser: parseInt(formData.tierMaxPerUser) || 4
                        })
                    })
                } catch (tierErr) {
                    console.error('Tier addition error:', tierErr)
                }

                router.push('/admin/events')
            } else {
                toast.error(data.error || 'Failed to create event')
            }
        } catch (error) {
            console.error('Create event error:', error)
            toast.error('Failed to connect to backend server. Make sure the backend is running on port 5000.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header with Quick Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Organizer <span className="gradient-text">Admin Panel</span>
                    </h1>
                    <p className="text-slate-600 text-sm mt-1">
                        Deploy new events, configure ticket tiers, and verify entry passes
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/events"
                        className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-200 font-semibold text-sm shadow-xs transition-colors flex items-center gap-1.5"
                    >
                        <span>📋</span>
                        <span>Manage Events</span>
                    </Link>
                    <Link
                        href="/admin/verify"
                        className="px-4 py-2.5 rounded-xl btn-gradient font-semibold text-sm shadow-xs transition-all flex items-center gap-1.5"
                    >
                        <span>📷</span>
                        <span>Verify Gate QR</span>
                    </Link>
                </div>
            </div>

            {/* Main Form Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
                        ✨
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Publish New Event</h2>
                        <p className="text-xs text-slate-500">Configure event details and ticket pricing tiers for on-chain deployment</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* General Information */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b border-indigo-100 pb-2">
                            1. Event Overview
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Event Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Ethereum Global Summit 2026"
                                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Description & Details
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Provide comprehensive details regarding the event, keynote speakers, agendas..."
                                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Date & Location */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b border-indigo-100 pb-2">
                            2. Date & Venue
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Start Date & Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                    End Date & Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Venue Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.venue}
                                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                    placeholder="e.g. Grand Exhibition Arena"
                                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                    City / Location
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="e.g. San Francisco, CA"
                                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Capacity & Economics */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b border-indigo-100 pb-2">
                            3. Capacity & Royalties
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Total Ticket Supply *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={formData.totalTickets}
                                    onChange={(e) => setFormData({ ...formData, totalTickets: e.target.value })}
                                    placeholder="100"
                                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Secondary Royalty (bps, 500 = 5%)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="1000"
                                    value={formData.royaltyPercentage}
                                    onChange={(e) => setFormData({ ...formData, royaltyPercentage: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Initial Tier Setup */}
                    <div className="space-y-4 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                            4. Initial Ticket Tier Configuration
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                                    Tier Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.tierName}
                                    onChange={(e) => setFormData({ ...formData, tierName: e.target.value })}
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                                    Price (ETH)
                                </label>
                                <input
                                    type="text"
                                    value={formData.tierPrice}
                                    onChange={(e) => setFormData({ ...formData, tierPrice: e.target.value })}
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                                    Tier Supply
                                </label>
                                <input
                                    type="number"
                                    value={formData.tierMaxSupply}
                                    onChange={(e) => setFormData({ ...formData, tierMaxSupply: e.target.value })}
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                                    Max / Wallet
                                </label>
                                <input
                                    type="number"
                                    value={formData.tierMaxPerUser}
                                    onChange={(e) => setFormData({ ...formData, tierMaxPerUser: e.target.value })}
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-8 py-3.5 rounded-xl btn-gradient font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-all"
                        >
                            {submitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Deploying Event...</span>
                                </>
                            ) : (
                                <>
                                    <span>🚀</span>
                                    <span>Deploy & Publish Event</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}