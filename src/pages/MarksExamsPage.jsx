import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Edit2,
  Award,
  Filter,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import LoadingState from '../components/common/LoadingState';
import marksApi from '../api/marksApi';
import { DEPARTMENTS, SUBJECTS_CATALOG } from '../data/mockData';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

export const MarksExamsPage = () => {
  const { user } = useAuth();
  const { success, error } = useNotification();

  const [marks, setMarks] = useState([]);
  const [gradeSummary, setGradeSummary] = useState({});
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('ALL');
  const [semester, setSemester] = useState('ALL');
  const [subject, setSubject] = useState('ALL');

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [form, setForm] = useState({
    studentId: '2022CSE001',
    rollNo: 'CS2201',
    studentName: 'Aarav Sharma',
    department: 'Computer Science & Engineering',
    deptCode: 'CSE',
    semester: 6,
    subjectCode: 'CS601',
    subjectName: 'Compiler Design',
    internalMarks: 35,
    examScore: 50
  });

  const loadMarks = async () => {
    setLoading(true);
    try {
      const res = await marksApi.getMarks({ department, semester, subject, search });
      setMarks(res.data);
      setGradeSummary(res.gradeSummary || {});
    } catch (err) {
      error(err.message || 'Failed to fetch examination marks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMarks();
  }, [department, semester, subject, search]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await marksApi.addMarks(form);
      success('Examination marks record registered.');
      setAddModalOpen(false);
      loadMarks();
    } catch (err) {
      error(err.message || 'Failed to add marks');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await marksApi.updateMarks(selectedRecord.id, {
        internalMarks: form.internalMarks,
        examScore: form.examScore
      });
      success('Marks updated and grade recomputed.');
      setEditModalOpen(false);
      loadMarks();
    } catch (err) {
      error(err.message || 'Failed to update marks');
    }
  };

  const openEdit = (record) => {
    setSelectedRecord(record);
    setForm({
      ...record,
      internalMarks: record.internalMarks,
      examScore: record.examScore
    });
    setEditModalOpen(true);
  };

  const columns = [
    {
      key: 'studentName',
      label: 'Student Name / Roll',
      sortable: true,
      render: (_, row) => (
        <div>
          <span className="font-bold text-navy-950 text-xs">{row.studentName}</span>
          <div className="text-[10px] text-neutral-500 font-mono">{row.studentId} ({row.rollNo})</div>
        </div>
      )
    },
    {
      key: 'subjectCode',
      label: 'Subject Code',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-mono font-bold text-xs text-navy-900">{val}</span>
          <div className="text-[10px] text-neutral-500 truncate max-w-[140px]">{row.subjectName}</div>
        </div>
      )
    },
    {
      key: 'deptCode',
      label: 'Dept / Sem',
      render: (_, row) => (
        <span className="text-xs font-medium text-neutral-700">
          {row.deptCode} <span className="text-[10px] text-neutral-400">Sem {row.semester}</span>
        </span>
      )
    },
    {
      key: 'internalMarks',
      label: 'Internal (/40)',
      sortable: true,
      align: 'center',
      render: (val) => (
        <span className={`font-mono font-bold text-xs ${val < 20 ? 'text-red-700' : 'text-neutral-800'}`}>
          {val}
        </span>
      )
    },
    {
      key: 'examScore',
      label: 'External Exam (/60)',
      sortable: true,
      align: 'center',
      render: (val) => (
        <span className={`font-mono font-bold text-xs ${val < 30 ? 'text-red-700' : 'text-neutral-800'}`}>
          {val}
        </span>
      )
    },
    {
      key: 'totalScore',
      label: 'Total (/100)',
      sortable: true,
      align: 'center',
      render: (val) => (
        <span className="font-mono font-bold text-xs text-navy-950">
          {val}
        </span>
      )
    },
    {
      key: 'grade',
      label: 'Grade',
      sortable: true,
      align: 'center',
      render: (val) => (
        <span className="px-2 py-0.5 rounded font-bold text-xs bg-neutral-100 border border-neutral-300">
          {val}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Result',
      sortable: true,
      align: 'center',
      render: (val) => (
        <Badge variant={val === 'FAIL' ? 'danger' : 'success'} size="xs">
          {val}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Edit',
      align: 'right',
      render: (_, row) => (
        <button
          onClick={() => openEdit(row)}
          className="p-1 text-neutral-700 hover:bg-neutral-100 rounded border border-neutral-300"
          title="Edit Marks"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3 border border-neutral-300 rounded shadow-panel">
        <div>
          <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wide">
            Examinations & Marks Ledger
          </h2>
          <p className="text-xs text-neutral-500">
            Internal assessments (40%), university end-semester tests (60%), and grade audit
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-800 hover:bg-navy-900 text-white rounded text-xs font-semibold shadow-sm transition-colors border border-navy-950"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Enter Exam Marks</span>
        </button>
      </div>

      {/* Grade Summary Ribbon */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {['O', 'A+', 'A', 'B+', 'B', 'C', 'D', 'F'].map(g => (
          <div key={g} className="bg-white p-2 border border-neutral-200 rounded text-center">
            <div className="text-[10px] text-neutral-500 font-bold uppercase">Grade {g}</div>
            <div className={`text-base font-bold ${g === 'F' ? 'text-red-700' : 'text-navy-950'}`}>
              {gradeSummary[g.replace('+', '_plus')] || 0}
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="inst-card p-3 bg-white flex flex-wrap items-center justify-between gap-2.5">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, roll number, or subject..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-neutral-300 rounded focus:border-navy-700 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-neutral-500 font-medium">Department:</span>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="py-1.5 px-2 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-800 font-medium"
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d.code} value={d.code}>{d.code}</option>
            ))}
          </select>

          <span className="text-xs text-neutral-500 font-medium ml-2">Subject:</span>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="py-1.5 px-2 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-800 font-medium"
          >
            <option value="ALL">All Subjects</option>
            {SUBJECTS_CATALOG.map(s => (
              <option key={s.code} value={s.code}>{s.code} - {s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Marks Table */}
      <DataTable
        columns={columns}
        data={marks}
        loading={loading}
      />

      {/* Add Marks Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Record Examination Marks"
        subtitle="Log internal assessment and external examination scores"
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
              form="add-marks-form"
              className="px-3.5 py-1.5 text-xs font-medium bg-navy-800 text-white rounded hover:bg-navy-900"
            >
              Commit Marks
            </button>
          </>
        }
      >
        <form id="add-marks-form" onSubmit={handleAddSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Student Roll Number</label>
              <input
                type="text"
                required
                value={form.rollNo}
                onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded font-mono uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Student Full Name</label>
              <input
                type="text"
                required
                value={form.studentName}
                onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Course Code</label>
              <select
                value={form.subjectCode}
                onChange={(e) => {
                  const s = SUBJECTS_CATALOG.find(sub => sub.code === e.target.value);
                  setForm({
                    ...form,
                    subjectCode: e.target.value,
                    subjectName: s ? s.name : ''
                  });
                }}
                className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded bg-white"
              >
                {SUBJECTS_CATALOG.map(s => (
                  <option key={s.code} value={s.code}>{s.code} - {s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Department</label>
              <select
                value={form.deptCode}
                onChange={(e) => setForm({ ...form, deptCode: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded bg-white"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d.code} value={d.code}>{d.code}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Internal Marks (Max 40)</label>
              <input
                type="number"
                min="0"
                max="40"
                required
                value={form.internalMarks}
                onChange={(e) => setForm({ ...form, internalMarks: Number(e.target.value) })}
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">External Exam (Max 60)</label>
              <input
                type="number"
                min="0"
                max="60"
                required
                value={form.examScore}
                onChange={(e) => setForm({ ...form, examScore: Number(e.target.value) })}
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded"
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Marks Modal */}
      {selectedRecord && (
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title={`Edit Examination Scores: ${selectedRecord.studentName}`}
          subtitle={`${selectedRecord.subjectCode} - ${selectedRecord.subjectName}`}
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
                form="edit-marks-form"
                className="px-3.5 py-1.5 text-xs font-medium bg-navy-800 text-white rounded hover:bg-navy-900"
              >
                Save Score
              </button>
            </>
          }
        >
          <form id="edit-marks-form" onSubmit={handleEditSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Internal Marks (out of 40)</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  required
                  value={form.internalMarks}
                  onChange={(e) => setForm({ ...form, internalMarks: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">External Exam (out of 60)</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  required
                  value={form.examScore}
                  onChange={(e) => setForm({ ...form, examScore: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded"
                />
              </div>
            </div>
            <div className="p-2.5 bg-neutral-100 rounded text-xs text-neutral-700">
              Total Score will be: <strong className="text-navy-950 font-mono">{Number(form.internalMarks) + Number(form.examScore)} / 100</strong>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default MarksExamsPage;
