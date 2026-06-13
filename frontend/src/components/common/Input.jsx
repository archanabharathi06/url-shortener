import React from 'react';

const Input = React.forwardRef(({
  label,
  type = 'text',
  error,
  helperText,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${label ? label.toLowerCase().replace(/\s+/g, '-') : Math.random().toString(36).substring(7)}`;

  return (
    <div className={`flex flex-col w-full gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-slate-700 tracking-wide"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        id={inputId}
        className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg outline-none transition-all duration-200 
          ${error 
            ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200' 
            : 'border-slate-200 focus:border-brand focus:ring-1 focus:ring-indigo-100'
          } 
          placeholder:text-slate-400 text-slate-800`}
        {...props}
      />
      {error && (
        <span className="text-xs font-medium text-red-500 mt-0.5">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span className="text-xs text-slate-400 mt-0.5">
          {helperText}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
