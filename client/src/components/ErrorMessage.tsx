import { ApiError } from "../types/error";

interface ErrorMessageProps {
  error: string | ApiError;
}

export const ErrorMessage = ({ error }: ErrorMessageProps) => {
  const isApiError = typeof error !== "string";

  if (isApiError) {
    const apiError = error as ApiError;
    return (
      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
        <div className="flex items-center mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-500 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="text-sm font-medium text-red-800">
            {apiError.title || "Error"}
          </h3>
        </div>
        <p className="text-sm text-red-700">
          {apiError.detail || "Unknown error"}
        </p>
        {apiError.status && (
          <p className="text-xs text-red-600 mt-1">
            Error status: {apiError.status}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
  );
};
