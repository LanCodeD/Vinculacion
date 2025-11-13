import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "cdn.pixabay.com",
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
      "localhost", // 👈 para desarrollo local
    ],
  },
};

export default nextConfig;
