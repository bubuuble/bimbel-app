// FILE: app/dashboard/components/UserProfileModal.tsx
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/lib/types"; // Asumsi tipe ini sudah mencakup semua field

// Komponen helper untuk menampilkan satu baris data
const ProfileDetailRow = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <div className="grid grid-cols-3 gap-4 border-b py-3">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="col-span-2 text-sm text-gray-900">{value || '-'}</dd>
  </div>
);

interface UserProfileModalProps {
  profile: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfileModal({ profile, isOpen, onClose }: UserProfileModalProps) {
  if (!profile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-4">
            <span>Detail Profil: {profile.name}</span>
            <Badge variant={profile.role === 'ADMIN' ? 'destructive' : 'secondary'}>{profile.role}</Badge>
          </DialogTitle>
          <DialogDescription>
            Informasi lengkap untuk pengguna @{profile.username}.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-4">
          <dl>
            <ProfileDetailRow label="Nama Lengkap" value={profile.name} />
            <ProfileDetailRow label="Username" value={profile.username} />
            <ProfileDetailRow label="Email" value={profile.email} />
            <ProfileDetailRow label="Tempat Lahir" value={profile.place_of_birth} />
            <ProfileDetailRow label="Tanggal Lahir" value={profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString('id-ID') : '-'} />
            <ProfileDetailRow label="Agama" value={profile.religion} />
            <ProfileDetailRow label="Asal Sekolah" value={profile.school_origin} />
            <ProfileDetailRow label="Kelas" value={profile.grade} />
            <ProfileDetailRow label="No. Telepon" value={profile.phone_number} />
            <ProfileDetailRow label="Alamat" value={profile.address} />
            <ProfileDetailRow label="Nama Ortu/Wali" value={profile.parent_name} />
            <ProfileDetailRow label="No. Telepon Ortu/Wali" value={profile.parent_phone_number} />
          </dl>
        </div>
      </DialogContent>
    </Dialog>
  );
}