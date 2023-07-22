/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    reactStrictMode: true,
    trailingSlash: true,
    images: {
        loader: "custom",
        domains: ['gene.cnp-music.jp'],
    },
}

module.exports = nextConfig
