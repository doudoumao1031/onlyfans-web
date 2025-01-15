import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "2048mb"
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imfanstest.potato.im",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "imfanstest.potato.im",
        port: "",
        pathname: "/**",
        search: ""
      }
    ]
  }
}

export default nextConfig
