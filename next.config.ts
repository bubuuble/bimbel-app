// FILE: next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Pola yang sudah ada untuk Unsplash (jika masih dipakai)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // --- TAMBAHKAN POLA BARU INI UNTUK SANITY ---
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      // ------------------------------------------
    ],
  },
};

export default nextConfig;