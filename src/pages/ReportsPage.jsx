import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Filter,
  CheckCircle2,
  Table,
  Eye,
  FileCheck
} from 'lucide-react';
import Badge from '../components/common/Badge';
import LoadingState from '../components/common/LoadingState';
import reportsApi from '../api/reportsApi';
import { useNotification } from '../context/NotificationContext';
import { DEPARTMENTS } from '../data/mockData';

export const ReportsPage = () => {
  const { success, error } = useNotification();

  const [reportType, setReportType] = useState('student_performance');
  const [department, setDepartment] = useState('ALL');
  const [semester, setSemester] = useState('ALL');
  const [dateRange, setDateRange] = useState('2024-2025 Even Sem');

  const [generatedReport, setGeneratedReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const REPORT_TYPES = [
    { id: 'student_performance', name: 'Student Performance & Marks Audit' },
    { id: 'attendance_shortage', name: 'Mandatory Attendance Shortage (<75%) Docket' },
    { id: 'department_comparison', name: 'Inter-Departmental Benchmarking Report' },
    { id: 'at_risk_summary', name: 'Academic Probation & At-Risk Mentoring Roster' },
    { id: 'statistical_summary', name: 'Institutional Psychometric & Statistical Brief' },
    { id: 'executive_summary', name: 'Executive Institutional Summary' },
  ];

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const rep = await reportsApi.generateReport(reportType, { department, semester, dateRange });
      setGeneratedReport(rep);
      success(`${rep.title} generated successfully.`);
    } catch (err) {
      error('Failed to generate institutional report');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!generatedReport) return;
    reportsApi.exportToCSV(generatedReport);
    success('Report data exported to CSV');
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 border border-neutral-300 rounded shadow-panel no-print">
        <div>
          <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wide flex items-center gap-2">
            <FileText className="w-4 h-4 text-navy-800" />
            <span>Institutional Report Generation & Regulatory Export</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Produce formal institutional records for Academic Council, NIRF audits, and University Senate
          </p>
        </div>

        {generatedReport && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs font-semibold text-neutral-700 hover:bg-neutral-50 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-navy-800" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handlePrintPDF}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-800 hover:bg-navy-900 text-white rounded text-xs font-semibold shadow-sm transition-colors border border-navy-950"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Export PDF</span>
            </button>
          </div>
        )}
      </div>

      {/* Report Configuration Form */}
      <div className="inst-card p-4 bg-white space-y-4 no-print">
        <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wide pb-2 border-b border-neutral-200">
          Report Parameters & Scope Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* Report Type */}
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Target Report Template</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full py-1.5 px-2.5 bg-neutral-50 border border-neutral-300 rounded text-xs text-navy-950 font-semibold"
            >
              {REPORT_TYPES.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Department Filter</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full py-1.5 px-2.5 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-800 font-medium"
            >
              <option value="ALL">All Departments (Institutional)</option>
              {DEPARTMENTS.map(d => (
                <option key={d.code} value={d.code}>{d.code} - {d.name}</option>
              ))}
            </select>
          </div>

          {/* Semester Filter */}
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Semester Filter</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full py-1.5 px-2.5 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-800 font-medium"
            >
              <option value="ALL">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>

          {/* Generate Button */}
          <div className="flex items-end">
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="w-full py-2 px-4 bg-navy-800 hover:bg-navy-900 text-white rounded font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <FileCheck className="w-4 h-4" />
              <span>{loading ? 'Synthesizing...' : 'Generate Official Report'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Generated Report Display Area (Optimized for both UI inspection & Print View) */}
      {generatedReport ? (
        <div className="inst-card bg-white p-6 border border-neutral-300 shadow-panel">
          {/* Institutional Official Letterhead Header for Print / PDF */}
          <div className="border-b-2 border-navy-950 pb-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-12 h-12 object-contain bg-white rounded p-0.5 border border-neutral-300"
              />
              <div>
                <h1 className="text-base font-bold text-navy-950 font-sans tracking-tight leading-tight">
                  NATIONAL INSTITUTE OF SCIENCE & TECHNOLOGY
                </h1>
                <div className="text-xs text-neutral-600 font-medium">
                  Office of the Academic Dean & Institutional Decision Analytics
                </div>
                <div className="text-[11px] font-mono text-teal-800">
                  Affiliated to State Technological University • Accreditation Grade A++
                </div>
              </div>
            </div>

            <div className="text-right text-xs text-neutral-600 font-mono">
              <div>Ref: NIST/REP/2026/042</div>
              <div>Date: {generatedReport.generatedAt}</div>
              <div>Term: {generatedReport.academicSession}</div>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wide">
              {generatedReport.title}
            </h2>
          </div>

          {/* Report Summary KPIs */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-neutral-50 border border-neutral-200 rounded mb-4 text-xs font-sans">
            {Object.entries(generatedReport.summary || {}).map(([key, val]) => (
              <div key={key}>
                <span className="text-[10px] text-neutral-500 uppercase font-semibold block">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="font-bold text-navy-950 text-sm">{val}</span>
              </div>
            ))}
          </div>

          {/* Report Data Table */}
          <div className="overflow-x-auto border border-neutral-200 rounded">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-100 border-b border-neutral-300 font-bold uppercase text-neutral-800">
                  {Object.keys(generatedReport.rows[0] || {}).map((col) => (
                    <th key={col} className="p-2 border-r border-neutral-200 last:border-r-0">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {generatedReport.rows.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? 'bg-neutral-50/50' : 'bg-white'}>
                    {Object.values(row).map((val, cIdx) => (
                      <td key={cIdx} className="p-2 border-r border-neutral-100 last:border-r-0">
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Official Signatures Footer for Print */}
          <div className="mt-8 pt-6 border-t border-neutral-300 grid grid-cols-3 gap-6 text-xs text-center">
            <div>
              <div className="h-8 border-b border-neutral-400 mb-1" />
              <div className="font-bold text-neutral-800">Data Analytics Officer</div>
              <div className="text-[10px] text-neutral-500">EduDecision System</div>
            </div>
            <div>
              <div className="h-8 border-b border-neutral-400 mb-1" />
              <div className="font-bold text-neutral-800">Controller of Examinations</div>
              <div className="text-[10px] text-neutral-500">Evaluation Division</div>
            </div>
            <div>
              <div className="h-8 border-b border-neutral-400 mb-1" />
              <div className="font-bold text-neutral-800">Dean (Academic Affairs)</div>
              <div className="text-[10px] text-neutral-500">National Institute of Science & Tech</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="inst-card p-12 bg-white text-center text-neutral-500">
          <FileText className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-navy-950 mb-1">No Report Generated Yet</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
            Select a template and click <strong>Generate Official Report</strong> to assemble live institutional records.
          </p>
          <button
            onClick={handleGenerateReport}
            className="px-4 py-1.5 text-xs font-semibold bg-navy-800 text-white rounded hover:bg-navy-900"
          >
            Generate Performance Audit
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
