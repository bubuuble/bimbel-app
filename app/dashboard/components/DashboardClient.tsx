'use client'

import { useState } from "react";
import type { UserProfile } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from "@/lib/supabase/client";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  LogOut,
  LayoutDashboard,
  Users,
  FileText,
  BookOpen,
  ClipboardCheck,
  Calendar,
  User,
  Menu,
  ShoppingCart,
  ClipboardList,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";

function NavLink({
  href,
  children,
  icon: Icon,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ElementType;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-indigo-100 text-indigo-700 shadow-sm"
          : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
      )}
    >
      {Icon && (
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 shrink-0",
            isActive
              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
              : "bg-white text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600"
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      )}
      <span className="flex-1">{children}</span>
      {isActive && <ChevronRight className="h-3.5 w-3.5 text-indigo-400" />}
    </Link>
  );
}

function NavSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
        {title}
      </p>
      {children}
    </div>
  );
}

export default function DashboardLayoutClient({ userProfile }: { userProfile: UserProfile }) {
  const router = useRouter();
  const { t } = useLanguage();
  const supabase = createClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-rose-100 text-rose-600';
      case 'GURU': return 'bg-violet-100 text-violet-600';
      case 'SISWA': return 'bg-teal-100 text-teal-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrator';
      case 'GURU': return 'Guru';
      case 'SISWA': return 'Siswa';
      default: return role;
    }
  };

  const initials = (userProfile.name || userProfile.username || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Pastel indigo gradient colors for avatar based on role
  const avatarGradient = {
    ADMIN: 'from-rose-400 to-pink-500',
    GURU: 'from-violet-400 to-purple-500',
    SISWA: 'from-indigo-400 to-blue-500',
  }[userProfile.role] ?? 'from-indigo-400 to-blue-500';

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-indigo-50/60 border-r border-indigo-100">
      {/* Logo area */}
      <div className="flex h-16 items-center flex-shrink-0 gap-3 px-6 border-b border-indigo-100 bg-white/70">
        <Image src="/image/logo/logo1.png" alt="Logo" width={32} height={32} className="w-8 h-8 object-contain" />
        <span className="font-sans font-extrabold text-lg">
          <span className="text-primary">BIMBEL</span><span className="text-secondary"> MASTER</span>
        </span>
      </div>

      {/* User card */}
      <div className="p-4">
        <div className="rounded-2xl bg-white border border-indigo-100 shadow-sm overflow-hidden">
          {/* Gradient header strip */}
          <div className={cn("h-12 bg-gradient-to-r", avatarGradient)} />
          <div className="px-4 pb-4 -mt-6">
            <div
              className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md bg-gradient-to-br border-2 border-white",
                avatarGradient
              )}
            >
              {initials}
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-800 truncate">
              {userProfile.name || userProfile.username}
            </p>
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold mt-0.5",
                getRoleColor(userProfile.role)
              )}
            >
              {getRoleLabel(userProfile.role)}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-2 space-y-4">
        {/* Main */}
        <div>
          <NavLink href="/dashboard" icon={LayoutDashboard} onClick={() => setSidebarOpen(false)}>
            {t('nav.dashboard')}
          </NavLink>
        </div>

        {/* Admin Menu */}
        {userProfile.role === 'ADMIN' && (
          <NavSection title="Admin">
            <NavLink href="/dashboard/user-management" icon={Users} onClick={() => setSidebarOpen(false)}>
              {t('nav.users')}
            </NavLink>
            <NavLink href="/dashboard/order-management" icon={ShoppingCart} onClick={() => setSidebarOpen(false)}>
              Manajemen Pesanan
            </NavLink>
            <NavLink href="/dashboard/attendance-report" icon={FileText} onClick={() => setSidebarOpen(false)}>
              Laporan Absensi
            </NavLink>
          </NavSection>
        )}

        {/* Teacher & Student: Classes */}
        {(userProfile.role === 'GURU' || userProfile.role === 'SISWA') && (
          <NavSection title={t('nav.classes')}>
            <NavLink href="/dashboard/kelas" icon={BookOpen} onClick={() => setSidebarOpen(false)}>
              {t('nav.classes')}
            </NavLink>
            <NavLink href="/dashboard/ujian" icon={ClipboardList} onClick={() => setSidebarOpen(false)}>
              Ujian Tryout
            </NavLink>
          </NavSection>
        )}

        {/* Teacher: Management */}
        {userProfile.role === 'GURU' && (
          <NavSection title="Manajemen">
            <NavLink href="/dashboard/absensi" icon={ClipboardCheck} onClick={() => setSidebarOpen(false)}>
              Manajemen Absensi
            </NavLink>
          </NavSection>
        )}

        {/* Student: Activity */}
        {userProfile.role === 'SISWA' && (
          <NavSection title="Aktivitas">
            <NavLink href="/dashboard/kehadiran" icon={Calendar} onClick={() => setSidebarOpen(false)}>
              Kehadiran
            </NavLink>
            <NavLink href="/dashboard/riwayat-pesanan" icon={ShoppingCart} onClick={() => setSidebarOpen(false)}>
              Riwayat Pesanan
            </NavLink>
          </NavSection>
        )}

        {/* Account */}
        <NavSection title="Akun">
          <NavLink href="/dashboard/profile" icon={User} onClick={() => setSidebarOpen(false)}>
            Profil Saya
          </NavLink>
        </NavSection>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-indigo-100">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-rose-50 hover:text-rose-600 group"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-400 group-hover:bg-rose-100 group-hover:text-rose-500 transition-all">
            <LogOut className="h-4 w-4" />
          </span>
          {t('nav.logout')}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile trigger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md border border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 border-0">
            <SheetTitle className="sr-only">Navigasi Dashboard</SheetTitle>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 shrink-0 h-screen sticky top-0">
        <SidebarContent />
      </div>
    </>
  );
}