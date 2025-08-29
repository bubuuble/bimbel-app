"use client";

import { useEffect, useState } from 'react';

const SNAP_SCRIPT_URL = 'https://app.sandbox.midtrans.com/snap/snap.js';

export function useMidtransSnap() {
  const [snap, setSnap] = useState<any>(null);

  useEffect(() => {
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    if (!clientKey) {
      console.error("Midtrans Client Key is not set in .env.local");
      return;
    }

    const script = document.createElement('script');
    script.src = SNAP_SCRIPT_URL;
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