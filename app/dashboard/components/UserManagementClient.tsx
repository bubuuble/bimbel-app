// FILE: app/dashboard/components/UserManagementClient.tsx
'use client'

import { useState, useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createClient } from "@/lib/supabase/client";
import { alert } from "@/lib/alerts";
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
        const confirmed = await alert.confirm(
            "Hapus Pengguna?", 
            `Anda yakin ingin menghapus pengguna "${profile.name || profile.username}"? Tindakan ini tidak dapat dibatalkan.`
        );
        
        if (confirmed) {
            const formData = new FormData();
            formData.append('userId', profile.id);
            const result = await deleteUserByAdmin(formData); // Sekarang mengembalikan hasil
            if (result?.success) toast.success(result.success);
            if (result?.error) toast.error("Gagal", { description: result.error });
        }
    };

    return (
        <TableRow>
            <TableCell className="px-6 py-3 font-medium">
                <button onClick={() => onSelectProfile(profile.id)} className="text-indigo-600 hover:text-indigo-800 hover:underline text-left">
                    {profile.name || "Tanpa Nama"}
                </button>
            </TableCell>
            <TableCell className="px-6 py-3 text-slate-600">{profile.username}</TableCell>
            <TableCell className="px-6 py-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                    profile.role === 'ADMIN' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 
                    profile.role === 'GURU' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 
                    'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                    {profile.role}
                </span>
            </TableCell>
            <TableCell className="px-6 py-3">
                <form action={changeRoleAction} className="flex items-center gap-2">
                    <input type="hidden" name="userId" value={profile.id} />
                    <Select name="newRole" defaultValue={profile.role} disabled={profile.role === 'ADMIN'}>
                        <SelectTrigger className="w-28 h-8 text-xs rounded-lg border-slate-200"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="SISWA" className="text-xs">Siswa</SelectItem>
                            <SelectItem value="GURU" className="text-xs">Guru</SelectItem>
                            <SelectItem value="ADMIN" className="text-xs">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                    {profile.role !== 'ADMIN' && <Button type="submit" size="sm" className="h-8 w-8 p-0 rounded-lg bg-indigo-600 hover:bg-indigo-700"><Save className="h-4 w-4" /></Button>}
                </form>
            </TableCell>
            <TableCell className="px-6 py-3">
                <div className="flex items-center gap-2">
                    <Button onClick={() => onChangePassword(profile)} disabled={profile.role === 'ADMIN'} variant="outline" size="sm" className="h-8 rounded-lg text-xs font-medium border-slate-200 text-slate-600">
                        <Edit className="h-3.5 w-3.5 mr-1.5" /> Password
                    </Button>
                    <Button onClick={handleDelete} disabled={profile.role === 'ADMIN'} variant="outline" size="sm" className="h-8 rounded-lg text-xs font-medium border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700">
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Hapus
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
            <div className="space-y-6">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="border-b-slate-100 hover:bg-transparent">
                                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 h-10 px-6">Nama (Klik untuk Detail)</TableHead>
                                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 h-10 px-6">Username</TableHead>
                                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 h-10 px-6">Peran</TableHead>
                                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 h-10 px-6">Ubah Peran</TableHead>
                                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 h-10 px-6">Tindakan</TableHead>
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

                <div className="mt-8 border-t border-slate-100 p-6 sm:p-8 bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 tracking-tight">Tambah Pengguna Baru</h3>
                    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <CreateUserForm />
                    </div>
                </div>
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