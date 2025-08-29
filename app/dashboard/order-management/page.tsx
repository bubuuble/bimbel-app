// FILE: app/dashboard/order-management/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import OrderManagementClient from "../components/OrderManagementClient";

export default async function OrderManagementPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  // Pastikan hanya admin yang bisa mengakses
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'ADMIN') {
    return <div className="p-8">Akses ditolak. Halaman ini hanya untuk Administrator.</div>;
  }
  
  // Ambil semua data pembayaran, gabungkan dengan data profil pemesan
  const { data: initialOrders, error } = await supabase
    .from('payments')
    .select(`*, profiles ( name, username )`) // JOIN dengan tabel profiles
    .order('created_at', { ascending: false });

  if (error) {
    return <div>Error memuat data pesanan: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-0 sm:p-4">
      <OrderManagementClient initialOrders={initialOrders || []} />
    </div>
  );
}