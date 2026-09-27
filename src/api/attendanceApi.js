// Attendance API Service
import apiClient from './apiClient';
import { INITIAL_STUDENTS, DEPARTMENTS } from '../data/mockData';

const SETTINGS_KEY = 'edudecision_settings';

export const getAttendanceThreshold = () => {
  const settings = localStorage.getItem(SETTINGS_KEY);
  if (settings) {
    try {
      const parsed = JSON.parse(settings);
      if (parsed.attendanceThreshold) return Number(parsed.attendanceThreshold);
    } catch {
      // default
    }
  }
  return 75; // Default 75% university norm
};

export const attendanceApi = {
  async getOverview(params = {}) {
    const threshold = getAttendanceThreshold();
    const studentsData = localStorage.getItem('edudecision_students_store');
    const students = studentsData ? JSON.parse(studentsData) : INITIAL_STUDENTS;

    const totalStudents = students.length;
    const belowThreshold = students.filter(s => s.attendance < threshold).length;
    const avgAttendance = Number((students.reduce((acc, s) => acc + s.attendance, 0) / totalStudents).toFixed(1));

    const departmentStats = DEPARTMENTS.map(dept => {
      const deptStudents = students.filter(s => s.deptCode === dept.code);
      const avg = deptStudents.length
        ? Number((deptStudents.reduce((acc, s) => acc + s.attendance, 0) / deptStudents.length).toFixed(1))
        : dept.avgAttendance;
      const shortageCount = deptStudents.filter(s => s.attendance < threshold).length;
      return {
        deptCode: dept.code,
        name: dept.name,
        avgAttendance: avg,
        shortageCount,
        studentCount: deptStudents.length || dept.studentCount
      };
    });

    return {
      success: true,
      threshold,
      totalStudents,
      belowThreshold,
      avgAttendance,
      departmentStats,
      monthlyTrend: [
        { month: "Aug", attendance: 86.4 },
        { month: "Sep", attendance: 83.1 },
        { month: "Oct", attendance: 79.5 },
        { month: "Nov", attendance: 76.8 },
        { month: "Dec", attendance: 78.2 },
        { month: "Jan", attendance: 81.0 },
        { month: "Feb", attendance: 79.8 },
      ]
    };
  },

  async getStudentAttendance(params = {}) {
    const { department = 'ALL', semester = 'ALL', thresholdOnly = false } = params;
    const threshold = getAttendanceThreshold();
    const studentsData = localStorage.getItem('edudecision_students_store');
    let students = studentsData ? JSON.parse(studentsData) : INITIAL_STUDENTS;

    if (department && department !== 'ALL') {
      students = students.filter(s => s.deptCode === department);
    }
    if (semester && semester !== 'ALL') {
      students = students.filter(s => s.semester === Number(semester));
    }
    if (thresholdOnly) {
      students = students.filter(s => s.attendance < threshold);
    }

    return {
      success: true,
      threshold,
      data: students.map(s => ({
        id: s.id,
        rollNo: s.rollNo,
        name: s.name,
        department: s.department,
        deptCode: s.deptCode,
        semester: s.semester,
        attendance: s.attendance,
        status: s.attendance < threshold ? 'SHORTAGE' : 'REGULAR',
        classesHeld: 72,
        classesAttended: Math.round((s.attendance / 100) * 72)
      }))
    };
  }
};

export default attendanceApi;
