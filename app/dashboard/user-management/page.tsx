// FILE: app/dashboard/user-management/page.tsx
import UserManagementClient from '../components/UserManagementClient';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default async function UserManagementPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase.rpc('get_all_users');
  
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage and monitor user accounts across your platform.
        </p>
      </div>
      
      <Separator />
      
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">All Users</CardTitle>
          <CardDescription className="text-sm">
            View and manage all registered users in the system.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <UserManagementClient initialProfiles={profiles || []} />
        </CardContent>
      </Card>
    </div>
  );
}