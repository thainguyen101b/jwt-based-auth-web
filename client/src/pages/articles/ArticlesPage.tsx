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
import {
  ChevronDownIcon,
  EditIcon,
  EyeIcon,
  FilterIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { ErrorMessage } from "../../components/ErrorMessage";
import { SearchBar } from "../../components/common/SearchBar";
import { PageSizeSelector } from "../../components/common/PageSizeSelector";
import { LoadingRow } from "../../components/common/LoadingRow";
import { EmptyState } from "../../components/common/EmptyState";
import { Pagination } from "../../components/common/Pagination";
import { DeleteModal } from "../../components/common/DeleteModal";
import { ColumnFilter } from "../../components/common/ColumnFilter";
import { FilterBadges } from "../../components/common/FilterBadges";

export const ArticlesPage = () => {
  const [articles, setArticles] = useState<ArticleResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | ApiError>("");

  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Pagination state
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Delete Modal state
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [articleToDelete, setArticleToDelete] =
    useState<ArticleResponse | null>(null);

  const fetchArticles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const data: MultipleArticlesResponse = await getArticles(
        undefined,
        undefined,
        undefined,
        pageNumber,
        pageSize
      );
      setArticles(data.articles);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);

      // Sync
      if (data.pageNumber !== pageNumber) {
        setPageNumber(data.pageNumber);
      }
      if (data.pageSize !== pageSize) {
        setPageSize(data.pageSize);
      }
    } catch (err) {
      if (err && typeof err === "object" && "status" in err) {
        setError(err as ApiError);
      } else {
        setError("Fetch articles error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [pageNumber, pageSize]);

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
    setPageNumber(0);
  }, []);

  const openDeleteModal = useCallback((article: ArticleResponse) => {
    setArticleToDelete(article);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setArticleToDelete(null);
  }, []);

  const handleRemoveFilter = useCallback((filterId: string) => {
    if (filterId === "all") {
      setColumnFilters([]);
    } else {
      setColumnFilters((prev) =>
        prev.filter((filter) => filter.id !== filterId)
      );
    }
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
        enableColumnFilter: true,
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
        enableColumnFilter: true,
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
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          const tags = row.getValue(columnId) as string[];
          return tags.some((tag) =>
            tag.toLowerCase().includes((filterValue as string).toLowerCase())
          );
        },
      }),
      columnHelper.accessor("createdAt", {
        header: "Created At",
        cell: (info) => new Date(info.getValue()).toLocaleDateString("vi-VN"),
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          const date = new Date(
            row.getValue(columnId) as string
          ).toLocaleDateString("vi-VN");
          return date.includes(filterValue as string);
        },
      }),
      columnHelper.accessor("updatedAt", {
        header: "Updated At",
        cell: (info) => new Date(info.getValue()).toLocaleDateString("vi-VN"),
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          const date = new Date(
            row.getValue(columnId) as string
          ).toLocaleDateString("vi-VN");
          return date.includes(filterValue as string);
        },
      }),
      columnHelper.accessor("favoritesCount", {
        header: "Favorites Count",
        cell: (info) => info.getValue(),
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          const count = row.getValue(columnId) as number;
          return count.toString().includes(filterValue as string);
        },
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
        enableColumnFilter: false,
      }),
    ],
    [openDeleteModal]
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
        pageIndex: pageNumber,
        pageSize,
      },
    },
    manualPagination: true,
    pageCount: totalPages,
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

        <Button to="/create-article">
          <PlusIcon className="h-5 w-5 mr-1" /> Create new article
        </Button>
      </div>

      {/* Search and filter */}
      <div className="mb-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <SearchBar value={globalFilter} onChange={setGlobalFilter} />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                variant="secondary"
                onClick={() => setActiveFilter(activeFilter ? null : "columns")}
                type="button"
              >
                <FilterIcon size={16} className="mr-1" />
                Column Filters
                <ChevronDownIcon size={16} className="ml-1" />
              </Button>
              {activeFilter === "columns" && (
                <div className="absolute z-10 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 w-64">
                  <h3 className="font-medium text-gray-700 px-3 py-2 border-b">
                    Select a column to filter
                  </h3>
                  <div className="max-h-80 overflow-y-auto">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanFilter())
                      .map((column) => (
                        <button
                          key={column.id}
                          onClick={() => setActiveFilter(column.id)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md flex justify-between items-center cursor-pointer"
                          type="button"
                        >
                          <span>{String(column.columnDef.header)}</span>
                          {(column.getFilterValue() as string) && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              Filtered
                            </span>
                          )}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
            <PageSizeSelector
              value={pageSize}
              onChange={handlePageSizeChange}
            />
          </div>
        </div>

        {/* Active Column Filter */}
        {activeFilter && activeFilter !== "columns" && (
          <div className="relative mt-2">
            {(() => {
              const column = table.getColumn(activeFilter);
              if (!column) return null;

              return (
                <ColumnFilter<ArticleResponse>
                  column={column}
                  onClose={() => setActiveFilter(null)}
                />
              );
            })()}
          </div>
        )}

        {/* Filter Badges */}
        <FilterBadges<ArticleResponse>
          columnFilters={columnFilters}
          columns={table.getAllColumns()}
          onRemoveFilter={handleRemoveFilter}
        />
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
                  >
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                    {header.column.getCanFilter() && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveFilter(header.column.id);
                        }}
                        className="mt-1 text-blue-600 hover:text-blue-800 text-xs flex items-center cursor-pointer"
                        type="button"
                      >
                        <FilterIcon size={12} className="mr-1" />
                        {header.column.getFilterValue()
                          ? "Edit filter"
                          : "Add filter"}
                      </button>
                    )}
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
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalElements={totalElements}
        totalPages={totalPages}
        setPageNumber={setPageNumber}
        onPageSizeChange={handlePageSizeChange}
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
