import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl',
  footer
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/60 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          className={`relative transform overflow-hidden rounded bg-white text-left shadow-xl transition-all sm:my-8 w-full ${maxWidth} border border-neutral-300`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Institutional Solid Header */}
          <div className="bg-navy-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-navy-950">
            <div>
              <h3 className="text-sm font-bold tracking-wide font-sans text-white uppercase">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-navy-200 mt-0.5">{subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-navy-300 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-5 max-h-[75vh] overflow-y-auto text-sm text-neutral-700">
            {children}
          </div>

          {/* Modal Footer */}
          {footer && (
            <div className="bg-neutral-50 px-6 py-3 border-t border-neutral-200 flex items-center justify-end gap-2.5">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
