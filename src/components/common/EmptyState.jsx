import React from 'react';
import { Database, FilterX } from 'lucide-react';

export const EmptyState = ({
  title = 'No Records Found',
  description = 'No academic records match the current filter criteria or search query.',
  actionText = 'Reset Filters',
  onAction,
  icon: Icon = FilterX
}) => {
  return (
    <div className="inst-card p-12 flex flex-col items-center justify-center text-center my-6">
      <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 mb-3 border border-neutral-200">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-navy-950 mb-1">{title}</h3>
      <p className="text-xs text-neutral-500 max-w-md mb-4">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="btn-secondary text-xs px-3.5 py-1.5 font-medium border border-neutral-300 rounded shadow-sm bg-white hover:bg-neutral-50 text-neutral-800"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
