import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import {
    metaMaskWallet,
    injectedWallet,
    coinbaseWallet,
    rainbowWallet,
    walletConnectWallet,
    trustWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { http } from 'wagmi'
import { hardhat, sepolia, polygonAmoy } from 'wagmi/chains'

const localRpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'http://127.0.0.1:8545'

// Define Localhost / Ganache chain
export const localChain = {
    id: 1337,
    name: 'Localhost',
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
    },
    rpcUrls: {
        default: {
            http: [localRpcUrl]
        },
        public: {
            http: [localRpcUrl]
        }
    },
    testnet: true,
} as const

export const ganacheChain = localChain

export const config = getDefaultConfig({
    appName: 'TicketBlock',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '3a8170812b534d0ff9d794f168fa2d7d',
    chains: [localChain, hardhat, sepolia, polygonAmoy],
    wallets: [
        {
            groupName: 'Popular',
            wallets: [
                metaMaskWallet,
                injectedWallet,
                coinbaseWallet,
                rainbowWallet,
                walletConnectWallet,
                trustWallet,
            ],
        },
    ],
    transports: {
        [localChain.id]: http(localRpcUrl),
        [hardhat.id]: http(localRpcUrl),
        [sepolia.id]: http(),
        [polygonAmoy.id]: http(),
    },
    ssr: true,
})

export const isLocalNetwork = (chainId?: number) => {
    return chainId === hardhat.id || chainId === localChain.id
}