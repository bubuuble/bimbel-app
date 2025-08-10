// FILE: app/(main)/layout.tsx

import Header from '@/components/Header'; // Pastikan path ini benar

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main style={{ padding: '2rem' }}>
        {children}
      </main>
    </div>
  );
}