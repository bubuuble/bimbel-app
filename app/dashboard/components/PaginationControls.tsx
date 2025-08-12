// FILE: app/dashboard/components/PaginationControls.tsx

'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function PaginationControls({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href={currentPage > 1 ? createPageURL(currentPage - 1) : undefined}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {getVisiblePages().map((page, index) => (
          <PaginationItem key={index}>
            {page === '...' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={createPageURL(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext 
            href={currentPage < totalPages ? createPageURL(currentPage + 1) : undefined}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}