'use client'

import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function WalletConnect() {
    return (
        <div className="flex items-center">
            <ConnectButton
                showBalance={false}
                chainStatus="icon"
                accountStatus={{
                    smallScreen: 'avatar',
                    largeScreen: 'full',
                }}
            />
        </div>
    )
}

export default WalletConnect
