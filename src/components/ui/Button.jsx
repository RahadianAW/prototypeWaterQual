// src/components/ui/Button.jsx
import React from "react";

const Button = ({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  icon: Icon,
  className = "",
  type = "button",
}) => {
  const baseStyles = `
    font-medium rounded-lg transition-all duration-200 
    flex items-center justify-center gap-2
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-blue-600 text-white 
      hover:bg-blue-700 active:bg-blue-800
      focus:ring-blue-500
      disabled:bg-gray-300 disabled:text-gray-500
      shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-gray-200 text-gray-700 
      hover:bg-gray-300 active:bg-gray-400
      focus:ring-gray-400
      disabled:bg-gray-100 disabled:text-gray-400
    `,
    ghost: `
      bg-transparent text-gray-700 
      hover:bg-gray-100 active:bg-gray-200
      focus:ring-gray-300
      disabled:opacity-50 disabled:hover:bg-transparent
    `,
    danger: `
      bg-red-600 text-white 
      hover:bg-red-700 active:bg-red-800
      focus:ring-red-500
      disabled:bg-gray-300 disabled:text-gray-500
      shadow-sm hover:shadow-md
    `,
    success: `
      bg-green-600 text-white 
      hover:bg-green-700 active:bg-green-800
      focus:ring-green-500
      disabled:bg-gray-300 disabled:text-gray-500
      shadow-sm hover:shadow-md
    `,
    outline: `
      bg-transparent border-2 border-blue-600 text-blue-600
      hover:bg-blue-50 active:bg-blue-100
      focus:ring-blue-500
      disabled:border-gray-300 disabled:text-gray-300 disabled:hover:bg-transparent
    `,
  };

  const sizes = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
  };

  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-7 h-7",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
    >
      {Icon && <Icon className={iconSizes[size]} />}
      {children && <span>{children}</span>}
    </button>
  );
};

export default Button;
