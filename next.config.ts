// FILE: next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack configuration - simplified for compatibility
  turbopack: {
    resolveAlias: {
      // Alias untuk mempercepat resolusi module
      '@': '.',
      '@/components': './components',
      '@/lib': './lib',
      '@/hooks': './hooks',
      '@/app': './app',
      '@/public': './public',
    },
  },
  // Experimental features untuk optimasi
  experimental: {
    // Optimasi package imports (CSS optimization disabled for compatibility)
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react', '@radix-ui/react-accordion', '@radix-ui/react-alert-dialog'],
  },
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
  // Custom webpack config to suppress specific warnings
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Suppress console errors for Sanity Studio hydration issues
      const originalError = console.error;
      console.error = (...args) => {
        const message = args[0];
        if (typeof message === 'string' && (
          message.includes('In HTML, <div> cannot be a descendant of <p>') ||
          message.includes('validateDOMNesting') ||
          message.includes('div cannot appear as a descendant of p')
        )) {
          return;
        }
        originalError(...args);
      };
    }
    return config;
  },
};

export default nextConfig;