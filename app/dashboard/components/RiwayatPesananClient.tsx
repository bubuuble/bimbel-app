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
        return <Badge variant="default" className="bg-green-500">Success</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'failed':
      case 'expire':
        return <Badge variant="destructive">Failed/Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <ShoppingCart className="h-6 w-6" />
          <div>
            <CardTitle>Riwayat Pesanan Anda</CardTitle>
            <CardDescription>Semua transaksi yang pernah Anda lakukan.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : payments.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.midtrans_order_id}>
                    <TableCell className="font-medium">{payment.midtrans_order_id}</TableCell>
                    <TableCell>{new Date(payment.created_at).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(payment.amount)}
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Anda belum memiliki riwayat pesanan.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}