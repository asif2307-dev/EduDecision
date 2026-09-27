// Marks & Examinations API Service
import apiClient from './apiClient';
import { INITIAL_STUDENTS, SUBJECTS_CATALOG } from '../data/mockData';

const MARKS_STORE_KEY = 'edudecision_marks_store';

const getInitialMarks = () => {
  const records = [];
  INITIAL_STUDENTS.forEach(student => {
    (student.subjectMarks || []).forEach(sub => {
      records.push({
        id: `${student.id}-${sub.code}`,
        studentId: student.id,
        rollNo: student.rollNo,
        studentName: student.name,
        department: student.department,
        deptCode: student.deptCode,
        semester: student.semester,
        subjectCode: sub.code,
        subjectName: sub.name,
        internalMarks: sub.internal,
        internalMax: 40,
        examScore: sub.external,
        examMax: 60,
        totalScore: sub.total,
        grade: sub.grade,
        status: sub.grade === 'F' ? 'FAIL' : 'PASS'
      });
    });
  });
  return records;
};

const getStoredMarks = () => {
  const data = localStorage.getItem(MARKS_STORE_KEY);
  if (!data) {
    const init = getInitialMarks();
    localStorage.setItem(MARKS_STORE_KEY, JSON.stringify(init));
    return init;
  }
  try {
    return JSON.parse(data);
  } catch {
    return getInitialMarks();
  }
};

const saveMarks = (records) => {
  localStorage.setItem(MARKS_STORE_KEY, JSON.stringify(records));
};

export const marksApi = {
  async getMarks(params = {}) {
    const { department = 'ALL', semester = 'ALL', subject = 'ALL', search = '' } = params;
    let records = getStoredMarks();

    if (department && department !== 'ALL') {
      records = records.filter(r => r.deptCode === department);
    }
    if (semester && semester !== 'ALL') {
      records = records.filter(r => r.semester === Number(semester));
    }
    if (subject && subject !== 'ALL') {
      records = records.filter(r => r.subjectCode === subject);
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      records = records.filter(r =>
        r.studentName.toLowerCase().includes(s) ||
        r.studentId.toLowerCase().includes(s) ||
        r.subjectName.toLowerCase().includes(s) ||
        r.subjectCode.toLowerCase().includes(s)
      );
    }

    return {
      success: true,
      data: records,
      total: records.length,
      gradeSummary: {
        O: records.filter(r => r.grade === 'O').length,
        A_plus: records.filter(r => r.grade === 'A+').length,
        A: records.filter(r => r.grade === 'A').length,
        B_plus: records.filter(r => r.grade === 'B+').length,
        B: records.filter(r => r.grade === 'B').length,
        C: records.filter(r => r.grade === 'C').length,
        D: records.filter(r => r.grade === 'D').length,
        F: records.filter(r => r.grade === 'F').length,
      }
    };
  },

  async addMarks(record) {
    const records = getStoredMarks();
    const total = Number(record.internalMarks) + Number(record.examScore);
    let grade = 'F';
    if (total >= 90) grade = 'O';
    else if (total >= 80) grade = 'A+';
    else if (total >= 70) grade = 'A';
    else if (total >= 60) grade = 'B+';
    else if (total >= 55) grade = 'B';
    else if (total >= 50) grade = 'C';
    else if (total >= 45) grade = 'D';

    const newRecord = {
      ...record,
      id: `${record.studentId}-${record.subjectCode}-${Date.now()}`,
      internalMarks: Number(record.internalMarks),
      examScore: Number(record.examScore),
      totalScore: total,
      grade,
      status: grade === 'F' ? 'FAIL' : 'PASS'
    };

    records.unshift(newRecord);
    saveMarks(records);
    return newRecord;
  },

  async updateMarks(id, updateData) {
    const records = getStoredMarks();
    const idx = records.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Marks record not found');

    const total = Number(updateData.internalMarks) + Number(updateData.examScore);
    let grade = 'F';
    if (total >= 90) grade = 'O';
    else if (total >= 80) grade = 'A+';
    else if (total >= 70) grade = 'A';
    else if (total >= 60) grade = 'B+';
    else if (total >= 55) grade = 'B';
    else if (total >= 50) grade = 'C';
    else if (total >= 45) grade = 'D';

    records[idx] = {
      ...records[idx],
      ...updateData,
      totalScore: total,
      grade,
      status: grade === 'F' ? 'FAIL' : 'PASS'
    };

    saveMarks(records);
    return records[idx];
  }
};

export default marksApi;
