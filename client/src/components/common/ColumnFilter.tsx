import { Column } from "@tanstack/react-table";
import { XIcon } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "./Button";

interface ColumnFilterProps<T> {
  column: Column<T, unknown>;
  onClose: () => void;
}

// Component for filtering individual columns
export const ColumnFilter = <T,>({ column, onClose }: ColumnFilterProps<T>) => {
  const [value, setValue] = useState<string>(
    (column.getFilterValue() as string) || ""
  );

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    column.setFilterValue(value);
    onClose();
  };

  const handleClear = (): void => {
    setValue("");
    column.setFilterValue("");
    onClose();
  };

  return (
    <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 w-64">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-gray-700">
          Filter: {String(column.columnDef.header)}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <XIcon size={16} />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter filter value..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex justify-between mt-3">
          <Button onClick={handleClear} variant="secondary">
            Clear
          </Button>
          <Button type="submit">Apply Filter</Button>
        </div>
      </form>
    </div>
  );
};
