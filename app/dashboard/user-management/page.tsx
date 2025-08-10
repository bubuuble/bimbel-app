// FILE: app/dashboard/user-management/page.tsx
import UserManagementClient from '../components/UserManagementClient';
import { createClient } from '@/lib/supabase/server';
// ... (tambahkan otorisasi admin)

export default async function UserManagementPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase.rpc('get_all_users');
  
  return (
    <div>
      <h1>User Management</h1>
      <UserManagementClient initialProfiles={profiles || []} />
    </div>
  );
}