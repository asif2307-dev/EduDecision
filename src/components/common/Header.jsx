import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Bell, Search, User, LogOut, ChevronDown, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export const Header = () => {
  const { user, logout, switchRole } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Determine page title and breadcrumb from pathname
  const path = location.pathname;
  let pageTitle = 'Dashboard';
  let breadcrumb = ['Institution', 'Dashboard'];

  if (path.startsWith('/students/')) {
    pageTitle = 'Student Profile & Academic Record';
    breadcrumb = ['Academic', 'Students', 'Profile View'];
  } else if (path === '/students') {
    pageTitle = 'Student Directory & Records';
    breadcrumb = ['Academic', 'Student Management'];
  } else if (path === '/faculty') {
    pageTitle = 'Faculty Directory & Workload';
    breadcrumb = ['Administration', 'Faculty'];
  } else if (path === '/departments') {
    pageTitle = 'Department Performance & Administration';
    breadcrumb = ['Administration', 'Departments'];
  } else if (path === '/subjects') {
    pageTitle = 'Curricular Subjects & Course Catalog';
    breadcrumb = ['Academic', 'Subjects'];
  } else if (path === '/attendance') {
    pageTitle = 'Institutional Attendance Monitoring';
    breadcrumb = ['Monitoring', 'Attendance'];
  } else if (path === '/marks') {
    pageTitle = 'Examinations & Marks Ledger';
    breadcrumb = ['Assessment', 'Marks & Exams'];
  } else if (path === '/analytics') {
    pageTitle = 'Institutional Statistical & Predictive Analytics';
    breadcrumb = ['Analytics', 'Statistical Suite'];
  } else if (path === '/performance') {
    pageTitle = 'Academic Performance & Benchmarking';
    breadcrumb = ['Analytics', 'Performance'];
  } else if (path === '/at-risk') {
    pageTitle = 'At-Risk Students & Early-Warning Radar';
    breadcrumb = ['Student Support', 'At-Risk'];
  } else if (path === '/decision-support') {
    pageTitle = 'Decision Support & Strategic Insights';
    breadcrumb = ['Executive', 'Decision Support'];
  } else if (path === '/import') {
    pageTitle = 'Dataset Ingestion & Validation Pipeline';
    breadcrumb = ['Data Management', 'Data Import'];
  } else if (path === '/data-quality') {
    pageTitle = 'Institutional Data Quality & Integrity';
    breadcrumb = ['Data Management', 'Quality Audit'];
  } else if (path === '/reports') {
    pageTitle = 'Report Generation & Regulatory Exports';
    breadcrumb = ['Reporting', 'Reports'];
  } else if (path === '/settings') {
    pageTitle = 'Institutional Settings & Governance';
    breadcrumb = ['Administration', 'Settings'];
  }

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/students?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const notifications = [
    { id: 1, title: 'Attendance Shortage Alert', desc: '42 students in Sem 4 (IT/ME) fell below 75% attendance threshold.', time: '1 hr ago', type: 'warning' },
    { id: 2, title: 'End-Semester Results Ingested', desc: 'Computer Science & Engineering Sem 6 results verified.', time: '3 hrs ago', type: 'info' },
    { id: 3, title: 'Probation Review Scheduled', desc: 'Academic Review Committee meeting on Friday at 3:00 PM.', time: '1 day ago', type: 'info' },
  ];

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-30 shadow-sm no-print">
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Page Title & Breadcrumbs */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-medium">
            {breadcrumb.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-neutral-400">/</span>}
                <span className={idx === breadcrumb.length - 1 ? 'text-navy-900 font-semibold' : ''}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </div>
          <h1 className="text-base font-bold text-navy-950 tracking-tight font-sans mt-0.5">
            {pageTitle}
          </h1>
        </div>

        {/* Center: Global Search & Academic Term Indicator */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-md mx-4">
          <form onSubmit={handleGlobalSearch} className="w-full relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students, faculty, roll numbers..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded focus:bg-white focus:border-navy-700 focus:outline-none focus:ring-1 focus:ring-navy-700"
            />
          </form>

          <span className="shrink-0 px-2.5 py-1 text-[11px] font-semibold bg-navy-50 text-navy-800 border border-navy-200 rounded">
            {settings.currentAcademicTerm}
          </span>
        </div>

        {/* Right: Actions, Notifications, Role Switcher & User Profile */}
        <div className="flex items-center gap-2">
          {/* Quick Demo Role Switcher Button */}
          <div className="relative">
            <button
              onClick={() => {
                setRoleSwitcherOpen(!roleSwitcherOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-navy-950 border border-neutral-300 rounded transition-colors"
              title="Switch demo role for testing"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-navy-700" />
              <span className="hidden sm:inline">Role:</span>
              <span className="text-teal-700 font-bold">{user?.role || 'ADMIN'}</span>
              <ChevronDown className="w-3 h-3 text-neutral-500" />
            </button>

            {roleSwitcherOpen && (
              <div className="absolute right-0 mt-1.5 w-60 bg-white border border-neutral-300 rounded shadow-dropdown z-50 p-2 text-xs">
                <div className="font-bold text-navy-900 px-2 py-1 border-b border-neutral-200 mb-1">
                  Switch Active Role (Demo)
                </div>
                <button
                  onClick={() => {
                    switchRole('ADMIN');
                    setRoleSwitcherOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded hover:bg-neutral-100 flex items-center justify-between ${
                    user?.role === 'ADMIN' ? 'bg-navy-50 font-bold text-navy-900' : 'text-neutral-700'
                  }`}
                >
                  <div>
                    <div>Administrator (Dean)</div>
                    <div className="text-[10px] text-neutral-500 font-normal">Full institution-wide control</div>
                  </div>
                  {user?.role === 'ADMIN' && <CheckCircle className="w-3.5 h-3.5 text-navy-800" />}
                </button>
                <button
                  onClick={() => {
                    switchRole('HOD');
                    setRoleSwitcherOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded hover:bg-neutral-100 flex items-center justify-between ${
                    user?.role === 'HOD' ? 'bg-navy-50 font-bold text-navy-900' : 'text-neutral-700'
                  }`}
                >
                  <div>
                    <div>HOD (Dr. Arvind Kumar)</div>
                    <div className="text-[10px] text-neutral-500 font-normal">Computer Science Dept View</div>
                  </div>
                  {user?.role === 'HOD' && <CheckCircle className="w-3.5 h-3.5 text-navy-800" />}
                </button>
                <button
                  onClick={() => {
                    switchRole('FACULTY');
                    setRoleSwitcherOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded hover:bg-neutral-100 flex items-center justify-between ${
                    user?.role === 'FACULTY' ? 'bg-navy-50 font-bold text-navy-900' : 'text-neutral-700'
                  }`}
                >
                  <div>
                    <div>Faculty (Prof. Sunita Nair)</div>
                    <div className="text-[10px] text-neutral-500 font-normal">Course & Class Records View</div>
                  </div>
                  {user?.role === 'FACULTY' && <CheckCircle className="w-3.5 h-3.5 text-navy-800" />}
                </button>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setRoleSwitcherOpen(false);
              }}
              className="p-1.5 text-neutral-600 hover:text-navy-950 border border-neutral-300 rounded bg-white hover:bg-neutral-50 relative transition-colors"
              title="Institutional Notices"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-1.5 w-80 bg-white border border-neutral-300 rounded shadow-dropdown z-50 p-2 text-xs">
                <div className="font-bold text-navy-950 px-2 py-1.5 border-b border-neutral-200 flex items-center justify-between">
                  <span>Institutional Notices (3)</span>
                  <span className="text-[10px] font-normal text-neutral-500">Live Academic Feed</span>
                </div>
                <div className="divide-y divide-neutral-100 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 hover:bg-neutral-50 cursor-pointer">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-semibold text-navy-900">{n.title}</span>
                        <span className="text-[10px] text-neutral-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-neutral-600 leading-tight">{n.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-1.5 border-t border-neutral-200 text-center">
                  <Link
                    to="/decision-support"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[11px] font-medium text-navy-700 hover:text-navy-900"
                  >
                    View All Decision Insights →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
            <div className="hidden lg:block text-right">
              <div className="text-xs font-bold text-navy-950 leading-tight">{user?.name}</div>
              <div className="text-[10px] text-neutral-500">{user?.designation}</div>
            </div>
            <div className="w-7 h-7 rounded bg-navy-800 text-white font-bold flex items-center justify-center text-xs shrink-0">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-neutral-500 hover:text-red-700 hover:bg-red-50 rounded border border-neutral-200 transition-colors"
              title="Logout from portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
