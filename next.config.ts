import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    sassOptions: {
        implementation: 'sass-embedded',
    },
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
module.exports = {
    skipTrailingSlashRedirect: true,
}

export default nextConfig;
