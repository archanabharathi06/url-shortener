import React from 'react';

const Skeleton = ({ className = '', variant = 'text', ...props }) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'circle':
        return 'rounded-full';
      case 'rect':
        return 'rounded-lg';
      case 'text':
      default:
        return 'rounded h-4 w-full';
    }
  };

  return (
    <div
      className={`shimmer bg-slate-200 ${getVariantClass()} ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
