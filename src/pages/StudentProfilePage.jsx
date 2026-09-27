import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  GraduationCap,
  CalendarCheck,
  Award,
  AlertTriangle,
  Mail,
  Phone,
  BookOpen,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  Printer
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
import Badge from '../components/common/Badge';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import studentsApi from '../api/studentsApi';
import { useNotification } from '../context/NotificationContext';

export const StudentProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useNotification();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadStudent = async () => {
      setLoading(true);
      try {
        const data = await studentsApi.getStudentById(id);
        setStudent(data);
      } catch (err) {
        setErrorMessage(err.message || 'Unable to retrieve student profile');
        error('Student profile not found');
      } finally {
        setLoading(false);
      }
    };
    loadStudent();
  }, [id, error]);

  if (loading) {
    return <LoadingState message="Retrieving comprehensive student profile..." subtext="Querying academic history and semester ledgers" />;
  }

  if (errorMessage || !student) {
    return (
      <ErrorState
        title="Student Profile Not Found"
        message={errorMessage || `No record found for ID: ${id}`}
        onRetry={() => navigate('/students')}
      />
    );
  }

  // CGPA progression line data
  const cgpaTrendData = (student.semesterGpa || [student.cgpa]).map((gpa, idx) => ({
    semester: `Sem ${idx + 1}`,
    gpa: Number(gpa)
  }));

  // Subject marks bar data
  const subjectMarksData = (student.subjectMarks || []).map(sub => ({
    name: sub.code,
    fullName: sub.name,
    internal: sub.internal,
    external: sub.external,
    total: sub.total
  }));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* Top Navigation & Action Ribbon */}
      <div className="flex items-center justify-between bg-white p-3 border border-neutral-300 rounded shadow-panel no-print">
        <Link
          to="/students"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-800 hover:text-navy-950"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Student Directory</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs font-medium text-neutral-700 hover:bg-neutral-50 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-navy-800" />
            <span>Print Student Dossier</span>
          </button>
        </div>
      </div>

      {/* Main Student Header Card */}
      <div className="inst-card p-5 bg-white border-l-4 border-l-navy-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded bg-navy-900 text-white font-bold text-xl flex items-center justify-center shrink-0 border border-navy-950 shadow-sm">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-navy-950 font-sans">{student.name}</h2>
                <Badge variant={student.riskLevel.toLowerCase()} size="sm">
                  {student.riskLevel} RISK
                </Badge>
                <span className="text-xs px-2 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {student.academicStatus}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600 mt-1 font-sans">
                <span><strong>ID:</strong> <span className="font-mono text-navy-900">{student.id}</span></span>
                <span><strong>Roll:</strong> <span className="font-mono text-navy-900">{student.rollNo}</span></span>
                <span><strong>Dept:</strong> {student.department}</span>
                <span><strong>Semester:</strong> {student.semester}</span>
                <span><strong>Batch:</strong> {student.batch}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-4 bg-neutral-50 p-2.5 rounded border border-neutral-200 text-xs">
            <div className="text-center px-2">
              <div className="text-[10px] text-neutral-500 font-semibold uppercase">CGPA</div>
              <div className="text-base font-bold text-navy-950">{student.cgpa}</div>
            </div>
            <div className="w-px h-7 bg-neutral-300" />
            <div className="text-center px-2">
              <div className="text-[10px] text-neutral-500 font-semibold uppercase">Attendance</div>
              <div className={`text-base font-bold ${student.attendance < 75 ? 'text-red-700' : 'text-emerald-700'}`}>
                {student.attendance}%
              </div>
            </div>
            <div className="w-px h-7 bg-neutral-300" />
            <div className="text-center px-2">
              <div className="text-[10px] text-neutral-500 font-semibold uppercase">Backlogs</div>
              <div className={`text-base font-bold ${student.backlogs > 0 ? 'text-red-700' : 'text-neutral-700'}`}>
                {student.backlogs}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Personal & Academic Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Personal & Contact Details */}
        <div className="inst-card">
          <div className="inst-card-header">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-navy-800" />
              <span>Personal & Administrative Details</span>
            </div>
          </div>
          <div className="p-4 text-xs space-y-2.5">
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Gender</span>
              <span className="font-semibold text-neutral-800">{student.gender}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Email Address</span>
              <span className="font-mono text-navy-900">{student.email}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Contact Number</span>
              <span className="font-mono text-neutral-800">{student.phone || '+91 98451 23400'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Admission Date</span>
              <span className="text-neutral-800">{student.admissionDate || '2022-08-12'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-500">Assigned Faculty Mentor</span>
              <span className="font-semibold text-navy-950">{student.mentor || 'Dr. Ramesh Sharma'}</span>
            </div>
          </div>
        </div>

        {/* Academic Performance Summary */}
        <div className="inst-card">
          <div className="inst-card-header">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-navy-800" />
              <span>Academic Standing & Status</span>
            </div>
          </div>
          <div className="p-4 text-xs space-y-2.5">
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Current Cumulative CGPA</span>
              <span className="font-bold text-navy-950">{student.cgpa} / 10.0</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Internal Marks Average</span>
              <span className="font-semibold text-neutral-800">{student.internalMarks} / 40.0</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Semester Exam Average</span>
              <span className="font-semibold text-neutral-800">{student.examScore} / 100.0</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Active Course Backlogs</span>
              <span className={`font-bold ${student.backlogs > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                {student.backlogs} Course(s)
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-500">Disciplinary Record</span>
              <span className="font-semibold text-emerald-800">Clear / No Infractions</span>
            </div>
          </div>
        </div>

        {/* Risk Assessment & Early Warning */}
        <div className="inst-card">
          <div className="inst-card-header">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${student.riskLevel === 'HIGH' ? 'text-red-700' : 'text-navy-800'}`} />
              <span>Analytical Risk & Support Indicators</span>
            </div>
          </div>
          <div className="p-4 text-xs space-y-3">
            <div>
              <div className="text-[11px] font-semibold text-neutral-500 uppercase mb-1">
                Risk Classification
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={student.riskLevel.toLowerCase()} size="sm">
                  {student.riskLevel} PRIORITY
                </Badge>
                <span className="text-neutral-600 text-[11px]">
                  {student.riskLevel === 'HIGH'
                    ? 'Requires mandatory faculty mentoring'
                    : student.riskLevel === 'MEDIUM'
                    ? 'Monitored for attendance compliance'
                    : 'Satisfactory academic trajectory'}
                </span>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-neutral-500 uppercase mb-1">
                Contributing Risk Factors
              </div>
              <div className="space-y-1">
                {(student.riskFactors || ['None']).map((rf, idx) => (
                  <div key={idx} className="p-1.5 bg-neutral-100 rounded text-neutral-700 text-[11px] font-medium">
                    • {rf}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-200">
              <span className="text-[10px] text-neutral-500 italic">
                * Risk classification is an analytical indicator generated by EduDecision heuristics.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Charts - CGPA Progression & Subject-wise Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Semester CGPA Trend */}
        <div className="inst-card">
          <div className="inst-card-header">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-navy-800" />
              <span>Semester-Wise SGPA Progression Trend</span>
            </div>
            <span className="text-[11px] text-neutral-500">Target Benchmark: 8.0</span>
          </div>
          <div className="p-4">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cgpaTrendData} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="semester" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', fontSize: '12px' }}
                    formatter={(val) => [val, 'SGPA']}
                  />
                  <Line
                    type="monotone"
                    dataKey="gpa"
                    stroke="#0f2c4b"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#0d9488' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Subject-Wise Marks Distribution */}
        <div className="inst-card">
          <div className="inst-card-header">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-navy-800" />
              <span>Current Semester Course Marks Breakdown</span>
            </div>
            <span className="text-[11px] text-neutral-500">Max Internal: 40 | External: 60</span>
          </div>
          <div className="p-4">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectMarksData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', fontSize: '12px' }}
                    formatter={(val, name) => [val, name === 'internal' ? 'Internal Marks (/40)' : 'External Exam (/60)']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
                  <Bar dataKey="internal" name="Internal (/40)" fill="#0d9488" stackId="a" />
                  <Bar dataKey="external" name="External (/60)" fill="#0f2c4b" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Subject-wise Marks Table */}
      <div className="inst-card">
        <div className="inst-card-header">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-navy-800" />
            <span>Subject-Wise Marks & Grade Ledger</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-100 border-b border-neutral-200 text-neutral-700 font-semibold uppercase">
                <th className="py-2.5 px-3">Subject Code</th>
                <th className="py-2.5 px-3">Subject Title</th>
                <th className="py-2.5 px-3 text-center">Internal (/40)</th>
                <th className="py-2.5 px-3 text-center">External Exam (/60)</th>
                <th className="py-2.5 px-3 text-center">Total (/100)</th>
                <th className="py-2.5 px-3 text-center">Awarded Grade</th>
                <th className="py-2.5 px-3 text-center">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {(student.subjectMarks || []).map((sub, idx) => (
                <tr key={idx} className="hover:bg-neutral-50">
                  <td className="py-2 px-3 font-mono font-semibold text-navy-900">{sub.code}</td>
                  <td className="py-2 px-3 font-medium text-neutral-800">{sub.name}</td>
                  <td className="py-2 px-3 text-center font-mono">{sub.internal}</td>
                  <td className="py-2 px-3 text-center font-mono">{sub.external}</td>
                  <td className="py-2 px-3 text-center font-bold text-navy-950 font-mono">{sub.total}</td>
                  <td className="py-2 px-3 text-center">
                    <span className="font-bold text-xs px-2 py-0.5 rounded bg-neutral-100 border border-neutral-300">
                      {sub.grade}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span
                      className={`inline-block px-1.5 py-0.5 text-[10px] font-bold rounded ${
                        sub.grade === 'F'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {sub.grade === 'F' ? 'FAIL / BACKLOG' : 'PASSED'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
