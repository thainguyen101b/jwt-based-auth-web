import { SearchIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface SearchBarProps {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  placeholder?: string;
}
export const SearchBar = ({
  value,
  onChange,
  placeholder = "Search in all columns...",
}: SearchBarProps) => {
  return (
    <div className="relative w-full sm:w-64">
      <input
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
    </div>
  );
};
