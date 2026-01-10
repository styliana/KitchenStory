import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Select = forwardRef(({ label, options = [], error, placeholder = '-- Wybierz --', className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`
            w-full px-4 py-2 appearance-none bg-white/80 backdrop-blur-sm border rounded-xl shadow-sm outline-none transition-all cursor-pointer
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
              : 'border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 hover:border-orange-300'
            }
            ${className}
          `}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {/* Strzałka */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium ml-1">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
Select.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
  error: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default Select;