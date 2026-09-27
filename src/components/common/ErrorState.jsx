import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export const ErrorState = ({
  title = 'System Error Encountered',
  message = 'Unable to communicate with the academic analytics database.',
  onRetry
}) => {
  return (
    <div className="inst-card p-8 border-red-200 bg-red-50/40 my-6">
      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-red-100 text-red-700 rounded border border-red-200">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-900 mb-1">{title}</h3>
          <p className="text-xs text-red-700 leading-relaxed mb-3">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-300 text-red-800 text-xs font-medium rounded hover:bg-red-50 shadow-sm transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retry Query
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
