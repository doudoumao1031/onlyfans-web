import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
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
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2000mb"
    }
  }
}


export default nextConfig
