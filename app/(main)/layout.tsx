// FILE: app/(main)/layout.tsx

import Header from '@/components/Header'; // Pastikan path ini benar
import Footer from '@/components/Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}