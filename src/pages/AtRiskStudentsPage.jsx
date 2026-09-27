import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ShieldAlert,
  Search,
  Eye,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  Download,
  LifeBuoy
} from 'lucide-react';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import LoadingState from '../components/common/LoadingState';
import atRiskApi from '../api/atRiskApi';
import reportsApi from '../api/reportsApi';
import { useNotification } from '../context/NotificationContext';
import { DEPARTMENTS } from '../data/mockData';

export const AtRiskStudentsPage = () => {
  const navigate = useNavigate();
  const { success, error } = useNotification();

  const [students, setStudents] = useState([]);
  const [counts, setCounts] = useState({ high: 0, medium: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [riskLevel, setRiskLevel] = useState('ALL');
  const [department, setDepartment] = useState('ALL');
  const [search, setSearch] = useState('');

  // Mentoring Intervention Modal
  const [mentoringModalOpen, setMentoringModalOpen] = useState(false);
  const [targetStudent, setTargetStudent] = useState(null);
  const [mentoringForm, setMentoringForm] = useState({
    date: new Date().toISOString().split('T')[0],
    facultyAdvisor: 'Dr. Ramesh Sharma',
    notes: 'Counseling regarding low internal test marks and attendance shortage.',
    actionPlan: 'Remedial coaching in core subjects and weekly attendance monitoring.'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await atRiskApi.getAtRiskStudents({ riskLevel, department });
      setStudents(res.data);
      setCounts(res.counts);
    } catch (err) {
      error(err.message || 'Failed to load at-risk students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [riskLevel, department]);

  const handleOpenMentoring = (student) => {
    setTargetStudent(student);
    setMentoringModalOpen(true);
  };

  const handleMentoringSubmit = async (e) => {
    e.preventDefault();
    try {
      await atRiskApi.logIntervention(targetStudent.id, mentoringForm);
      success(`Mentoring session scheduled for ${targetStudent.name}. Logged in academic diary.`);
      setMentoringModalOpen(false);
    } catch (err) {
      error('Failed to log intervention');
    }
  };

  const handleExportRiskReport = () => {
    reportsApi.exportToCSV({
      title: "EduDecision Academic Probation & At-Risk Radar Export",
      generatedAt: new Date().toLocaleString(),
      academicSession: "2024-2025 Even Semester",
      rows: students.map(s => ({
        "Student ID": s.id,
        "Roll No": s.rollNo,
        "Name": s.name,
        "Department": s.deptCode,
        "Semester": s.semester,
        "Risk Priority": s.riskLevel,
        "Attendance": `${s.attendance}%`,
        "CGPA": s.cgpa,
        "Backlogs": s.backlogs,
        "Contributing Risk Factors": (s.riskFactors || []).join('; ')
      }))
    });
    success("At-Risk Student Docket exported to CSV");
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: 'name',
      label: 'Student / Roll No',
      sortable: true,
      render: (_, row) => (
        <div>
          <button
            onClick={() => navigate(`/students/${row.id}`)}
            className="font-bold text-navy-950 hover:text-teal-700 hover:underline text-left text-xs"
          >
            {row.name}
          </button>
          <div className="text-[10px] text-neutral-500 font-mono">{row.id} ({row.rollNo})</div>
        </div>
      )
    },
    {
      key: 'deptCode',
      label: 'Department',
      sortable: true,
      render: (val, row) => (
        <span className="text-xs font-semibold text-neutral-800">
          {val} <span className="text-[10px] text-neutral-400 font-normal">Sem {row.semester}</span>
        </span>
      )
    },
    {
      key: 'riskLevel',
      label: 'Analytical Risk',
      sortable: true,
      align: 'center',
      render: (val) => (
        <Badge variant={val.toLowerCase()} size="xs">
          {val} PRIORITY
        </Badge>
      )
    },
    {
      key: 'attendance',
      label: 'Attendance',
      sortable: true,
      align: 'center',
      render: (val) => (
        <span className={`font-bold text-xs ${val < 70 ? 'text-red-700' : 'text-amber-700'}`}>
          {val}%
        </span>
      )
    },
    {
      key: 'cgpa',
      label: 'CGPA',
      sortable: true,
      align: 'center',
      render: (val) => (
        <span className={`font-bold text-xs ${val < 6.0 ? 'text-red-700' : 'text-neutral-800'}`}>
          {val}
        </span>
      )
    },
    {
      key: 'backlogs',
      label: 'Backlogs',
      sortable: true,
      align: 'center',
      render: (val) => (
        <span className={`font-bold text-xs ${val > 0 ? 'text-red-700 font-mono' : 'text-neutral-500'}`}>
          {val}
        </span>
      )
    },
    {
      key: 'riskFactors',
      label: 'Contributing Risk Indicators',
      render: (factors) => (
        <div className="flex flex-wrap gap-1">
          {(factors || []).map((f, i) => (
            <span key={i} className="px-1.5 py-0.5 bg-neutral-100 text-neutral-700 border border-neutral-200 rounded text-[10px]">
              {f}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Intervention',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenMentoring(row)}
            className="px-2 py-1 bg-navy-800 hover:bg-navy-900 text-white rounded text-[11px] font-medium shadow-sm transition-colors"
          >
            Mentoring
          </button>
          <button
            onClick={() => navigate(`/students/${row.id}`)}
            className="p-1 bg-white border border-neutral-300 rounded hover:bg-neutral-50 text-navy-900"
            title="Inspect Dossier"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 border border-neutral-300 rounded shadow-panel">
        <div>
          <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wide flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>At-Risk Students & Early-Warning Radar</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Algorithmic early identification based on attendance shortfall, low internals, and accumulated backlogs
          </p>
        </div>

        <button
          onClick={handleExportRiskReport}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs font-medium text-neutral-700 hover:bg-neutral-50 shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-navy-800" />
          <span>Export Risk Docket</span>
        </button>
      </div>

      {/* Institutional Disclaimer Banner (Requirement 17) */}
      <div className="p-3 bg-amber-50/70 border border-amber-300 rounded text-xs text-amber-900 flex items-start gap-2.5">
        <LifeBuoy className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Institutional Governance Note:</strong> Risk classification is an analytical indicator intended solely for proactive academic mentoring and remediation. It does <strong>not</strong> constitute an official disciplinary sanction or final institutional judgment.
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="inst-card p-4 border-l-4 border-l-red-600">
          <div className="text-xs font-semibold uppercase text-neutral-500">High Risk Priority</div>
          <div className="text-2xl font-bold text-red-700 mt-1">{counts.high} Students</div>
          <div className="text-[11px] text-neutral-500 mt-1">Critical attendance (&lt;65%) or &gt;2 backlogs</div>
        </div>

        <div className="inst-card p-4 border-l-4 border-l-amber-500">
          <div className="text-xs font-semibold uppercase text-neutral-500">Medium Risk (Watchlist)</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{counts.medium} Students</div>
          <div className="text-[11px] text-neutral-500 mt-1">Borderline attendance (70-75%)</div>
        </div>

        <div className="inst-card p-4 border-l-4 border-l-navy-800">
          <div className="text-xs font-semibold uppercase text-neutral-500">Total Flagged Cohort</div>
          <div className="text-2xl font-bold text-navy-950 mt-1">{counts.total} Students</div>
          <div className="text-[11px] text-neutral-500 mt-1">Assigned to academic mentors</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="inst-card p-3 bg-white flex flex-wrap items-center justify-between gap-2.5">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search flagged students by name or ID..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-neutral-300 rounded focus:border-navy-700 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-neutral-500 font-medium">Risk Level:</span>
          <select
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value)}
            className="py-1.5 px-2 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-800 font-medium"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">High Risk Only</option>
            <option value="MEDIUM">Medium Risk Only</option>
          </select>

          <span className="text-xs text-neutral-500 font-medium ml-2">Department:</span>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="py-1.5 px-2 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-800 font-medium"
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d.code} value={d.code}>{d.code}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredStudents}
        loading={loading}
      />

      {/* Mentoring Session Modal */}
      {targetStudent && (
        <Modal
          isOpen={mentoringModalOpen}
          onClose={() => setMentoringModalOpen(false)}
          title={`Schedule Mentoring Intervention: ${targetStudent.name}`}
          subtitle={`Student ID: ${targetStudent.id} | Department: ${targetStudent.deptCode}`}
          footer={
            <>
              <button
                type="button"
                onClick={() => setMentoringModalOpen(false)}
                className="px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="mentoring-form"
                className="px-3.5 py-1.5 text-xs font-medium bg-navy-800 text-white rounded hover:bg-navy-900"
              >
                Log Intervention
              </button>
            </>
          }
        >
          <form id="mentoring-form" onSubmit={handleMentoringSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Session Date</label>
                <input
                  type="date"
                  required
                  value={mentoringForm.date}
                  onChange={(e) => setMentoringForm({ ...mentoringForm, date: e.target.value })}
                  className="w-full px-3 py-1.5 border border-neutral-300 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Assigned Faculty Mentor</label>
                <input
                  type="text"
                  required
                  value={mentoringForm.facultyAdvisor}
                  onChange={(e) => setMentoringForm({ ...mentoringForm, facultyAdvisor: e.target.value })}
                  className="w-full px-3 py-1.5 border border-neutral-300 rounded"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Diagnostic Advisory Notes</label>
              <textarea
                rows={3}
                required
                value={mentoringForm.notes}
                onChange={(e) => setMentoringForm({ ...mentoringForm, notes: e.target.value })}
                className="w-full px-3 py-1.5 border border-neutral-300 rounded focus:border-navy-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Remedial Action Plan</label>
              <input
                type="text"
                required
                value={mentoringForm.actionPlan}
                onChange={(e) => setMentoringForm({ ...mentoringForm, actionPlan: e.target.value })}
                className="w-full px-3 py-1.5 border border-neutral-300 rounded"
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AtRiskStudentsPage;
