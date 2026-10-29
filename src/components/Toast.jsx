import React, { useEffect } from "react";
import { FiCheck, FiAlertTriangle, FiX } from "react-icons/fi";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[200] transition-all duration-150 transform translate-y-0 opacity-100">
      <div
        className={`flex items-center gap-3 px-3.5 py-2.5 border shadow-none ${
          type === "success"
            ? "bg-[var(--frasto-surface)] border-[var(--frasto-positive)] text-[var(--frasto-ink)]"
            : "bg-[var(--frasto-surface)] border-[var(--frasto-danger)] text-[var(--frasto-ink)]"
        }`}
      >
        <span
          className={`size-2 shrink-0 ${
            type === "success" ? "bg-[var(--frasto-positive)]" : "bg-[var(--frasto-danger)]"
          }`}
        />
        <p className="font-medium text-xs max-w-sm">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 p-1 text-[var(--frasto-ink-soft)] hover:text-[var(--frasto-ink)] transition-colors"
        >
          <FiX className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
