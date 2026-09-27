// Reports API Service
import apiClient from './apiClient';
import { INITIAL_STUDENTS, DEPARTMENTS, STATISTICAL_ANALYSIS } from '../data/mockData';

export const reportsApi = {
  async generateReport(type, filters = {}) {
    try {
      const res = await apiClient.post('/reports/generate', { type, filters });
      if (res && res.data) return res.data;
    } catch {
      // Fallback
    }

    const studentsData = localStorage.getItem('edudecision_students_store');
    const students = studentsData ? JSON.parse(studentsData) : INITIAL_STUDENTS;

    let title = 'Institutional Report';
    let summary = {};
    let rows = [];

    switch (type) {
      case 'student_performance':
        title = 'Student Comprehensive Performance & Marks Audit';
        summary = { totalRecords: students.length, avgCgpa: 8.12, passRate: '88.4%' };
        rows = students.map(s => ({
          'Student ID': s.id,
          'Roll Number': s.rollNo,
          'Name': s.name,
          'Department': s.department,
          'Semester': s.semester,
          'CGPA': s.cgpa,
          'Attendance %': `${s.attendance}%`,
          'Backlogs': s.backlogs,
          'Status': s.academicStatus
        }));
        break;

      case 'attendance_shortage':
        title = 'Mandatory Attendance Shortage (<75%) Official Hearing Report';
        const lowAtt = students.filter(s => s.attendance < 75);
        summary = { totalStudents: students.length, shortageCount: lowAtt.length, percentageAtRisk: `${((lowAtt.length/students.length)*100).toFixed(1)}%` };
        rows = lowAtt.map(s => ({
          'Student ID': s.id,
          'Roll Number': s.rollNo,
          'Name': s.name,
          'Department': s.department,
          'Semester': s.semester,
          'Attendance %': `${s.attendance}%`,
          'Shortfall %': `${(75 - s.attendance).toFixed(1)}%`,
          'Mentor': s.mentor
        }));
        break;

      case 'department_comparison':
        title = 'Inter-Departmental Academic Benchmarking Report';
        summary = { activeDepartments: DEPARTMENTS.length, highestAvgCgpa: 'Data Science (8.45)' };
        rows = DEPARTMENTS.map(d => ({
          'Department': d.name,
          'Code': d.code,
          'HOD': d.hod,
          'Student Count': d.studentCount,
          'Faculty Count': d.facultyCount,
          'Average CGPA': d.avgCgpa,
          'Average Attendance': `${d.avgAttendance}%`,
          'Pass Rate': `${d.passPercentage}%`
        }));
        break;

      case 'at_risk_summary':
        title = 'Academic Probation & Early-Warning Intervention Docket';
        const atRisk = students.filter(s => s.riskLevel === 'HIGH' || s.riskLevel === 'MEDIUM');
        summary = { totalAtRisk: atRisk.length, highRiskCount: atRisk.filter(s => s.riskLevel === 'HIGH').length };
        rows = atRisk.map(s => ({
          'Student ID': s.id,
          'Name': s.name,
          'Department': s.department,
          'Semester': s.semester,
          'Risk Level': s.riskLevel,
          'Attendance': `${s.attendance}%`,
          'CGPA': s.cgpa,
          'Contributing Factors': s.riskFactors.join('; ')
        }));
        break;

      case 'statistical_summary':
        title = 'Institutional Psychometric & Statistical Analysis Brief';
        summary = { rSquared: '0.814', pearsonR: '0.782', anovaF: '14.82' };
        rows = [
          { 'Metric': 'CGPA Mean', 'Value': STATISTICAL_ANALYSIS.descriptive.cgpa.mean, 'Notes': 'Std Dev: 0.88' },
          { 'Metric': 'Attendance Mean', 'Value': `${STATISTICAL_ANALYSIS.descriptive.attendance.mean}%`, 'Notes': 'Variance: 88.73' },
          { 'Metric': 'OLS Model R²', 'Value': '0.814', 'Notes': 'Strong fit: Attendance + Internals' },
          { 'Metric': 'Chi-Square Test', 'Value': 'χ² = 84.62 (p < 0.0001)', 'Notes': 'Attendance significantly associates with passing' }
        ];
        break;

      default:
        title = 'Executive Institutional Summary';
        summary = { totalStudents: 1800, totalFaculty: 94, institutionalCgpa: 8.12 };
        rows = students.slice(0, 10).map(s => ({
          'Student ID': s.id,
          'Name': s.name,
          'Department': s.deptCode,
          'CGPA': s.cgpa,
          'Attendance': `${s.attendance}%`
        }));
    }

    return {
      title,
      generatedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      academicSession: '2024-2025 (Even Semester)',
      filters,
      summary,
      rows
    };
  },

  exportToCSV(reportData) {
    if (!reportData || !reportData.rows || !reportData.rows.length) return;
    const headers = Object.keys(reportData.rows[0]);
    const csvContent = [
      `"${reportData.title}"`,
      `"Generated: ${reportData.generatedAt} | Session: ${reportData.academicSession}"`,
      '',
      headers.map(h => `"${h}"`).join(','),
      ...reportData.rows.map(row => headers.map(h => `"${(row[h] !== undefined ? row[h] : '')}"`).join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${reportData.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export default reportsApi;
