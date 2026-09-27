import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  UserPlus,
  Eye,
  Edit2,
  Trash2,
  Download,
  AlertTriangle,
  GraduationCap,
  CheckCircle2,
  Search
} from 'lucide-react';
import DataTable from '../components/common/DataTable';
import FilterBar from '../components/common/FilterBar';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Badge from '../components/common/Badge';
import studentsApi from '../api/studentsApi';
import reportsApi from '../api/reportsApi';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { DEPARTMENTS } from '../data/mockData';

export const StudentsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { success, error } = useNotification();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters state
  const [page, setPage] = useState(1);
  const limit = 8;
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [department, setDepartment] = useState(user?.role === 'HOD' ? user.deptCode || 'CSE' : 'ALL');
  const [semester, setSemester] = useState('ALL');
  const [batch, setBatch] = useState('ALL');
  const [gender, setGender] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Student Form State for Add / Edit
  const initialForm = {
    id: '',
    rollNo: '',
    name: '',
    email: '',
    department: 'Computer Science & Engineering',
    deptCode: 'CSE',
    semester: 6,
    batch: '2022-2026',
    gender: 'Male',
    attendance: 80.0,
    cgpa: 7.5,
    internalMarks: 32.0,
    examScore: 75.0,
    backlogs: 0,
    academicStatus: 'Active',
    phone: '+91 98451 00000',
    mentor: 'Dr. Ramesh Sharma'
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await studentsApi.getStudents({
        page,
        limit,
        search,
        department,
        semester,
        batch,
        gender,
        status,
        sortBy,
        sortOrder
      });
      setStudents(res.data);
      setTotalRecords(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      error(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }, [page, search, department, semester, batch, gender, status, sortBy, sortOrder, error]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleSort = (columnKey) => {
    if (sortBy === columnKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnKey);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setDepartment('ALL');
    setSemester('ALL');
    setBatch('ALL');
    setGender('ALL');
    setStatus('ALL');
    setSortBy('name');
    setSortOrder('asc');
    setPage(1);
  };

  const handleExportCSV = () => {
    reportsApi.exportToCSV({
      title: 'EduDecision Student Directory Export',
      generatedAt: new Date().toLocaleString(),
      academicSession: '2024-2025 Even Semester',
      rows: students.map(s => ({
        'Student ID': s.id,
        'Roll No': s.rollNo,
        'Name': s.name,
        'Department': s.department,
        'Semester': s.semester,
        'Batch': s.batch,
        'Gender': s.gender,
        'Attendance %': s.attendance,
        'CGPA': s.cgpa,
        'Backlogs': s.backlogs,
        'Risk Level': s.riskLevel,
        'Status': s.academicStatus
      }))
    });
    success('Student records exported to CSV');
  };

  // Add Student Handler
  const handleOpenAdd = () => {
    setFormData(initialForm);
    setAddModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await studentsApi.createStudent(formData);
      success(`Student ${formData.name} successfully registered.`);
      setAddModalOpen(false);
      fetchStudents();
    } catch (err) {
      error(err.message || 'Failed to register student');
    } finally {
      setActionLoading(false);
    }
  };

  // Edit Student Handler
  const handleOpenEdit = (student) => {
    setSelectedStudent(student);
    setFormData({ ...student });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await studentsApi.updateStudent(selectedStudent.id, formData);
      success(`Student ${formData.name} record updated.`);
      setEditModalOpen(false);
      fetchStudents();
    } catch (err) {
      error(err.message || 'Failed to update student');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Student Handler
  const handleOpenDelete = (student) => {
    setSelectedStudent(student);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedStudent) return;
    setActionLoading(true);
    try {
      await studentsApi.deleteStudent(selectedStudent.id);
      success(`Student ${selectedStudent.name} (${selectedStudent.id}) removed from registry.`);
      setDeleteDialogOpen(false);
      fetchStudents();
    } catch (err) {
      error(err.message || 'Failed to delete student');
    } finally {
      setActionLoading(false);
    }
  };

  // Table Columns Definition
  const columns = [
    {
      key: 'id',
      label: 'ID / Roll No',
      sortable: true,
      render: (_, row) => (
        <div>
          <div className="font-mono font-semibold text-navy-950 text-xs">{row.id}</div>
          <div className="text-[10px] text-neutral-500 font-mono">{row.rollNo}</div>
        </div>
      )
    },
    {
      key: 'name',
      label: 'Student Name',
      sortable: true,
      render: (_, row) => (
        <div>
          <button
            onClick={() => navigate(`/students/${row.id}`)}
            className="font-bold text-navy-900 hover:text-teal-700 hover:underline text-left text-xs"
          >
            {row.name}
          </button>
          <div className="text-[10px] text-neutral-500">{row.email}</div>
        </div>
      )
    },
    {
      key: 'deptCode',
      label: 'Department',
      sortable: true,
      render: (_, row) => (
        <span className="font-semibold text-neutral-700 text-xs">
          {row.deptCode} <span className="text-[10px] text-neutral-400">Sem {row.semester}</span>
        </span>
      )
    },
    {
      key: 'batch',
      label: 'Batch',
      sortable: true,
      render: (val) => <span className="text-[11px] text-neutral-600">{val}</span>
    },
    {
      key: 'attendance',
      label: 'Attendance',
      sortable: true,
      align: 'center',
      render: (val) => (
        <span
          className={`font-bold text-xs ${
            val < 70 ? 'text-red-700' : val < 75 ? 'text-amber-700' : 'text-neutral-800'
          }`}
        >
          {val}%
        </span>
      )
    },
    {
      key: 'cgpa',
      label: 'CGPA',
      sortable: true,
      align: 'center',
      render: (val) => (
        <span
          className={`font-bold text-xs ${
            val < 6.0 ? 'text-red-700' : val >= 8.5 ? 'text-teal-800' : 'text-neutral-800'
          }`}
        >
          {val}
        </span>
      )
    },
    {
      key: 'backlogs',
      label: 'Backlogs',
      sortable: true,
      align: 'center',
      render: (val) => (
        <span className={`font-semibold text-xs ${val > 0 ? 'text-red-700' : 'text-neutral-500'}`}>
          {val}
        </span>
      )
    },
    {
      key: 'riskLevel',
      label: 'Risk Level',
      sortable: true,
      align: 'center',
      render: (val) => (
        <Badge variant={val.toLowerCase()} size="xs">
          {val}
        </Badge>
      )
    },
    {
      key: 'academicStatus',
      label: 'Status',
      sortable: true,
      align: 'center',
      render: (val) => (
        <span
          className={`inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded ${
            val === 'Active'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {val}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => navigate(`/students/${row.id}`)}
            className="p-1 text-navy-800 hover:bg-navy-50 rounded border border-neutral-300"
            title="Inspect Student Record"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1 text-neutral-700 hover:bg-neutral-100 rounded border border-neutral-300"
            title="Edit Student Info"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          {user?.role === 'ADMIN' && (
            <button
              onClick={() => handleOpenDelete(row)}
              className="p-1 text-red-700 hover:bg-red-50 rounded border border-red-200"
              title="Delete Student"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 border border-neutral-300 rounded shadow-panel">
        <div>
          <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wide">
            Institutional Student Registry
          </h2>
          <p className="text-xs text-neutral-500">
            Comprehensive student profiles, attendance metrics, examination ledger, and backlog status
          </p>
        </div>

        <div className="flex items-center gap-2">
          {user?.role !== 'FACULTY' && (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-800 hover:bg-navy-900 text-white rounded text-xs font-semibold shadow-sm transition-colors border border-navy-950"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Enroll New Student</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar with search, dropdowns, and export */}
      <FilterBar
        search={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        department={department}
        onDepartmentChange={(val) => { setDepartment(val); setPage(1); }}
        semester={semester}
        onSemesterChange={(val) => { setSemester(val); setPage(1); }}
        batch={batch}
        onBatchChange={(val) => { setBatch(val); setPage(1); }}
        status={status}
        onStatusChange={(val) => { setStatus(val); setPage(1); }}
        onReset={handleResetFilters}
        onExport={handleExportCSV}
      />

      {/* Students Data Table */}
      <DataTable
        columns={columns}
        data={students}
        loading={loading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        pagination={{
          page,
          limit,
          total: totalRecords,
          totalPages
        }}
        onPageChange={setPage}
      />

      {/* Add Student Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Institutional Student Enrollment"
        subtitle="Register a new academic scholar into the institutional registry"
        maxWidth="max-w-2xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-student-form"
              disabled={actionLoading}
              className="px-3.5 py-1.5 text-xs font-medium bg-navy-800 hover:bg-navy-900 text-white rounded shadow-sm"
            >
              {actionLoading ? 'Saving...' : 'Confirm Enrollment'}
            </button>
          </>
        }
      >
        <form id="add-student-form" onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Aditya Verma"
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded focus:border-navy-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Institutional Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. aditya.v@edudecision.demo"
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded focus:border-navy-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Department</label>
              <select
                value={formData.deptCode}
                onChange={(e) => {
                  const d = DEPARTMENTS.find(dep => dep.code === e.target.value);
                  setFormData({ ...formData, deptCode: e.target.value, department: d ? d.name : '' });
                }}
                className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded bg-white"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d.code} value={d.code}>{d.code} - {d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Semester</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded bg-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Batch</label>
              <select
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded bg-white"
              >
                <option value="2021-2025">2021-2025</option>
                <option value="2022-2026">2022-2026</option>
                <option value="2023-2027">2023-2027</option>
                <option value="2024-2028">2024-2028</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Attendance %</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                required
                value={formData.attendance}
                onChange={(e) => setFormData({ ...formData, attendance: Number(e.target.value) })}
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded focus:border-navy-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">CGPA (0-10)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: Number(e.target.value) })}
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded focus:border-navy-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Active Backlogs</label>
              <input
                type="number"
                min="0"
                max="15"
                required
                value={formData.backlogs}
                onChange={(e) => setFormData({ ...formData, backlogs: Number(e.target.value) })}
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded focus:border-navy-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit Student Record - ${selectedStudent?.name || ''}`}
        subtitle="Update academic details and attendance marks"
        maxWidth="max-w-2xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-student-form"
              disabled={actionLoading}
              className="px-3.5 py-1.5 text-xs font-medium bg-navy-800 hover:bg-navy-900 text-white rounded shadow-sm"
            >
              {actionLoading ? 'Updating...' : 'Save Modifications'}
            </button>
          </>
        }
      >
        <form id="edit-student-form" onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Student Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Attendance %</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                required
                value={formData.attendance}
                onChange={(e) => setFormData({ ...formData, attendance: Number(e.target.value) })}
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: Number(e.target.value) })}
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Backlogs</label>
              <input
                type="number"
                min="0"
                max="15"
                required
                value={formData.backlogs}
                onChange={(e) => setFormData({ ...formData, backlogs: Number(e.target.value) })}
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Academic Status</label>
              <select
                value={formData.academicStatus}
                onChange={(e) => setFormData({ ...formData, academicStatus: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded bg-white"
              >
                <option value="Active">Active</option>
                <option value="Probation">Probation</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Student Expulsion / Removal"
        message={`Are you sure you want to permanently remove student ${selectedStudent?.name} (${selectedStudent?.id}) from the academic database? All examination records and attendance ledgers for this ID will be detached.`}
        confirmText="Confirm Delete"
        confirmVariant="danger"
        loading={actionLoading}
      />
    </div>
  );
};

export default StudentsPage;
