import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { FiTrash2, FiFolder, FiCheck, FiInfo } from "react-icons/fi";
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
      className="bg-[var(--frasto-surface)] border border-[var(--frasto-border)] p-4 flex flex-col h-full hover:border-[var(--frasto-border-strong)] transition-colors duration-150 group cursor-pointer relative shadow-none"
    >
      {/* Top row: Icon, Name, Category */}
      <div className="flex items-start gap-3 mb-2.5">
        <div className="size-10 bg-[var(--frasto-surface-subtle)] border border-[var(--frasto-border)] p-1.5 flex items-center justify-center flex-shrink-0 group-hover:border-[var(--frasto-ink-soft)] transition-colors overflow-hidden">
          {iconSrc ? (
            <img
              src={iconSrc}
              alt={displayName}
              className="size-7 object-contain"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
          ) : null}
          <div
            className="text-[var(--frasto-ink-soft)] group-hover:text-[var(--frasto-ink)] transition-colors"
            style={{ display: iconSrc ? "none" : "block" }}
          >
            {getManagerIcon(app.manager, "w-5 h-5")}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1.5">
            <h3
              className="font-bold font-display text-[var(--frasto-ink)] group-hover:text-[var(--frasto-ink)] transition-colors text-sm truncate"
              title={displayName}
            >
              {displayName}
            </h3>
            {app.category && (
              <span className="text-[10px] font-medium text-[var(--frasto-info)] bg-[var(--frasto-surface-subtle)] border border-[var(--frasto-border)] px-1.5 py-0.2 shrink-0">
                {app.category}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] font-mono text-[var(--frasto-ink-soft)]">
              {app.version}
            </span>
            <span className="text-[11px] font-mono text-[var(--frasto-ink-soft)]">
              · {app.size}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-[var(--frasto-ink-muted)] line-clamp-2 mb-3.5 flex-grow leading-relaxed">
        {app.description || "Debian/Linux desktop software package"}
      </p>

      {/* Bottom bar: Path & Quick actions */}
      <div className="flex items-center justify-between pt-2.5 border-t border-[var(--frasto-border)] text-xs">
        <div
          className="flex items-center gap-1.5 text-[var(--frasto-ink-soft)] max-w-[180px] truncate hover:text-[var(--frasto-ink)] transition-colors"
          onClick={handleCopyPath}
          title={`${app.path} (Click to copy)`}
        >
          {copied ? (
            <FiCheck className="w-3.5 h-3.5 text-[var(--frasto-positive)] flex-shrink-0" />
          ) : (
            <FiFolder className="w-3.5 h-3.5 flex-shrink-0" />
          )}
          <span className="font-mono text-[11px] truncate">
            {copied ? "Copied" : app.path || "Installed"}
          </span>
        </div>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onClick}
            className="h-6 px-2 text-[10px] font-medium border border-[var(--frasto-border)] hover:border-[var(--frasto-ink)] bg-[var(--frasto-surface)] text-[var(--frasto-ink)] hover:bg-[var(--frasto-surface-subtle)] transition-colors"
            title="Inspect Details"
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
      </div>
    </div>
  );
};

export default AppCard;
