// Departments API Service
import apiClient from './apiClient';
import { DEPARTMENTS } from '../data/mockData';

export const departmentsApi = {
  async getDepartments() {
    try {
      const res = await apiClient.get('/departments');
      if (res && res.data) return res;
    } catch {
      // Fallback
    }
    return {
      success: true,
      data: DEPARTMENTS
    };
  },

  async getDepartmentByCode(code) {
    const dept = DEPARTMENTS.find(d => d.code === code || d.id === code);
    if (!dept) throw new Error(`Department ${code} not found`);
    return dept;
  }
};

export default departmentsApi;
