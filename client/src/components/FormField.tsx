import { InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  inputName: string;
  error?: FieldError;
  type?: string;
}

export const FormField = ({
  label,
  inputName,
  error,
  type = "text",
  ...rest
}: FormFieldProps) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={inputName}
        className="block mb-2 text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        id={inputName}
        name={inputName}
        type={type}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:ring-blue-500"
        }`}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};
