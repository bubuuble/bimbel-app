// FILE: app/dashboard/components/OrderManagementClient.tsx
'use client'

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShoppingCart } from 'lucide-react';
import ExportOrdersButton from "./ExportOrdersButton";

// Tipe data untuk pesanan
type Order = {
  midtrans_order_id: string;
  created_at: string;
  amount: number;
  status: 'pending' | 'success' | 'failed' | 'expire';
  product_name: string | null;
  profiles: { // Tipe untuk data dari join
    name: string | null;
    username: string | null;
  } | null;
};

interface OrderManagementClientProps {
  initialOrders: Order[];
}

export default function OrderManagementClient({ initialOrders }: OrderManagementClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = createClient();

  // Realtime listener untuk pesanan baru atau update
  useEffect(() => {
    const channel = supabase
      .channel('payments_admin_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' },
        (payload) => {
          // Refresh data jika ada perubahan
          const fetchLatestOrders = async () => {
            const { data: latestOrders } = await supabase
              .from('payments')
              .select(`*, profiles ( name, username )`)
              .order('created_at', { ascending: false });
            setOrders(latestOrders || []);
          };
          fetchLatestOrders();
        }
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [supabase]);

  // Fungsi untuk render badge status
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'success': return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">Success</span>;
      case 'pending': return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">Pending</span>;
      default: return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">Failed/Expired</span>;
    }
  };

  // Filter pesanan berdasarkan pencarian
  const filteredOrders = orders.filter(order =>
    order.midtrans_order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.profiles?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">Manajemen Pesanan</h2>
              <p className="text-xs text-slate-500">Lihat dan kelola semua transaksi pengguna.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
              <Input 
                placeholder="Cari Order ID, Nama, Produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs rounded-xl border-slate-200 text-sm focus:border-indigo-400 focus:ring-indigo-400"
              />
              <ExportOrdersButton />
          </div>
        </div>
        <div className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-b-slate-100 hover:bg-transparent">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 h-10 px-6">Order ID</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 h-10 px-6">Pengguna</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 h-10 px-6">Produk</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 h-10 px-6">Tanggal</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 h-10 px-6">Jumlah</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 h-10 px-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.midtrans_order_id} className="border-b-slate-50 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-mono text-xs text-slate-500 px-6 py-3">{order.midtrans_order_id}</TableCell>
                    <TableCell className="font-medium text-slate-700 px-6 py-3">{order.profiles?.name || order.profiles?.username || 'N/A'}</TableCell>
                    <TableCell className="text-slate-600 px-6 py-3">{order.product_name || 'N/A'}</TableCell>
                    <TableCell className="text-slate-600 text-sm px-6 py-3">{new Date(order.created_at).toLocaleString('id-ID')}</TableCell>
                    <TableCell className="font-medium text-slate-700 px-6 py-3">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(order.amount)}</TableCell>
                    <TableCell className="px-6 py-3">{getStatusBadge(order.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-slate-500">
                <p className="text-sm">Tidak ada pesanan ditemukan.</p>
            </div>
          )}
        </div>
    </div>
  );
}