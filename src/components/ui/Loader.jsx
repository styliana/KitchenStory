import React from 'react';

export default function Loader({ size = "medium", className = "" }) {
  const sizes = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12"
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className={`${sizes[size]} animate-spin rounded-full border-2 border-orange-100 border-t-orange-500`}></div>
    </div>
  );
}