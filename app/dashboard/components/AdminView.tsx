// FILE: app/dashboard/components/AdminView.tsx
'use client'
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, GraduationCap, BookOpen, ShoppingCart, DollarSign } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

// [PERBAIKAN 1] - Pastikan tipe data mencakup semua statistik
type AdminStats = {
  total_users: number;
  total_siswa: number;
  total_guru: number;
  total_orders_successful: number;
  total_income: number;
};

export default function AdminView() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const supabase = createClient();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    
    try {
      // [PERBAIKAN 2] - Panggil kedua fungsi RPC secara bersamaan untuk efisiensi
      const [userStatsRes, orderStatsRes] = await Promise.all([
        supabase.rpc('get_admin_dashboard_stats'),
        supabase.rpc('get_admin_order_stats')
      ]);

      // Cek error untuk setiap panggilan
      if (userStatsRes.error) throw new Error(`User Stats Error: ${userStatsRes.error.message}`);
      if (orderStatsRes.error) throw new Error(`Order Stats Error: ${orderStatsRes.error.message}`);

      // [PERBAIKAN 3] - Ambil elemen pertama [0] dari setiap hasil data
      const userStats = userStatsRes.data?.[0];
      const orderStats = orderStatsRes.data?.[0];

      if (userStats && orderStats) {
        // Gabungkan kedua hasil menjadi satu objek state
        setStats({ ...userStats, ...orderStats });
      } else {
        console.error("Salah satu atau kedua RPC tidak mengembalikan data.");
      }

    } catch (error) {
      console.error("Gagal mengambil statistik admin:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    // ... (UI Skeleton tidak berubah)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Here's your system overview</p>
      </div>
      
      {/* [PERBAIKAN 4] - Ubah grid menjadi 5 kolom agar pas */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_users ?? 0}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_guru ?? 0}</div>
            <p className="text-xs text-muted-foreground">Active teachers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_siswa ?? 0}</div>
            <p className="text-xs text-muted-foreground">Active students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pesanan Berhasil</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_orders_successful ?? 0}</div>
            <p className="text-xs text-muted-foreground">Total transaksi lunas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(stats?.total_income || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Dari semua pesanan lunas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}