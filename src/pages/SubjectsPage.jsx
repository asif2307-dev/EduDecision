import React, { useState } from 'react';
import { BookOpen, Search, Plus, Filter, Users, Award } from 'lucide-react';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';
import { SUBJECTS_CATALOG, DEPARTMENTS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Modal from '../components/common/Modal';

export const SubjectsPage = () => {
  const { user } = useAuth();
  const { success } = useNotification();
  const [subjects, setSubjects] = useState(SUBJECTS_CATALOG);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [form, setForm] = useState({
    code: '',
    name: '',
    dept: 'CSE',
    sem: 6,
    credits: 4,
    faculty: 'Dr. Ramesh Sharma'
  });

  const filtered = subjects.filter(s => {
    const matchesSearch = s.code.toLowerCase().includes(search.toLowerCase()) ||
                          s.name.toLowerCase().includes(search.toLowerCase()) ||
                          s.faculty.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || s.dept === deptFilter;
    return matchesSearch && matchesDept;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setSubjects([...subjects, { ...form, credits: Number(form.credits), sem: Number(form.sem) }]);
    success(`Course ${form.code}: ${form.name} appended to curriculum catalog.`);
    setAddModalOpen(false);
  };

  const columns = [
    {
      key: 'code',
      label: 'Course Code',
      sortable: true,
      render: (val) => <span className="font-mono font-bold text-navy-950 text-xs">{val}</span>
    },
    {
      key: 'name',
      label: 'Curricular Course Title',
      sortable: true,
      render: (val) => <span className="font-semibold text-neutral-800 text-xs">{val}</span>
    },
    {
      key: 'dept',
      label: 'Department',
      sortable: true,
      render: (val) => <Badge variant="navy" size="xs">{val}</Badge>
    },
    {
      key: 'sem',
      label: 'Semester',
      sortable: true,
      align: 'center',
      render: (val) => <span className="font-semibold text-xs text-neutral-700">Sem {val}</span>
    },
    {
      key: 'credits',
      label: 'Academic Credits',
      sortable: true,
      align: 'center',
      render: (val) => <span className="font-mono font-bold text-xs text-navy-900">{val} Credits</span>
    },
    {
      key: 'faculty',
      label: 'Assigned Lead Instructor',
      render: (val) => <span className="text-xs text-neutral-700 font-medium">{val}</span>
    }
  ];

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 border border-neutral-300 rounded shadow-panel">
        <div>
          <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wide">
            Curricular Course Catalog & Credit Structure
          </h2>
          <p className="text-xs text-neutral-500">
            Regulated institutional syllabus, credit allocations, and assigned faculty leads
          </p>
        </div>

        {user?.role === 'ADMIN' && (
          <button
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-800 hover:bg-navy-900 text-white rounded text-xs font-semibold shadow-sm transition-colors border border-navy-950"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Curricular Course</span>
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
            placeholder="Search by course code, title, or instructor..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-neutral-300 rounded focus:border-navy-700 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 font-medium">Department:</span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="py-1.5 px-2 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-800 font-medium"
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d.code} value={d.code}>{d.code}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
      />

      {/* Add Course Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Course to Institutional Catalog"
        subtitle="Specify course syllabus code, credits, and faculty lead"
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
              form="add-course-form"
              className="px-3.5 py-1.5 text-xs font-medium bg-navy-800 text-white rounded hover:bg-navy-900"
            >
              Add Course
            </button>
          </>
        }
      >
        <form id="add-course-form" onSubmit={handleAddSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Course Code</label>
              <input
                type="text"
                required
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g. CS605"
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded font-mono uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Curricular Course Title</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Distributed Computing"
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Department</label>
              <select
                value={form.dept}
                onChange={(e) => setForm({ ...form, dept: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded bg-white"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d.code} value={d.code}>{d.code}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Semester</label>
              <select
                value={form.sem}
                onChange={(e) => setForm({ ...form, sem: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded bg-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Credits</label>
              <input
                type="number"
                min="1"
                max="6"
                required
                value={form.credits}
                onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })}
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Assigned Lead Instructor</label>
            <input
              type="text"
              required
              value={form.faculty}
              onChange={(e) => setForm({ ...form, faculty: e.target.value })}
              placeholder="e.g. Dr. Ramesh Sharma"
              className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubjectsPage;
