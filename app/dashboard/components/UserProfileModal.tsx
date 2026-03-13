// FILE: app/dashboard/components/UserProfileModal.tsx
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/lib/types"; // Asumsi tipe ini sudah mencakup semua field

const ProfileDetailRow = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-slate-100 last:border-0 gap-1 sm:gap-4">
    <dt className="text-xs font-semibold text-slate-400 uppercase tracking-widest sm:w-1/3 shrink-0">{label}</dt>
    <dd className="text-sm font-medium text-slate-800">{value || <span className="text-slate-400 italic">Tidak ada data</span>}</dd>
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
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-0 rounded-2xl shadow-xl">
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-400 p-6 text-white text-center rounded-t-2xl">
          <DialogTitle className="text-2xl font-bold tracking-tight text-white mb-2">
            Profil Pengguna
          </DialogTitle>
          <div className="flex items-center justify-center gap-3 mt-2">
            <span className="font-medium text-indigo-100">{profile.name}</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                profile.role === 'ADMIN' ? 'bg-rose-500 text-white' : 
                profile.role === 'GURU' ? 'bg-white text-indigo-700' : 
                'bg-white/20 text-white'
            }`}>
              {profile.role}
            </span>
          </div>
          <DialogDescription className="text-indigo-100 text-xs mt-2 font-mono">
            @{profile.username}
          </DialogDescription>
        </div>
        <div className="p-6 bg-white overflow-y-auto max-h-[60vh]">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <div className="col-span-1 md:col-span-2 mb-2 pb-2 border-b border-slate-100">
                <h4 className="text-sm font-bold text-slate-700">Informasi Pribadi</h4>
            </div>
            <ProfileDetailRow label="Nama Lengkap" value={profile.name} />
            <ProfileDetailRow label="Email" value={profile.email} />
            <ProfileDetailRow label="Tempat Lahir" value={profile.place_of_birth} />
            <ProfileDetailRow label="Tanggal Lahir" value={profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : ''} />
            <ProfileDetailRow label="Agama" value={profile.religion} />
            <ProfileDetailRow label="No. Telepon" value={profile.phone_number} />
            
            <div className="col-span-1 md:col-span-2 mt-4 mb-2 pb-2 border-b border-slate-100">
                <h4 className="text-sm font-bold text-slate-700">Pendidikan & Akademik</h4>
            </div>
            <ProfileDetailRow label="Asal Sekolah" value={profile.school_origin} />
            <ProfileDetailRow label="Kelas" value={profile.grade} />
            
            <div className="col-span-1 md:col-span-2 mt-4 mb-2 pb-2 border-b border-slate-100">
                <h4 className="text-sm font-bold text-slate-700">Kontak Orang Tua / Wali</h4>
            </div>
            <ProfileDetailRow label="Nama Ortu/Wali" value={profile.parent_name} />
            <ProfileDetailRow label="Telp. Ortu/Wali" value={profile.parent_phone_number} />
            
            <div className="col-span-1 md:col-span-2 mt-4 mb-2 pb-2 border-b border-slate-100">
                <h4 className="text-sm font-bold text-slate-700">Alamat Rumah</h4>
            </div>
            <div className="col-span-1 md:col-span-2 py-3">
              <p className="text-sm font-medium text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {profile.address || <span className="text-slate-400 italic">Alamat tidak tersedia</span>}
              </p>
            </div>
          </dl>
        </div>
      </DialogContent>
    </Dialog>
  );
}