// FILE: app/dashboard/components/PaginationControls.tsx

'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaginationControls({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Jangan tampilkan kontrol jika hanya ada satu halaman atau tidak ada sama sekali
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
      <Link href={createPageURL(currentPage - 1)} passHref legacyBehavior>
        <button disabled={currentPage <= 1}>&larr; Sebelumnya</button>
      </Link>
      <span>
        Halaman {currentPage} dari {totalPages}
      </span>
      <Link href={createPageURL(currentPage + 1)} passHref legacyBehavior>
        <button disabled={currentPage >= totalPages}>Berikutnya &rarr;</button>
      </Link>
    </div>
  )
}