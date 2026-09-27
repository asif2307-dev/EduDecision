// Authentication API Service
import apiClient, { setAuthToken } from './apiClient';

const DEMO_USERS = {
  'admin@edudecision.demo': {
    id: 'USR-ADM-01',
    name: 'Dr. S. K. Narayanan',
    email: 'admin@edudecision.demo',
    role: 'ADMIN',
    designation: 'Dean of Academic Affairs',
    department: 'Central Administration',
    token: 'jwt-demo-token-admin-edu-dec-2026',
    permissions: ['all']
  },
  'hod@edudecision.demo': {
    id: 'USR-HOD-01',
    name: 'Dr. Arvind Kumar',
    email: 'hod@edudecision.demo',
    role: 'HOD',
    designation: 'Professor & Head of Department',
    department: 'Computer Science & Engineering',
    deptCode: 'CSE',
    token: 'jwt-demo-token-hod-edu-dec-2026',
    permissions: ['view_dept', 'manage_dept_students', 'view_analytics', 'generate_dept_reports']
  },
  'faculty@edudecision.demo': {
    id: 'USR-FAC-01',
    name: 'Prof. Sunita Nair',
    email: 'faculty@edudecision.demo',
    role: 'FACULTY',
    designation: 'Associate Professor',
    department: 'Computer Science & Engineering',
    deptCode: 'CSE',
    token: 'jwt-demo-token-fac-edu-dec-2026',
    permissions: ['view_assigned_students', 'manage_attendance', 'manage_marks', 'view_at_risk']
  }
};

export const authApi = {
  async login(email, password) {
    // If backend is active, try backend first
    try {
      const response = await apiClient.post('/auth/login', { username: email, password });
      if (response && response.access_token) {
        setAuthToken(response.access_token);
        localStorage.setItem('edudecision_user', JSON.stringify(response.user));
        return { success: true, user: response.user, token: response.access_token };
      }
    } catch {
      // Fallback to local institutional demo accounts
    }

    const normalizedEmail = email.trim().toLowerCase();
    const demoUser = DEMO_USERS[normalizedEmail];

    if (demoUser && (password === 'admin123' || password === 'hod123' || password === 'faculty123' || password.length >= 4)) {
      setAuthToken(demoUser.token);
      localStorage.setItem('edudecision_user', JSON.stringify(demoUser));
      return { success: true, user: demoUser, token: demoUser.token };
    }

    // Also support role shortcut if entered (e.g. "admin", "hod", "faculty")
    if (normalizedEmail.includes('admin')) {
      const u = DEMO_USERS['admin@edudecision.demo'];
      setAuthToken(u.token);
      localStorage.setItem('edudecision_user', JSON.stringify(u));
      return { success: true, user: u, token: u.token };
    }
    if (normalizedEmail.includes('hod')) {
      const u = DEMO_USERS['hod@edudecision.demo'];
      setAuthToken(u.token);
      localStorage.setItem('edudecision_user', JSON.stringify(u));
      return { success: true, user: u, token: u.token };
    }
    if (normalizedEmail.includes('faculty')) {
      const u = DEMO_USERS['faculty@edudecision.demo'];
      setAuthToken(u.token);
      localStorage.setItem('edudecision_user', JSON.stringify(u));
      return { success: true, user: u, token: u.token };
    }

    throw new Error('Invalid institutional credentials. Please check your institutional email and password.');
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout', {});
    } catch {
      // Local cleanup
    } finally {
      setAuthToken(null);
      localStorage.removeItem('edudecision_user');
    }
    return { success: true };
  },

  getCurrentUser() {
    const cached = localStorage.getItem('edudecision_user');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  }
};

export default authApi;
