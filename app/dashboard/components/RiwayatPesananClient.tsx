// FILE: app/dashboard/components/RiwayatPesananClient.tsx
'use client'

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Loader2 } from 'lucide-react';

type Payment = {
  midtrans_order_id: string;
  created_at: string;
  amount: number;
  status: 'pending' | 'success' | 'failed' | 'expire';
  snap_token: string | null;
};

interface RiwayatPesananClientProps {
  initialPayments: Payment[];
}

export default function RiwayatPesananClient({ initialPayments }: RiwayatPesananClientProps) {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  // Realtime listener untuk update status pembayaran
  useEffect(() => {
    const channel = supabase.channel('payments_changes')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'payments' },
        (payload) => {
          // Update data di state jika ada perubahan
          setPayments(currentPayments =>
            currentPayments.map(p => 
              p.midtrans_order_id === payload.old.midtrans_order_id ? { ...p, ...payload.new } : p
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const getStatusBadge = (status: Payment['status']) => {
    switch (status) {
      case 'success':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">Success</span>;
      case 'pending':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">Pending</span>;
      case 'failed':
      case 'expire':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">Failed/Expired</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">{status}</span>;
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-slate-50 flex items-center gap-3 bg-slate-50/30">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
            <ShoppingCart className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-800">Riwayat Pesanan Anda</h2>
          <p className="text-xs text-slate-500">Semua transaksi yang pernah Anda lakukan.</p>
        </div>
      </div>
      <div className="p-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-4" />
            <span className="text-sm font-medium">Memuat riwayat pesanan...</span>
          </div>
        ) : payments.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-b-slate-100 hover:bg-transparent">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 h-10 px-6">Order ID</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 h-10 px-6">Tanggal</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 h-10 px-6">Jumlah</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 h-10 px-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.midtrans_order_id} className="border-b-slate-50 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-mono text-xs text-slate-600 px-6 py-3">{payment.midtrans_order_id}</TableCell>
                    <TableCell className="text-slate-600 text-sm px-6 py-3">{new Date(payment.created_at).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell className="font-medium text-slate-800 px-6 py-3">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(payment.amount)}
                    </TableCell>
                    <TableCell className="px-6 py-3">{getStatusBadge(payment.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 mb-4 text-slate-400">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-slate-600">Anda belum memiliki riwayat pesanan.</p>
          </div>
        )}
      </div>
    </div>
  );
}