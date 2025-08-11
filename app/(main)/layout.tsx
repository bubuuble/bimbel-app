// FILE: app/(main)/layout.tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer'; // Impor footer

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