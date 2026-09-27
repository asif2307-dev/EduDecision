import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { SettingsProvider } from './context/SettingsContext';

import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import StudentProfilePage from './pages/StudentProfilePage';
import FacultyPage from './pages/FacultyPage';
import DepartmentsPage from './pages/DepartmentsPage';
import SubjectsPage from './pages/SubjectsPage';
import AttendancePage from './pages/AttendancePage';
import MarksExamsPage from './pages/MarksExamsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PerformancePage from './pages/PerformancePage';
import AtRiskStudentsPage from './pages/AtRiskStudentsPage';
import DecisionSupportPage from './pages/DecisionSupportPage';
import DataImportPage from './pages/DataImportPage';
import DataQualityPage from './pages/DataQualityPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f4f8] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-navy-800 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <div className="text-xs font-semibold text-navy-950">Initializing EduDecision...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <NotificationProvider>
            <Routes>
              {/* Public Authentication Route */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Institutional Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="students" element={<StudentsPage />} />
                <Route path="students/:id" element={<StudentProfilePage />} />
                <Route path="faculty" element={<FacultyPage />} />
                <Route path="departments" element={<DepartmentsPage />} />
                <Route path="subjects" element={<SubjectsPage />} />
                <Route path="attendance" element={<AttendancePage />} />
                <Route path="marks" element={<MarksExamsPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="performance" element={<PerformancePage />} />
                <Route path="at-risk" element={<AtRiskStudentsPage />} />
                <Route path="decision-support" element={<DecisionSupportPage />} />
                <Route path="import" element={<DataImportPage />} />
                <Route path="data-quality" element={<DataQualityPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </NotificationProvider>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
