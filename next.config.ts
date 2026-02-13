import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* enable a static export */
    output: "export",
    /* config options here */
    /* Disables Next.js image optimization (not compatible with static export) */
    images: {
        unoptimized: true,
    },

    basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
};

export default nextConfig;
