# EduDecision — Educational Institution Decision Support Platform

> **"Data-Driven Decision Support for Educational Institutions"**

A comprehensive, production-ready frontend platform built for educational institutions to manage academic data and convert it into analytical and predictive insights for **Administrators**, **Heads of Departments (HODs)**, and **Faculty**.

Designed strictly following a **Three-Tone Institutional Visual Language** inspired by human-designed educational administration software (2012–2018), with clean modular architecture ready to connect to **Python FastAPI + PostgreSQL + Scikit-learn + SciPy**.

---

## 🏛️ System Features & Core Modules

### 1. Institutional Dashboard (`/`)
- **Top 6 Institutional Metrics**: Total Students (1,800), Faculty Strength (94), Institutional Mean CGPA (8.12), Cohort Attendance (79.8%), Students At-Risk (68), Active Departments (5).
- **Interactive Visualizations (Recharts)**:
  - Inter-departmental Pass Rate & Attendance Benchmarking
  - CGPA Band Distribution (Cohort $n=1,800$)
  - Monthly Statutory Attendance Trajectory (with 75% warning benchmark)
- **Executive Audit Feed**: Live chronological log of examination uploads, shortage declarations, and probation audits.

### 2. Student Directory & Records (`/students`)
- Full tabular records with realistic Indian higher-education data.
- **Dynamic Search & Multi-Parametric Filters**: Filter by Department, Semester (1–8), Batch (2021–2025, 2022–2026, 2023–2027), Status (Active / Probation), and Risk Priority.
- **Full CRUD Management**: Add New Student Modal, Edit Student Record Modal, and Delete Confirmation Modal.
- **Exporting**: Instant CSV export matching active filter criteria.

### 3. Comprehensive Student Dossier (`/students/:id`)
- Deep drill-down containing personal, administrative, and academic parameters.
- **Semester-wise SGPA Progression Trend**: Line chart tracking performance history.
- **Subject-Wise Marks Ledger**: Internal assessments (/40) vs University External Exam (/60) breakdown.
- **Early-Warning Indicators**: Contributing risk factors tag list and faculty mentor assignment.
- **Printable Dossier**: Native print layout with official letterhead formatting.

### 4. Faculty Management & Workload (`/faculty`)
- Faculty directory with designations (Dean, Professor & HOD, Associate Professor, Assistant Professor), educational credentials (e.g. Ph.D. IIT Bombay), assigned courses, and Academic Performance Index (API) scores.
- Register new faculty appointments.

### 5. Departments Governance (`/departments`)
- 5 Core Departments: **Computer Science & Engineering (CSE)**, **Data Science & AI (DS)**, **Information Technology (IT)**, **Electronics & Communication (ECE)**, and **Mechanical Engineering (ME)**.
- Normalized comparative indices and HOD administration profiles.

### 6. Curricular Course Catalog (`/subjects`)
- Complete course registry with syllabus codes, credit weights, semester assignments, and assigned instructors.

### 7. Attendance Monitoring Module (`/attendance`)
- **Configurable Statutory Threshold**: Default 75% university norm (dynamically configurable in UI without code changes).
- Departmental attendance aggregations and automatic generation of the official **Attendance Shortage List**.

### 8. Examinations & Marks Ledger (`/marks`)
- Track Continuous Internal Evaluations (CIE) and Semester End Examinations (SEE).
- Real-time university letter-grade computation ($O, A+, A, B+, B, C, D, F$).
- Add/Edit scores with automatic status determination (PASS / FAIL).

### 9. Statistical & Inferential Analytics Suite (`/analytics`)
- **A. Descriptive Statistics**: Mean ($\mu$), Median ($Q_2$), Mode, Standard Deviation ($\sigma$), Variance ($\sigma^2$), Minimum, Maximum, Skewness, and Kurtosis.
- **B. Pearson Correlation Analysis**: Attendance vs Exam Score ($r = +0.782, p < 0.0001$) with scatter plot and academic interpretation.
- **C. Inferential Hypothesis Testing**:
  - **Two-Sample Student's t-Test**: CSE vs ME CGPA variance ($t = 11.42, p < 0.001$).
  - **One-Way ANOVA**: Cross-department variance ($F = 14.82, p < 0.001$).
  - **Chi-Square Test of Independence**: Attendance status vs Exam success ($\chi^2 = 84.62, p < 0.0001, \text{Cramer's } V = 0.44$).
- **D. OLS Multiple Linear Regression & Score Predictor**:
  $$\text{ExamScore} = -14.28 + 0.62 \cdot (\text{Attendance}) + 1.24 \cdot (\text{InternalMarks})$$
  Interactive calculator providing expected marks and 95% confidence intervals.

### 10. Performance Benchmarking (`/performance`)
- Longitudinal semester-to-semester trajectories and course failure rate audits.

### 11. At-Risk Students & Early-Warning Radar (`/at-risk`)
- Dedicated early-intervention radar classifying students into **HIGH**, **MEDIUM**, and **LOW** priority.
- Explicit institutional disclaimer stating risk levels are heuristic indicators for support, not disciplinary judgments.
- **Schedule Mentoring Modal**: Log faculty advisory counseling and remedial action plans.

### 12. Strategic Decision Support (`/decision-support`)
- Converts complex data models into understandable institutional directives:
  1. *Analytical Observation*
  2. *Empirical Supporting Data* (statistical backing)
  3. *Institutional Action Directive*

### 13. Multi-Stage Data Ingestion Pipeline (`/import`)
- Full 5-stage ETL workflow:
  $$\text{Upload} \longrightarrow \text{Validate} \longrightarrow \text{Error Quality Audit} \longrightarrow \text{Preview} \longrightarrow \text{PostgreSQL Commit}$$
- Verification checks: Missing attributes (12), Duplicate primary keys (4), Invalid boundary values (2), Out-of-range checks.
- Sample dataset template download.

### 14. Institutional Data Quality (`/data-quality`)
- Detects format inconsistencies, primary-key collisions, and outliers with 1-click remediation actions.

### 15. Regulatory Reports Generator (`/reports`)
- 7 Regulatory Report templates for Academic Senate, NIRF, and State accreditation.
- Instant CSV generation and formal print-ready PDF styling with official institute header and signature blocks.

### 16. Institutional Governance & Settings (`/settings`)
- Configurable statutory attendance cutoffs, academic terms, passing marks floor, Role-Based Access Control (RBAC) matrix, and FastAPI endpoint diagnostics.

---

## 🎨 Design Philosophy & Three-Tone Color System

Strictly constructed using a **Three-Tone Institutional Visual Language** inspired by higher-education administrative systems from 2012–2018:

| Tone | Role | Hex Palette | Usage |
| :--- | :--- | :--- | :--- |
| **Tone 1** | **Primary Institutional Navy** | `#0f2c4b` / `#163f68` | Header, sidebar accents, active badges, primary buttons, major chart bars |
| **Tone 2** | **Supporting Academic Teal / Cyan** | `#0d9488` / `#14b8a6` | Secondary accents, metric cards, trend lines, badges |
| **Tone 3** | **Institutional Slate & Crisp Neutral** | `#f1f4f8` / `#ffffff` / `#e2e8f0` | Viewport background, clean card panels, dense table borders |

*No neon colors, no glassmorphism, no excessive whitespace, no dead buttons.*

---

## 🔐 Working Demo Accounts (Role-Based Access Control)

To review different institutional perspectives:

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **ADMIN (Dean)** | `admin@edudecision.demo` | `admin123` | Complete institutional oversight, dataset ingestion, system settings |
| **HOD (CSE)** | `hod@edudecision.demo` | `hod123` | Department students, faculty workload, attendance shortages, reports |
| **FACULTY** | `faculty@edudecision.demo` | `faculty123` | Assigned courses, attendance logs, marks entry, student mentoring |

*A 1-click role switcher is conveniently provided in the top header for viva demonstrations.*

---

## 🚀 Getting Started & Local Development

### Prerequisites
- Node.js (v18 or higher; tested on v24.20.0)
- npm (v9 or higher; tested on v11.19.0)

### Installation
```bash
# Clone the repository and enter the directory
cd EduDecision

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will be accessible at `http://localhost:5173/`.

### Building for Production
```bash
npm run build
npm run preview
```

---

## 🔌 API Service Layer Architecture

The frontend is structured with an isolated service layer (`src/api/*`) designed to connect directly to a Python FastAPI backend:

```
src/
├── api/
│   ├── apiClient.js          # Central client with JWT headers and VITE_API_BASE_URL
│   ├── authApi.js            # Login, logout, JWT token handling
│   ├── studentsApi.js        # Student query, filter, pagination, CRUD
│   ├── facultyApi.js         # Faculty directory & workload
│   ├── departmentsApi.js    # Department metrics & benchmarks
│   ├── attendanceApi.js      # Attendance logs & threshold queries
│   ├── marksApi.js           # Examinations & grade computing
│   ├── analyticsApi.js       # Descriptive, Correlation, Inferential & Regression
│   ├── atRiskApi.js          # At-risk detection & mentoring interventions
│   ├── decisionSupportApi.js # Actionable institutional directives
│   ├── reportsApi.js         # Regulatory report compilation & CSV export
│   └── importApi.js          # Multi-step CSV/Excel ETL validation & DB commit
```

Environment variables are configured in `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME="EduDecision"
VITE_DEMO_MODE=true
```
