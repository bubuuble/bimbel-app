// FILE: app/dashboard/components/UserManagementClient.tsx

'use client'

import { useState } from "react";
import CreateUserForm from "./CreateUserForm";
import { updateUserRole, changeUserPasswordByAdmin, deleteUserByAdmin, type FormState } from "@/lib/actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Save, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type UserProfile = { 
    id: string; 
    name: string | null; 
    username: string | null; 
    email: string | null; 
    role: 'ADMIN' | 'GURU' | 'SISWA'; 
};

function UserRow({ profile }: { profile: UserProfile }) {
        const [isChangingPassword, setIsChangingPassword] = useState(false);
        const [passwordState, changePasswordAction] = useActionState(changeUserPasswordByAdmin, null);
        const [roleState, changeRoleAction] = useActionState(updateUserRole, null);
        const { pending: isSavingRole } = useFormStatus();

        const handleDelete = async () => {
                if (confirm(`Anda yakin ingin menghapus pengguna "${profile.name || profile.username}"? Tindakan ini tidak dapat diurungkan.`)) {
                        const formData = new FormData();
                        formData.append('userId', profile.id);
                        await deleteUserByAdmin(formData);
                }
        };

        const getRoleBadgeVariant = (role: string) => {
                switch (role) {
                        case 'ADMIN': return 'destructive';
                        case 'GURU': return 'default';
                        case 'SISWA': return 'secondary';
                        default: return 'outline';
                }
        };
        
        return (
                <TableRow>
                        <TableCell className="font-medium">{profile.name}</TableCell>
                        <TableCell>{profile.username}</TableCell>
                        <TableCell>
                                <Badge variant={getRoleBadgeVariant(profile.role)}>
                                        {profile.role}
                                </Badge>
                        </TableCell>
                        <TableCell>
                                <form action={changeRoleAction} className="flex items-center gap-2">
                                        <input type="hidden" name="userId" value={profile.id} />
                                        <Select name="newRole" defaultValue={profile.role} disabled={profile.role === 'ADMIN'}>
                                                <SelectTrigger className="w-32">
                                                        <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                        <SelectItem value="SISWA">Siswa</SelectItem>
                                                        <SelectItem value="GURU">Guru</SelectItem>
                                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                                </SelectContent>
                                        </Select>
                                        {profile.role !== 'ADMIN' && (
                                                <Button type="submit" size="sm" disabled={isSavingRole}>
                                                        <Save className="h-4 w-4" />
                                                </Button>
                                        )}
                                </form>
                                {roleState?.success && (
                                        <Alert className="mt-2">
                                                <AlertDescription className="text-green-600 text-sm">
                                                        {roleState.success}
                                                </AlertDescription>
                                        </Alert>
                                )}
                                {roleState?.error && (
                                        <Alert className="mt-2" variant="destructive">
                                                <AlertDescription className="text-sm">
                                                        {roleState.error}
                                                </AlertDescription>
                                        </Alert>
                                )}
                        </TableCell>
                        <TableCell>
                                <div className="flex flex-col gap-2">
                                        {isChangingPassword ? (
                                                <form action={changePasswordAction} className="space-y-2">
                                                        <input type="hidden" name="userId" value={profile.id} />
                                                        <Input 
                                                                type="password" 
                                                                name="newPassword" 
                                                                placeholder="Password Baru" 
                                                                required 
                                                                className="w-32"
                                                        />
                                                        <div className="flex gap-1">
                                                                <Button type="submit" size="sm">
                                                                        <Save className="h-4 w-4" />
                                                                </Button>
                                                                <Button 
                                                                        type="button" 
                                                                        variant="outline" 
                                                                        size="sm"
                                                                        onClick={() => setIsChangingPassword(false)}
                                                                >
                                                                        <X className="h-4 w-4" />
                                                                </Button>
                                                        </div>
                                                        {passwordState?.success && (
                                                                <Alert>
                                                                        <AlertDescription className="text-green-600 text-sm">
                                                                                {passwordState.success}
                                                                        </AlertDescription>
                                                                </Alert>
                                                        )}
                                                        {passwordState?.error && (
                                                                <Alert variant="destructive">
                                                                        <AlertDescription className="text-sm">
                                                                                {passwordState.error}
                                                                        </AlertDescription>
                                                                </Alert>
                                                        )}
                                                </form>
                                        ) : (
                                                <Button 
                                                        onClick={() => setIsChangingPassword(true)} 
                                                        disabled={profile.role === 'ADMIN'}
                                                        variant="outline"
                                                        size="sm"
                                                >
                                                        <Edit className="h-4 w-4 mr-1" />
                                                        Ubah Password
                                                </Button>
                                        )}
                                        <Button 
                                                onClick={handleDelete} 
                                                disabled={profile.role === 'ADMIN'}
                                                variant="destructive"
                                                size="sm"
                                        >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Hapus
                                        </Button>
                                </div>
                        </TableCell>
                </TableRow>
        );
}

export default function UserManagementClient({ initialProfiles }: { initialProfiles: UserProfile[] }) {
        const [profiles, setProfiles] = useState(initialProfiles);

        return (
                <div className="space-y-8">
                        <Card>
                                <CardHeader>
                                        <CardTitle>Manajemen Pengguna</CardTitle>
                                </CardHeader>
                                <CardContent>
                                        <div className="overflow-x-auto">
                                                <Table>
                                                        <TableHeader>
                                                                <TableRow>
                                                                        <TableHead>Nama</TableHead>
                                                                        <TableHead>Username</TableHead>
                                                                        <TableHead>Peran Saat Ini</TableHead>
                                                                        <TableHead>Ubah Peran</TableHead>
                                                                        <TableHead>Tindakan</TableHead>
                                                                </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                                {profiles.map((profile) => (
                                                                        <UserRow key={profile.id} profile={profile} />
                                                                ))}
                                                        </TableBody>
                                                </Table>
                                        </div>
                                </CardContent>
                        </Card>
                        
                        <Card>
                                <CardHeader>
                                        <CardTitle>Tambah Pengguna Baru</CardTitle>
                                </CardHeader>
                                <CardContent>
                                        <CreateUserForm />
                                </CardContent>
                        </Card>
                </div>
        );
}