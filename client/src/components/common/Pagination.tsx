import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface PaginationProps {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  totalItems: number;
  setPageIndex: Dispatch<SetStateAction<number>>;
}

export const Pagination = ({
  pageIndex,
  pageSize,
  pageCount,
  totalItems,
  setPageIndex,
}: PaginationProps) => {
  return (
    <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
      <div className="text-sm text-gray-700 mb-2 sm:mb-0">
        from {pageIndex * pageSize + 1} to{" "}
        {Math.min((pageIndex + 1) * pageSize, totalItems)}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
          disabled={pageIndex === 0}
          className={`p-2 rounded-full flex items-center justify-center ${
            pageIndex === 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        <div className="flex space-x-1">
          {generatePageNumbers(pageIndex, pageCount).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setPageIndex(pageNum)}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                pageIndex === pageNum
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {pageNum + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))}
          disabled={pageIndex === pageCount - 1}
          className={`p-2 rounded-full flex items-center justify-center ${
            pageIndex === pageCount - 1
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
    // Hiển thị tất cả các trang nếu ít hơn hoặc bằng maxPagesToShow
    for (let i = 0; i < totalPages; i++) {
      pages.push(i);
    }
  } else if (currentPage < 2) {
    // Hiển thị 5 trang đầu tiên
    for (let i = 0; i < maxPagesToShow; i++) {
      pages.push(i);
    }
  } else if (currentPage > totalPages - 3) {
    // Hiển thị 5 trang cuối cùng
    for (let i = totalPages - maxPagesToShow; i < totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Hiển thị 2 trang trước và 2 trang sau trang hiện tại
    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
      pages.push(i);
    }
  }

  return pages;
};
