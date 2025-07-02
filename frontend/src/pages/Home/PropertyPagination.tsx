import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PropertyPaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  pageLimit?: number;
}

function PropertyPagination({
  page,
  setPage,
  totalPages,
  pageLimit = 2,
}: PropertyPaginationProps) {
  const startPage = Math.max(2, page - pageLimit);
  const endPage = Math.min(totalPages - 1, page + pageLimit);

  const pagesToShow: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pagesToShow.push(i);
  }

  const hasFirstEllipsis = startPage > 2;
  const hasLastEllipsis = endPage < totalPages - 1;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setPage(page - 1)}
            aria-disabled={page === 1}
            tabIndex={page === 1 ? -1 : undefined}
          />
        </PaginationItem>

        {totalPages > 0 && (
          <PaginationItem>
            <PaginationLink onClick={() => setPage(1)} isActive={page === 1}>
              1
            </PaginationLink>
          </PaginationItem>
        )}

        {hasFirstEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {pagesToShow.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink onClick={() => setPage(p)} isActive={page === p}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        {hasLastEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {totalPages > 1 && (
          <PaginationItem>
            <PaginationLink
              onClick={() => setPage(totalPages)}
              isActive={page === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => setPage(page + 1)}
            aria-disabled={page === totalPages}
            tabIndex={page === totalPages ? -1 : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default PropertyPagination;
