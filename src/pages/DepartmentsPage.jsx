import React, { useState } from 'react';
import {
  Building2,
  Users,
  GraduationCap,
  Award,
  CalendarCheck,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  FileSpreadsheet
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import Badge from '../components/common/Badge';
import { DEPARTMENTS } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

export const DepartmentsPage = () => {
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState(DEPARTMENTS[0]);

  const chartData = DEPARTMENTS.map(d => ({
    name: d.code,
    passRate: d.passPercentage,
    attendance: d.avgAttendance,
    cgpaScore: Number((d.avgCgpa * 10).toFixed(1))
  }));

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="bg-white p-3 border border-neutral-300 rounded shadow-panel flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wide">
            Academic Department Governance & Benchmarking
          </h2>
          <p className="text-xs text-neutral-500">
            Comparative institutional metrics across 5 active engineering departments
          </p>
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DEPARTMENTS.map((dept) => {
          const isSelected = selectedDept.code === dept.code;
          return (
            <div
              key={dept.code}
              onClick={() => setSelectedDept(dept)}
              className={`inst-card p-4 transition-all cursor-pointer border ${
                isSelected
                  ? 'border-navy-800 ring-1 ring-navy-800 bg-white'
                  : 'border-neutral-300 hover:border-neutral-400 bg-white'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-navy-950">{dept.code}</span>
                    <Badge variant={dept.trend.startsWith('+') ? 'teal' : 'warning'} size="xs">
                      {dept.trend}
                    </Badge>
                  </div>
                  <h3 className="text-xs font-semibold text-neutral-700 leading-tight mt-0.5">
                    {dept.name}
                  </h3>
                </div>
                <div className="p-2 bg-navy-50 text-navy-800 rounded border border-navy-100">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>

              <div className="text-[11px] text-neutral-500 mb-3 pb-2 border-b border-neutral-100 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-navy-700" />
                <span>HOD: <strong className="text-neutral-800">{dept.hod}</strong></span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                <div className="bg-neutral-50 p-1.5 rounded border border-neutral-200">
                  <div className="text-[10px] text-neutral-500">Students</div>
                  <div className="font-bold text-navy-950">{dept.studentCount}</div>
                </div>
                <div className="bg-neutral-50 p-1.5 rounded border border-neutral-200">
                  <div className="text-[10px] text-neutral-500">Faculty</div>
                  <div className="font-bold text-navy-950">{dept.facultyCount}</div>
                </div>
                <div className="bg-neutral-50 p-1.5 rounded border border-neutral-200">
                  <div className="text-[10px] text-neutral-500">Pass %</div>
                  <div className={`font-bold ${dept.passPercentage < 80 ? 'text-red-700' : 'text-emerald-700'}`}>
                    {dept.passPercentage}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-100 text-neutral-600">
                <span>Avg CGPA: <strong className="text-navy-950">{dept.avgCgpa}</strong></span>
                <span>Attendance: <strong className="text-navy-950">{dept.avgAttendance}%</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Department Focus & Comparative Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Comparative Department Metrics Chart (2 cols) */}
        <div className="lg:col-span-2 inst-card">
          <div className="inst-card-header">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-navy-800" />
              <span>Comparative Cross-Department Performance Indices</span>
            </div>
            <span className="text-[11px] text-neutral-500">Normalized Scale (0-100)</span>
          </div>
          <div className="p-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', fontSize: '12px' }}
                    formatter={(val, name) => [
                      `${val}%`,
                      name === 'passRate' ? 'Pass Percentage' : name === 'attendance' ? 'Attendance Rate' : 'CGPA Score (x10)'
                    ]}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="passRate" name="Pass Rate (%)" fill="#0f2c4b" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="attendance" name="Attendance (%)" fill="#0d9488" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="cgpaScore" name="CGPA Index (x10)" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Selected Department Detailed Summary (1 col) */}
        <div className="inst-card">
          <div className="inst-card-header">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-navy-800" />
              <span>{selectedDept.name} ({selectedDept.code})</span>
            </div>
          </div>
          <div className="p-4 space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Head of Department</span>
              <span className="font-bold text-navy-950">{selectedDept.hod}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Established Year</span>
              <span className="text-neutral-800">{selectedDept.established}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Total Enrolled Scholars</span>
              <span className="font-bold text-navy-950">{selectedDept.studentCount} Students</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Full-Time Faculty Strength</span>
              <span className="font-semibold text-neutral-800">{selectedDept.facultyCount} Members</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Faculty-Student Ratio</span>
              <span className="font-semibold text-navy-900">
                1:{Math.round(selectedDept.studentCount / selectedDept.facultyCount)}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Department Mean CGPA</span>
              <span className="font-bold text-navy-950">{selectedDept.avgCgpa}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-500">Pass Outcome</span>
              <span className="font-bold text-emerald-800">{selectedDept.passPercentage}%</span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate(`/students?department=${selectedDept.code}`)}
                className="w-full py-1.5 px-3 bg-navy-800 hover:bg-navy-900 text-white rounded text-xs font-semibold shadow-sm transition-colors text-center"
              >
                Inspect {selectedDept.code} Student Cohort →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentsPage;
