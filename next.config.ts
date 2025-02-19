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
        protocol: "http",
        hostname: "imfans",
        port: "8080",
        pathname: "/**"
      },
      {
        protocol: "http",
        hostname: process.env.NEXT_PUBLIC_HOST || "",
        port: process.env.NEXT_PUBLIC_PORT || "8080",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "onlyfanswebtest.potato.im",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_HOST || "",
        port: "",
        pathname: "/**"
      }
    ],
    dangerouslyAllowSVG: true,
    formats: ["image/avif", "image/webp"]
  }
}

export default nextConfig
