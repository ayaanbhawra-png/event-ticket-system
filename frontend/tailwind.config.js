/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                    DEFAULT: '#6366f1',
                },
                secondary: {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed',
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                    DEFAULT: '#8b5cf6',
                },
                accent: {
                    50: '#ecfeff',
                    100: '#cffafe',
                    400: '#22d3ee',
                    500: '#06b6d4',
                    600: '#0891b2',
                    DEFAULT: '#06b6d4',
                },
                dark: {
                    900: '#0f172a',
                    800: '#1e293b',
                    700: '#334155',
                }
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 3s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'shimmer': 'shimmer 2.5s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)' },
                    '100%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.7)' },
                },
                shimmer: {
                    '100%': { transform: 'translateX(100%)' },
                }
            },
            boxShadow: {
                'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.3)',
                'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.3)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
            },
        },
    },
    plugins: [],
}