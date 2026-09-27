// Students API Service Layer
import apiClient from './apiClient';
import { INITIAL_STUDENTS } from '../data/mockData';

// In-memory / localStorage store to persist created, edited, and deleted students in demo mode
const STORAGE_KEY = 'edudecision_students_store';

const getStoredStudents = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
    return [...INITIAL_STUDENTS];
  }
  try {
    return JSON.parse(data);
  } catch {
    return [...INITIAL_STUDENTS];
  }
};

const saveStudents = (students) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};

export const studentsApi = {
  async getStudents(params = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      department = 'ALL',
      semester = 'ALL',
      batch = 'ALL',
      gender = 'ALL',
      status = 'ALL',
      risk = 'ALL',
      sortBy = 'name',
      sortOrder = 'asc'
    } = params;

    // Try backend FastAPI first
    try {
      const queryParams = new URLSearchParams(params).toString();
      const res = await apiClient.get(`/students?${queryParams}`);
      if (res && res.data) return res;
    } catch {
      // Fallback to local store with real filtering, sorting and pagination
    }

    let records = getStoredStudents();

    // 1. Search across ID, Name, Email, RollNo
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      records = records.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    }

    // 2. Department filter
    if (department && department !== 'ALL') {
      records = records.filter(s => s.deptCode === department || s.department === department);
    }

    // 3. Semester filter
    if (semester && semester !== 'ALL') {
      records = records.filter(s => s.semester === Number(semester));
    }

    // 4. Batch filter
    if (batch && batch !== 'ALL') {
      records = records.filter(s => s.batch === batch);
    }

    // 5. Gender filter
    if (gender && gender !== 'ALL') {
      records = records.filter(s => s.gender.toLowerCase() === gender.toLowerCase());
    }

    // 6. Academic Status filter
    if (status && status !== 'ALL') {
      records = records.filter(s => s.academicStatus.toLowerCase() === status.toLowerCase());
    }

    // 7. Risk level filter
    if (risk && risk !== 'ALL') {
      records = records.filter(s => s.riskLevel.toUpperCase() === risk.toUpperCase());
    }

    // 8. Sorting
    records.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (valA === undefined) valA = '';
      if (valB === undefined) valB = '';

      if (typeof valA === 'string') {
        const cmp = valA.localeCompare(valB);
        return sortOrder === 'desc' ? -cmp : cmp;
      }
      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });

    const total = records.length;
    const startIndex = (page - 1) * limit;
    const paginated = records.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: paginated,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit) || 1
    };
  },

  async getStudentById(id) {
    try {
      const res = await apiClient.get(`/students/${id}`);
      if (res && res.data) return res.data;
    } catch {
      // Fallback
    }
    const students = getStoredStudents();
    const student = students.find(s => s.id === id || s.rollNo === id);
    if (!student) {
      throw new Error(`Student with ID ${id} not found in institutional database`);
    }
    return student;
  },

  async createStudent(studentData) {
    try {
      const res = await apiClient.post('/students', studentData);
      if (res && res.data) return res.data;
    } catch {
      // Fallback
    }
    const students = getStoredStudents();
    
    // Auto-compute risk
    let riskLevel = 'LOW';
    const riskFactors = [];
    if (studentData.attendance < 70) {
      riskLevel = 'HIGH';
      riskFactors.push(`Critical Attendance (${studentData.attendance}%)`);
    } else if (studentData.attendance < 75) {
      riskLevel = 'MEDIUM';
      riskFactors.push(`Attendance Borderline (${studentData.attendance}%)`);
    }

    if (studentData.cgpa < 6.0) {
      riskLevel = 'HIGH';
      riskFactors.push(`Low CGPA (${studentData.cgpa})`);
    } else if (studentData.cgpa < 6.8) {
      if (riskLevel !== 'HIGH') riskLevel = 'MEDIUM';
      riskFactors.push(`CGPA Warning (${studentData.cgpa})`);
    }

    if (Number(studentData.backlogs) > 2) {
      riskLevel = 'HIGH';
      riskFactors.push(`${studentData.backlogs} Active Backlogs`);
    }

    const newStudent = {
      ...studentData,
      id: studentData.id || `2024${studentData.deptCode || 'ENG'}${Math.floor(100 + Math.random() * 900)}`,
      rollNo: studentData.rollNo || `STU${Math.floor(1000 + Math.random() * 9000)}`,
      riskLevel,
      riskFactors: riskFactors.length ? riskFactors : ['None'],
      academicStatus: studentData.academicStatus || (riskLevel === 'HIGH' ? 'Probation' : 'Active'),
      semesterGpa: [7.5, 7.8, Number(studentData.cgpa)],
      subjectMarks: [
        { code: "SUB101", name: "Core Course I", internal: 32, external: 45, total: 77, grade: "B+" },
        { code: "SUB102", name: "Core Course II", internal: 35, external: 48, total: 83, grade: "A" }
      ]
    };

    students.unshift(newStudent);
    saveStudents(students);
    return newStudent;
  },

  async updateStudent(id, updateData) {
    try {
      const res = await apiClient.put(`/students/${id}`, updateData);
      if (res && res.data) return res.data;
    } catch {
      // Fallback
    }

    const students = getStoredStudents();
    const index = students.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Student ${id} not found`);
    }

    const updated = {
      ...students[index],
      ...updateData
    };

    // Re-evaluate risk
    if (updated.attendance < 70 || updated.cgpa < 6.0 || updated.backlogs >= 3) {
      updated.riskLevel = 'HIGH';
    } else if (updated.attendance < 75 || updated.cgpa < 6.8 || updated.backlogs >= 1) {
      updated.riskLevel = 'MEDIUM';
    } else {
      updated.riskLevel = 'LOW';
    }

    students[index] = updated;
    saveStudents(students);
    return updated;
  },

  async deleteStudent(id) {
    try {
      await apiClient.delete(`/students/${id}`);
    } catch {
      // Fallback
    }
    let students = getStoredStudents();
    students = students.filter(s => s.id !== id);
    saveStudents(students);
    return { success: true };
  }
};

export default studentsApi;
