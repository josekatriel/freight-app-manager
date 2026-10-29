import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { FiTrash2, FiFolder, FiCheck, FiTerminal } from "react-icons/fi";
import { getManagerIcon, getDisplayName } from "../utils/appUtils";

const AppCard = ({ app, onUninstall, isUninstalling, onClick, onCopyPath }) => {
  const displayName = getDisplayName(app);
  const [iconSrc, setIconSrc] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let url = null;
    if (app.icon) {
      if (app.icon.startsWith("/api/") || app.icon.startsWith("http")) {
        setIconSrc(app.icon);
        return;
      }
      invoke("read_image_bytes", { path: app.icon })
        .then((bytes) => {
          const ext = app.icon.split(".").pop().toLowerCase();
          const mimeType =
            ext === "svg"
              ? "image/svg+xml"
              : ext === "jpg" || ext === "jpeg"
              ? "image/jpeg"
              : "image/png";
          const blob = new Blob([new Uint8Array(bytes)], { type: mimeType });
          url = URL.createObjectURL(blob);
          setIconSrc(url);
        })
        .catch(() => {
          setIconSrc(null);
        });
    } else {
      setIconSrc(null);
    }
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [app.icon]);

  const handleCopyPath = (e) => {
    e.stopPropagation();
    if (app.path) {
      navigator.clipboard?.writeText(app.path);
      setCopied(true);
      if (onCopyPath) onCopyPath(app.path);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-[#131926] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 flex flex-col h-full hover:border-indigo-400 dark:hover:border-indigo-500/60 hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-indigo-950/30 transition-all duration-200 group cursor-pointer relative"
    >
      {/* Top row: Icon, Name, Category */}
      <div className="flex items-start gap-3.5 mb-3">
        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 p-2 flex items-center justify-center flex-shrink-0 group-hover:border-indigo-200 dark:group-hover:border-indigo-500/40 transition-colors overflow-hidden">
          {iconSrc ? (
            <img
              src={iconSrc}
              alt={displayName}
              className="w-8 h-8 object-contain"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
          ) : null}
          <div
            className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
            style={{ display: iconSrc ? "none" : "block" }}
          >
            {getManagerIcon(app.manager, "w-6 h-6")}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1.5">
            <h3
              className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-base truncate"
              title={displayName}
            >
              {displayName}
            </h3>
            {app.category && (
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 px-2 py-0.5 rounded-full flex-shrink-0">
                {app.category}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-mono text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 px-1.5 py-0.2 rounded">
              {app.version}
            </span>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
              {app.size}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 flex-grow leading-relaxed">
        {app.description || "No description available for this desktop package."}
      </p>

      {/* Bottom bar: Path & Quick actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        <div
          className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 max-w-[170px] truncate hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          onClick={handleCopyPath}
          title={`${app.path} (Click to copy)`}
        >
          {copied ? (
            <FiCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          ) : (
            <FiFolder className="w-3.5 h-3.5 flex-shrink-0" />
          )}
          <span className="font-mono text-[11px] truncate">
            {copied ? "Copied path" : app.path || "Installed"}
          </span>
        </div>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onUninstall(app)}
            disabled={isUninstalling}
            className={`p-2 rounded-xl transition-all ${
              isUninstalling
                ? "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed"
                : "text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            }`}
            title="Uninstall"
          >
            {isUninstalling ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-500"></div>
            ) : (
              <FiTrash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppCard;
