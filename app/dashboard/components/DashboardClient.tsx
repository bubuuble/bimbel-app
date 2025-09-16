'use client'

import { useState } from "react";
import type { UserProfile } from "@/lib/types";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";

function NavLink({ href, children, icon: Icon, onClick }: { 
  href: string, 
  children: React.ReactNode,
  icon?: React.ElementType,
  onClick?: () => void
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive 
          ? "bg-accent text-accent-foreground" 
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </Link>
  );
}

function NavSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h4>
      <div className="space-y-1">
        {children}
      </div>
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

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'destructive';
      case 'GURU': return 'default';
      case 'SISWA': return 'secondary';
      default: return 'outline';
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

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-14 sm:h-16 items-center px-4 sm:px-6 border-b">
        <div className="flex items-center space-x-2">
          <h2 className="text-base sm:text-lg font-bold">Bimbel Master</h2>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="p-3 sm:p-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col items-center space-y-2 sm:space-y-3">
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {(userProfile.name || userProfile.username)?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center space-y-1">
                <p className="text-xs sm:text-sm font-medium">
                  {userProfile.name || userProfile.username}
                </p>
                <Badge variant={getRoleBadgeVariant(userProfile.role)} className="text-xs">
                  {getRoleLabel(userProfile.role)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 sm:px-4">
        <nav className="space-y-3 sm:space-y-4 py-3 sm:py-4">
          <NavLink href="/dashboard" icon={LayoutDashboard} onClick={() => setSidebarOpen(false)}>
            {t('nav.dashboard')}
          </NavLink>
          
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
                {t('nav.attendance')} Report
              </NavLink>
            </NavSection>
          )}
          
          {/* Teacher & Student Menu */}
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
          
          {userProfile.role === 'GURU' && (
            <NavSection title="Manajemen">
              <NavLink href="/dashboard/absensi" icon={ClipboardCheck} onClick={() => setSidebarOpen(false)}>
                Manajemen Absensi
              </NavLink>
            </NavSection>
          )}
          
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
          
          <NavSection title="Account">
            <NavLink href="/dashboard/profile" icon={User} onClick={() => setSidebarOpen(false)}>
              Profil Saya
            </NavLink>
          </NavSection>
        </nav>
      </ScrollArea>

      <Separator />

      {/* Logout Button */}
      <div className="p-3 sm:p-4">
        <Button 
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t('nav.logout')}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="fixed top-4 left-4 z-50 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full w-64 flex-col border-r bg-background">
        <SidebarContent />
      </div>
    </>
  );
}