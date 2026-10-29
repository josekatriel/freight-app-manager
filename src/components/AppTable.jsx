import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { FiTrash2, FiInfo, FiCopy, FiCheck } from "react-icons/fi";
import { getManagerIcon, getDisplayName } from "../utils/appUtils";

const AppRow = ({ app, onUninstall, isUninstalling, onClick, onCopyPath }) => {
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
        .catch(() => setIconSrc(null));
    } else {
      setIconSrc(null);
    }
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [app.icon]);

  const handleCopy = (e) => {
    e.stopPropagation();
    if (app.path) {
      navigator.clipboard?.writeText(app.path);
      setCopied(true);
      if (onCopyPath) onCopyPath(app.path);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <tr
      onClick={onClick}
      className="group border-b border-slate-100 dark:border-slate-800/60 hover:bg-indigo-50/40 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
    >
      {/* Name and Icon */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:border-indigo-200 dark:group-hover:border-indigo-500/40 transition-colors">
            {iconSrc ? (
              <img
                src={iconSrc}
                alt={displayName}
                className="w-7 h-7 object-contain"
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
              {getManagerIcon(app.manager, "w-4 h-4")}
            </div>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
              {displayName}
            </p>
            {app.pkgName && app.pkgName !== displayName && (
              <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate">
                {app.pkgName}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="py-3 px-4 hidden md:table-cell">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
          {app.category || "Utilities"}
        </span>
      </td>

      {/* Version */}
      <td className="py-3 px-4">
        <span className="font-mono text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 px-2 py-0.5 rounded-md">
          {app.version}
        </span>
      </td>

      {/* Size */}
      <td className="py-3 px-4 font-mono text-xs text-slate-600 dark:text-slate-400 hidden sm:table-cell">
        {app.size}
      </td>

      {/* Manager Source */}
      <td className="py-3 px-4 hidden lg:table-cell">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 capitalize">
          {getManagerIcon(app.manager, "w-3.5 h-3.5")}
          <span>{app.manager}</span>
        </div>
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-all"
            title={copied ? "Copied!" : "Copy binary path"}
          >
            {copied ? (
              <FiCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <FiCopy className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={onClick}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-all"
            title="View Details"
          >
            <FiInfo className="w-4 h-4" />
          </button>
          <button
            onClick={() => onUninstall(app)}
            disabled={isUninstalling}
            className={`p-1.5 rounded-lg transition-all ${
              isUninstalling
                ? "text-slate-300 dark:text-slate-600 cursor-not-allowed"
                : "text-rose-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            }`}
            title="Uninstall package"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const AppTable = ({
  apps,
  onUninstall,
  uninstalling,
  onAppClick,
  onCopyPath,
}) => {
  return (
    <div className="bg-white dark:bg-[#131926] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden transition-colors duration-200">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 dark:bg-[#0E131F] border-b border-slate-200/80 dark:border-slate-800/80 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Application</th>
              <th className="py-3 px-4 hidden md:table-cell">Category</th>
              <th className="py-3 px-4">Version</th>
              <th className="py-3 px-4 hidden sm:table-cell">Size</th>
              <th className="py-3 px-4 hidden lg:table-cell">Source</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app, index) => (
              <AppRow
                key={`${app.manager}-${app.name}-${index}`}
                app={app}
                onUninstall={onUninstall}
                isUninstalling={uninstalling === app.name}
                onClick={() => onAppClick(app)}
                onCopyPath={onCopyPath}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppTable;
