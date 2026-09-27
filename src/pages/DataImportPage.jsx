import React, { useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Database,
  RotateCcw,
  CheckCircle2,
  FileText,
  AlertOctagon,
  Download
} from 'lucide-react';
import Badge from '../components/common/Badge';
import LoadingState from '../components/common/LoadingState';
import importApi from '../api/importApi';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

export const DataImportPage = () => {
  const navigate = useNavigate();
  const { success, error, warning } = useNotification();

  // Workflow steps: 1: UPLOAD, 2: VALIDATING, 3: SUMMARY & ERROR REVIEW, 4: PREVIEW, 5: IMPORTED
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [importSummary, setImportSummary] = useState(null);
  const [skipErrors, setSkipErrors] = useState(true);

  const STEPS = [
    { num: 1, label: 'Upload Dataset' },
    { num: 2, label: 'Schema Validation' },
    { num: 3, label: 'Data Quality & Errors' },
    { num: 4, label: 'Ingestion Preview' },
    { num: 5, label: 'PostgreSQL Commit' }
  ];

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    setSelectedFile(file);
  };

  const handleStartValidation = async () => {
    setIsProcessing(true);
    setCurrentStep(2);
    try {
      const res = await importApi.validateFile(selectedFile);
      setValidationResult(res);
      setCurrentStep(3);
      warning(`Validation complete: ${res.validationSummary.validRecords} valid records, ${res.validationSummary.missingValues + res.validationSummary.duplicateRecords + res.validationSummary.invalidValues} anomalies detected.`);
    } catch (err) {
      error('Validation pipeline failed. Check file format.');
      setCurrentStep(1);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProceedToPreview = () => {
    setCurrentStep(4);
  };

  const handleCommitImport = async () => {
    setIsProcessing(true);
    try {
      const res = await importApi.commitImport('token-sample', { skipErrors });
      setImportSummary(res);
      setCurrentStep(5);
      success(`${res.recordsImported} records successfully committed to PostgreSQL database.`);
    } catch (err) {
      error('Database commit failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setValidationResult(null);
    setImportSummary(null);
    setCurrentStep(1);
  };

  const handleDownloadSample = () => {
    const sampleHeaders = 'student_id,roll_no,name,email,department,semester,batch,gender,attendance,cgpa,internal_marks,exam_score,backlogs';
    const sampleRows = [
      '2024CSE101,CS2401,Aarav Sharma,aarav.s@edudecision.demo,CSE,2,2024-2028,Male,88.5,8.75,36.5,84.0,0',
      '2024CSE102,CS2402,Priya Patel,priya.p@edudecision.demo,CSE,2,2024-2028,Female,92.0,9.32,39.0,91.5,0',
      '2024DS103,DS2403,Rohan Deshmukh,rohan.d@edudecision.demo,DS,2,2024-2028,Male,71.5,6.82,26.5,61.0,1'
    ].join('\r\n');
    const content = `${sampleHeaders}\r\n${sampleRows}`;
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'edudecision_sample_student_dataset.csv');
    link.click();
    success('Sample CSV template downloaded');
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-white p-3 border border-neutral-300 rounded shadow-panel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wide flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-navy-800" />
            <span>Dataset Ingestion, Validation & ETL Pipeline</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Automated verification of missing fields, primary-key duplicates, and boundary violations before DB ingestion
          </p>
        </div>

        <button
          onClick={handleDownloadSample}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 rounded text-xs font-semibold shadow-sm transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-navy-800" />
          <span>Download Sample CSV Template</span>
        </button>
      </div>

      {/* 5-Step Visual Workflow Stepper (Requirement 13) */}
      <div className="inst-card p-3.5 bg-white">
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          {STEPS.map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div
                key={s.num}
                className={`p-2 rounded border transition-colors flex items-center justify-center gap-1.5 ${
                  isCurrent
                    ? 'bg-navy-900 text-white font-bold border-navy-950'
                    : isCompleted
                    ? 'bg-teal-50 text-teal-800 border-teal-300 font-semibold'
                    : 'bg-neutral-50 text-neutral-500 border-neutral-200'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                ) : (
                  <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono ${
                    isCurrent ? 'bg-white text-navy-900 font-bold' : 'bg-neutral-200 text-neutral-700'
                  }`}>
                    {s.num}
                  </span>
                )}
                <span className="truncate text-[11px]">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: UPLOAD AREA */}
      {currentStep === 1 && (
        <div className="inst-card p-8 bg-white text-center">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="border-2 border-dashed border-neutral-300 hover:border-navy-600 rounded p-10 max-w-xl mx-auto bg-neutral-50 hover:bg-neutral-100/60 transition-colors flex flex-col items-center justify-center cursor-pointer"
            onClick={() => document.getElementById('file-upload-input')?.click()}
          >
            <input
              id="file-upload-input"
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={(e) => e.target.files && handleFileSelected(e.target.files[0])}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-full bg-navy-100/60 text-navy-800 flex items-center justify-center mb-3">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-navy-950 mb-1">
              Select or Drag Institutional Data File Here
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mb-4">
              Supports CSV, TSV, and Microsoft Excel (.xlsx) files up to 50MB. Prepares data for FastAPI backend ingestion.
            </p>

            {selectedFile ? (
              <div className="p-2.5 bg-white border border-teal-400 rounded flex items-center gap-2 text-xs font-semibold text-navy-950">
                <FileSpreadsheet className="w-4 h-4 text-teal-700" />
                <span>Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            ) : (
              <button
                type="button"
                className="px-3.5 py-1.5 bg-navy-800 text-white rounded text-xs font-medium hover:bg-navy-900 shadow-sm"
              >
                Browse Local Storage
              </button>
            )}
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => {
                // Load default demo file if none selected
                handleFileSelected({ name: 'even_sem_2024_admissions.csv', size: 430000 });
              }}
              className="px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white hover:bg-neutral-50 text-neutral-700 font-medium"
            >
              Use Institutional Demo CSV (5,000 Records)
            </button>
            {selectedFile && (
              <button
                onClick={handleStartValidation}
                className="px-4 py-1.5 text-xs font-semibold bg-navy-800 text-white rounded hover:bg-navy-900 shadow-sm flex items-center gap-1.5"
              >
                <span>Initiate Multi-Stage Validation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: PROCESSING / VALIDATING */}
      {currentStep === 2 && (
        <LoadingState
          message="Running Institutional Validation Engine..."
          subtext="Executing checks: Missing Values → Duplicate Primary Keys → Boundary Rules → Data Type Format Casts"
        />
      )}

      {/* STEP 3: VALIDATION SUMMARY & ERROR AUDIT */}
      {currentStep === 3 && validationResult && (
        <div className="space-y-4">
          {/* Summary Cards Grid (Requirement 13) */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
            <div className="inst-card p-3 bg-white">
              <div className="text-[10px] text-neutral-500 font-bold uppercase">Total Records</div>
              <div className="text-xl font-bold text-navy-950 font-mono mt-1">
                {validationResult.validationSummary.totalRecords.toLocaleString()}
              </div>
              <div className="text-[10px] text-neutral-400">Parsed from CSV</div>
            </div>

            <div className="inst-card p-3 bg-white border-l-4 border-l-emerald-600">
              <div className="text-[10px] text-neutral-500 font-bold uppercase">Valid Records</div>
              <div className="text-xl font-bold text-emerald-700 font-mono mt-1">
                {validationResult.validationSummary.validRecords.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-800 font-semibold">{validationResult.validationSummary.validationScore}% Conformance</div>
            </div>

            <div className="inst-card p-3 bg-white border-l-4 border-l-amber-500">
              <div className="text-[10px] text-neutral-500 font-bold uppercase">Missing Values</div>
              <div className="text-xl font-bold text-amber-700 font-mono mt-1">
                {validationResult.validationSummary.missingValues}
              </div>
              <div className="text-[10px] text-neutral-400">Empty Required Fields</div>
            </div>

            <div className="inst-card p-3 bg-white border-l-4 border-l-red-600">
              <div className="text-[10px] text-neutral-500 font-bold uppercase">Duplicate Keys</div>
              <div className="text-xl font-bold text-red-700 font-mono mt-1">
                {validationResult.validationSummary.duplicateRecords}
              </div>
              <div className="text-[10px] text-neutral-400">Student ID Collisions</div>
            </div>

            <div className="inst-card p-3 bg-white border-l-4 border-l-red-600">
              <div className="text-[10px] text-neutral-500 font-bold uppercase">Invalid Values</div>
              <div className="text-xl font-bold text-red-700 font-mono mt-1">
                {validationResult.validationSummary.invalidValues}
              </div>
              <div className="text-[10px] text-neutral-400">Out-of-Range (&gt;100%)</div>
            </div>
          </div>

          {/* Validation Error Table */}
          <div className="inst-card">
            <div className="inst-card-header bg-red-50/50">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-red-700" />
                <span className="text-red-950 font-bold">Detected Anomalies & Rule Violations (Requires Sanitization)</span>
              </div>
              <span className="text-[11px] text-neutral-500 font-mono">5 Sample Flagged Records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-100 border-b border-neutral-200 text-neutral-700 font-semibold uppercase">
                    <th className="py-2.5 px-3 text-center">Row #</th>
                    <th className="py-2.5 px-3">Field Name</th>
                    <th className="py-2.5 px-3">Supplied Raw Value</th>
                    <th className="py-2.5 px-3">Violation Reason</th>
                    <th className="py-2.5 px-3">Suggested Remediation</th>
                    <th className="py-2.5 px-3 text-center">Disposition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {validationResult.errorTable.map((err, i) => (
                    <tr key={i} className="hover:bg-neutral-50">
                      <td className="py-2 px-3 text-center font-mono font-bold text-navy-950">{err.rowNumber}</td>
                      <td className="py-2 px-3 font-mono text-neutral-800">{err.field}</td>
                      <td className="py-2 px-3 font-mono font-semibold text-red-700 bg-red-50/50">{err.providedValue}</td>
                      <td className="py-2 px-3 text-neutral-700">{err.errorReason}</td>
                      <td className="py-2 px-3 text-teal-800 font-medium">{err.suggestedCorrection}</td>
                      <td className="py-2 px-3 text-center">
                        <Badge variant="danger" size="xs">{err.action}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="inst-card p-3.5 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-neutral-800 cursor-pointer">
              <input
                type="checkbox"
                checked={skipErrors}
                onChange={(e) => setSkipErrors(e.target.checked)}
                className="rounded border-neutral-300 text-navy-800 focus:ring-navy-600"
              />
              <span>Automatically skip or quarantine invalid records (18 rows) during database commit</span>
            </label>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white hover:bg-neutral-50 text-neutral-700"
              >
                Cancel / Re-upload
              </button>
              <button
                onClick={handleProceedToPreview}
                className="px-4 py-1.5 text-xs font-semibold bg-navy-800 text-white rounded hover:bg-navy-900 shadow-sm flex items-center gap-1.5"
              >
                <span>Proceed to Data Preview</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: PREVIEW READY RECORDS */}
      {currentStep === 4 && validationResult && (
        <div className="space-y-4">
          <div className="inst-card">
            <div className="inst-card-header">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-navy-800" />
                <span>Sample Record Preview Prior to PostgreSQL Transaction</span>
              </div>
              <span className="text-[11px] text-emerald-800 font-semibold">Ready for Committal: 4,982 records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-100 border-b border-neutral-200 text-neutral-700 font-semibold uppercase">
                    <th className="py-2.5 px-3">Student ID</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3 text-center">Semester</th>
                    <th className="py-2.5 px-3 text-center">Attendance</th>
                    <th className="py-2.5 px-3 text-center">CGPA</th>
                    <th className="py-2.5 px-3 text-center">Pre-Check</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {validationResult.previewRecords.map((r, i) => (
                    <tr key={i} className="hover:bg-neutral-50">
                      <td className="py-2 px-3 font-mono font-bold text-navy-950">{r.id}</td>
                      <td className="py-2 px-3 font-medium text-neutral-800">{r.name}</td>
                      <td className="py-2 px-3"><Badge variant="navy" size="xs">{r.department}</Badge></td>
                      <td className="py-2 px-3 text-center">Sem {r.sem}</td>
                      <td className="py-2 px-3 text-center font-bold text-navy-900">{r.attendance}</td>
                      <td className="py-2 px-3 text-center font-bold text-teal-800">{r.cgpa}</td>
                      <td className="py-2 px-3 text-center">
                        <Badge variant="success" size="xs">{r.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between items-center bg-white p-3.5 border border-neutral-300 rounded shadow-panel">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white hover:bg-neutral-50 text-neutral-700"
            >
              ← Back to Validation Summary
            </button>
            <button
              onClick={handleCommitImport}
              disabled={isProcessing}
              className="px-5 py-2 text-xs font-bold bg-navy-800 hover:bg-navy-900 text-white rounded shadow-sm flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Writing to PostgreSQL Database...' : 'Commit 4,982 Valid Records to PostgreSQL'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: COMMITTED SUCCESS STATE */}
      {currentStep === 5 && importSummary && (
        <div className="inst-card p-10 bg-white text-center max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-navy-950">
            Institutional Dataset Successfully Ingested
          </h3>
          <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
            {importSummary.message}. Database indexes have been updated and cached for analytics engines.
          </p>

          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded text-xs font-mono text-neutral-700 max-w-sm mx-auto text-left space-y-1">
            <div>Batch Identifier: <strong>{importSummary.importBatchId}</strong></div>
            <div>Records Ingested: <strong className="text-emerald-700">{importSummary.recordsImported}</strong></div>
            <div>Records Quarantined: <strong className="text-red-700">{importSummary.recordsSkipped}</strong></div>
            <div>Database Engine: <strong>PostgreSQL 16.2 / FastAPI</strong></div>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 text-xs border border-neutral-300 rounded bg-white hover:bg-neutral-50 text-neutral-700"
            >
              Upload Another File
            </button>
            <button
              onClick={() => navigate('/students')}
              className="px-4 py-1.5 text-xs font-semibold bg-navy-800 text-white rounded hover:bg-navy-900 shadow-sm"
            >
              View Updated Student Directory →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataImportPage;
