// FILE: app/dashboard/components/UserManagementClient.tsx
'use client'

import { useState, useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createClient } from "@/lib/supabase/client";
import CreateUserForm from "./CreateUserForm";
import { updateUserRole, deleteUserByAdmin, getUserProfileById, type FormState } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import UserProfileModal from "./UserProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";
import type { UserProfile as FullUserProfile } from "@/lib/types";

type UserProfileSummary = { 
    id: string; 
    name: string | null; 
    username: string | null; 
    email: string | null; 
    role: 'ADMIN' | 'GURU' | 'SISWA'; 
};

function UserRow({ 
  profile, 
  onSelectProfile,
  onChangePassword
}: { 
  profile: UserProfileSummary, 
  onSelectProfile: (userId: string) => void,
  onChangePassword: (user: UserProfileSummary) => void
}) {
    // --- [PERBAIKAN UTAMA DI SINI] ---
    // Berikan tipe generik secara eksplisit ke hook useActionState
    const [roleState, changeRoleAction] = useActionState<FormState, FormData>(updateUserRole, null);

    useEffect(() => {
        if (roleState?.success) toast.success(roleState.success);
        if (roleState?.error) toast.error("Gagal", { description: roleState.error });
    }, [roleState]);

    const handleDelete = async () => {
        if (confirm(`Anda yakin ingin menghapus pengguna "${profile.name || profile.username}"?`)) {
            const formData = new FormData();
            formData.append('userId', profile.id);
            const result = await deleteUserByAdmin(formData); // Sekarang mengembalikan hasil
            if (result?.success) toast.success(result.success);
            if (result?.error) toast.error("Gagal", { description: result.error });
        }
    };

    return (
        <TableRow>
            <TableCell className="font-medium">
                <button onClick={() => onSelectProfile(profile.id)} className="text-blue-600 hover:underline text-left">
                    {profile.name}
                </button>
            </TableCell>
            <TableCell>{profile.username}</TableCell>
            <TableCell><Badge variant={profile.role === 'ADMIN' ? 'destructive' : profile.role === 'GURU' ? 'default' : 'secondary'}>{profile.role}</Badge></TableCell>
            <TableCell>
                <form action={changeRoleAction} className="flex items-center gap-2">
                    <input type="hidden" name="userId" value={profile.id} />
                    <Select name="newRole" defaultValue={profile.role} disabled={profile.role === 'ADMIN'}>
                        <SelectTrigger className="w-32 h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="SISWA">Siswa</SelectItem>
                            <SelectItem value="GURU">Guru</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                    {profile.role !== 'ADMIN' && <Button type="submit" size="sm" className="h-9 w-9 p-0"><Save className="h-4 w-4" /></Button>}
                </form>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <Button onClick={() => onChangePassword(profile)} disabled={profile.role === 'ADMIN'} variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" /> Ubah Password
                    </Button>
                    <Button onClick={handleDelete} disabled={profile.role === 'ADMIN'} variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" /> Hapus
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}

// ... Sisa dari komponen UserManagementClient tidak perlu diubah ...
export default function UserManagementClient({ initialProfiles }: { initialProfiles: UserProfileSummary[] }) {
    const [profiles, setProfiles] = useState(initialProfiles);
    const [selectedProfile, setSelectedProfile] = useState<FullUserProfile | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isLoadingModal, setIsLoadingModal] = useState(false);
    const [passwordChangeUser, setPasswordChangeUser] = useState<UserProfileSummary | null>(null);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const supabase = createClient();
    useEffect(() => {
        const channel = supabase.channel('profiles_admin_changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' },
            async () => {
              const { data: updatedProfiles } = await supabase.from('profiles').select('*');
              setProfiles(updatedProfiles || []);
            }
          ).subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [supabase]);

    const handleSelectProfile = async (userId: string) => {
        setIsLoadingModal(true);
        setIsDetailModalOpen(true);
        try {
            const profileData = await getUserProfileById(userId);
            setSelectedProfile(profileData);
        } catch (error: any) {
            toast.error("Gagal Memuat Profil", { description: error.message });
            setIsDetailModalOpen(false);
        } finally {
            setIsLoadingModal(false);
        }
    };
    
    const handleOpenPasswordModal = (user: UserProfileSummary) => {
        setPasswordChangeUser(user);
        setIsPasswordModalOpen(true);
    };

    return (
        <>
            <div className="space-y-8">
                <Card>
                    <CardHeader><CardTitle>Manajemen Pengguna</CardTitle></CardHeader>
                    <CardContent>
                        <div className="border rounded-lg overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama (Klik untuk Detail)</TableHead>
                                        <TableHead>Username</TableHead>
                                        <TableHead>Peran</TableHead>
                                        <TableHead>Ubah Peran</TableHead>
                                        <TableHead>Tindakan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {profiles.map((profile) => (
                                        <UserRow 
                                            key={profile.id} 
                                            profile={profile} 
                                            onSelectProfile={handleSelectProfile}
                                            onChangePassword={handleOpenPasswordModal}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
                <Card><CardHeader><CardTitle>Tambah Pengguna Baru</CardTitle></CardHeader><CardContent><CreateUserForm /></CardContent></Card>
            </div>
            
            <UserProfileModal 
                profile={isLoadingModal ? null : selectedProfile}
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)} 
            />
            {isLoadingModal && isDetailModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]"><Loader2 className="h-8 w-8 text-white animate-spin" /></div>
            )}

            <ChangePasswordModal 
                user={passwordChangeUser}
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </>
    );
}