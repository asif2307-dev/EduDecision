// Data Import & Validation API Service Layer
import apiClient from './apiClient';

export const importApi = {
  // Simulates FastAPI validation endpoint: POST /import/validate
  async validateFile(file) {
    // If backend is active:
    // const formData = new FormData();
    // formData.append('file', file);
    // return apiClient.post('/import/validate', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

    // Client-side realistic validation pipeline for demo & testing:
    await new Promise(r => setTimeout(r, 600)); // institutional processing simulation

    const fileName = file ? file.name : 'students_semester_dataset.csv';
    const fileSize = file ? `${(file.size / 1024).toFixed(1)} KB` : '420 KB';

    return {
      success: true,
      fileName,
      fileSize,
      uploadedAt: new Date().toISOString(),
      validationSummary: {
        totalRecords: 5000,
        validRecords: 4982,
        missingValues: 12,
        duplicateRecords: 4,
        invalidValues: 2,
        validationScore: 99.64
      },
      errorTable: [
        {
          rowNumber: 14,
          field: "attendance",
          providedValue: "105.0%",
          errorReason: "Attendance value exceeds maximum permitted bound (0 - 100%)",
          suggestedCorrection: "Truncate to 100% or verify attendance ledger",
          action: "FLAGGED"
        },
        {
          rowNumber: 28,
          field: "student_id",
          providedValue: "2023CSE088",
          errorReason: "Duplicate Primary Key: ID already registered in database",
          suggestedCorrection: "Merge record or re-assign student registration code",
          action: "DUPLICATE"
        },
        {
          rowNumber: 42,
          field: "cgpa",
          providedValue: "NULL / Empty",
          errorReason: "Missing mandatory academic metric for active student",
          suggestedCorrection: "Impute with semester SGPA mean or request exam record",
          action: "MISSING"
        },
        {
          rowNumber: 77,
          field: "gender",
          providedValue: "X",
          errorReason: "Non-standard categorical encoding (Expected 'Male', 'Female', 'Other')",
          suggestedCorrection: "Normalize to institutional standard",
          action: "FORMAT_ERROR"
        },
        {
          rowNumber: 105,
          field: "backlogs",
          providedValue: "-1",
          errorReason: "Negative backlog count is logically inadmissible",
          suggestedCorrection: "Set to 0",
          action: "INVALID_VALUE"
        }
      ],
      previewRecords: [
        { id: "2024CSE101", name: "Suresh Balakrishnan", department: "CSE", sem: 2, attendance: "86.0%", cgpa: "8.40", status: "VALID" },
        { id: "2024CSE102", name: "Aishwarya Rai", department: "CSE", sem: 2, attendance: "91.5%", cgpa: "9.10", status: "VALID" },
        { id: "2024DS103", name: "Prateek Bansal", department: "DS", sem: 2, attendance: "78.0%", cgpa: "7.85", status: "VALID" },
        { id: "2024IT104", name: "Deepa Krishnan", department: "IT", sem: 2, attendance: "82.5%", cgpa: "8.20", status: "VALID" },
        { id: "2024ECE105", name: "Manoj Swamy", department: "ECE", sem: 2, attendance: "74.0%", cgpa: "6.95", status: "VALID" },
      ]
    };
  },

  // Simulates FastAPI commit endpoint: POST /import/commit
  async commitImport(importToken, options = { skipErrors: true }) {
    await new Promise(r => setTimeout(r, 800));
    return {
      success: true,
      recordsImported: 4982,
      recordsSkipped: options.skipErrors ? 18 : 0,
      importBatchId: `BATCH-IMP-${Date.now()}`,
      status: "COMPLETED",
      message: "4,982 records successfully committed to PostgreSQL database"
    };
  }
};

export default importApi;
