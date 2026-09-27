// At-Risk Students API Service
import apiClient from './apiClient';
import { INITIAL_STUDENTS } from '../data/mockData';

export const atRiskApi = {
  async getAtRiskStudents(params = {}) {
    const { riskLevel = 'ALL', department = 'ALL' } = params;
    const studentsData = localStorage.getItem('edudecision_students_store');
    let students = studentsData ? JSON.parse(studentsData) : INITIAL_STUDENTS;

    // Filter only at-risk (MEDIUM or HIGH) unless ALL requested
    if (riskLevel === 'ALL') {
      students = students.filter(s => s.riskLevel === 'HIGH' || s.riskLevel === 'MEDIUM');
    } else {
      students = students.filter(s => s.riskLevel.toUpperCase() === riskLevel.toUpperCase());
    }

    if (department && department !== 'ALL') {
      students = students.filter(s => s.deptCode === department);
    }

    // Sort High risk first
    students.sort((a, b) => (a.riskLevel === 'HIGH' ? -1 : 1));

    return {
      success: true,
      data: students,
      counts: {
        high: students.filter(s => s.riskLevel === 'HIGH').length,
        medium: students.filter(s => s.riskLevel === 'MEDIUM').length,
        total: students.length
      }
    };
  },

  async logIntervention(studentId, intervention) {
    // In production, posts to /interventions
    return {
      success: true,
      message: `Intervention counseling scheduled for ${studentId}`,
      timestamp: new Date().toISOString(),
      intervention
    };
  }
};

export default atRiskApi;
