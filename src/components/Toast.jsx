import React, { useEffect } from "react";
import { FiCheckCircle, FiXCircle, FiX } from "react-icons/fi";

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
    <div className="fixed bottom-6 right-6 z-[200] transition-all duration-300 transform translate-y-0 opacity-100">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md ${
          type === "success"
            ? "bg-emerald-50/95 dark:bg-[#062419]/95 border-emerald-200/80 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200"
            : "bg-rose-50/95 dark:bg-[#2A0F14]/95 border-rose-200/80 dark:border-rose-800/80 text-rose-900 dark:text-rose-200"
        }`}
      >
        {type === "success" ? (
          <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
        ) : (
          <FiXCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
        )}
        <p className="font-semibold text-xs max-w-sm">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <FiX className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
