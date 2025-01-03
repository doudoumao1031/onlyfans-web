import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imfanstest.potato.im",
        port: "",
        pathname: "/**",
      },
    ],
  }
};

export default nextConfig;
