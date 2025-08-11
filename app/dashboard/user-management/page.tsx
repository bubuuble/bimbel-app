// FILE: app/dashboard/user-management/page.tsx
import UserManagementClient from '../components/UserManagementClient';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default async function UserManagementPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase.rpc('get_all_users');
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage and monitor user accounts across your platform.
        </p>
      </div>
      
      <Separator />
      
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            View and manage all registered users in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserManagementClient initialProfiles={profiles || []} />
        </CardContent>
      </Card>
    </div>
  );
}