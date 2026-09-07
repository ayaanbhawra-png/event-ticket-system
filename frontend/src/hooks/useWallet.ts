'use client'
 
import { useAccount, useConnect, useDisconnect, useBalance, useSwitchChain } from 'wagmi'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
 
export function useWallet() {
    const { address, isConnected, isConnecting, status, chain, chainId } = useAccount()
    const { connectors, connect, error: connectError, isPending: isConnectingWallet } = useConnect()
    const { disconnect } = useDisconnect()
    const { data: balance, refetch: refetchBalance } = useBalance({
        address: address,
    })
    const { switchChain } = useSwitchChain()
 
    const [isLoading, setIsLoading] = useState(false)
 
    useEffect(() => {
        const savedConnection = localStorage.getItem('walletConnected')
        if (savedConnection === 'true' && !isConnected && connectors.length > 0) {
            const connector = connectors[0]
            if (connector) {
                connect({ connector })
            }
        }
    }, [connect, connectors, isConnected])
 
    useEffect(() => {
        if (isConnected) {
            localStorage.setItem('walletConnected', 'true')
        } else {
            localStorage.removeItem('walletConnected')
        }
    }, [isConnected])
 
    useEffect(() => {
        if (connectError) {
            toast.error(connectError.message || 'Failed to connect wallet')
        }
    }, [connectError])
 
    const connectWallet = async (connectorIndex: number = 0) => {
        try {
            setIsLoading(true)
            const connector = connectors[connectorIndex] || connectors[0]
            if (connector) {
                connect({ connector })
            } else {
                toast.error('No wallet connector found')
            }
        } catch (error) {
            console.error('Connection error:', error)
            toast.error('Failed to connect wallet')
        } finally {
            setIsLoading(false)
        }
    }
 
    const disconnectWallet = () => {
        disconnect()
        localStorage.removeItem('walletConnected')
        toast.success('Wallet disconnected')
    }
 
    const switchToNetwork = (targetChainId: number) => {
        if (switchChain) {
            switchChain({ chainId: targetChainId })
        } else {
            toast.error('Unable to switch network. Please switch manually in your wallet.')
        }
    }
 
    const getShortAddress = (addr?: string) => {
        if (!addr) return ''
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }
 
    const getFormattedBalance = () => {
        if (!balance) return '0'
        return Number.parseFloat(balance.formatted).toFixed(4)
    }
 
    return {
        address,
        isConnected,
        isConnecting: isConnecting || isConnectingWallet || isLoading,
        status,
        balance,
        formattedBalance: getFormattedBalance(),
        shortAddress: getShortAddress(address),
        chain,
        chainId: chainId ?? chain?.id,
        chainName: chain?.name,
        connectWallet,
        disconnectWallet,
        switchToNetwork,
        refetchBalance,
        getShortAddress,
        getFormattedBalance,
        connectors,
    }
}