import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Navbar from '@/components/Navbar'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ 
    subsets: ['latin'],
    variable: '--font-inter',
})

export const metadata: Metadata = {
    title: 'TicketBlock | Web3 Event Ticketing & QR Verification',
    description: 'Decentralized, fraud-proof event ticketing platform powered by Ethereum smart contracts and instant QR check-in.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white`}>
                <Providers>
                    <Navbar />
                    <main className="min-h-[calc(100vh-4rem)]">
                        {children}
                    </main>
                    <Toaster 
                        position="top-right" 
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#1e293b',
                                color: '#f8fafc',
                                borderRadius: '1rem',
                                fontSize: '13px',
                                padding: '12px 18px',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#10b981',
                                    secondary: '#ffffff',
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: '#f43f5e',
                                    secondary: '#ffffff',
                                },
                            },
                        }}
                    />
                </Providers>
            </body>
        </html>
    )
}
