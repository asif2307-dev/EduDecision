import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({ message = 'Loading institutional records...', subtext = 'Querying academic database' }) => {
  return (
    <div className="inst-card p-12 flex flex-col items-center justify-center text-center my-6">
      <div className="relative mb-4">
        <Loader2 className="w-8 h-8 text-navy-800 animate-spin" />
      </div>
      <h3 className="text-sm font-semibold text-navy-950 mb-1">{message}</h3>
      <p className="text-xs text-neutral-500 max-w-sm">{subtext}</p>
    </div>
  );
};

export default LoadingState;
