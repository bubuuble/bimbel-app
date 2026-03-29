// FILE: app/(main)/layout.tsx
'use client'

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <PageTransition>
        <main>
          {children}
        </main>
      </PageTransition>
      <Footer />
    </div>
  );
}