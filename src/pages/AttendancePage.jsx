import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  AlertTriangle,
  Users,
  TrendingDown,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Settings as SettingsIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import LoadingState from '../components/common/LoadingState';
import attendanceApi from '../api/attendanceApi';
import reportsApi from '../api/reportsApi';
import { useSettings } from '../context/SettingsContext';
import { useNotification } from '../context/NotificationContext';
import { DEPARTMENTS } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

export const AttendancePage = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  const { success, error } = useNotification();

  const threshold = settings.attendanceThreshold || 75;

  const [overview, setOverview] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [department, setDepartment] = useState('ALL');
  const [semester, setSemester] = useState('ALL');
  const [thresholdOnly, setThresholdOnly] = useState(false);
  const [tempThreshold, setTempThreshold] = useState(threshold);
  const [thresholdEditorOpen, setThresholdEditorOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ovData, listData] = await Promise.all([
        attendanceApi.getOverview(),
        attendanceApi.getStudentAttendance({ department, semester, thresholdOnly })
      ]);
      setOverview(ovData);
      setStudentList(listData.data);
    } catch (err) {
      error(err.message || 'Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [department, semester, thresholdOnly, threshold]);

  const handleSaveThreshold = (e) => {
    e.preventDefault();
    updateSettings({ attendanceThreshold: Number(tempThreshold) });
    setThresholdEditorOpen(false);
    success(`Institutional attendance threshold updated to ${tempThreshold}%.`);
  };

  const handleExportCSV = () => {
    reportsApi.exportToCSV({
      title: `Institutional Attendance Ledger (Threshold ${threshold}%)`,
      generatedAt: new Date().toLocaleString(),
      academicSession: settings.currentAcademicTerm,
      rows: studentList.map(s => ({
        'Student ID': s.id,
        'Roll No': s.rollNo,
        'Name': s.name,
        'Department': s.deptCode,
        'Semester': s.semester,
        'Attendance %': `${s.attendance}%`,
        'Classes Held': s.classesHeld,
        'Classes Attended': s.classesAttended,
        'Status': s.status
      }))
    });
    success('Attendance ledger exported to CSV');
  };

  const columns = [
    {
      key: 'rollNo',
      label: 'Roll / ID',
      sortable: true,
      render: (_, row) => (
        <div>
          <span className="font-mono font-bold text-navy-950 text-xs">{row.rollNo}</span>
          <div className="text-[10px] text-neutral-500 font-mono">{row.id}</div>
        </div>
      )
    },
    {
      key: 'name',
      label: 'Student Name',
      sortable: true,
      render: (val, row) => (
        <button
          onClick={() => navigate(`/students/${row.id}`)}
          className="font-bold text-navy-900 hover:text-teal-700 hover:underline text-left text-xs"
        >
          {val}
        </button>
      )
    },
    {
      key: 'deptCode',
      label: 'Department',
      sortable: true,
      render: (val) => <Badge variant="navy" size="xs">{val}</Badge>
    },
    {
      key: 'semester',
      label: 'Semester',
      sortable: true,
      align: 'center',
      render: (val) => <span className="text-xs text-neutral-700 font-medium">Sem {val}</span>
    },
    {
      key: 'classesAttended',
      label: 'Lectures Attended',
      align: 'center',
      render: (_, row) => (
        <span className="text-xs font-mono font-semibold text-neutral-800">
          {row.classesAttended} / {row.classesHeld}
        </span>
      )
    },
    {
      key: 'attendance',
      label: 'Attendance %',
      sortable: true,
      align: 'center',
      render: (val) => {
        const isBelow = val < threshold;
        return (
          <span
            className={`font-bold text-xs px-2 py-0.5 rounded ${
              isBelow
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            {val}%
          </span>
        );
      }
    },
    {
      key: 'status',
      label: 'Norm Compliance',
      sortable: true,
      align: 'center',
      render: (val) => (
        <Badge variant={val === 'SHORTAGE' ? 'danger' : 'success'} size="xs">
          {val === 'SHORTAGE' ? 'SHORTAGE (<75%)' : 'REGULAR'}
        </Badge>
      )
    },
    {
      key: 'action',
      label: 'Inspect',
      align: 'right',
      render: (_, row) => (
        <button
          onClick={() => navigate(`/students/${row.id}`)}
          className="px-2.5 py-1 text-xs bg-white border border-neutral-300 rounded hover:bg-neutral-50 text-navy-900 font-medium"
        >
          Profile
        </button>
      )
    }
  ];

  if (loading && !overview) {
    return <LoadingState message="Loading institutional attendance records..." />;
  }

  const shortagePercentage = overview
    ? ((overview.belowThreshold / overview.totalStudents) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 border border-neutral-300 rounded shadow-panel">
        <div>
          <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wide">
            Institutional Attendance Compliance & Shortage Monitoring
          </h2>
          <p className="text-xs text-neutral-500">
            Enforcing statutory institutional attendance benchmark (Configured: {threshold}%)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Configurable Threshold Button */}
          <button
            onClick={() => setThresholdEditorOpen(!thresholdEditorOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-navy-950 border border-neutral-300 rounded text-xs font-semibold shadow-sm transition-colors"
          >
            <SettingsIcon className="w-3.5 h-3.5 text-navy-700" />
            <span>Threshold: {threshold}%</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs font-medium text-neutral-700 hover:bg-neutral-50 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-navy-800" />
            <span>Export Shortage List</span>
          </button>
        </div>
      </div>

      {/* Threshold Configurator Popup */}
      {thresholdEditorOpen && (
        <div className="inst-card p-4 bg-navy-50/50 border border-navy-300">
          <form onSubmit={handleSaveThreshold} className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-navy-950">
              Institutional Statutory Attendance Benchmark (%):
            </span>
            <input
              type="number"
              min="50"
              max="90"
              value={tempThreshold}
              onChange={(e) => setTempThreshold(e.target.value)}
              className="w-20 px-2 py-1 bg-white border border-neutral-300 rounded text-xs font-bold text-navy-900"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-navy-800 text-white rounded font-medium hover:bg-navy-900"
            >
              Update Benchmark
            </button>
            <button
              type="button"
              onClick={() => setThresholdEditorOpen(false)}
              className="px-2 py-1 text-neutral-500 hover:text-neutral-800"
            >
              Cancel
            </button>
            <span className="text-[11px] text-neutral-500 italic ml-auto">
              * Per University Regulation Clause 4.2, students under {threshold}% require Dean exemption or remedial hours.
            </span>
          </form>
        </div>
      )}

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="inst-card p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Total Monitored Scholars
          </div>
          <div className="text-2xl font-bold text-navy-950 mt-1">
            {overview?.totalStudents || 0}
          </div>
          <div className="text-xs text-neutral-500 mt-1">Across all registered semesters</div>
        </div>

        <div className="inst-card p-4 border-l-4 border-l-teal-600">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Cohort Average Attendance
          </div>
          <div className="text-2xl font-bold text-teal-800 mt-1">
            {overview?.avgAttendance || 0}%
          </div>
          <div className="text-xs text-neutral-500 mt-1">Above institutional target</div>
        </div>

        <div className="inst-card p-4 border-l-4 border-l-red-600">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Students in Shortage (&lt;{threshold}%)
          </div>
          <div className="text-2xl font-bold text-red-700 mt-1">
            {overview?.belowThreshold || 0}
          </div>
          <div className="text-xs text-red-700 font-semibold mt-1">
            {shortagePercentage}% of cohort affected
          </div>
        </div>

        <div className="inst-card p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Statutory Threshold Norm
          </div>
          <div className="text-2xl font-bold text-navy-900 mt-1">
            {threshold}%
          </div>
          <div className="text-xs text-neutral-500 mt-1">University Examination Eligibility</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Department Attendance Bar Chart */}
        <div className="lg:col-span-2 inst-card">
          <div className="inst-card-header">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-navy-800" />
              <span>Department-Wise Mean Attendance Rate (%)</span>
            </div>
            <span className="text-[11px] text-neutral-500">Threshold Reference: {threshold}%</span>
          </div>
          <div className="p-4">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={overview?.departmentStats || []} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="deptCode" tick={{ fontSize: 11 }} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', fontSize: '12px' }}
                    formatter={(val) => [`${val}%`, 'Average Attendance']}
                  />
                  <Bar dataKey="avgAttendance" fill="#0f2c4b" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Shortage Count by Department */}
        <div className="inst-card">
          <div className="inst-card-header">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-700" />
              <span>Shortage Count by Department</span>
            </div>
          </div>
          <div className="p-4 space-y-2.5 text-xs">
            {(overview?.departmentStats || []).map((dept) => (
              <div key={dept.deptCode} className="flex items-center justify-between py-1.5 border-b border-neutral-100 last:border-b-0">
                <div>
                  <span className="font-bold text-navy-950">{dept.deptCode}</span>
                  <div className="text-[10px] text-neutral-500 truncate max-w-[140px]">{dept.name}</div>
                </div>
                <div className="text-right">
                  <span className={`font-bold ${dept.shortageCount > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                    {dept.shortageCount} Shortages
                  </span>
                  <div className="text-[10px] text-neutral-400">Avg: {dept.avgAttendance}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="inst-card p-3 bg-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-neutral-500 font-medium">Department:</span>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="py-1.5 px-2 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-800 font-medium"
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d.code} value={d.code}>{d.code} - {d.name}</option>
            ))}
          </select>

          <span className="text-xs text-neutral-500 font-medium ml-2">Semester:</span>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="py-1.5 px-2 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-800 font-medium"
          >
            <option value="ALL">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-red-700 bg-red-50 px-2.5 py-1.5 rounded border border-red-200">
          <input
            type="checkbox"
            checked={thresholdOnly}
            onChange={(e) => setThresholdOnly(e.target.checked)}
            className="rounded border-red-300 text-red-700 focus:ring-red-600"
          />
          <span>Show Only Below Threshold (&lt;{threshold}%)</span>
        </label>
      </div>

      {/* Student Attendance Table */}
      <DataTable
        columns={columns}
        data={studentList}
        loading={loading}
      />
    </div>
  );
};

export default AttendancePage;
