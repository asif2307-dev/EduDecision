// Faculty API Service
import apiClient from './apiClient';
import { FACULTY_MEMBERS } from '../data/mockData';

const STORAGE_KEY = 'edudecision_faculty_store';

const getStoredFaculty = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(FACULTY_MEMBERS));
    return [...FACULTY_MEMBERS];
  }
  try {
    return JSON.parse(data);
  } catch {
    return [...FACULTY_MEMBERS];
  }
};

const saveFaculty = (faculty) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(faculty));
};

export const facultyApi = {
  async getFaculty(params = {}) {
    const { department = 'ALL', search = '' } = params;
    try {
      const q = new URLSearchParams(params).toString();
      const res = await apiClient.get(`/faculty?${q}`);
      if (res && res.data) return res;
    } catch {
      // Fallback
    }

    let records = getStoredFaculty();
    if (department && department !== 'ALL') {
      records = records.filter(f => f.deptCode === department || f.department === department);
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      records = records.filter(f =>
        f.name.toLowerCase().includes(s) ||
        f.id.toLowerCase().includes(s) ||
        f.email.toLowerCase().includes(s)
      );
    }

    return {
      success: true,
      data: records,
      total: records.length
    };
  },

  async getFacultyById(id) {
    const records = getStoredFaculty();
    const faculty = records.find(f => f.id === id);
    if (!faculty) throw new Error(`Faculty ${id} not found`);
    return faculty;
  },

  async addFaculty(data) {
    const records = getStoredFaculty();
    const newFaculty = {
      ...data,
      id: `FAC-${data.deptCode || 'ENG'}-0${records.length + 1}`,
      studentCount: data.studentCount || 100,
      attendanceResponsibility: data.attendanceResponsibility || 90.0,
      performanceIndex: data.performanceIndex || 8.5,
      subjects: Array.isArray(data.subjects) ? data.subjects : [data.subjects || 'General Studies']
    };
    records.push(newFaculty);
    saveFaculty(records);
    return newFaculty;
  }
};

export default facultyApi;
