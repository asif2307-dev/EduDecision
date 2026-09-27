import React from 'react';
import { Search, RotateCcw, Filter, Download } from 'lucide-react';
import { DEPARTMENTS } from '../../data/mockData';

export const FilterBar = ({
  search = '',
  onSearchChange,
  department = 'ALL',
  onDepartmentChange,
  semester = 'ALL',
  onSemesterChange,
  batch = 'ALL',
  onBatchChange,
  status = 'ALL',
  onStatusChange,
  risk = 'ALL',
  onRiskChange,
  onReset,
  onExport,
  extraActions,
  showRiskFilter = false,
  showBatchFilter = true,
  showStatusFilter = true,
  placeholder = 'Search by name, ID, roll number...'
}) => {
  return (
    <div className="inst-card p-3 mb-4 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Search input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-neutral-300 rounded focus:border-navy-700 focus:outline-none focus:ring-1 focus:ring-navy-700"
          />
        </div>

        {/* Dropdown filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Department */}
          {onDepartmentChange && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-neutral-500 font-medium hidden sm:inline">Dept:</span>
              <select
                value={department}
                onChange={(e) => onDepartmentChange(e.target.value)}
                className="py-1.5 px-2 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-800 focus:outline-none focus:border-navy-700 font-medium"
              >
                <option value="ALL">All Departments</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept.code} value={dept.code}>
                    {dept.code} ({dept.name})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Semester */}
          {onSemesterChange && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-neutral-500 font-medium hidden sm:inline">Sem:</span>
              <select
                value={semester}
                onChange={(e) => onSemesterChange(e.target.value)}
                className="py-1.5 px-2 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-800 focus:outline-none focus:border-navy-700 font-medium"
              >
                <option value="ALL">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Batch */}
          {showBatchFilter && onBatchChange && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-neutral-500 font-medium hidden sm:inline">Batch:</span>
              <select
                value={batch}
                onChange={(e) => onBatchChange(e.target.value)}
                className="py-1.5 px-2 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-800 focus:outline-none focus:border-navy-700 font-medium"
              >
                <option value="ALL">All Batches</option>
                <option value="2021-2025">2021-2025</option>
                <option value="2022-2026">2022-2026</option>
                <option value="2023-2027">2023-2027</option>
                <option value="2024-2028">2024-2028</option>
              </select>
            </div>
          )}

          {/* Risk Filter */}
          {showRiskFilter && onRiskChange && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-neutral-500 font-medium hidden sm:inline">Risk:</span>
              <select
                value={risk}
                onChange={(e) => onRiskChange(e.target.value)}
                className="py-1.5 px-2 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-800 focus:outline-none focus:border-navy-700 font-medium"
              >
                <option value="ALL">All Risk Levels</option>
                <option value="HIGH">High Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="LOW">Low Risk</option>
              </select>
            </div>
          )}

          {/* Status Filter */}
          {showStatusFilter && onStatusChange && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-neutral-500 font-medium hidden sm:inline">Status:</span>
              <select
                value={status}
                onChange={(e) => onStatusChange(e.target.value)}
                className="py-1.5 px-2 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-800 focus:outline-none focus:border-navy-700 font-medium"
              >
                <option value="ALL">All Status</option>
                <option value="Active">Active</option>
                <option value="Probation">Probation</option>
              </select>
            </div>
          )}

          {/* Reset button */}
          {onReset && (
            <button
              onClick={onReset}
              className="p-1.5 text-neutral-600 hover:text-navy-900 border border-neutral-300 rounded bg-white hover:bg-neutral-50 transition-colors"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Export CSV button */}
          {onExport && (
            <button
              onClick={onExport}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded hover:bg-neutral-50 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-navy-800" />
              <span>Export CSV</span>
            </button>
          )}

          {extraActions}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
