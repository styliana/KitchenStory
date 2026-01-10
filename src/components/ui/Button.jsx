import React from 'react';
import PropTypes from 'prop-types';

export default function Button({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  className = '', 
  disabled, 
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  
  const variants = {
    primary: "bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-full shadow-md shadow-orange-200",
    secondary: "bg-white hover:bg-orange-50 text-orange-600 border border-orange-200 py-2 px-4 rounded-full shadow-sm",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 py-1 px-3 rounded-lg text-sm",
    ghost: "text-gray-500 hover:text-orange-600 p-2 hover:bg-orange-50 rounded-lg transition-colors",
    link: "text-orange-600 hover:text-orange-700 underline p-0 bg-transparent shadow-none"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Przetwarzanie...
        </>
      ) : (
        children
      )}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost', 'link']),
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};