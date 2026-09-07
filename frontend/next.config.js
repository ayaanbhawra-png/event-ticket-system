/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            net: false,
            tls: false,
            '@x402/svm/exact/client': false,
        };
        config.resolve.alias = {
            ...config.resolve.alias,
            '@x402/svm/exact/client': false,
        };
        config.externals.push('pino-pretty', 'lokijs', 'encoding');
        return config;
    },
}

module.exports = nextConfig