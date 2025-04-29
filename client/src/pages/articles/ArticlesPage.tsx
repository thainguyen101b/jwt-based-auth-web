import { useEffect, useMemo, useState } from "react";
import { ArticleResponse, MultipleArticlesResponse } from "../../types/article";
import { useNavigate } from "react-router";
import { ApiError } from "../../types/error";
import {
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { deleteArticle, getArticles } from "../../api/article";
import { Button } from "../../components/common/Button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  EyeIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import { ErrorMessage } from "../../components/ErrorMessage";

export const ArticlesPage = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<ArticleResponse[]>([]);
  const [totalArticles, setTotalArticles] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | ApiError>("");

  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  // Pagination state
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(20);

  // Delete Modal state
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [articleToDelete, setArticleToDelete] =
    useState<ArticleResponse | null>(null);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      setError("");

      const offset = pageIndex * pageSize;
      const limit = pageSize;
      const data: MultipleArticlesResponse = await getArticles(
        undefined,
        undefined,
        undefined,
        offset,
        limit
      );
      setArticles(data.articles);
      setTotalArticles(data.articlesCount);
    } catch (err) {
      if (err && typeof err === "object" && "status" in err) {
        setError(err as ApiError);
      } else {
        setError("Fetch articles error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and when pagination change
  useEffect(() => {
    fetchArticles();
  }, [pageIndex, pageSize]);

  // Handle delete article
  const handleDeleteArticle = async () => {
    if (!articleToDelete) return;

    try {
      await deleteArticle(articleToDelete.slug);
      fetchArticles(); // Refresh the list
      setShowDeleteModal(false);
      setArticleToDelete(null);
    } catch (err) {
      if (err && typeof err === "object" && "status" in err) {
        setError(err as ApiError);
      } else {
        setError("Delete article error. Please try again.");
      }
    }
  };

  // Column definitions
  const columnHelper = createColumnHelper<ArticleResponse>();
  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: "Title",
        cell: (info) => (
          <div className="max-w-md">
            <div className="font-medium text-gray-900 truncate">
              {info.getValue()}
            </div>
            <div className="text-sm text-gray-500 truncate">
              {info.row.original.description}
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("author.username", {
        header: "Author",
        cell: (info) => (
          <div className="flex items-center">
            <img
              src={
                info.row.original.author.image || "https://placehold.co/32x32"
              }
              alt={info.getValue()}
              className="h-8 w-8 rounded-full mr-2"
            />
            <span>{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("tagList", {
        header: "Tags",
        cell: (info) => (
          <div className="flex flex-wrap gap-1 max-w-xs">
            {info.getValue().length > 0 ? (
              info.getValue().map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">Empty</span>
            )}
          </div>
        ),
      }),
      columnHelper.accessor("createdAt", {
        header: "Created At",
        cell: (info) => new Date(info.getValue()).toLocaleDateString("vi-VN"),
      }),
      columnHelper.accessor("updatedAt", {
        header: "Updated At",
        cell: (info) => new Date(info.getValue()).toLocaleDateString("vi-VN"),
      }),
      columnHelper.accessor("favoritesCount", {
        header: "Favorites Count",
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex space-x-2">
            <Button to={`/articles/${info.row.original.slug}`}>
              <EyeIcon size={18} />
            </Button>
            <Button outline to={`/edit-article/${info.row.original.slug}`}>
              <EditIcon size={18} />
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setArticleToDelete(info.row.original);
                setShowDeleteModal(true);
              }}
            >
              <TrashIcon size={18} />
            </Button>
          </div>
        ),
      }),
    ],
    [navigate]
  );

  // Table instance
  const table = useReactTable({
    data: articles,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    manualPagination: true,
    pageCount: Math.ceil(totalArticles / pageSize),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const pageCount = Math.ceil(totalArticles / pageSize);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Article management
          </h1>
          <p className="text-gray-600">Manage all articles in system</p>
        </div>
      </div>

      <Button to="/create-article">
        <PlusIcon className="h-5 w-5 mr-1" /> Create new article
      </Button>

      {/* Search and filter */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <input
            placeholder="Search article"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="flex items-center">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageIndex(0);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[10, 20, 30, 50].map((size) => (
              <option key={size} value={size}>
                {size} rows
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
      {error && <ErrorMessage error={error} />}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-4 py-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gray-200 rounded-full mr-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1">
                      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex space-x-2">
                      <div className="h-6 w-6 bg-gray-200 rounded"></div>
                      <div className="h-6 w-6 bg-gray-200 rounded"></div>
                      <div className="h-6 w-6 bg-gray-200 rounded"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Không có bài viết nào. Hãy tạo bài viết mới!
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="text-sm text-gray-700 mb-2 sm:mb-0">
          from {pageIndex * pageSize + 1} to{" "}
          {Math.min((pageIndex + 1) * pageSize, totalArticles)}
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
            {Array.from({ length: Math.min(5, pageCount) }).map((_, i) => {
              let pageNum;
              if (pageCount <= 5) {
                // If 5 or fewer pages, show all
                pageNum = i;
              } else if (pageIndex < 2) {
                // First 2 pages
                pageNum = i;
              } else if (pageIndex > pageCount - 3) {
                // Last 2 pages
                pageNum = pageCount - 5 + i;
              } else {
                // Middle pages
                pageNum = pageIndex - 2 + i;
              }

              return (
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
              );
            })}
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

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete confirm
            </h3>
            <p className="text-gray-500 mb-6">
              Are you sure delete article "{articleToDelete?.title}"? This
              action can't be revert.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDeleteModal(false);
                  setArticleToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteArticle}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
