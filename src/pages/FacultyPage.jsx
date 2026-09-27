import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Mail,
  Phone,
  BookOpen,
  Award,
  Users,
  Search,
  Plus,
  Building,
  CheckCircle2
} from 'lucide-react';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import LoadingState from '../components/common/LoadingState';
import facultyApi from '../api/facultyApi';
import { DEPARTMENTS } from '../data/mockData';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

export const FacultyPage = () => {
  const { user } = useAuth();
  const { success, error } = useNotification();

  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState(user?.role === 'HOD' ? user.deptCode || 'CSE' : 'ALL');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  // Form state for adding faculty
  const [form, setForm] = useState({
    name: '',
    email: '',
    department: 'Computer Science & Engineering',
    deptCode: 'CSE',
    designation: 'Assistant Professor',
    qualification: 'Ph.D. in Computer Science',
    subjects: 'Algorithm Design (CS501)',
    experienceYears: 5,
    cabin: 'Block A-202',
    phone: '+91 94123 00000'
  });

  const loadFaculty = async () => {
    setLoading(true);
    try {
      const res = await facultyApi.getFaculty({ department, search });
      setFaculty(res.data);
    } catch (err) {
      error(err.message || 'Failed to fetch faculty records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaculty();
  }, [department, search]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await facultyApi.addFaculty(form);
      success(`Faculty member ${form.name} registered.`);
      setAddModalOpen(false);
      loadFaculty();
    } catch (err) {
      error(err.message || 'Failed to add faculty');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Faculty Member',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-navy-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
            {row.name.replace('Dr. ', '').replace('Prof. ', '').charAt(0)}
          </div>
          <div>
            <div className="font-bold text-navy-950 text-xs">{row.name}</div>
            <div className="text-[10px] text-neutral-500">{row.qualification}</div>
          </div>
        </div>
      )
    },
    {
      key: 'designation',
      label: 'Designation',
      sortable: true,
      render: (val) => <span className="font-medium text-xs text-neutral-800">{val}</span>
    },
    {
      key: 'deptCode',
      label: 'Department',
      sortable: true,
      render: (val) => <Badge variant="navy" size="xs">{val}</Badge>
    },
    {
      key: 'subjects',
      label: 'Courses / Subjects Assigned',
      render: (subs) => (
        <div className="space-y-0.5">
          {(subs || []).map((s, idx) => (
            <div key={idx} className="text-[11px] text-neutral-700 font-mono">
              • {s}
            </div>
          ))}
        </div>
      )
    },
    {
      key: 'studentCount',
      label: 'Scholars Mapped',
      sortable: true,
      align: 'center',
      render: (val) => <span className="font-bold text-xs text-navy-900">{val}</span>
    },
    {
      key: 'attendanceResponsibility',
      label: 'Batch Attendance',
      sortable: true,
      align: 'center',
      render: (val) => (
        <span className={`font-bold text-xs ${val < 85 ? 'text-amber-700' : 'text-emerald-700'}`}>
          {val}%
        </span>
      )
    },
    {
      key: 'performanceIndex',
      label: 'API Score',
      sortable: true,
      align: 'center',
      render: (val) => (
        <span className="font-bold text-xs text-navy-950 font-mono">
          {val} / 10
        </span>
      )
    },
    {
      key: 'actions',
      label: 'View',
      align: 'right',
      render: (_, row) => (
        <button
          onClick={() => setSelectedFaculty(row)}
          className="px-2.5 py-1 text-xs bg-white border border-neutral-300 rounded hover:bg-neutral-50 font-medium text-navy-900"
        >
          Details
        </button>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 border border-neutral-300 rounded shadow-panel">
        <div>
          <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wide">
            Faculty Directory & Academic Workload
          </h2>
          <p className="text-xs text-neutral-500">
            Teaching assignments, scholar counts, student attendance tracking responsibility, and API index
          </p>
        </div>

        {user?.role === 'ADMIN' && (
          <button
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-800 hover:bg-navy-900 text-white rounded text-xs font-semibold shadow-sm transition-colors border border-navy-950"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Faculty Member</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="inst-card p-3 bg-white flex flex-wrap items-center justify-between gap-2.5">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search faculty by name, qualification, or course..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-neutral-300 rounded focus:border-navy-700 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 font-medium">Department:</span>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="py-1.5 px-2 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-800 font-medium"
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d.code} value={d.code}>{d.code} - {d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Faculty Table */}
      <DataTable
        columns={columns}
        data={faculty}
        loading={loading}
      />

      {/* Add Faculty Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Faculty Member Appointment"
        subtitle="Add a new academic instructor to the faculty cadre"
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
              form="add-faculty-form"
              className="px-3.5 py-1.5 text-xs font-medium bg-navy-800 text-white rounded hover:bg-navy-900"
            >
              Confirm Appointment
            </button>
          </>
        }
      >
        <form id="add-faculty-form" onSubmit={handleAddSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Name & Salutation</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Dr. Anand Raghavan"
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Institutional Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="e.g. anand.r@edudecision.demo"
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Department</label>
              <select
                value={form.deptCode}
                onChange={(e) => {
                  const d = DEPARTMENTS.find(dep => dep.code === e.target.value);
                  setForm({ ...form, deptCode: e.target.value, department: d ? d.name : '' });
                }}
                className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded bg-white"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d.code} value={d.code}>{d.code} - {d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Designation</label>
              <select
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded bg-white"
              >
                <option value="Professor & HOD">Professor & HOD</option>
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Visiting Faculty">Visiting Faculty</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Highest Academic Qualification</label>
              <input
                type="text"
                required
                value={form.qualification}
                onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                placeholder="e.g. Ph.D. (IIT Delhi)"
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Primary Teaching Subject</label>
              <input
                type="text"
                required
                value={form.subjects}
                onChange={(e) => setForm({ ...form, subjects: e.target.value })}
                placeholder="e.g. Operating Systems (CS403)"
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded"
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Faculty Detail Modal */}
      {selectedFaculty && (
        <Modal
          isOpen={!!selectedFaculty}
          onClose={() => setSelectedFaculty(null)}
          title={`Faculty Dossier: ${selectedFaculty.name}`}
          subtitle={selectedFaculty.designation}
          maxWidth="max-w-md"
        >
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Department</span>
              <span className="font-semibold text-navy-950">{selectedFaculty.department}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Qualification</span>
              <span className="font-medium text-neutral-800">{selectedFaculty.qualification}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Teaching Experience</span>
              <span className="text-neutral-800">{selectedFaculty.experienceYears} Years</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Cabin Location</span>
              <span className="text-neutral-800">{selectedFaculty.cabin}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Contact Email</span>
              <span className="font-mono text-navy-900">{selectedFaculty.email}</span>
            </div>
            <div>
              <span className="text-neutral-500 block mb-1">Assigned Courses:</span>
              {(selectedFaculty.subjects || []).map((s, idx) => (
                <div key={idx} className="p-1.5 bg-neutral-100 rounded text-neutral-800 font-mono text-[11px] mb-1">
                  {s}
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FacultyPage;
