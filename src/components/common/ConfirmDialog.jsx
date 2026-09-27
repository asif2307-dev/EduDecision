import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Institutional Action',
  message = 'Are you sure you want to proceed with this operation? This record will be permanently altered in the institutional database.',
  confirmText = 'Proceed',
  confirmVariant = 'danger', // 'danger' | 'navy' | 'teal'
  loading = false
}) => {
  let btnClass = 'btn-danger bg-red-700 hover:bg-red-800 text-white';
  if (confirmVariant === 'navy') {
    btnClass = 'btn-primary bg-navy-800 hover:bg-navy-900 text-white';
  } else if (confirmVariant === 'teal') {
    btnClass = 'btn-teal bg-teal-600 hover:bg-teal-700 text-white';
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-3.5 py-1.5 text-xs font-medium border border-neutral-300 rounded shadow-sm bg-white hover:bg-neutral-50 text-neutral-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-3.5 py-1.5 text-xs font-medium rounded shadow-sm transition-colors ${btnClass}`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-3 py-2">
        <div className="p-2 bg-amber-50 text-amber-700 rounded border border-amber-200 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <p className="text-xs text-neutral-700 leading-relaxed pt-1">
          {message}
        </p>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
