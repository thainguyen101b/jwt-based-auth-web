import { useCallback, useEffect, useMemo, useState } from "react";
import { ArticleResponse, MultipleArticlesResponse } from "../../types/article";
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
import { EditIcon, EyeIcon, PlusIcon, TrashIcon } from "lucide-react";
import { ErrorMessage } from "../../components/ErrorMessage";
import { SearchBar } from "../../components/common/SearchBar";
import { PageSizeSelector } from "../../components/common/PageSizeSelector";
import { LoadingRow } from "../../components/common/LoadingRow";
import { EmptyState } from "../../components/common/EmptyState";
import { Pagination } from "../../components/common/Pagination";
import { DeleteModal } from "../../components/common/DeleteModal";

export const ArticlesPage = () => {
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

  const fetchArticles = useCallback(async () => {
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
  }, [pageIndex, pageSize]);

  // Initial fetch and when pagination change
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Handle delete article
  const handleDeleteArticle = async () => {
    if (!articleToDelete) return;

    try {
      await deleteArticle(articleToDelete.slug);
      fetchArticles(); // Refresh the list
    } catch (err) {
      if (err && typeof err === "object" && "status" in err) {
        setError(err as ApiError);
      } else {
        setError("Delete article error. Please try again.");
      }
    } finally {
      setShowDeleteModal(false);
      setArticleToDelete(null);
    }
  };

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPageIndex(0);
  }, []);

  const openDeleteModal = useCallback((article: ArticleResponse) => {
    setArticleToDelete(article);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setArticleToDelete(null);
  }, []);

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
        cell: (info) => {
          const tags = info.getValue();
          return (
            <div className="flex flex-wrap gap-1 max-w-xs">
              {tags.length > 0 ? (
                tags.map((tag, index) => (
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
          );
        },
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
              onClick={() => openDeleteModal(info.row.original)}
            >
              <TrashIcon size={18} />
            </Button>
          </div>
        ),
      }),
    ],
    [openDeleteModal]
  );

  const pageCount = Math.ceil(totalArticles / pageSize);

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
    pageCount,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

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
        <SearchBar value={globalFilter} onChange={setGlobalFilter} />
        <PageSizeSelector value={pageSize} onChange={handlePageSizeChange} />
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
              <LoadingRow />
            ) : articles.length === 0 ? (
              <EmptyState stateName="articles" />
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
      <Pagination
        pageIndex={pageIndex}
        pageSize={pageSize}
        pageCount={pageCount}
        totalItems={totalArticles}
        setPageIndex={setPageIndex}
      />

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <DeleteModal
          onCancel={closeDeleteModal}
          onConfirm={handleDeleteArticle}
        />
      )}
    </div>
  );
};
