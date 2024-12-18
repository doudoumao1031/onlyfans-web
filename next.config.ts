import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    sassOptions: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
        port: "",
        pathname: "/api/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
