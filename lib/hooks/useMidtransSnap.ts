// FILE: lib/hooks/useMidtransSnap.ts
"use client";

import { useEffect, useState } from 'react';

// [PERBAIKAN 1] - Definisikan kedua URL
const SNAP_SCRIPT_URL_SANDBOX = 'https://app.sandbox.midtrans.com/snap/snap.js';
const SNAP_SCRIPT_URL_PRODUCTION = 'https://app.midtrans.com/snap/snap.js';

export function useMidtransSnap() {
  const [snap, setSnap] = useState<any>(null);

  useEffect(() => {
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    if (!clientKey) {
      console.error("Midtrans Client Key is not set in .env.local / Vercel");
      return;
    }

    // [PERBAIKAN 2] - Pilih URL berdasarkan environment variable baru
    const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true';
    const scriptUrl = isProduction ? SNAP_SCRIPT_URL_PRODUCTION : SNAP_SCRIPT_URL_SANDBOX;
    
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;

    script.onload = () => {
      // @ts-ignore
      if (window.snap) {
        // @ts-ignore
        setSnap(window.snap);
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return snap;
}