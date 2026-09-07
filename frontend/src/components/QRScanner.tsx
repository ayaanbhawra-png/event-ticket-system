'use client'

import { useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'

interface QRScannerProps {
    onScanSuccess: (data: string) => void
    onScanError?: (error: string) => void
}

export default function QRScanner({ onScanSuccess }: QRScannerProps) {
    const [scanning, setScanning] = useState(false)
    const [permission, setPermission] = useState<boolean | null>(null)
    const scannerRef = useRef<any>(null)

    useEffect(() => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then(() => setPermission(true))
                .catch(() => setPermission(false))
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => { })
            }
        }
    }, [])

    const startScanner = async () => {
        try {
            const { Html5Qrcode } = await import('html5-qrcode')
            const html5QrCode = new Html5Qrcode('qr-reader')
            scannerRef.current = html5QrCode

            await html5QrCode.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: 220, height: 220 },
                },
                (decodedText: string) => {
                    onScanSuccess(decodedText)
                    html5QrCode.stop().catch(() => { })
                    setScanning(false)
                    toast.success('QR Code scanned successfully!')
                },
                () => { }
            )

            setScanning(true)
            toast.success('Camera scanner active')
        } catch (error) {
            console.error('Scanner error:', error)
            toast.error('Failed to start camera scanner')
        }
    }

    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop()
                await scannerRef.current.clear()
                scannerRef.current = null
                setScanning(false)
                toast.success('Scanner stopped')
            } catch (error) {
                console.error('Stop error:', error)
            }
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2.5 flex-wrap">
                <button
                    onClick={startScanner}
                    disabled={scanning}
                    className="btn-gradient px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all"
                >
                    <span>📷</span>
                    <span>{scanning ? 'Scanner Running...' : 'Start Camera Scanner'}</span>
                </button>
                {scanning && (
                    <button
                        onClick={stopScanner}
                        className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5"
                    >
                        <span>⏹</span>
                        <span>Stop Scanner</span>
                    </button>
                )}
            </div>

            {permission === false && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
                    <span>⚠️</span>
                    <span>Camera permission is required. Please grant browser camera access to scan QR codes.</span>
                </div>
            )}

            {/* Viewport Frame */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-indigo-200 bg-slate-900/5 min-h-[280px] flex items-center justify-center">
                <div
                    id="qr-reader"
                    className="w-full max-w-sm mx-auto overflow-hidden rounded-xl"
                ></div>

                {!scanning && (
                    <div className="text-center p-8 z-10 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl mb-3 shadow-inner">
                            📷
                        </div>
                        <p className="text-sm font-semibold text-slate-700">QR Gate Viewfinder</p>
                        <p className="text-xs text-slate-500 max-w-xs mt-1">
                            Click &quot;Start Camera Scanner&quot; and point camera at attendee&apos;s ticket pass
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}