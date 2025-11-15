// src/components/ui/InlineLoader.jsx
import React from "react";
import Spinner from "./Spinner";

/**
 * Inline Loading Component (untuk dalam card/section)
 * @param {string} message - Loading message
 * @param {string} size - 'sm', 'md', 'lg'
 */
const InlineLoader = ({ message = "Loading...", size = "md" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Spinner size={size} color="cyan" />
      <p className="mt-4 text-sm text-cyan-600 font-medium">{message}</p>
    </div>
  );
};

export default InlineLoader;
