import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Authentication failed.' }, { status: 401 });
    
    const { data: profile } = await supabase.from('profiles').select('name, username').eq('id', user.id).single();
    if (!profile) return NextResponse.json({ error: 'User profile not found.' }, { status: 404 });
    
    // Hanya butuh productId, productName, dan price
    const { productId, productName, price } = await request.json();

    // 3. Inisialisasi Midtrans Snap client
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
    });

    const orderId = `BIMBEL-${productId.slice(0, 5)}-${Date.now()}`;
    const parameter = {
      transaction_details: { order_id: orderId, gross_amount: price },
      customer_details: { first_name: profile.name || profile.username || "User", email: user.email! },
      item_details: [{ id: productId, price, quantity: 1, name: productName }],
    };

    console.log("Creating Midtrans transaction with params:", JSON.stringify(parameter, null, 2));

    // 4. Buat transaksi di Midtrans
    const transaction = await snap.createTransaction(parameter);

    const { error: insertError } = await supabase.from('payments').insert({
        midtrans_order_id: orderId,
        user_id: user.id,
        amount: price,
        status: 'pending',
        snap_token: transaction.token,
        sanity_product_id: productId, // Simpan ID Produk Sanity
        product_name: productName,
    });

    if (insertError) throw new Error(`Supabase insert error: ${insertError.message}`);
    
    return NextResponse.json({ token: transaction.token });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}