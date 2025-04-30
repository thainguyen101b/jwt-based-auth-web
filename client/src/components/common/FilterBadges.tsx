import { Column, ColumnFiltersState } from "@tanstack/react-table";
import { XIcon } from "lucide-react";

interface FilterBadgesProps<T> {
  columnFilters: ColumnFiltersState;
  columns: Column<T, unknown>[];
  onRemoveFilter: (filterId: string) => void;
}

// Component for rendering filter badges
export const FilterBadges = <T,>({
  columnFilters,
  columns,
  onRemoveFilter,
}: FilterBadgesProps<T>) => {
  if (columnFilters.length === 0) return;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {columnFilters.map((filter) => {
        const column = columns.find((col) => col.id === filter.id);
        const columnName = column?.columnDef.header || filter.id;

        return (
          <div
            key={filter.id}
            className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
          >
            <span className="font-medium mr-1">{String(columnName)}:</span>
            <span>{String(filter.value)}</span>
            <button
              onClick={() => onRemoveFilter(filter.id)}
              className="ml-1 text-blue-600 hover:text-blue-800 cursor-pointer"
              type="button"
            >
              <XIcon size={14} />
            </button>
          </div>
        );
      })}
      {columnFilters.length > 0 && (
        <button
          onClick={() => onRemoveFilter("all")}
          className="text-xs text-gray-500 hover:text-gray-700 underline ml-2 flex items-center cursor-pointer"
          type="button"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};
