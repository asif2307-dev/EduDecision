import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  Calendar,
  Filter,
  BarChart2,
  PieChart as PieIcon,
  Download,
  BookOpen
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import { DEPARTMENTS, INSTITUTION_STATS, INITIAL_STUDENTS } from '../data/mockData';
import Badge from '../components/common/Badge';
import reportsApi from '../api/reportsApi';
import { useNotification } from '../context/NotificationContext';

export const PerformancePage = () => {
  const { success } = useNotification();
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedSem, setSelectedSem] = useState('ALL');

  // Semester comparison trend
  const semesterTrendData = [
    { sem: 'Sem 1', avgCgpa: 7.82, passRate: 85.0 },
    { sem: 'Sem 2', avgCgpa: 7.95, passRate: 86.4 },
    { sem: 'Sem 3', avgCgpa: 8.04, passRate: 88.0 },
    { sem: 'Sem 4', avgCgpa: 7.92, passRate: 84.5 },
    { sem: 'Sem 5', avgCgpa: 8.18, passRate: 89.2 },
    { sem: 'Sem 6', avgCgpa: 8.24, passRate: 91.0 },
    { sem: 'Sem 7', avgCgpa: 8.42, passRate: 93.5 },
    { sem: 'Sem 8', avgCgpa: 8.58, passRate: 96.0 },
  ];

  // Subject failure rate benchmarks
  const subjectPerformanceData = [
    { code: 'CS601', name: 'Compiler Design', passRate: 88.5, avgMarks: 78.4 },
    { code: 'CS602', name: 'Computer Networks', passRate: 84.0, avgMarks: 74.2 },
    { code: 'DS601', name: 'Deep Learning', passRate: 92.0, avgMarks: 82.5 },
    { code: 'IT401', name: 'Database Systems', passRate: 82.5, avgMarks: 72.8 },
    { code: 'EC601', name: 'VLSI Design', passRate: 80.0, avgMarks: 71.0 },
    { code: 'ME402', name: 'Fluid Mechanics', passRate: 71.5, avgMarks: 64.0 }, // Identified core failure risk
  ];

  const handleExportPerformance = () => {
    reportsApi.exportToCSV({
      title: "EduDecision Institutional Performance Benchmark Report",
      generatedAt: new Date().toLocaleString(),
      academicSession: "2024-2025 Even Semester",
      rows: subjectPerformanceData.map(s => ({
        "Course Code": s.code,
        "Course Title": s.name,
        "Pass Percentage": `${s.passRate}%`,
        "Mean Score": `${s.avgMarks} / 100`
      }))
    });
    success("Performance benchmarks exported to CSV");
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 border border-neutral-300 rounded shadow-panel">
        <div>
          <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wide">
            Institutional Performance Analytics & Benchmarks
          </h2>
          <p className="text-xs text-neutral-500">
            Semester-to-semester trajectories, core subject failure rates, and cohort progression
          </p>
        </div>

        <button
          onClick={handleExportPerformance}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs font-medium text-neutral-700 hover:bg-neutral-50 shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-navy-800" />
          <span>Export Benchmarks</span>
        </button>
      </div>

      {/* Filter Ribbon */}
      <div className="inst-card p-3 bg-white flex flex-wrap items-center gap-3 text-xs">
        <span className="font-semibold text-neutral-600">Filters:</span>
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-500">Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="py-1 px-2 border border-neutral-300 rounded bg-neutral-50 font-medium"
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d.code} value={d.code}>{d.code} - {d.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-neutral-500">Semester:</span>
          <select
            value={selectedSem}
            onChange={(e) => setSelectedSem(e.target.value)}
            className="py-1 px-2 border border-neutral-300 rounded bg-neutral-50 font-medium"
          >
            <option value="ALL">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Semester Progression Chart */}
        <div className="inst-card">
          <div className="inst-card-header">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-navy-800" />
              <span>Semester-Wise Average CGPA & Pass Rate (%)</span>
            </div>
          </div>
          <div className="p-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={semesterTrendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="sem" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" domain={[60, 100]} tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" domain={[6.0, 10.0]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', fontSize: '12px' }}
                    formatter={(val, name) => [val, name === 'passRate' ? 'Pass Percentage (%)' : 'Average CGPA']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="passRate"
                    name="Pass Rate (%)"
                    stroke="#0f2c4b"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="avgCgpa"
                    name="Mean CGPA (x10)"
                    stroke="#0d9488"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-xs text-neutral-500 text-center">
              Observations: Dip observed in Semester 4 across core engineering disciplines; steady recovery in upper semesters.
            </div>
          </div>
        </div>

        {/* Subject-Wise Pass Percentage Benchmark */}
        <div className="inst-card">
          <div className="inst-card-header">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-navy-800" />
              <span>Core Subject Pass Outcome Benchmarking</span>
            </div>
            <span className="text-[11px] text-neutral-500">Benchmark: 80%</span>
          </div>
          <div className="p-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectPerformanceData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" domain={[50, 100]} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="code" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', fontSize: '12px' }}
                    formatter={(val) => [`${val}%`, 'Pass Rate']}
                  />
                  <Bar dataKey="passRate" radius={[0, 2, 2, 0]}>
                    {subjectPerformanceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.passRate < 75 ? '#dc2626' : entry.passRate < 82 ? '#d97706' : '#0f2c4b'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900">
              <strong>Curricular Alert:</strong> ME402 (Fluid Mechanics) shows pass rate of 71.5% - below institutional standard.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePage;
