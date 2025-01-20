import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  transpilePackages: ["antd-mobile"],
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
