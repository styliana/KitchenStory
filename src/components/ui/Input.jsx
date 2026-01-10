import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
          w-full px-4 py-2 bg-white/80 backdrop-blur-sm border rounded-xl shadow-sm outline-none transition-all
          placeholder:text-gray-400
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
            : 'border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 hover:border-orange-300'
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium ml-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
};

export default Input;