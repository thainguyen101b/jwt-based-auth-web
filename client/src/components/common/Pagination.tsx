import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface PaginationProps {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  setPageNumber: Dispatch<SetStateAction<number>>;
  onPageSizeChange?: (size: number) => void;
}

export const Pagination = ({
  pageNumber,
  pageSize,
  totalElements,
  totalPages,
  setPageNumber,
}: PaginationProps) => {
  const firstItem = totalElements === 0 ? 0 : pageNumber * pageSize + 1;
  const lastItem = Math.min((pageNumber + 1) * pageSize, totalElements);

  return (
    <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
      <div className="text-sm text-gray-700 mb-2 sm:mb-0">
        {totalElements > 0 ? (
          <>
            Showing <span className="font-medium">{firstItem}</span> to{" "}
            <span className="font-medium">{lastItem}</span> of{" "}
            <span className="font-medium">{totalElements}</span> results
          </>
        ) : (
          <span>No results</span>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => setPageNumber((p) => Math.max(0, p - 1))}
          disabled={pageNumber === 0}
          className={`p-2 rounded-full flex items-center justify-center ${
            pageNumber === 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        <div className="flex space-x-1">
          {generatePageNumbers(pageNumber, totalPages).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setPageNumber(pageNum)}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                pageNumber === pageNum
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {pageNum + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() => setPageNumber((p) => Math.min(totalPages - 1, p + 1))}
          disabled={pageNumber === totalPages - 1 || totalPages === 0}
          className={`p-2 rounded-full flex items-center justify-center ${
            pageNumber === totalPages - 1 || totalPages === 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

const generatePageNumbers = (currentPage: number, totalPages: number) => {
  const maxPagesToShow = 5;
  const pages = [];

  if (totalPages <= maxPagesToShow) {
    for (let i = 0; i < totalPages; i++) {
      pages.push(i);
    }
  } else if (currentPage < 2) {
    // Show first 5 pages
    for (let i = 0; i < maxPagesToShow; i++) {
      pages.push(i);
    }
  } else if (currentPage > totalPages - 3) {
    // Show last 5 pages
    for (let i = totalPages - maxPagesToShow; i < totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Show 2 pages before and 2 pages after current page
    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
      pages.push(i);
    }
  }

  return pages;
};
