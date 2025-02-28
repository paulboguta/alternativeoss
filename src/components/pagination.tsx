'use client';
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as PaginationRoot,
} from '@/components/ui/pagination';
import { useQueryState } from 'nuqs';
import { useTransition } from 'react';

type PaginationProps = {
  totalPages: number;
};

export function Pagination({ totalPages }: PaginationProps) {
  const [, startTransition] = useTransition();

  const [currentPage, setCurrentPage] = useQueryState('page', {
    startTransition,
    shallow: false,
    defaultValue: '1',
    clearOnDefault: true,
    throttleMs: 200,
  });

  // Generate array of page numbers to show
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const showPages = pages.filter(
    page =>
      page === 1 || page === totalPages || (page >= +currentPage - 2 && page <= +currentPage + 2)
  );

  // Add ellipsis where needed
  const pagesWithEllipsis: (number | string)[] = [];
  showPages.forEach((page, index) => {
    if (index > 0) {
      const prevPage = showPages[index - 1]!;
      if (page - prevPage > 1) {
        pagesWithEllipsis.push('...');
      }
    }
    pagesWithEllipsis.push(page);
  });

  return (
    <PaginationRoot>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setCurrentPage(String(+currentPage - 1))}
            aria-disabled={+currentPage === 1}
            className={+currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {pagesWithEllipsis.map((page, index) => {
          if (page === '...') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          const pageNum = page as number;
          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                onClick={() => setCurrentPage(pageNum.toString())}
                isActive={+currentPage === pageNum}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() => setCurrentPage(String(+currentPage + 1))}
            aria-disabled={+currentPage === totalPages}
            className={+currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}
