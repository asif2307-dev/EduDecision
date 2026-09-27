import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  Award,
  CalendarCheck,
  AlertTriangle,
  Building2,
  TrendingUp,
  ArrowRight,
  Download,
  Filter,
  CheckCircle,
  FileText,
  Clock,
  ExternalLink
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
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import LoadingState from '../components/common/LoadingState';
import { INSTITUTION_STATS, DEPARTMENTS, DECISION_INSIGHTS, INITIAL_STUDENTS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import reportsApi from '../api/reportsApi';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { success } = useNotification();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');

  // Chart color palette adhering strictly to Three-Tone system:
  // Primary Navy: #0f2c4b / #1f5999
  // Supporting Teal: #0d9488 / #14b8a6
  // Neutral: #94a3b8 / #e2e8f0
  const CHART_COLORS = ['#0f2c4b', '#0d9488', '#2563eb', '#f59e0b', '#dc2626'];

  const deptComparisonData = DEPARTMENTS.map(d => ({
    name: d.code,
    fullName: d.name,
    cgpa: d.avgCgpa,
    attendance: d.avgAttendance,
    passRate: d.passPercentage
  }));

  const handleExportSummary = () => {
    reportsApi.exportToCSV({
      title: "Executive Institutional Performance Dashboard Export",
      generatedAt: new Date().toLocaleString(),
      academicSession: "2024-2025 Even Semester",
      rows: deptComparisonData
    });
    success('Institutional dashboard summary exported to CSV');
  };

  if (loading) {
    return <LoadingState message="Aggregating institutional data..." />;
  }

  return (
    <div className="space-y-5">
      {/* Institutional Top Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 border border-neutral-300 rounded shadow-panel">
        <div>
          <div className="text-xs text-neutral-500 font-medium">
            Institutional Performance & Decision Cockpit
          </div>
          <div className="text-sm font-bold text-navy-950 flex items-center gap-2">
            <span>Academic Cycle 2024-2025</span>
            <Badge variant="teal" size="xs">Live Term Active</Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-neutral-500 font-medium">Department View:</span>
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="py-1 px-2.5 bg-neutral-50 border border-neutral-300 rounded text-xs text-navy-900 font-semibold focus:outline-none focus:border-navy-700"
            >
              <option value="ALL">All Departments (Aggregate)</option>
              {DEPARTMENTS.map(d => (
                <option key={d.code} value={d.code}>{d.code} - {d.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleExportSummary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs font-medium text-neutral-700 hover:bg-neutral-50 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-navy-800" />
            <span>Export Metrics</span>
          </button>
        </div>
      </div>

      {/* Top 6 Institutional Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <StatCard
          title="Total Students"
          value={INSTITUTION_STATS.totalStudents.toLocaleString()}
          subtext="Across 5 Depts"
          icon={Users}
          trend="+4.2% YoY"
          trendType="positive"
          onClick={() => navigate('/students')}
        />
        <StatCard
          title="Total Faculty"
          value={INSTITUTION_STATS.totalFaculty}
          subtext="Student ratio 1:19"
          icon={GraduationCap}
          trend="Full Cadre"
          trendType="neutral"
          onClick={() => navigate('/faculty')}
        />
        <StatCard
          title="Average CGPA"
          value={INSTITUTION_STATS.avgCgpa}
          subtext="Institutional Benchmark"
          icon={Award}
          trend="+0.14 vs LY"
          trendType="positive"
          onClick={() => navigate('/performance')}
        />
        <StatCard
          title="Avg Attendance"
          value={`${INSTITUTION_STATS.avgAttendance}%`}
          subtext="Min norm: 75%"
          icon={CalendarCheck}
          trend="-2.1% (Exam Month)"
          trendType="negative"
          onClick={() => navigate('/attendance')}
        />
        <StatCard
          title="Students At Risk"
          value={INSTITUTION_STATS.studentsAtRisk}
          subtext="3.7% of cohort"
          icon={AlertTriangle}
          trend="18 High Priority"
          trendType="negative"
          onClick={() => navigate('/at-risk')}
        />
        <StatCard
          title="Departments"
          value={INSTITUTION_STATS.activeDepartments}
          subtext="Engineering & Tech"
          icon={Building2}
          trend="100% Accredited"
          trendType="neutral"
          onClick={() => navigate('/departments')}
        />
      </div>

      {/* Row 1: Charts - Department Benchmarking & CGPA Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Department Performance Bar Chart (2 cols) */}
        <div className="lg:col-span-2 inst-card">
          <div className="inst-card-header">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-navy-800" />
              <span>Inter-Departmental Performance & Pass Rates</span>
            </div>
            <Link to="/performance" className="text-xs text-navy-700 hover:text-navy-950 font-medium flex items-center gap-1">
              Full Analysis <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptComparisonData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#334155' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#334155' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', fontSize: '12px', borderRadius: '4px' }}
                    formatter={(value, name) => [
                      name === 'cgpa' ? `${(value * 10).toFixed(1)}% (CGPA ${value})` : `${value}%`,
                      name === 'attendance' ? 'Average Attendance' : name === 'passRate' ? 'Pass Percentage' : 'CGPA Index'
                    ]}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="passRate" name="Pass Rate (%)" fill="#0f2c4b" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="attendance" name="Attendance (%)" fill="#0d9488" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 pt-3 border-t border-neutral-200 text-xs text-neutral-600 flex items-center justify-between">
              <span>Highest Performing: <strong className="text-navy-950">Data Science & AI (94.0% Pass)</strong></span>
              <span>Requires Remedial Action: <strong className="text-red-700">Mechanical Eng (79.5% Pass)</strong></span>
            </div>
          </div>
        </div>

        {/* CGPA Distribution (1 col) */}
        <div className="inst-card">
          <div className="inst-card-header">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-navy-800" />
              <span>CGPA Band Distribution</span>
            </div>
            <span className="text-[11px] text-neutral-500">Cohort n=1,800</span>
          </div>
          <div className="p-4">
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={INSTITUTION_STATS.cgpaDistribution} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="range" tick={{ fontSize: 11, fill: '#1e293b' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', fontSize: '12px' }}
                    formatter={(val) => [`${val} Students`, 'Count']}
                  />
                  <Bar dataKey="count" fill="#1b5083" radius={[0, 2, 2, 0]}>
                    {INSTITUTION_STATS.cgpaDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#dc2626' : index === 4 ? '#0d9488' : '#1b5083'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-xs text-neutral-600 divide-y divide-neutral-100">
              <div className="flex justify-between py-1">
                <span>Distinction (&gt;= 8.0 CGPA):</span>
                <span className="font-semibold text-navy-950">745 students (41.4%)</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Probation Risk (&lt; 6.0 CGPA):</span>
                <span className="font-semibold text-red-700">112 students (6.2%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Attendance Trend & Enrollment Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Attendance Progression Line Chart */}
        <div className="inst-card">
          <div className="inst-card-header">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-navy-800" />
              <span>Institutional Monthly Attendance Trend</span>
            </div>
            <span className="text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 border border-red-200 rounded">
              Shortage Warning Threshold: 75%
            </span>
          </div>
          <div className="p-4">
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={INSTITUTION_STATS.attendanceTrend} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', fontSize: '12px' }}
                    formatter={(val) => [`${val}%`, 'Attendance Rate']}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    name="Attendance %"
                    stroke="#0f2c4b"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#0d9488' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="p-2.5 mt-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Mid-Term Notice:</strong> Attendance dipped to 76.8% during November mid-term tests. 42 students in IT and Mechanical branches currently in shortage list.
              </div>
            </div>
          </div>
        </div>

        {/* Key Decision-Support Action Cards */}
        <div className="inst-card">
          <div className="inst-card-header">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-navy-800" />
              <span>High-Priority Decision Support Directives</span>
            </div>
            <Link to="/decision-support" className="text-xs text-navy-700 hover:text-navy-950 font-medium flex items-center gap-1">
              View All 4 Insights <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {DECISION_INSIGHTS.slice(0, 2).map((item) => (
              <div
                key={item.id}
                onClick={() => navigate('/decision-support')}
                className="p-3 border border-neutral-200 rounded hover:border-navy-400 hover:bg-neutral-50/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-navy-950">{item.title}</span>
                  <Badge variant={item.severity === 'High' ? 'danger' : 'warning'} size="xs">
                    {item.severity} Priority
                  </Badge>
                </div>
                <p className="text-xs text-neutral-600 line-clamp-2 mb-2">
                  {item.insight}
                </p>
                <div className="p-2 bg-neutral-100 rounded text-[11px] text-navy-900 flex items-center justify-between">
                  <span className="truncate mr-2"><strong>Action:</strong> {item.actionArea}</span>
                  <ExternalLink className="w-3 h-3 shrink-0 text-neutral-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: At-Risk Students Snapshot & Recent Institutional Audit Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* At-Risk Students Table (2 cols) */}
        <div className="lg:col-span-2 inst-card">
          <div className="inst-card-header">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>At-Risk Students Requiring Immediate Faculty Intervention</span>
            </div>
            <Link to="/at-risk" className="text-xs text-navy-700 hover:text-navy-950 font-medium">
              Open Risk Radar ({INSTITUTION_STATS.studentsAtRisk}) →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-100 border-b border-neutral-200 text-neutral-700 font-semibold uppercase">
                  <th className="py-2 px-3">Student Name / ID</th>
                  <th className="py-2 px-3">Dept</th>
                  <th className="py-2 px-3 text-center">Attendance</th>
                  <th className="py-2 px-3 text-center">CGPA</th>
                  <th className="py-2 px-3 text-center">Backlogs</th>
                  <th className="py-2 px-3">Contributing Risk Factor</th>
                  <th className="py-2 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {INITIAL_STUDENTS.filter(s => s.riskLevel === 'HIGH').slice(0, 4).map(s => (
                  <tr key={s.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-2 px-3">
                      <div className="font-bold text-navy-950">{s.name}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">{s.id} ({s.rollNo})</div>
                    </td>
                    <td className="py-2 px-3">
                      <Badge variant="navy" size="xs">{s.deptCode}</Badge>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className="font-bold text-red-700">{s.attendance}%</span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className="font-bold text-red-700">{s.cgpa}</span>
                    </td>
                    <td className="py-2 px-3 text-center font-bold text-red-800">
                      {s.backlogs}
                    </td>
                    <td className="py-2 px-3">
                      <span className="text-[11px] text-neutral-600 line-clamp-1">{s.riskFactors[0]}</span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => navigate(`/students/${s.id}`)}
                        className="px-2 py-1 text-[11px] bg-white border border-neutral-300 rounded hover:bg-neutral-50 text-navy-900 font-medium"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Institutional Activities Audit (1 col) */}
        <div className="inst-card">
          <div className="inst-card-header">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-navy-800" />
              <span>Recent Academic Audit Feed</span>
            </div>
            <span className="text-[10px] text-teal-800 font-medium">Auto-Synced</span>
          </div>
          <div className="p-3 divide-y divide-neutral-100">
            {INSTITUTION_STATS.recentActivities.map(act => (
              <div key={act.id} className="py-2.5 first:pt-1 last:pb-1">
                <div className="flex items-center justify-between text-[11px] mb-0.5">
                  <span className="font-bold text-navy-950">{act.dept}</span>
                  <span className="text-neutral-400">{act.time}</span>
                </div>
                <div className="text-xs text-neutral-700 font-medium leading-snug">
                  {act.title}
                </div>
                <div className="text-[10px] text-neutral-500 mt-0.5">
                  Logged by: {act.author}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
