import React from 'react';

export const Badge = ({ children, variant = 'neutral', size = 'sm', className = '' }) => {
  let colorStyles = 'bg-neutral-100 text-neutral-700 border-neutral-300';

  switch (variant) {
    case 'navy':
      colorStyles = 'bg-navy-50 text-navy-900 border-navy-200';
      break;
    case 'teal':
      colorStyles = 'bg-teal-50 text-teal-800 border-teal-300';
      break;
    case 'success':
      colorStyles = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      break;
    case 'warning':
    case 'medium':
      colorStyles = 'bg-amber-50 text-amber-900 border-amber-300';
      break;
    case 'danger':
    case 'high':
      colorStyles = 'bg-red-50 text-red-900 border-red-300';
      break;
    case 'low':
      colorStyles = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      break;
    case 'neutral':
    default:
      colorStyles = 'bg-neutral-100 text-neutral-800 border-neutral-200';
      break;
  }

  const sizeStyles = size === 'xs' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center font-medium border rounded ${colorStyles} ${sizeStyles} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
