import React from 'react';

const StatCard = ({ title, value, icon: Icon, description, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex items-center justify-between gap-4 transition-all duration-200 hover:shadow-md ${className}`}>
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <span className="text-2xl font-bold tracking-tight text-slate-800 truncate mt-1">
          {value}
        </span>
        {description && (
          <span className="text-xs text-slate-400 mt-1 truncate">
            {description}
          </span>
        )}
      </div>

      {Icon && (
        <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-brand shrink-0">
          <Icon className="h-6 w-6 stroke-[2]" />
        </div>
      )}
    </div>
  );
};

export default StatCard;
