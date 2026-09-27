import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  CalendarCheck,
  FileSpreadsheet,
  TrendingUp,
  BarChart3,
  AlertOctagon,
  FileText,
  UploadCloud,
  CheckSquare,
  Settings,
  Shield,
  LifeBuoy
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { user } = useAuth();

  // Role-based navigation rules:
  // ADMIN: All modules
  // HOD: Dept-specific analytics, students, faculty, attendance, marks, reports
  // FACULTY: Assigned students, attendance, marks, performance, at-risk
  const navSections = [
    {
      title: "Core Administration",
      items: [
        { name: "Dashboard", to: "/", icon: LayoutDashboard, roles: ['ADMIN', 'HOD', 'FACULTY'] },
        { name: "Students", to: "/students", icon: Users, roles: ['ADMIN', 'HOD', 'FACULTY'] },
        { name: "Faculty", to: "/faculty", icon: GraduationCap, roles: ['ADMIN', 'HOD'] },
        { name: "Departments", to: "/departments", icon: Building2, roles: ['ADMIN', 'HOD'] },
        { name: "Subjects Catalog", to: "/subjects", icon: BookOpen, roles: ['ADMIN', 'HOD', 'FACULTY'] },
      ]
    },
    {
      title: "Academic Operations",
      items: [
        { name: "Attendance", to: "/attendance", icon: CalendarCheck, roles: ['ADMIN', 'HOD', 'FACULTY'], badge: "75%" },
        { name: "Marks & Exams", to: "/marks", icon: FileSpreadsheet, roles: ['ADMIN', 'HOD', 'FACULTY'] },
        { name: "Performance Analysis", to: "/performance", icon: TrendingUp, roles: ['ADMIN', 'HOD', 'FACULTY'] },
      ]
    },
    {
      title: "Analytics & Decision Engine",
      items: [
        { name: "Analytics Suite", to: "/analytics", icon: BarChart3, roles: ['ADMIN', 'HOD', 'FACULTY'] },
        { name: "At-Risk Students", to: "/at-risk", icon: AlertOctagon, roles: ['ADMIN', 'HOD', 'FACULTY'], badge: "68", badgeVariant: "danger" },
        { name: "Decision Support", to: "/decision-support", icon: LifeBuoy, roles: ['ADMIN', 'HOD', 'FACULTY'], badge: "4 New" },
      ]
    },
    {
      title: "Data Management & Reports",
      items: [
        { name: "Reports Generator", to: "/reports", icon: FileText, roles: ['ADMIN', 'HOD'] },
        { name: "Data Import (ETL)", to: "/import", icon: UploadCloud, roles: ['ADMIN'] },
        { name: "Data Quality Audit", to: "/data-quality", icon: CheckSquare, roles: ['ADMIN', 'HOD'] },
        { name: "System Settings", to: "/settings", icon: Settings, roles: ['ADMIN'] },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-navy-950 text-slate-200 border-r border-navy-900 flex flex-col shrink-0 min-h-screen select-none no-print">
      {/* Institutional Brand Header */}
      <div className="p-3.5 border-b border-navy-900 bg-navy-900/60 flex items-center gap-3">
        <img
          src="/logo.png"
          alt="EduDecision Logo"
          className="w-9 h-9 object-contain bg-white rounded p-0.5 shadow-sm"
        />
        <div className="flex flex-col">
          <span className="font-bold text-base tracking-wide text-white font-sans flex items-center gap-1">
            EduDecision
          </span>
          <span className="text-[10px] text-teal-300 font-medium tracking-tight">
            Decision Support Platform
          </span>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-4">
        {navSections.map((section, sIdx) => {
          const visibleItems = section.items.filter(item =>
            !user?.role || item.roles.includes(user.role)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={sIdx}>
              <div className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/"}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-teal-700 text-white font-semibold shadow-sm'
                            : 'text-slate-300 hover:bg-navy-900 hover:text-white'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className="w-4 h-4 shrink-0 text-slate-300" />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                            item.badgeVariant === 'danger'
                              ? 'bg-red-800 text-red-100'
                              : 'bg-navy-800 text-teal-300 border border-teal-800'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Institutional User Status Box */}
      <div className="p-3 border-t border-navy-900 bg-navy-900/40 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-teal-800 text-teal-100 flex items-center justify-center font-bold text-[11px]">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <div className="truncate flex-1">
            <div className="font-semibold text-white truncate text-[11px]">
              {user?.role === 'ADMIN' ? 'Central Admin' : user?.role === 'HOD' ? 'Department HOD' : 'Faculty Member'}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {user?.department || 'Institution Portal'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
