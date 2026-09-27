import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  Save,
  RotateCcw,
  CheckCircle2,
  Server,
  Database,
  Lock,
  Sliders
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/common/Badge';

export const SettingsPage = () => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { success, info } = useNotification();
  const { user } = useAuth();

  const [form, setForm] = useState({ ...settings });
  const [activeTab, setActiveTab] = useState('academic'); // 'academic' | 'security' | 'api'

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(form);
    success('Institutional parameters updated in local registry.');
  };

  const handleReset = () => {
    resetSettings();
    setForm({
      institutionName: "National Institute of Science & Technology",
      institutionCode: "NIST-ENG-042",
      attendanceThreshold: 75,
      probationCgpaThreshold: 6.0,
      currentAcademicTerm: "2024-2025 (Even Semester)",
      internalWeightage: 40,
      externalWeightage: 60,
      passingMarksTotal: 45
    });
    info('Institutional settings restored to default baseline.');
  };

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 border border-neutral-300 rounded shadow-panel">
        <div>
          <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wide flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-navy-800" />
            <span>Institutional Governance & System Settings</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Configure statutory attendance benchmarks, examination weightage matrices, and FastAPI endpoints
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white hover:bg-neutral-50 text-neutral-700 font-medium"
          >
            Reset to Baseline
          </button>
          <button
            type="submit"
            form="settings-form"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-navy-800 hover:bg-navy-900 text-white rounded text-xs font-semibold shadow-sm transition-colors border border-navy-950"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-neutral-300 bg-white px-3 pt-2 rounded-t shadow-sm">
        <button
          onClick={() => setActiveTab('academic')}
          className={`px-4 py-2 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'academic'
              ? 'border-navy-800 text-navy-950 bg-neutral-50'
              : 'border-transparent text-neutral-600 hover:text-navy-900'
          }`}
        >
          <Sliders className="w-4 h-4 text-navy-800" />
          <span>Academic & Regulatory Norms</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'security'
              ? 'border-navy-800 text-navy-950 bg-neutral-50'
              : 'border-transparent text-neutral-600 hover:text-navy-900'
          }`}
        >
          <Shield className="w-4 h-4 text-navy-800" />
          <span>Role Permissions (RBAC)</span>
        </button>

        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'api'
              ? 'border-navy-800 text-navy-950 bg-neutral-50'
              : 'border-transparent text-neutral-600 hover:text-navy-900'
          }`}
        >
          <Server className="w-4 h-4 text-navy-800" />
          <span>Backend & FastAPI Endpoint Status</span>
        </button>
      </div>

      {/* TAB 1: ACADEMIC NORMS */}
      {activeTab === 'academic' && (
        <form id="settings-form" onSubmit={handleSave} className="inst-card p-6 bg-white space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Institution Legal Name</label>
              <input
                type="text"
                required
                value={form.institutionName}
                onChange={(e) => setForm({ ...form, institutionName: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded font-medium text-navy-950"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Institutional Code / AISHE Code</label>
              <input
                type="text"
                required
                value={form.institutionCode}
                onChange={(e) => setForm({ ...form, institutionCode: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded font-mono uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Mandatory Attendance Benchmark (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="50"
                  max="90"
                  required
                  value={form.attendanceThreshold}
                  onChange={(e) => setForm({ ...form, attendanceThreshold: Number(e.target.value) })}
                  className="w-24 px-3 py-1.5 border border-neutral-300 rounded font-mono font-bold text-navy-950"
                />
                <span className="text-neutral-500 font-sans">Min % required for exam eligibility</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Probation CGPA Cutoff
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="4.0"
                  max="8.0"
                  required
                  value={form.probationCgpaThreshold}
                  onChange={(e) => setForm({ ...form, probationCgpaThreshold: Number(e.target.value) })}
                  className="w-24 px-3 py-1.5 border border-neutral-300 rounded font-mono font-bold text-navy-950"
                />
                <span className="text-neutral-500 font-sans">Scholars &lt; cutoff placed on probation</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Active Academic Term</label>
              <input
                type="text"
                required
                value={form.currentAcademicTerm}
                onChange={(e) => setForm({ ...form, currentAcademicTerm: e.target.value })}
                className="w-full px-3 py-1.5 border border-neutral-300 rounded font-medium"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-200">
            <h4 className="text-xs font-bold text-navy-950 uppercase mb-3">Examination Weightage Matrix</h4>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded">
                <div className="text-[10px] text-neutral-500 font-bold uppercase">Internal Weightage</div>
                <div className="text-lg font-bold text-navy-950 font-mono mt-1">{form.internalWeightage}% (40 Marks)</div>
                <div className="text-[10px] text-neutral-400">Continuous Assessment Tests</div>
              </div>
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded">
                <div className="text-[10px] text-neutral-500 font-bold uppercase">External Weightage</div>
                <div className="text-lg font-bold text-navy-950 font-mono mt-1">{form.externalWeightage}% (60 Marks)</div>
                <div className="text-[10px] text-neutral-400">University Theory Exam</div>
              </div>
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded">
                <div className="text-[10px] text-neutral-500 font-bold uppercase">Aggregate Passing Floor</div>
                <div className="text-lg font-bold text-teal-800 font-mono mt-1">{form.passingMarksTotal} / 100 Marks</div>
                <div className="text-[10px] text-neutral-400">Min composite score</div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: RBAC MATRIX */}
      {activeTab === 'security' && (
        <div className="inst-card bg-white p-6 space-y-4 text-xs">
          <h3 className="text-xs font-bold text-navy-950 uppercase">Role-Based Access Control (RBAC) Entitlements</h3>
          <p className="text-neutral-600">
            Current active session role: <strong className="text-teal-800 font-mono">{user?.role}</strong> ({user?.name})
          </p>

          <table className="w-full text-left border border-neutral-200">
            <thead className="bg-neutral-100 uppercase text-neutral-700">
              <tr>
                <th className="p-2.5 border-b">Functional Module</th>
                <th className="p-2.5 border-b text-center">ADMIN</th>
                <th className="p-2.5 border-b text-center">HOD</th>
                <th className="p-2.5 border-b text-center">FACULTY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              <tr>
                <td className="p-2 font-medium">Institution-Wide Analytics & Dashboard</td>
                <td className="p-2 text-center text-emerald-700 font-bold">✓ Full</td>
                <td className="p-2 text-center text-emerald-700 font-bold">✓ Dept Scope</td>
                <td className="p-2 text-center text-emerald-700 font-bold">✓ Assigned Scope</td>
              </tr>
              <tr>
                <td className="p-2 font-medium">Student Registry & Record Add/Delete</td>
                <td className="p-2 text-center text-emerald-700 font-bold">✓ Full</td>
                <td className="p-2 text-center text-teal-700 font-medium">✓ View / Edit Dept</td>
                <td className="p-2 text-center text-neutral-400 font-medium">View Only</td>
              </tr>
              <tr>
                <td className="p-2 font-medium">Attendance & Marks Entry</td>
                <td className="p-2 text-center text-emerald-700 font-bold">✓ Full</td>
                <td className="p-2 text-center text-emerald-700 font-bold">✓ Dept Override</td>
                <td className="p-2 text-center text-emerald-700 font-bold">✓ Primary Entry</td>
              </tr>
              <tr>
                <td className="p-2 font-medium">Data Ingestion (CSV / Excel ETL)</td>
                <td className="p-2 text-center text-emerald-700 font-bold">✓ Ingestion Privileges</td>
                <td className="p-2 text-center text-red-700 font-bold">✕ Restricted</td>
                <td className="p-2 text-center text-red-700 font-bold">✕ Restricted</td>
              </tr>
              <tr>
                <td className="p-2 font-medium">Senate Reports & CSV Exports</td>
                <td className="p-2 text-center text-emerald-700 font-bold">✓ Full Exports</td>
                <td className="p-2 text-center text-emerald-700 font-bold">✓ Dept Reports</td>
                <td className="p-2 text-center text-neutral-400 font-medium">Class Reports</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: BACKEND API ARCHITECTURE */}
      {activeTab === 'api' && (
        <div className="inst-card bg-white p-6 space-y-4 text-xs">
          <h3 className="text-xs font-bold text-navy-950 uppercase flex items-center gap-2">
            <Server className="w-4 h-4 text-teal-700" />
            <span>Python FastAPI & PostgreSQL Infrastructure</span>
          </h3>

          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-700">Configured Base API URL (VITE_API_BASE_URL):</span>
              <span className="font-mono text-xs font-bold text-navy-950 bg-white px-2 py-1 rounded border border-neutral-300">
                {apiBaseUrl}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-700">Operating Mode:</span>
              <Badge variant="teal" size="xs">Hybrid Demo + FastAPI Ready</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-navy-950 uppercase text-[11px]">Integrated Backend Services:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-2.5 border border-neutral-200 rounded bg-white">
                <div className="font-bold text-navy-950">FastAPI & PostgreSQL ORM</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">High-performance async REST API with JWT authorization</div>
              </div>
              <div className="p-2.5 border border-neutral-200 rounded bg-white">
                <div className="font-bold text-navy-950">Pandas & NumPy Computation Engine</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Vectorized metrics aggregation and attendance tracking</div>
              </div>
              <div className="p-2.5 border border-neutral-200 rounded bg-white">
                <div className="font-bold text-navy-950">SciPy Statistical Modules</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Two-sample t-Test, One-Way ANOVA, and Chi-Square independence</div>
              </div>
              <div className="p-2.5 border border-neutral-200 rounded bg-white">
                <div className="font-bold text-navy-950">Scikit-learn Predictive Analytics</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">OLS linear regression and early-warning probation classification</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
