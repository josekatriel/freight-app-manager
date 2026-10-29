import React from "react";
import { FiAlertCircle } from "react-icons/fi";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-[var(--frasto-surface)] border border-[var(--frasto-border-strong)] shadow-none flex flex-col">
        <div className="p-5 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`size-8 border flex items-center justify-center flex-shrink-0 ${
                isDestructive
                  ? "bg-[var(--frasto-surface-subtle)] border-[var(--frasto-danger)] text-[var(--frasto-danger)]"
                  : "bg-[var(--frasto-surface-subtle)] border-[var(--frasto-border)] text-[var(--frasto-ink)]"
              }`}
            >
              <FiAlertCircle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold font-display text-[var(--frasto-ink)]">
              {title}
            </h3>
          </div>
          <div className="bg-[var(--frasto-surface-subtle)] p-3 border border-[var(--frasto-border)]">
            <p className="text-xs text-[var(--frasto-ink-muted)] leading-relaxed whitespace-pre-line">
              {message}
            </p>
          </div>
        </div>

        <div className="p-3 bg-[var(--frasto-surface-subtle)] border-t border-[var(--frasto-border)] flex items-center gap-2 justify-end">
          <button
            onClick={onClose}
            className="h-8 px-3 text-xs font-medium text-[var(--frasto-ink)] bg-[var(--frasto-surface)] border border-[var(--frasto-border)] hover:bg-[var(--frasto-surface-subtle)] transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`h-8 px-3 text-xs font-semibold text-white transition-opacity ${
              isDestructive
                ? "bg-[var(--frasto-danger)] border border-[var(--frasto-danger)]"
                : "bg-[var(--frasto-ink)] border border-[var(--frasto-ink)]"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
