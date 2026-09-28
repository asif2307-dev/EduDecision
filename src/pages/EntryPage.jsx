import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  LogIn,
  BarChart3,
  CalendarCheck,
  FileSpreadsheet,
  AlertTriangle,
  Building2,
  FileText,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Download,
  Mail,
  Phone,
  MapPin,
  Clock,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const EntryPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeModuleTab, setActiveModuleTab] = useState(0);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    fullName: '',
    email: '',
    department: 'Central Administration',
    subject: 'Access Request / Inquiries',
    message: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Smooth scroll helper
  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({
        fullName: '',
        email: '',
        department: 'Central Administration',
        subject: 'Access Request / Inquiries',
        message: ''
      });
    }, 4000);
  };

  const modules = [
    {
      id: 'attendance',
      title: 'Attendance Monitoring',
      icon: CalendarCheck,
      badge: 'Statutory 75% Rule',
      tagline: 'Automated attendance logging with mandatory regulatory threshold verification.',
      description: 'Tracks lecture and lab presence across all academic departments. Flags students slipping beneath the mandatory 75% threshold with automated notice generation for course coordinators and parents.',
      metrics: [
        { label: 'Campus Average', value: '84.6%' },
        { label: 'Regulatory Cutoff', value: '75.0%' },
        { label: 'Shortfall Alerts', value: '18 Students' }
      ],
      highlights: [
        'Daily session recording by assigned course faculty',
        'Automated attendance shortfall warning generation',
        'Biometric and manual register reconciliation',
        'Medical leave and institutional duty waiver audit trail'
      ]
    },
    {
      id: 'marks',
      title: 'Examinations & Marks Ledger',
      icon: FileSpreadsheet,
      badge: 'Continuous Internal Assessment',
      tagline: 'Standardized assessment matrix for mid-terms, practicals, and semester finals.',
      description: 'Maintains an auditable continuous internal assessment (CIE) ledger. Calculates weighted grade points, cumulative GPAs, and class percentiles aligned with university academic regulations.',
      metrics: [
        { label: 'Average Score', value: '74.2 / 100' },
        { label: 'Distinction Rate', value: '28.4%' },
        { label: 'Passing Benchmark', value: '92.1%' }
      ],
      highlights: [
        'Component weightage configuration (Tests, Quizzes, Lab Work)',
        'Grade normalization and moderation verification',
        'Direct integration with university transcript format',
        'Faculty grade submission approval workflows'
      ]
    },
    {
      id: 'at-risk',
      title: 'At-Risk Early Warning Radar',
      icon: AlertTriangle,
      badge: 'Predictive Intervention',
      tagline: 'Multi-parameter algorithm identifying vulnerable students weeks before finals.',
      description: 'Synthesizes attendance deficits, continuous assessment drops, and prerequisite history to compute composite academic risk scores, prompting timely remedial tutoring.',
      metrics: [
        { label: 'Monitored Cohort', value: '1,248' },
        { label: 'High Risk Flagged', value: '68' },
        { label: 'Remedial Success', value: '88.2%' }
      ],
      highlights: [
        'Composite risk scoring combining attendance + CIE marks',
        'Assigned faculty mentor intervention logs',
        'Department-level vulnerability heatmaps',
        'Exportable list for Academic Counseling Committee'
      ]
    },
    {
      id: 'departments',
      title: 'Department Administration',
      icon: Building2,
      badge: 'Faculty Workload',
      tagline: 'Department-level performance benchmarking and instructional workload governance.',
      description: 'Enables Heads of Department (HODs) and Deans to evaluate curriculum pacing, course coverage, faculty workload distribution, and comparative departmental performance indicators.',
      metrics: [
        { label: 'Active Depts', value: '4 Engineering' },
        { label: 'Faculty Members', value: '52 Full-time' },
        { label: 'Average Load', value: '14.2 hrs/wk' }
      ],
      highlights: [
        'Subject-to-faculty allocation matrix',
        'Comparative pass-percentage and attendance analytics',
        'Departmental resource and lab allocation tracking',
        'Academic council review reporting'
      ]
    },
    {
      id: 'decision-support',
      title: 'Strategic Decision Engine',
      icon: BarChart3,
      badge: 'Evidence-Based Governance',
      tagline: 'Synthesized insights and targeted recommendations for academic leadership.',
      description: 'Transforms raw classroom data into structured institutional recommendations—highlighting low-performing courses, teacher-student ratios, and curriculum revisions needed for accreditation.',
      metrics: [
        { label: 'Data Quality Score', value: '98.6%' },
        { label: 'Interventions Closed', value: '42' },
        { label: 'Accreditation Ready', value: '100%' }
      ],
      highlights: [
        'Automated institutional recommendation engine',
        'Cohort retention and progression trend lines',
        'Course-outcome (CO) and program-outcome (PO) attainment tracking',
        'Executive summaries for Academic Advisory Boards'
      ]
    },
    {
      id: 'reporting',
      title: 'Regulatory & Audit Reports',
      icon: FileText,
      badge: 'ISO 9001:2015 Compliant',
      tagline: 'Standardized documentation and accredited export formats for academic councils.',
      description: 'Generates print-ready formal institutional reports for statutory accreditation boards, annual academic reviews, departmental audits, and institutional senate meetings.',
      metrics: [
        { label: 'Standard Templates', value: '16 Formats' },
        { label: 'Export Types', value: 'PDF / CSV / XLSX' },
        { label: 'Audit Trail', value: '100% Immutable' }
      ],
      highlights: [
        'Single-click generation of statutory attendance registers',
        'Official semester exam ledger tabulation sheets',
        'Accreditation documentation data packages',
        'Tamper-evident system logs and export verification'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f1f4f8] text-slate-800 font-sans flex flex-col selection:bg-navy-100 selection:text-navy-900">
      {/* 1. TOP UTILITY / INSTITUTIONAL BAR */}
      <div className="bg-navy-950 text-slate-300 text-[11px] py-1.5 px-4 sm:px-6 lg:px-8 border-b border-navy-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-white tracking-wide">
              EDUDECISION ACADEMIC PORTAL
            </span>
            <span className="hidden md:inline text-navy-400">|</span>
            <span className="hidden md:inline text-slate-300">
              Decision Support System for Higher Education Institutions
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>Academic Year 2025–2026 • Term II</span>
            </div>
            {isAuthenticated ? (
              <span className="text-teal-300 font-medium flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-teal-400" />
                Logged in as {user?.role || 'Staff'}
              </span>
            ) : (
              <span className="text-slate-400">Restricted Staff & Faculty Access</span>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Sticky & Clean Institutional Structure) */}
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Branding */}
          <div
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src="/logo.png"
              alt="EduDecision Logo"
              className="w-10 h-10 object-contain bg-white rounded border border-neutral-300 p-0.5 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-navy-950 tracking-tight leading-none group-hover:text-navy-700 transition-colors">
                  EduDecision
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-navy-50 text-navy-800 border border-navy-200">
                  Portal
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 font-medium leading-tight mt-0.5 hidden sm:block">
                Educational Institution Decision Support Dashboard
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {[
              { name: 'Home', id: 'home' },
              { name: 'About', id: 'about' },
              { name: 'Features', id: 'features' },
              { name: 'Analytics', id: 'analytics' },
              { name: 'Resources', id: 'resources' },
              { name: 'Contact', id: 'contact' }
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:text-navy-950 hover:bg-neutral-100 rounded-[3px] transition-colors"
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Login / Dashboard CTA Action */}
          <div className="flex items-center gap-3">
            <button
              id="header-login-btn"
              onClick={() => navigate('/login')}
              className="bg-navy-900 hover:bg-navy-950 text-white text-xs font-semibold px-4 py-2 rounded-[3px] border border-navy-950 shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-teal-400" />
              <span>{isAuthenticated ? 'Staff Login / Switch' : 'Login'}</span>
            </button>

            {isAuthenticated && (
              <button
                onClick={() => navigate('/dashboard')}
                className="hidden sm:flex bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3 py-2 rounded-[3px] border border-teal-700 shadow-sm items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Enter Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-neutral-600 hover:text-navy-950 rounded hover:bg-neutral-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-200 bg-white px-4 py-3 space-y-1 shadow-lg">
            {[
              { name: 'Home', id: 'home' },
              { name: 'About', id: 'about' },
              { name: 'Features', id: 'features' },
              { name: 'Analytics', id: 'analytics' },
              { name: 'Resources', id: 'resources' },
              { name: 'Contact', id: 'contact' }
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 hover:text-navy-950 rounded"
              >
                {link.name}
              </button>
            ))}
            <div className="pt-2 border-t border-neutral-200">
              <button
                onClick={() => navigate('/login')}
                className="w-full py-2 px-3 bg-navy-900 text-white text-xs font-semibold rounded text-center flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-teal-400" />
                <span>Login to EduDecision</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 3. HERO SECTION (Spacious, Institutional, 2012–2018 Aesthetic) */}
      <section id="home" className="bg-[#f0f4f9] border-b border-neutral-200 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Primary Copy & Direct CTAs */}
            <div className="lg:col-span-7">
              {/* Small Category Label */}
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] bg-white border border-neutral-300 text-navy-900 text-[11px] font-bold tracking-wider uppercase mb-5 shadow-xs">
                <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                <span>EDUCATION • ACADEMIC ADMINISTRATION</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-navy-950 tracking-tight leading-[1.18] mb-5">
                Smarter Decisions Through Educational Data
              </h1>

              {/* Short Description */}
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl mb-8">
                EduDecision helps educational institutions manage academic data, analyze attendance
                and performance, and generate data-driven insights. Built specifically for universities,
                engineering colleges, and polytechnics to transition from fragmented spreadsheets to
                structured institutional governance.
              </p>

              {/* CTA Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-8">
                {/* Primary CTA */}
                <button
                  id="hero-login-btn"
                  onClick={() => navigate('/login')}
                  className="bg-navy-900 hover:bg-navy-950 text-white font-semibold text-sm px-6 py-3 rounded-[3px] border border-navy-950 shadow-panel flex items-center justify-center gap-2 transition-all cursor-pointer group"
                >
                  <Shield className="w-4 h-4 text-teal-400 group-hover:scale-105 transition-transform" />
                  <span>Login to Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Secondary CTA */}
                <button
                  id="hero-explore-btn"
                  onClick={() => scrollToSection('features')}
                  className="bg-white hover:bg-neutral-50 text-neutral-800 font-semibold text-sm px-5 py-3 rounded-[3px] border border-neutral-300 shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Explore Platform</span>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </button>
              </div>

              {/* Institutional Assurance / Features Pill Strip */}
              <div className="pt-4 border-t border-neutral-300/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-neutral-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-700 shrink-0" />
                  <span className="font-medium">Role-Based Access (Admin / HOD / Faculty)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-700 shrink-0" />
                  <span className="font-medium">Mandatory 75% Attendance Safeguards</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-700 shrink-0" />
                  <span className="font-medium">ISO 9001:2015 Audit Readiness</span>
                </div>
              </div>
            </div>

            {/* Right Column: Authentic Institutional Dashboard Preview Panel */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-neutral-300 rounded-[4px] shadow-panel overflow-hidden">
                {/* Window / Institutional Header Bar */}
                <div className="bg-navy-900 text-white px-4 py-2.5 border-b border-navy-950 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                    <span className="text-xs font-bold tracking-wide">
                      EduDecision — Institutional Overview
                    </span>
                  </div>
                  <span className="text-[10px] bg-navy-800 px-2 py-0.5 rounded text-teal-300 font-mono border border-teal-800">
                    TERM 2026-Q1
                  </span>
                </div>

                {/* Sub-header status bar */}
                <div className="bg-[#f8fafc] px-4 py-2 border-b border-neutral-200 flex items-center justify-between text-[11px] text-neutral-600">
                  <span>Target: Academic Performance Audit</span>
                  <span className="font-semibold text-navy-900">4 Enrolled Departments</span>
                </div>

                {/* KPI Metrics Matrix */}
                <div className="p-4 grid grid-cols-2 gap-3 bg-[#fdfdfd]">
                  <div className="p-3 bg-white border border-neutral-200 rounded-[3px] shadow-2xs">
                    <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                      Overall Attendance
                    </div>
                    <div className="text-xl font-bold text-navy-950 mt-0.5">84.6%</div>
                    <div className="text-[10px] text-teal-700 font-semibold mt-1 flex items-center gap-1">
                      <span>▲ +1.8%</span>
                      <span className="text-neutral-500 font-normal">vs minimum 75%</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white border border-neutral-200 rounded-[3px] shadow-2xs">
                    <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                      Active Enrollment
                    </div>
                    <div className="text-xl font-bold text-navy-950 mt-0.5">1,248</div>
                    <div className="text-[10px] text-neutral-500 mt-1">Full-time registered</div>
                  </div>

                  <div className="p-3 bg-white border border-neutral-200 rounded-[3px] shadow-2xs">
                    <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                      At-Risk Students
                    </div>
                    <div className="text-xl font-bold text-amber-700 mt-0.5">68</div>
                    <div className="text-[10px] text-amber-800 font-semibold mt-1">
                      Early intervention active
                    </div>
                  </div>

                  <div className="p-3 bg-white border border-neutral-200 rounded-[3px] shadow-2xs">
                    <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                      Cohort Mean CGPA
                    </div>
                    <div className="text-xl font-bold text-navy-950 mt-0.5">7.64 / 10</div>
                    <div className="text-[10px] text-teal-700 font-semibold mt-1">
                      Above 7.20 target
                    </div>
                  </div>
                </div>

                {/* Mini Department Performance Grid */}
                <div className="px-4 pb-4">
                  <div className="text-[11px] font-bold text-navy-900 uppercase tracking-wide mb-2">
                    Departmental Benchmarking Summary
                  </div>
                  <div className="border border-neutral-200 rounded-[3px] overflow-hidden text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-[#f1f5f9] text-[10px] font-bold text-neutral-600 uppercase border-b border-neutral-200">
                        <tr>
                          <th className="py-1.5 px-2.5">Department</th>
                          <th className="py-1.5 px-2 text-right">Attendance</th>
                          <th className="py-1.5 px-2 text-right">Avg Marks</th>
                          <th className="py-1.5 px-2 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 text-[11px]">
                        <tr className="hover:bg-neutral-50">
                          <td className="py-1.5 px-2.5 font-semibold text-navy-950">Computer Science (CSE)</td>
                          <td className="py-1.5 px-2 text-right font-mono">87.2%</td>
                          <td className="py-1.5 px-2 text-right font-mono">78.4%</td>
                          <td className="py-1.5 px-2 text-center">
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                              OPTIMAL
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-neutral-50">
                          <td className="py-1.5 px-2.5 font-semibold text-navy-950">Electronics & Comm (ECE)</td>
                          <td className="py-1.5 px-2 text-right font-mono">82.5%</td>
                          <td className="py-1.5 px-2 text-right font-mono">74.1%</td>
                          <td className="py-1.5 px-2 text-center">
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                              OPTIMAL
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-neutral-50">
                          <td className="py-1.5 px-2.5 font-semibold text-navy-950">Mechanical Eng (ME)</td>
                          <td className="py-1.5 px-2 text-right font-mono">84.1%</td>
                          <td className="py-1.5 px-2 text-right font-mono">72.8%</td>
                          <td className="py-1.5 px-2 text-center">
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                              OPTIMAL
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-neutral-50">
                          <td className="py-1.5 px-2.5 font-semibold text-navy-950">Civil Engineering (CE)</td>
                          <td className="py-1.5 px-2 text-right font-mono">81.3%</td>
                          <td className="py-1.5 px-2 text-right font-mono">71.0%</td>
                          <td className="py-1.5 px-2 text-center">
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              REVIEW
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Footer Status Strip */}
                <div className="bg-[#f8fafc] px-4 py-2 border-t border-neutral-200 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-500 font-medium">Internal Assessment Cycle 2 Active</span>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-navy-700 hover:text-navy-950 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Open Full Ledger</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KEY INSTITUTIONAL METRICS BAND */}
      <section className="bg-white border-b border-neutral-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
            <div className="px-4 py-2 text-center sm:text-left">
              <div className="text-2xl lg:text-3xl font-bold text-navy-950 font-mono">1,248</div>
              <div className="text-xs font-semibold text-neutral-600 uppercase tracking-wide mt-0.5">
                Active Student Profiles
              </div>
              <div className="text-[11px] text-neutral-500">Across 4 core engineering branches</div>
            </div>

            <div className="px-4 py-2 text-center sm:text-left pt-4 md:pt-2">
              <div className="text-2xl lg:text-3xl font-bold text-teal-700 font-mono">94.2%</div>
              <div className="text-xs font-semibold text-neutral-600 uppercase tracking-wide mt-0.5">
                At-Risk Early Detection
              </div>
              <div className="text-[11px] text-neutral-500">Intervention triggered before finals</div>
            </div>

            <div className="px-4 py-2 text-center sm:text-left pt-4 md:pt-2">
              <div className="text-2xl lg:text-3xl font-bold text-navy-950 font-mono">100%</div>
              <div className="text-xs font-semibold text-neutral-600 uppercase tracking-wide mt-0.5">
                Regulatory Compliance
              </div>
              <div className="text-[11px] text-neutral-500">Continuous internal assessment rules</div>
            </div>

            <div className="px-4 py-2 text-center sm:text-left pt-4 md:pt-2">
              <div className="text-2xl lg:text-3xl font-bold text-teal-700 font-mono">16+</div>
              <div className="text-xs font-semibold text-neutral-600 uppercase tracking-wide mt-0.5">
                Accredited Report Types
              </div>
              <div className="text-[11px] text-neutral-500">Print-ready PDF & statistical exports</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ABOUT SECTION */}
      <section id="about" className="py-14 lg:py-20 bg-[#f8fafc] border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-bold text-teal-700 tracking-wider uppercase mb-2">
              SYSTEM ARCHITECTURE & PURPOSE
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-950 tracking-tight mb-4">
              Designed for Higher Education Governance
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              EduDecision provides academic deans, department heads, and faculty coordinators with a single,
              auditable operational intelligence system. By linking daily classroom attendance registers with
              continuous examination assessments, institutions can implement targeted academic interventions
              long before semester final examinations occur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 border border-neutral-300 rounded-[3px] shadow-xs">
              <div className="w-10 h-10 rounded bg-navy-50 border border-navy-200 flex items-center justify-center text-navy-900 mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy-950 mb-2">
                1. Centralized Academic Intelligence
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                Eliminates fragmented spreadsheets and isolated paper registers. All student demographics,
                semester enrollments, subject allocations, and faculty assignments reside in an integrated,
                validated relational repository.
              </p>
              <ul className="text-xs text-neutral-700 space-y-1.5 font-medium">
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Immutable semester student records</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Curricular course catalog with credit allocations</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Role-based access security</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 border border-neutral-300 rounded-[3px] shadow-xs">
              <div className="w-10 h-10 rounded bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy-950 mb-2">
                2. Proactive At-Risk Intervention
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                Early-warning statistical algorithms monitor classroom attendance drops and internal assessment
                slumps in real-time, categorizing risk into Low, Medium, and Critical tiers with actionable remediation steps.
              </p>
              <ul className="text-xs text-neutral-700 space-y-1.5 font-medium">
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Automated 75% attendance cutoff flags</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Continuous assessment trend analysis</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Assigned counselor notification workflows</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 border border-neutral-300 rounded-[3px] shadow-xs">
              <div className="w-10 h-10 rounded bg-navy-50 border border-navy-200 flex items-center justify-center text-navy-900 mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy-950 mb-2">
                3. Accreditation & Regulatory Ready
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                Standardized report generators prepare compliant data exports for national academic accreditation,
                institutional audits, and executive senate reviews with complete provenance and validation trails.
              </p>
              <ul className="text-xs text-neutral-700 space-y-1.5 font-medium">
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Standardized course outcome attainment sheets</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Official semester mark ledger tabulations</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>ISO 9001:2015 educational record integrity</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURES SECTION (Interactive Tabbed Institutional Modules) */}
      <section id="features" className="py-14 lg:py-20 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="text-xs font-bold text-teal-700 tracking-wider uppercase mb-2">
                CORE ACADEMIC MODULES
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy-950 tracking-tight">
                Comprehensive Institutional Capabilities
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md mt-2 md:mt-0">
              Each module is engineered to support everyday institutional workflows for faculty, department heads, and central administration.
            </p>
          </div>

          {/* Module Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
            {modules.map((mod, idx) => {
              const Icon = mod.icon;
              const isActive = activeModuleTab === idx;
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveModuleTab(idx)}
                  className={`p-3 text-left border rounded-[3px] transition-all flex flex-col justify-between ${
                    isActive
                      ? 'bg-navy-900 border-navy-950 text-white shadow-sm'
                      : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-300 text-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-navy-800'}`} />
                    <span
                      className={`text-[9px] font-bold px-1 py-0.2 rounded uppercase ${
                        isActive
                          ? 'bg-navy-800 text-teal-300 border border-teal-700'
                          : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </div>
                  <div className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-navy-950'}`}>
                    {mod.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Module Detailed Showcase Card */}
          <div className="bg-[#f8fafc] border border-neutral-300 rounded-[4px] shadow-sm overflow-hidden">
            <div className="bg-navy-900 text-white px-6 py-3.5 border-b border-navy-950 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {React.createElement(modules[activeModuleTab].icon, {
                  className: "w-5 h-5 text-teal-400"
                })}
                <h3 className="text-sm font-bold tracking-wide">
                  {modules[activeModuleTab].title}
                </h3>
              </div>
              <span className="text-xs bg-navy-800 text-teal-300 px-2.5 py-0.5 rounded border border-teal-800 font-semibold">
                {modules[activeModuleTab].badge}
              </span>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Description & Highlights */}
              <div className="lg:col-span-7">
                <div className="text-sm font-semibold text-navy-950 mb-2">
                  {modules[activeModuleTab].tagline}
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed mb-6">
                  {modules[activeModuleTab].description}
                </p>

                <div className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-3">
                  Key Institutional Workflows
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {modules[activeModuleTab].highlights.map((item, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-white border border-neutral-200 rounded-[3px] text-xs text-neutral-700 flex items-start gap-2"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Live Institutional Metrics Preview */}
              <div className="lg:col-span-5 bg-white border border-neutral-200 p-5 rounded-[3px] flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-4 pb-2 border-b border-neutral-200 flex items-center justify-between">
                    <span>Live Telemetry Benchmark</span>
                    <span className="text-teal-700 font-mono text-[10px]">Verified Real-Time</span>
                  </div>

                  <div className="space-y-4">
                    {modules[activeModuleTab].metrics.map((m, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-neutral-50 border border-neutral-200 rounded-[3px] flex items-center justify-between"
                      >
                        <span className="text-xs font-medium text-neutral-700">{m.label}</span>
                        <span className="text-sm font-bold text-navy-950 font-mono">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-200 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-500">Requires Staff Authentication</span>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-xs font-semibold text-navy-800 hover:text-navy-950 flex items-center gap-1 hover:underline"
                  >
                    <span>Launch Module</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ANALYTICS & DECISION ENGINE SECTION */}
      <section id="analytics" className="py-14 lg:py-20 bg-[#f1f5f9] border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-bold text-teal-700 tracking-wider uppercase mb-2">
              EXECUTIVE & ACADEMIC ANALYTICS
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-950 tracking-tight mb-3">
              Statistical Intelligence & Cohort Benchmarking
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Real-time aggregation across continuous assessments, mid-semester evaluations, and classroom registers.
              Detect historical anomalies and monitor course outcome progress at institutional scale.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Cohort Grade Distribution Panel */}
            <div className="lg:col-span-7 bg-white border border-neutral-300 rounded-[3px] p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200">
                <div>
                  <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wide">
                    Institutional Cohort Grade Distribution
                  </h4>
                  <p className="text-[11px] text-neutral-500">Cumulative performance for Term 2025–26 (N=1,248)</p>
                </div>
                <span className="text-[11px] font-mono text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Target: 85% Pass Rate
                </span>
              </div>

              {/* Distribution Bar Visualization */}
              <div className="space-y-3.5 my-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-neutral-700 mb-1">
                    <span>Distinction (CGPA ≥ 8.5)</span>
                    <span className="font-mono text-navy-950">354 Students (28.4%)</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-3 rounded-xs overflow-hidden border border-neutral-200">
                    <div className="bg-navy-900 h-full" style={{ width: '28.4%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-neutral-700 mb-1">
                    <span>First Class (CGPA 7.0 – 8.49)</span>
                    <span className="font-mono text-navy-950">542 Students (43.4%)</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-3 rounded-xs overflow-hidden border border-neutral-200">
                    <div className="bg-teal-600 h-full" style={{ width: '43.4%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-neutral-700 mb-1">
                    <span>Second Class (CGPA 5.5 – 6.99)</span>
                    <span className="font-mono text-navy-950">284 Students (22.8%)</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-3 rounded-xs overflow-hidden border border-neutral-200">
                    <div className="bg-neutral-400 h-full" style={{ width: '22.8%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-amber-800 mb-1">
                    <span>At-Risk / Remedial Needed (CGPA &lt; 5.5 or Attendance &lt; 75%)</span>
                    <span className="font-mono font-bold text-amber-900">68 Students (5.4%)</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-3 rounded-xs overflow-hidden border border-neutral-200">
                    <div className="bg-amber-600 h-full" style={{ width: '5.4%' }} />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500">
                <span>Verified by Academic Dean Registry</span>
                <span className="text-teal-700 font-semibold">94.6% Eligible for Final Exams</span>
              </div>
            </div>

            {/* Strategic Decision Support Actions */}
            <div className="lg:col-span-5 bg-white border border-neutral-300 rounded-[3px] p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200">
                  <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wide">
                    Automated Administrative Actions
                  </h4>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300">
                    4 Interventions Pending
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-[3px]">
                    <div className="text-xs font-bold text-navy-950 flex items-center justify-between">
                      <span>Civil Eng — Fluid Mechanics II</span>
                      <span className="text-[10px] text-amber-800 font-semibold">Shortfall Alert</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 mt-1">
                      Batch 2024 attendance dropped to 71.4%. Automatic notice recommended to Course In-charge.
                    </p>
                  </div>

                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-[3px]">
                    <div className="text-xs font-bold text-navy-950 flex items-center justify-between">
                      <span>Computer Science — Data Structures</span>
                      <span className="text-[10px] text-teal-800 font-semibold">Target Achieved</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 mt-1">
                      Midterm CIE average reached 82.1%, exceeding departmental benchmark by +5.3%.
                    </p>
                  </div>

                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-[3px]">
                    <div className="text-xs font-bold text-navy-950 flex items-center justify-between">
                      <span>Mechanical — Thermodynamics</span>
                      <span className="text-[10px] text-amber-800 font-semibold">Tutoring Assigned</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 mt-1">
                      12 students paired with senior department teaching assistants for peer tutoring.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-200">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-2 bg-navy-800 hover:bg-navy-900 text-white font-semibold text-xs rounded border border-navy-950 shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Access Full Analytics Suite</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. RESOURCES SECTION */}
      <section id="resources" className="py-14 lg:py-20 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-bold text-teal-700 tracking-wider uppercase mb-2">
              DOCUMENTATION & PROTOCOLS
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-950 tracking-tight mb-3">
              Institutional Handbooks & Regulatory Resources
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Standard operating procedures, assessment schemas, and operational guidelines for academic staff and administration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Academic Administration Handbook',
                code: 'DOC-ADM-2026',
                format: 'PDF • 4.2 MB',
                description: 'Guidelines for Dean and HOD decision support workflows, semester scheduling, and department benchmarking.'
              },
              {
                title: 'Attendance Protocol & 75% Cutoff Rules',
                code: 'DOC-ATT-75R',
                format: 'PDF • 1.8 MB',
                description: 'Mandatory statutory regulations, leave reconciliations, duty-leave criteria, and student notice formats.'
              },
              {
                title: 'Accreditation Data Schema (NBA/NAAC)',
                code: 'DOC-ACR-SCH',
                format: 'PDF • 3.5 MB',
                description: 'Standardized tables and mapping guidelines for Course Outcomes (CO) and Program Outcomes (PO).'
              },
              {
                title: 'At-Risk Intervention & Tutoring Standard',
                code: 'DOC-INT-POL',
                format: 'PDF • 2.1 MB',
                description: 'Counseling guidelines, early-warning rubric scoring, and remediation session recording instructions.'
              }
            ].map((doc, idx) => (
              <div
                key={idx}
                className="p-5 bg-[#f8fafc] border border-neutral-300 rounded-[3px] flex flex-col justify-between hover:border-neutral-400 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-2">
                    <span className="font-semibold text-navy-900">{doc.code}</span>
                    <span>{doc.format}</span>
                  </div>
                  <h4 className="text-xs font-bold text-navy-950 mb-2 leading-snug">
                    {doc.title}
                  </h4>
                  <p className="text-[11px] text-neutral-600 leading-relaxed mb-4">
                    {doc.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                  <span className="text-[10px] text-teal-800 font-semibold">Institutional Document</span>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-xs font-semibold text-navy-800 hover:text-navy-950 flex items-center gap-1 hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CONTACT & INSTITUTIONAL SUPPORT SECTION */}
      <section id="contact" className="py-14 lg:py-20 bg-[#f8fafc] border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Contact Details & Office Hours */}
            <div className="lg:col-span-5">
              <div className="text-xs font-bold text-teal-700 tracking-wider uppercase mb-2">
                ACADEMIC HELP DESK & ADMINISTRATION
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy-950 tracking-tight mb-4">
                Institutional Contact & Staff Assistance
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                For account authorization, faculty credentials, academic ledger reconciliation, or technical
                support, reach out to the Registrar Academic Systems team.
              </p>

              <div className="space-y-4 text-xs">
                <div className="p-3.5 bg-white border border-neutral-300 rounded-[3px] flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-navy-800 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-navy-950">Academic Registrar Office</div>
                    <div className="text-neutral-600 mt-0.5 leading-relaxed">
                      Administration Complex, Central Block, Room 104
                      <br />Higher Education Academic Campus
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-white border border-neutral-300 rounded-[3px] flex items-start gap-3">
                  <Mail className="w-4 h-4 text-navy-800 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-navy-950">Institutional IT & Academic Support</div>
                    <div className="text-neutral-600 mt-0.5 font-mono">
                      support@edudecision.demo
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-white border border-neutral-300 rounded-[3px] flex items-start gap-3">
                  <Phone className="w-4 h-4 text-navy-800 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-navy-950">Internal Campus Telephony</div>
                    <div className="text-neutral-600 mt-0.5">
                      Academic Desk: Ext. 204 • IT Operations: Ext. 410
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-white border border-neutral-300 rounded-[3px] flex items-start gap-3">
                  <Clock className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-navy-950">Operational Helpdesk Hours</div>
                    <div className="text-neutral-600 mt-0.5">
                      Monday to Saturday: 08:30 – 17:30 IST
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Institutional Inquiry Form */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-neutral-300 rounded-[4px] shadow-panel overflow-hidden">
                <div className="bg-navy-900 text-white px-6 py-4 border-b border-navy-950 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider">
                      Staff Inquiry & Support Request
                    </h3>
                    <p className="text-[11px] text-navy-200 mt-0.5">
                      Direct ticket routing to Academic IT Administration
                    </p>
                  </div>
                  <HelpCircle className="w-5 h-5 text-teal-400" />
                </div>

                <div className="p-6">
                  {contactSubmitted ? (
                    <div className="p-4 bg-teal-50 border border-teal-200 rounded-[3px] text-center">
                      <CheckCircle className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                      <div className="text-sm font-bold text-teal-900">
                        Inquiry Received Successfully
                      </div>
                      <div className="text-xs text-teal-800 mt-1">
                        Ticket Ref #EDU-2026-INQ has been logged. Our Academic Operations team will respond within 4 working hours.
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-navy-950 mb-1">
                            Staff / Faculty Name
                          </label>
                          <input
                            type="text"
                            required
                            value={contactForm.fullName}
                            onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                            placeholder="e.g., Dr. A. K. Sharma"
                            className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-[3px] focus:border-navy-700 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-navy-950 mb-1">
                            Institutional Email
                          </label>
                          <input
                            type="email"
                            required
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            placeholder="staff@edudecision.demo"
                            className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-[3px] focus:border-navy-700 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-navy-950 mb-1">
                            Department / Office
                          </label>
                          <select
                            value={contactForm.department}
                            onChange={(e) => setContactForm({ ...contactForm, department: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-[3px] focus:border-navy-700 focus:outline-none"
                          >
                            <option value="Central Administration">Central Administration</option>
                            <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                            <option value="Electronics & Communication">Electronics & Communication</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                            <option value="Civil Engineering">Civil Engineering</option>
                            <option value="Examination Control Office">Examination Control Office</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-navy-950 mb-1">
                            Inquiry Category
                          </label>
                          <select
                            value={contactForm.subject}
                            onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-[3px] focus:border-navy-700 focus:outline-none"
                          >
                            <option value="Access Request / Inquiries">Staff Access & Authorization</option>
                            <option value="Attendance Reconciliation">Attendance Record Rectification</option>
                            <option value="Marks & Exams Submission">Exam Ledger Submission Support</option>
                            <option value="Dataset Import Assistance">Dataset Import & Bulk CSV Ingestion</option>
                            <option value="General Technical Support">General Technical Support</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-navy-950 mb-1">
                          Message / Technical Description
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          placeholder="Provide details regarding your academic query or system authorization request..."
                          className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-[3px] focus:border-navy-700 focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="text-[11px] text-neutral-500">
                          Priority routing for accredited institutional faculty
                        </div>
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-navy-900 hover:bg-navy-950 text-white font-semibold text-xs rounded-[3px] border border-navy-950 shadow-sm transition-colors cursor-pointer"
                        >
                          Submit Institutional Ticket
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. INSTITUTIONAL FOOTER */}
      <footer className="bg-navy-950 text-neutral-400 text-xs border-t border-navy-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-navy-900">
            {/* Column 1: Brand & Mission */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="EduDecision"
                  className="w-8 h-8 object-contain bg-white rounded border border-navy-800 p-0.5"
                />
                <div>
                  <div className="text-base font-bold text-white tracking-tight">EduDecision</div>
                  <div className="text-[10px] text-teal-400 font-medium">Educational Institution Decision Support Dashboard</div>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                Empowering academic leadership and teaching faculty with systematic student intelligence,
                attendance threshold tracking, and early intervention tools.
              </p>
              <div className="pt-2 flex items-center gap-3 text-[11px] text-slate-400">
                <span className="font-mono text-teal-300">ISO 9001:2015 Compliant</span>
                <span>•</span>
                <span>Role-Based Security</span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="md:col-span-3 space-y-2">
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Portal Sections
              </div>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button onClick={() => scrollToSection('home')} className="hover:text-white transition-colors">
                    Home & Overview
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">
                    System Architecture
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">
                    Core Academic Modules
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('analytics')} className="hover:text-white transition-colors">
                    Statistical Analytics
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('resources')} className="hover:text-white transition-colors">
                    Handbooks & Schemas
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">
                    Academic Help Desk
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Institutional Access */}
            <div className="md:col-span-4 space-y-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Staff Authentication
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Authorized academic personnel may access the administrative console to input grades,
                record daily attendance, and review at-risk student queues.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs rounded-[3px] border border-teal-600 transition-colors shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Open Staff Login Page</span>
              </button>
            </div>
          </div>

          {/* Bottom Copyright & Compliance Strip */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <div>
              © 2026 EduDecision. All rights reserved. Developed for Higher Education Administration & Analytics.
            </div>
            <div className="flex items-center gap-4">
              <span>Confidential Institutional System</span>
              <span>•</span>
              <button onClick={() => navigate('/login')} className="hover:text-slate-300 underline">
                Staff Portal Access
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EntryPage;
