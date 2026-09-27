import React, { useState } from 'react';
import {
  CheckSquare,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Wrench
} from 'lucide-react';
import Badge from '../components/common/Badge';
import { DATA_QUALITY_ISSUES } from '../data/mockData';
import { useNotification } from '../context/NotificationContext';

export const DataQualityPage = () => {
  const { success } = useNotification();
  const [issues, setIssues] = useState(DATA_QUALITY_ISSUES);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleResolveIssue = (id) => {
    setIssues(issues.filter(i => i.id !== id));
    success(`Issue #${id} resolved and database ledger patched.`);
  };

  const handleRunFullAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      success('Institutional database audit completed. Integrity index: 99.4%');
    }, 800);
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 border border-neutral-300 rounded shadow-panel">
        <div>
          <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wide flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-navy-800" />
            <span>Institutional Data Quality & Integrity Diagnostics</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Automated heuristics detecting missing attributes, primary-key collisions, and outlier anomaly scores
          </p>
        </div>

        <button
          onClick={handleRunFullAudit}
          disabled={isAuditing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-800 hover:bg-navy-900 text-white rounded text-xs font-semibold shadow-sm transition-colors"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
          <span>{isAuditing ? 'Running Diagnostic Scans...' : 'Execute Comprehensive DB Audit'}</span>
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="inst-card p-4 border-l-4 border-l-teal-600">
          <div className="text-xs font-semibold uppercase text-neutral-500">Data Integrity Index</div>
          <div className="text-2xl font-bold text-teal-800 font-mono mt-1">99.64%</div>
          <div className="text-[11px] text-neutral-500 mt-1">Institutional High Conformance</div>
        </div>

        <div className="inst-card p-4 border-l-4 border-l-red-600">
          <div className="text-xs font-semibold uppercase text-neutral-500">Unresolved Anomalies</div>
          <div className="text-2xl font-bold text-red-700 font-mono mt-1">{issues.length} Issues</div>
          <div className="text-[11px] text-neutral-500 mt-1">Requires registrar verification</div>
        </div>

        <div className="inst-card p-4 border-l-4 border-l-amber-500">
          <div className="text-xs font-semibold uppercase text-neutral-500">Missing Mandatory Values</div>
          <div className="text-2xl font-bold text-amber-700 font-mono mt-1">12 Fields</div>
          <div className="text-[11px] text-neutral-500 mt-1">E.g. Sem 3 CGPA field empty</div>
        </div>

        <div className="inst-card p-4 border-l-4 border-l-navy-800">
          <div className="text-xs font-semibold uppercase text-neutral-500">Deduplication Status</div>
          <div className="text-2xl font-bold text-navy-950 font-mono mt-1">4 Conflicts</div>
          <div className="text-[11px] text-neutral-500 mt-1">Student Roll No duplications</div>
        </div>
      </div>

      {/* Issues Table */}
      <div className="inst-card">
        <div className="inst-card-header">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Active Quality Violations & Corrective Actions</span>
          </div>
          <span className="text-[11px] text-neutral-500 font-mono">{issues.length} Pending Records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-100 border-b border-neutral-200 text-neutral-700 font-semibold uppercase">
                <th className="py-2.5 px-3">Field</th>
                <th className="py-2.5 px-3">Violation Category</th>
                <th className="py-2.5 px-3">Problem Description & Student Record</th>
                <th className="py-2.5 px-3 text-center">Severity</th>
                <th className="py-2.5 px-3">Institutional Recommended Action</th>
                <th className="py-2.5 px-3 text-right">Resolution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {issues.map((iss) => (
                <tr key={iss.id} className="hover:bg-neutral-50">
                  <td className="py-2 px-3 font-mono font-bold text-navy-950">{iss.field}</td>
                  <td className="py-2 px-3 font-medium text-neutral-800">{iss.type}</td>
                  <td className="py-2 px-3 text-neutral-700">{iss.record}</td>
                  <td className="py-2 px-3 text-center">
                    <Badge variant={iss.severity.toLowerCase()} size="xs">{iss.severity}</Badge>
                  </td>
                  <td className="py-2 px-3 text-teal-800 font-medium">{iss.action}</td>
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={() => handleResolveIssue(iss.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] bg-white border border-neutral-300 rounded hover:bg-neutral-100 font-semibold text-navy-900"
                    >
                      <Wrench className="w-3 h-3 text-navy-700" />
                      <span>Resolve</span>
                    </button>
                  </td>
                </tr>
              ))}
              {issues.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-500">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1.5" />
                    <span className="font-bold text-navy-950">Zero Active Data Quality Issues Detected</span>
                    <p className="text-xs text-neutral-400 mt-0.5">All tables conform to ISO academic records standards.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataQualityPage;
