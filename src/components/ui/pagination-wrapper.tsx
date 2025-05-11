import { useNavigate } from "@tanstack/react-router";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";

interface PaginationWrapperProps {
  page: number;
  total: number;
  limit: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function PaginationWrapper({
  page,
  total,
  limit,
  onPageChange,
  className,
}: PaginationWrapperProps) {
  const navigate = useNavigate();

  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      navigate({
        search: (prev) => ({
          ...prev,
          page: newPage,
        }),
      });
    }
  };

  return (
    <div className={className}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(1)}
              className={page === 1 ? "opacity-50 cursor-not-allowed" : ""}
            />
          </PaginationItem>
          {Array.from(
            { length: Math.ceil(total / limit) },
            (_, i) => i + 1
          ).map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                isActive={p === page}
                onClick={() => handlePageChange(p)}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                handlePageChange(
                  Math.min(Math.ceil(total / limit), page + 1)
                )
              }
              className={
                page === Math.ceil(total / limit)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}