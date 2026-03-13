'use client'

import { usePathname } from 'next/navigation';
import type { UserProfile } from "@/lib/types";
import { LanguageProvider } from "@/lib/LanguageContext";
import DashboardLayoutClient from "./DashboardClient";
import DashboardHeader from "./DashboardHeader";

export default function DashboardLayoutRenderer({
  children,
  userProfile
}: {
  children: React.ReactNode;
  userProfile: UserProfile;
}) {
  const pathname = usePathname();

  const isSpecialUjianPage = pathname.includes('/ujian/');

  if (isSpecialUjianPage) {
    return (
      <LanguageProvider>
        {children}
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen flex bg-slate-50">
        {/* Sidebar */}
        <DashboardLayoutClient userProfile={userProfile} />

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader userRole={userProfile.role} userName={userProfile.name || ''} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </LanguageProvider>
  );
}