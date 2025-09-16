// FILE: app/api/notification/route.ts
import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client'; // Impor default
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: Request) {
  try {
    const notificationJson = await request.json();

    // --- [PERBAIKAN FINAL] ---
    // Gunakan 'midtransClient' (dengan 'm' kecil) yang kita impor
    const core = new midtransClient.CoreApi({
      isProduction: true,
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
    });
    // -------------------------

    const statusResponse = await core.transaction.notification(notificationJson);
    const { order_id, transaction_status, fraud_status } = statusResponse;
    
    let newStatus: 'success' | 'pending' | 'failed' = 'pending';
    if (transaction_status == 'capture' || transaction_status == 'settlement') {
      if (fraud_status == 'accept') newStatus = 'success';
    } else if (['cancel', 'deny', 'expire'].includes(transaction_status)) {
      newStatus = 'failed';
    }

    const { error } = await supabaseAdmin.from('payments')
      .update({ status: newStatus })
      .eq('midtrans_order_id', order_id);

    if (error) throw new Error(`Supabase update error: ${error.message}`);
    
    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}