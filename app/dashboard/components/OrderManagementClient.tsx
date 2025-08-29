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
    // ... (fungsi yang sama seperti di RiwayatPesananClient)
    switch (status) {
      case 'success': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Success</Badge>;
      case 'pending': return <Badge variant="secondary">Pending</Badge>;
      default: return <Badge variant="destructive">Failed/Expired</Badge>;
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
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-6 w-6" />
            <div>
              <CardTitle>Manajemen Pesanan</CardTitle>
              <CardDescription>Lihat dan kelola semua transaksi pengguna.</CardDescription>
            </div>
          </div>
          <Input 
            placeholder="Cari Order ID, Nama, Produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <ExportOrdersButton />
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Pengguna</TableHead>
                <TableHead>Produk</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.midtrans_order_id}>
                  <TableCell className="font-mono text-xs">{order.midtrans_order_id}</TableCell>
                  <TableCell className="font-medium">{order.profiles?.name || order.profiles?.username || 'N/A'}</TableCell>
                  <TableCell>{order.product_name || 'N/A'}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleString('id-ID')}</TableCell>
                  <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(order.amount)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredOrders.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Tidak ada pesanan ditemukan.</p>
        )}
      </CardContent>
    </Card>
  );
}