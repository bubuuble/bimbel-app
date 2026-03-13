// FILE: app/dashboard/riwayat-pesanan/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import RiwayatPesananClient from "../components/RiwayatPesananClient"; // Komponen ini akan kita buat selanjutnya

export default async function RiwayatPesananPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  // Ambil data pembayaran awal di server
  const { data: initialPayments, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching initial payments:", error);
    return <div>Terjadi kesalahan saat memuat riwayat pesanan Anda.</div>;
  }

  // Kirim data awal sebagai prop ke komponen klien
  return (
    <div className="space-y-6 sm:space-y-8">
      <RiwayatPesananClient initialPayments={initialPayments || []} />
    </div>
  );
}