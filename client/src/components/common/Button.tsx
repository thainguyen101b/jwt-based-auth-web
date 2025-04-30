import { ReactNode } from "react";
import { Link } from "react-router";

interface ButtonProps {
  children: ReactNode;
  disabled?: boolean;
  type?: "submit" | "button";
  variant?: "primary" | "secondary" | "danger";
  outline?: boolean;
  size?: "sm" | "md" | "lg";
  to?: string;
  onClick?: () => void;
  fullWidth?: boolean;
}

export const Button = ({
  children,
  disabled = false,
  type = "button",
  variant = "primary",
  outline = false,
  size = "md",
  to,
  onClick,
  fullWidth = false
}: ButtonProps) => {
  const baseClasses =
    `${fullWidth ? "w-full" : "w-auto"} 
    inline-flex justify-center items-center 
    rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-75 cursor-pointer`;

  const sizeClasses = {
    sm: "py-1 px-3 text-sm",
    md: "py-2 px-4 text-base",
    lg: "py-3 px-6 text-lg",
  };

  const filledVariantClasses = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 border-transparent",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 border-transparent",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border-transparent",
  };

  const outlineVariantClasses = {
    primary:
      "bg-transparent text-blue-600 hover:bg-blue-50 border-blue-600 focus:ring-blue-500",
    secondary:
      "bg-transparent text-gray-800 hover:bg-gray-100 border-gray-400 focus:ring-gray-400",
    danger:
      "bg-transparent text-red-600 hover:bg-red-50 border-red-600 focus:ring-red-500",
  };

  const variantClasses = outline ? outlineVariantClasses : filledVariantClasses;

  const commonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`;

  if (to) {
    return (
      <Link to={to} className={commonClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={commonClasses}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
