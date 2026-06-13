import React from 'react';

const Tooltip = ({ text, children, position = 'top', className = '' }) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className={`relative flex items-center group ${className}`}>
      {children}
      <div className={`absolute z-30 hidden group-hover:inline-block bg-slate-900 text-white text-[11px] font-medium py-1 px-2.5 rounded shadow-md whitespace-nowrap pointer-events-none transition-all duration-200 ${positionClasses[position]}`}>
        {text}
        {/* Tiny arrow indicators */}
        <div className={`absolute border-4 border-transparent ${
          position === 'top' ? 'top-full left-1/2 -translate-x-1/2 border-t-slate-900' :
          position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-900' :
          position === 'left' ? 'left-full top-1/2 -translate-y-1/2 border-l-slate-900' :
          'right-full top-1/2 -translate-y-1/2 border-r-slate-900'
        }`} />
      </div>
    </div>
  );
};

export default Tooltip;
