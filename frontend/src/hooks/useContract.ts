'use client'

import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { contractABI, contractAddress } from '@/lib/contract'
import { parseEther } from 'viem'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export function useTicketContract() {
    const { address } = useAccount()
    const [isLoading, setIsLoading] = useState(false)

    // Write: Purchase ticket
    const {
        writeContract: purchaseTicketWrite,
        data: purchaseData,
        isPending: isPurchasing,
        error: purchaseError
    } = useWriteContract()

    const purchaseTicket = async (eventId: number, tierIndex: number, price: string) => {
        if (!address) {
            toast.error('Please connect your wallet first')
            return
        }

        try {
            setIsLoading(true)
            purchaseTicketWrite({
                address: contractAddress,
                abi: contractABI,
                functionName: 'purchaseTicket',
                args: [BigInt(eventId), BigInt(tierIndex)],
                value: parseEther(price),
            })
        } catch (error) {
            console.error('Purchase error:', error)
            toast.error('Failed to purchase ticket')
        } finally {
            setIsLoading(false)
        }
    }

    // Wait for purchase transaction
    const { isLoading: isConfirmingPurchase, isSuccess: purchaseSuccess } =
        useWaitForTransactionReceipt({
            hash: purchaseData,
        })

    // Write: Verify ticket
    const {
        writeContract: verifyTicketWrite,
        data: verifyData,
        isPending: isVerifying,
        error: verifyError
    } = useWriteContract()

    const verifyTicket = async (ticketId: number, verifierAddress: string) => {
        try {
            setIsLoading(true)
            verifyTicketWrite({
                address: contractAddress,
                abi: contractABI,
                functionName: 'verifyTicket',
                args: [BigInt(ticketId), verifierAddress as `0x${string}`],
            })
        } catch (error) {
            console.error('Verification error:', error)
            toast.error('Failed to verify ticket')
        } finally {
            setIsLoading(false)
        }
    }

    // Wait for verification transaction
    const { isLoading: isConfirmingVerify, isSuccess: verifySuccess } =
        useWaitForTransactionReceipt({
            hash: verifyData,
        })

    // Show toast for purchase status
    useEffect(() => {
        if (purchaseSuccess) {
            toast.success('🎉 Ticket purchased successfully!')
        }
    }, [purchaseSuccess])

    useEffect(() => {
        if (purchaseError) {
            toast.error(purchaseError.message || 'Purchase failed')
        }
    }, [purchaseError])

    // Show toast for verification status
    useEffect(() => {
        if (verifySuccess) {
            toast.success('✅ Ticket verified successfully!')
        }
    }, [verifySuccess])

    useEffect(() => {
        if (verifyError) {
            toast.error(verifyError.message || 'Verification failed')
        }
    }, [verifyError])

    return {
        purchaseTicket,
        isPurchasing: isPurchasing || isLoading || isConfirmingPurchase,
        purchaseSuccess,
        verifyTicket,
        isVerifying: isVerifying || isLoading || isConfirmingVerify,
        verifySuccess,
        isLoading,
    }
}