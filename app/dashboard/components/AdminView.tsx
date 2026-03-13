// FILE: app/dashboard/components/AdminView.tsx
'use client'
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, GraduationCap, BookOpen, ShoppingCart, TrendingUp } from "lucide-react";

type AdminStats = {
  total_users: number;
  total_siswa: number;
  total_guru: number;
  total_orders_successful: number;
  total_income: number;
};

const statCards = (stats: AdminStats | null) => [
  {
    label: "Total Pengguna",
    value: stats?.total_users ?? 0,
    sub: "Terdaftar",
    icon: Users,
    gradient: "from-indigo-400 to-indigo-600",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
  },
  {
    label: "Total Guru",
    value: stats?.total_guru ?? 0,
    sub: "Aktif mengajar",
    icon: GraduationCap,
    gradient: "from-violet-400 to-purple-600",
    bg: "bg-violet-50",
    text: "text-violet-600",
  },
  {
    label: "Total Siswa",
    value: stats?.total_siswa ?? 0,
    sub: "Aktif belajar",
    icon: BookOpen,
    gradient: "from-teal-400 to-emerald-500",
    bg: "bg-teal-50",
    text: "text-teal-600",
  },
  {
    label: "Pesanan Berhasil",
    value: stats?.total_orders_successful ?? 0,
    sub: "Transaksi lunas",
    icon: ShoppingCart,
    gradient: "from-rose-400 to-pink-500",
    bg: "bg-rose-50",
    text: "text-rose-600",
  },
  {
    label: "Total Pendapatan",
    value: new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      notation: 'compact',
    }).format(stats?.total_income || 0),
    sub: "Dari pesanan lunas",
    icon: TrendingUp,
    gradient: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
];

export default function AdminView() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const [userStatsRes, orderStatsRes] = await Promise.all([
        supabase.rpc('get_admin_dashboard_stats'),
        supabase.rpc('get_admin_order_stats')
      ]);
      const userStats = userStatsRes.data?.[0];
      const orderStats = orderStatsRes.data?.[0];
      if (userStats && orderStats) {
        setStats({ ...userStats, ...orderStats });
      }
    } catch (error) {
      console.error("Gagal mengambil statistik admin:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const cards = statCards(stats);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 pointer-events-none" />
        <div className="relative z-10">
          <p className="text-indigo-100 text-sm font-medium mb-1">Administrator</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-indigo-200 mt-1 text-sm">Ringkasan statistik keseluruhan sistem.</p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -right-4 bottom-0 h-24 w-24 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="group rounded-2xl bg-white border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} shadow-sm text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              {loading ? (
                <>
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-slate-800 tabular-nums">
                    {typeof card.value === 'number'
                      ? card.value.toLocaleString('id-ID')
                      : card.value}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">{card.label}</p>
                  <p className="text-[11px] text-slate-300 mt-0.5">{card.sub}</p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}