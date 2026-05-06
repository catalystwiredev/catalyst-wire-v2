/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  serverExternalPackages: [
    'applicationinsights',
    'diagnostic-channel',
    'diagnostic-channel-publishers',
  ],
}

module.exports = nextConfig
