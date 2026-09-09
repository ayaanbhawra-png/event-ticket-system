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
    tiers: Array<{
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
    const { address } = useAccount()

    const { writeContract, data: hash, isPending } = useWriteContract()
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

    useEffect(() => {
        fetchEvents()
    }, [])

    useEffect(() => {
        if (hash) {
            toast.success('Ticket purchase initiated!')
            setTimeout(fetchEvents, 5000)
        }
    }, [hash])

    const fetchEvents = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050'
            const response = await fetch(`${apiUrl}/api/events`)
            const data = await response.json()
            if (data.success) {
                setEvents(data.events || [])
            }
        } catch (error) {
            console.error('Error fetching events:', error)
            toast.error('Failed to load events')
        } finally {
            setLoading(false)
        }
    }

    const handlePurchaseTicket = async () => {
        if (!address) {
            toast.error('Please connect your wallet')
            return
        }

        if (!selectedEvent || selectedTier === undefined) {
            toast.error('Please select a ticket tier')
            return
        }

        const tier = selectedEvent.tiers[selectedTier]
        if (!tier) {
            toast.error('Invalid tier selected')
            return
        }

        try {
            writeContract({
                address: contractAddress,
                abi: contractABI,
                functionName: 'purchaseTicket',
                args: [BigInt(selectedEvent.id), BigInt(selectedTier)],
                value: parseEther(tier.price),
                gas: BigInt(500000) // ← FIXED: Added gas limit to prevent "gas limit exceeds cap" error
            })
        } catch (error) {
            console.error('Purchase error:', error)
            toast.error('Failed to purchase ticket')
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Loading events...</div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Events</h1>

            {events.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-md">
                    <p className="text-gray-500">No events available at the moment</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.name}</h3>
                                <p className="text-gray-600 text-sm mb-4">{event.description?.slice(0, 120)}...</p>
                                <div className="space-y-2 text-sm">
                                    <p className="text-gray-600"><span className="font-medium">📍</span> {event.venue}</p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">📅</span> {new Date(event.startDate * 1000).toLocaleDateString()}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">🎟️</span> {event.ticketsSold || 0}/{event.totalTickets} sold
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedEvent(event)
                                        setSelectedTier(0)
                                    }}
                                    className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Purchase Tickets
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Purchase Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold mb-4">{selectedEvent.name}</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Ticket Tier</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    value={selectedTier}
                                    onChange={(e) => setSelectedTier(parseInt(e.target.value))}
                                >
                                    {selectedEvent.tiers.map((tier, index) => (
                                        <option key={index} value={index}>
                                            {tier.name} - {tier.price} ETH ({tier.sold}/{tier.maxSupply})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Total:</span> {selectedEvent.tiers[selectedTier]?.price || 0} ETH
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handlePurchaseTicket}
                                    disabled={isPending || isConfirming}
                                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {isPending || isConfirming ? 'Processing...' : 'Purchase Ticket'}
                                </button>
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                            {hash && (
                                <p className="text-xs text-gray-500 mt-2">
                                    Transaction: {hash.slice(0, 20)}...{hash.slice(-8)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}