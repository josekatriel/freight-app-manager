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
      className="group border-b border-[var(--frasto-border)] hover:bg-[var(--frasto-surface-subtle)]/60 transition-colors cursor-pointer text-xs"
    >
      {/* Name and Icon */}
      <td className="py-2.5 px-4">
        <div className="flex items-center gap-3">
          <div className="size-7 bg-[var(--frasto-surface-subtle)] border border-[var(--frasto-border)] flex items-center justify-center flex-shrink-0 overflow-hidden">
            {iconSrc ? (
              <img
                src={iconSrc}
                alt={displayName}
                className="size-5 object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              />
            ) : null}
            <div
              className="text-[var(--frasto-ink-soft)]"
              style={{ display: iconSrc ? "none" : "block" }}
            >
              {getManagerIcon(app.manager, "w-3.5 h-3.5")}
            </div>
          </div>
          <div className="min-w-0">
            <p className="font-semibold font-display text-[var(--frasto-ink)] truncate">
              {displayName}
            </p>
            {app.pkgName && app.pkgName !== displayName && (
              <p className="text-[10px] font-mono text-[var(--frasto-ink-soft)] truncate">
                {app.pkgName}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="py-2.5 px-4 hidden md:table-cell">
        <span className="inline-flex items-center px-1.5 py-0.2 text-[10px] font-medium border border-[var(--frasto-border)] bg-[var(--frasto-surface-subtle)] text-[var(--frasto-info)]">
          {app.category || "Utilities"}
        </span>
      </td>

      {/* Version */}
      <td className="py-2.5 px-4">
        <span className="font-mono text-[11px] text-[var(--frasto-ink-soft)]">
          {app.version}
        </span>
      </td>

      {/* Size */}
      <td className="py-2.5 px-4 font-mono text-[11px] text-[var(--frasto-ink-soft)] hidden sm:table-cell">
        {app.size}
      </td>

      {/* Manager Source */}
      <td className="py-2.5 px-4 hidden lg:table-cell">
        <span className="text-[11px] font-mono uppercase text-[var(--frasto-ink-muted)]">
          {app.manager}
        </span>
      </td>

      {/* Actions */}
      <td className="py-2.5 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleCopy}
            className="p-1 border border-transparent hover:border-[var(--frasto-border)] text-[var(--frasto-ink-muted)] hover:text-[var(--frasto-ink)] transition-colors"
            title={copied ? "Copied" : "Copy binary path"}
          >
            {copied ? (
              <FiCheck className="w-3.5 h-3.5 text-[var(--frasto-positive)]" />
            ) : (
              <FiCopy className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={onClick}
            className="h-6 px-2 text-[10px] font-medium border border-[var(--frasto-border)] hover:border-[var(--frasto-ink)] bg-[var(--frasto-surface)] text-[var(--frasto-ink)] transition-colors"
            title="Inspect"
          >
            Inspect
          </button>
          <button
            onClick={() => onUninstall(app)}
            disabled={isUninstalling}
            className={`h-6 px-2 text-[10px] font-medium border transition-colors ${
              isUninstalling
                ? "border-[var(--frasto-border)] bg-[var(--frasto-surface-subtle)] text-[var(--frasto-ink-soft)] cursor-not-allowed"
                : "border-[var(--frasto-border)] hover:border-[var(--frasto-danger)] text-[var(--frasto-ink-muted)] hover:text-[var(--frasto-danger)] hover:bg-[var(--frasto-surface-subtle)]"
            }`}
            title="Uninstall package"
          >
            {isUninstalling ? "..." : "Remove"}
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
    <div className="border border-[var(--frasto-border)] bg-[var(--frasto-surface)] overflow-hidden transition-colors duration-150">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" data-frasto-table>
          <thead>
            <tr className="bg-[var(--frasto-surface-subtle)] border-b border-[var(--frasto-border)] text-[10px] font-bold text-[var(--frasto-ink-muted)] uppercase tracking-wider">
              <th className="py-2.5 px-4">Application</th>
              <th className="py-2.5 px-4 hidden md:table-cell">Category</th>
              <th className="py-2.5 px-4">Version</th>
              <th className="py-2.5 px-4 hidden sm:table-cell">Size</th>
              <th className="py-2.5 px-4 hidden lg:table-cell">Source</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
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
