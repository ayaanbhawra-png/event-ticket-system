'use client'

import { useEffect, useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import toast from 'react-hot-toast'
import { contractABI, contractAddress } from '@/lib/contract'

interface Event {
    id: string
    name: string
    description: string
    venue: string
    location: string
    totalTickets: string
    ticketsSold: string
    startDate: number
    isActive: boolean
    tiers?: Array<{  // ← Made optional with '?'
        name: string
        price: string
        maxSupply: string
        sold: string
    }>
}

export default function UserEvents() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [selectedTier, setSelectedTier] = useState<number>(0)
    const [searchQuery, setSearchQuery] = useState('')
    const { address, isConnected } = useAccount()

    const { writeContract, data: hash, isPending } = useWriteContract()
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

    useEffect(() => {
        fetchEvents()
    }, [])

    useEffect(() => {
        if (hash) {
            toast.success('Ticket purchase submitted to blockchain!')
        }
    }, [hash])

    useEffect(() => {
        if (isConfirmed) {
            toast.success('🎉 Transaction confirmed! Your ticket is in "My Tickets".')
            setSelectedEvent(null)
            fetchEvents()
        }
    }, [isConfirmed])

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/events')
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

    // ============================================
    // Direct Ethers Transaction (Fallback)
    // ============================================
    const handleMintAndPay = async () => {
        try {
            console.log('🟢 === MINT & PAY (Direct Ethers) ===');
            
            // Check if MetaMask is installed
            if (!window.ethereum) {
                toast.error('MetaMask is not installed');
                return;
            }

            if (!selectedEvent) {
                toast.error('Please select an event');
                return;
            }

            // 🔥 FIX: Use default tier if tiers array is missing
            const tier = selectedEvent.tiers?.[selectedTier] ?? {
                name: 'Standard Admission',
                price: '0.01',
                maxSupply: '100',
                sold: '0'
            };

            console.log('🟢 Event ID:', selectedEvent.id);
            console.log('🟢 Tier Index:', selectedTier);
            console.log('🟢 Tier:', tier);
            console.log('🟢 Price:', tier.price);

            // Import ethers dynamically to avoid SSR issues
            const { ethers } = await import('ethers');
            
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            
            console.log('🟢 Signer address:', await signer.getAddress());

            // Get the contract
            const contract = new ethers.Contract(
                contractAddress,
                contractABI,
                signer
            );

            console.log('🟢 Calling purchaseTicket...');
            
            const tx = await contract.purchaseTicket(
                BigInt(selectedEvent.id),
                BigInt(selectedTier),
                {
                    value: ethers.parseEther(tier.price),
                    gasLimit: 500000
                }
            );

            console.log('🟢 Transaction sent:', tx.hash);
            toast.success('Transaction sent! Waiting for confirmation...');

            const receipt = await tx.wait();
            console.log('🟢 Transaction confirmed:', receipt);
            toast.success('🎉 Ticket purchased successfully!');

            setSelectedEvent(null);
            fetchEvents();

        } catch (error: any) {
            console.error('🔴 Purchase failed:', error);
            toast.error(
                error?.reason ||
                error?.shortMessage ||
                error?.message ||
                'Transaction failed'
            );
        }
    };

    const filteredEvents = events.filter((e) =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.location && e.location.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600 font-medium">Fetching verified events...</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Explore <span className="gradient-text">Live Events</span>
                    </h1>
                    <p className="text-slate-600 text-sm mt-1">
                        Secure your verifiable NFT tickets backed by smart contracts
                    </p>
                </div>

                {/* Search Bar */}
                <div className="w-full md:w-72">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search events or venues..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                        />
                        <span className="absolute left-3.5 top-3 text-slate-400 text-sm">🔍</span>
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            {filteredEvents.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-xs max-w-xl mx-auto">
                    <div className="text-5xl mb-3">🎟️</div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">No Events Found</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto">
                        {searchQuery ? 'No events matching your search terms.' : 'There are currently no active events available for purchase.'}
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => {
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
                                    {/* Card Header & Status */}
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                            Event #{event.id}
                                        </span>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                            event.isActive
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                : 'bg-rose-50 text-rose-700 border border-rose-100'
                                        }`}>
                                            {event.isActive ? '● Booking Open' : '● Closed'}
                                        </span>
                                    </div>

                                    {/* Event Title */}
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-1">
                                        {event.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                                        {event.description || 'Join this exciting event on TicketBlock!'}
                                    </p>

                                    {/* Event Details Grid */}
                                    <div className="space-y-2.5 text-xs text-slate-600 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-indigo-500">📍</span>
                                            <span className="font-medium text-slate-800">{event.venue}</span>
                                            {event.location && event.location !== event.venue && (
                                                <span className="text-slate-400">({event.location})</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-indigo-500">📅</span>
                                            <span className="font-medium text-slate-800">{formattedDate}</span>
                                        </div>
                                    </div>

                                    {/* Capacity Progress Bar */}
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-slate-500">Capacity Sold</span>
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

                                {/* Purchase CTA Button */}
                                <div className="p-6 pt-0">
                                    <button
                                        onClick={() => {
                                            setSelectedEvent(event)
                                            setSelectedTier(0)
                                        }}
                                        disabled={!event.isActive}
                                        className="w-full py-3 px-4 rounded-xl btn-gradient font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <span>🎟️</span>
                                        <span>Get Ticket</span>
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Purchase Ticket Modal Dialog */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 transform transition-all scale-100">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Purchase Pass</span>
                                <h2 className="text-xl font-bold text-slate-900 mt-0.5">{selectedEvent.name}</h2>
                            </div>
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Tier Selection */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                                    Select Ticket Tier
                                </label>
                                {selectedEvent.tiers && selectedEvent.tiers.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedEvent.tiers.map((tier, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => setSelectedTier(idx)}
                                                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                                                    selectedTier === idx
                                                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                                                        : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                            >
                                                <div>
                                                    <p className="font-semibold text-sm text-slate-800">{tier.name}</p>
                                                    <p className="text-xs text-slate-500">
                                                        {tier.sold || '0'} / {tier.maxSupply || '∞'} minted
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-indigo-600">{tier.price} ETH</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                                        Standard Admission (Default Tier)
                                    </div>
                                )}
                            </div>

                            {/* Price Summary */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-600">Total Due:</span>
                                <span className="text-lg font-extrabold text-indigo-700">
                                    {selectedEvent.tiers?.[selectedTier]?.price ?? '0.01'} ETH
                                </span>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleMintAndPay}
                                    disabled={isPending || isConfirming}
                                    className="flex-1 py-3 px-4 rounded-xl btn-gradient font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isPending || isConfirming ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Confirming on Chain...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>💳</span>
                                            <span>Mint & Pay ETH</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>

                            {hash && (
                                <p className="text-[11px] text-slate-400 font-mono truncate text-center pt-1">
                                    Tx: {hash}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}