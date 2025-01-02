import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "imfanstest.potato.im",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
  },
};
module.exports = {
    skipTrailingSlashRedirect: true,
}

export default nextConfig;
