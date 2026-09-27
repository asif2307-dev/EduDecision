import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendType = 'neutral', // 'positive' | 'negative' | 'neutral'
  badgeText,
  badgeVariant = 'navy',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`inst-card p-4 flex flex-col justify-between transition-all ${
        onClick ? 'cursor-pointer hover:border-navy-400 hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          {title}
        </span>
        {Icon && (
          <div className="p-2 bg-navy-50 text-navy-800 rounded border border-navy-100">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-2 mb-1">
        <div className="text-2xl font-bold tracking-tight text-navy-950 font-sans">
          {value}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-100 mt-2">
        <span className="text-neutral-500 truncate mr-2">{subtext}</span>
        {trend && (
          <span
            className={`inline-flex items-center font-medium ${
              trendType === 'positive'
                ? 'text-emerald-700'
                : trendType === 'negative'
                ? 'text-red-700'
                : 'text-neutral-600'
            }`}
          >
            {trendType === 'positive' && <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />}
            {trendType === 'negative' && <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
            {trendType === 'neutral' && <Minus className="w-3.5 h-3.5 mr-0.5" />}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
