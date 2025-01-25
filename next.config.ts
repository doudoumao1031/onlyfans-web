import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "2048mb"
    }
  },
  transpilePackages: ["antd-mobile"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_HOST || "",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_HOST || "",
        port: "",
        pathname: "/**",
        search: ""
      }
    ]
  }
}

export default nextConfig
