import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';

export const DataTable = ({
  columns,
  data = [],
  loading = false,
  emptyMessage = 'No records match the current criteria',
  sortBy,
  sortOrder,
  onSort,
  pagination,
  onPageChange,
  selectable = false,
  selectedRows = [],
  onSelectRow,
  onSelectAll
}) => {
  if (loading) {
    return <LoadingState message="Loading tabular records..." subtext="Querying database indices" />;
  }

  if (!data || data.length === 0) {
    return <EmptyState description={emptyMessage} />;
  }

  const allSelected = selectable && data.length > 0 && selectedRows.length === data.length;

  return (
    <div className="inst-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-100 border-b border-neutral-200 text-navy-950 font-semibold uppercase tracking-wider">
              {selectable && (
                <th className="py-2.5 px-3 w-10 text-center border-r border-neutral-200">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => onSelectAll && onSelectAll(e.target.checked)}
                    className="rounded border-neutral-300 text-navy-800 focus:ring-navy-600"
                  />
                </th>
              )}
              {columns.map((col) => {
                const isSorted = sortBy === col.key;
                return (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && onSort && onSort(col.key)}
                    className={`py-2.5 px-3 border-r border-neutral-200 last:border-r-0 select-none ${
                      col.sortable ? 'cursor-pointer hover:bg-neutral-200/70 transition-colors' : ''
                    } ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.className || ''}`}
                  >
                    <div className={`inline-flex items-center gap-1 ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : ''}`}>
                      <span>{col.label}</span>
                      {col.sortable && (
                        <span className="text-neutral-400">
                          {isSorted ? (
                            sortOrder === 'asc' ? (
                              <ArrowUp className="w-3.5 h-3.5 text-navy-800" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-navy-800" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white">
            {data.map((row, idx) => {
              const isSelected = selectable && selectedRows.includes(row.id);
              return (
                <tr
                  key={row.id || idx}
                  className={`hover:bg-neutral-50 transition-colors ${
                    idx % 2 === 1 ? 'bg-neutral-50/40' : 'bg-white'
                  } ${isSelected ? 'bg-navy-50/60' : ''}`}
                >
                  {selectable && (
                    <td className="py-2 px-3 text-center border-r border-neutral-100">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectRow && onSelectRow(row.id)}
                        className="rounded border-neutral-300 text-navy-800 focus:ring-navy-600"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-2 px-3 border-r border-neutral-100 last:border-r-0 ${
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                      } ${col.className || ''}`}
                    >
                      {col.render ? col.render(row[col.key], row, idx) : row[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <div className="bg-neutral-50 px-4 py-2.5 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-600">
          <div>
            Showing{' '}
            <span className="font-semibold text-navy-950">
              {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-navy-950">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            of <span className="font-semibold text-navy-950">{pagination.total}</span> records
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(1)}
              disabled={pagination.page <= 1}
              className="p-1 border border-neutral-300 rounded bg-white text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed"
              title="First Page"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-2 py-1 border border-neutral-300 rounded bg-white text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-medium"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>

            <span className="px-3 py-1 font-medium text-navy-900 bg-white border border-neutral-300 rounded">
              Page {pagination.page} of {pagination.totalPages || 1}
            </span>

            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-2 py-1 border border-neutral-300 rounded bg-white text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-medium"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onPageChange(pagination.totalPages)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-1 border border-neutral-300 rounded bg-white text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Last Page"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
