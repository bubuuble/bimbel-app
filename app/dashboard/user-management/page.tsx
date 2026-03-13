// FILE: app/dashboard/user-management/page.tsx
import UserManagementClient from '../components/UserManagementClient';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default async function UserManagementPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase.rpc('get_all_users');
  
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-400 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10">
          <p className="text-rose-100 text-sm font-medium mb-1">Admin</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Manajemen Pengguna</h1>
          <p className="text-rose-100 mt-1 text-sm">Kelola akun pengguna, ubah peran, dan tambah admin baru.</p>
        </div>
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 pointer-events-none" />
      </div>

      <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
        <UserManagementClient initialProfiles={profiles || []} />
      </div>
    </div>
  );
}