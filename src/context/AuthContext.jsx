// Authentication Context
import React, { createContext, useContext, useState, useEffect } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existing = authApi.getCurrentUser();
    if (existing) {
      setUser(existing);
    } else {
      // Default to Admin demo user if first time visiting for smooth demo experience
      const defaultUser = {
        id: 'USR-ADM-01',
        name: 'Dr. S. K. Narayanan',
        email: 'admin@edudecision.demo',
        role: 'ADMIN',
        designation: 'Dean of Academic Affairs',
        department: 'Central Administration',
        token: 'jwt-demo-token-admin-edu-dec-2026',
        permissions: ['all']
      };
      localStorage.setItem('edudecision_user', JSON.stringify(defaultUser));
      setUser(defaultUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      setUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const switchRole = (role) => {
    let newUser;
    if (role === 'ADMIN') {
      newUser = {
        id: 'USR-ADM-01',
        name: 'Dr. S. K. Narayanan',
        email: 'admin@edudecision.demo',
        role: 'ADMIN',
        designation: 'Dean of Academic Affairs',
        department: 'Central Administration',
        token: 'jwt-demo-token-admin',
        permissions: ['all']
      };
    } else if (role === 'HOD') {
      newUser = {
        id: 'USR-HOD-01',
        name: 'Dr. Arvind Kumar',
        email: 'hod@edudecision.demo',
        role: 'HOD',
        designation: 'Professor & Head of Department',
        department: 'Computer Science & Engineering',
        deptCode: 'CSE',
        token: 'jwt-demo-token-hod',
        permissions: ['view_dept', 'manage_dept_students', 'view_analytics', 'generate_dept_reports']
      };
    } else {
      newUser = {
        id: 'USR-FAC-01',
        name: 'Prof. Sunita Nair',
        email: 'faculty@edudecision.demo',
        role: 'FACULTY',
        designation: 'Associate Professor',
        department: 'Computer Science & Engineering',
        deptCode: 'CSE',
        token: 'jwt-demo-token-fac',
        permissions: ['view_assigned_students', 'manage_attendance', 'manage_marks', 'view_at_risk']
      };
    }
    localStorage.setItem('edudecision_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, switchRole, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;
