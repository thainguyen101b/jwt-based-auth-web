interface PageSizeSelectorProps {
  value: number;
  onChange: (val: number) => void;
}

export const PageSizeSelector = ({
  value,
  onChange,
}: PageSizeSelectorProps) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {[5, 10, 20, 30, 50].map((size) => (
        <option key={size} value={size}>
          {size} rows
        </option>
      ))}
    </select>
  );
};
