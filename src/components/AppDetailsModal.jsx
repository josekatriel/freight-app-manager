import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  FiX,
  FiShield,
  FiTrash2,
  FiCopy,
  FiCheck,
  FiPlay,
  FiLayers,
} from "react-icons/fi";
import { getManagerIcon, getDisplayName } from "../utils/appUtils";
import appService from "../services/appService";

const AppDetailsModal = ({
  app,
  onClose,
  onUninstall,
  isUninstalling,
  showToast,
}) => {
  if (!app) return null;

  const displayName = getDisplayName(app);
  const [iconSrc, setIconSrc] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [updateStatus, setUpdateStatus] = useState("idle");
  const [newVersion, setNewVersion] = useState(null);

  useEffect(() => {
    setUpdateStatus("idle");
    setNewVersion(null);
  }, [app]);

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

  const copyToClipboard = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    if (showToast) showToast(`Copied ${fieldName} to clipboard`, "success");
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleLaunch = () => {
    if (app.path) {
      appService.openPath(app.path);
      if (showToast) showToast(`Launching ${displayName}...`, "success");
    }
  };

  const handleCheckUpdate = async () => {
    setUpdateStatus("checking");
    try {
      const version = await appService.checkAppUpdate(app.name, app.manager);
      if (version) {
        setNewVersion(version);
        setUpdateStatus("available");
      } else {
        setUpdateStatus("up-to-date");
      }
    } catch (err) {
      if (showToast) showToast(`Failed to check updates: ${err}`, "error");
      setUpdateStatus("idle");
    }
  };

  const handleUpdate = async () => {
    setUpdateStatus("updating");
    try {
      await appService.updateApp(app.name, app.manager);
      setUpdateStatus("updated");
      if (showToast)
        showToast(
          `Updated ${displayName} to ${newVersion || "latest"}`,
          "success"
        );
    } catch (err) {
      if (showToast)
        showToast(`Failed to update ${displayName}: ${err}`, "error");
      setUpdateStatus("available");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-[var(--frasto-surface)] border border-[var(--frasto-border-strong)] shadow-none flex flex-col max-h-[90vh] transition-colors">
        {/* Header */}
        <div className="p-5 pb-4 border-b border-[var(--frasto-border)] flex items-start justify-between bg-[var(--frasto-surface-subtle)]">
          <div className="flex items-center gap-3.5">
            <div className="size-12 flex items-center justify-center flex-shrink-0">
              {iconSrc ? (
                <img
                  src={iconSrc}
                  alt={displayName}
                  className="size-12 object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                    if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="size-12 flex items-center justify-center text-[var(--frasto-ink-soft)]"
                style={{ display: iconSrc ? "none" : "flex" }}
              >
                {getManagerIcon(app.manager, "w-8 h-8")}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold font-display text-[var(--frasto-ink)]">
                  {displayName}
                </h2>
                {app.category && (
                  <span className="text-[10px] font-medium text-[var(--frasto-info)] bg-[var(--frasto-surface)] border border-[var(--frasto-border)] px-1.5 py-0.2">
                    {app.category}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-mono text-[var(--frasto-ink-soft)]">
                  v{app.version}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--frasto-ink-muted)]">
                  · {app.manager}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[var(--frasto-ink-muted)] hover:text-[var(--frasto-ink)] border border-transparent hover:border-[var(--frasto-border)] transition-colors"
            title="Close"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Description */}
          <div>
            <h4 className="text-[10px] font-bold text-[var(--frasto-ink-muted)] uppercase tracking-wider mb-1">
              Description
            </h4>
            <div className="bg-[var(--frasto-surface-subtle)] border border-[var(--frasto-border)] p-3 text-xs text-[var(--frasto-ink)] leading-relaxed">
              {app.description || "Debian/Linux desktop software package"}
            </div>
          </div>

          {/* Metadata Grid */}
          <div>
            <h4 className="text-[10px] font-bold text-[var(--frasto-ink-muted)] uppercase tracking-wider mb-1.5">
              Package Details
            </h4>
            <div className="space-y-2">
              {/* Path */}
              <div className="p-2.5 bg-[var(--frasto-surface)] border border-[var(--frasto-border)] flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-[var(--frasto-ink-muted)] uppercase tracking-wider">
                    Binary Path
                  </p>
                  <p className="text-xs font-mono text-[var(--frasto-ink)] truncate" title={app.path}>
                    {app.path || "Not specified"}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(app.path, "path")}
                  className="p-1 border border-transparent hover:border-[var(--frasto-border)] text-[var(--frasto-ink-muted)] hover:text-[var(--frasto-ink)] transition-colors flex-shrink-0"
                  title="Copy path"
                >
                  {copiedField === "path" ? (
                    <FiCheck className="w-3.5 h-3.5 text-[var(--frasto-positive)]" />
                  ) : (
                    <FiCopy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Package Identifier */}
              <div className="p-2.5 bg-[var(--frasto-surface)] border border-[var(--frasto-border)] flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-[var(--frasto-ink-muted)] uppercase tracking-wider">
                    Identifier
                  </p>
                  <p className="text-xs font-mono text-[var(--frasto-ink)] truncate">
                    {app.pkgName || app.name}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(app.pkgName || app.name, "identifier")}
                  className="p-1 border border-transparent hover:border-[var(--frasto-border)] text-[var(--frasto-ink-muted)] hover:text-[var(--frasto-ink)] transition-colors flex-shrink-0"
                  title="Copy identifier"
                >
                  {copiedField === "identifier" ? (
                    <FiCheck className="w-3.5 h-3.5 text-[var(--frasto-positive)]" />
                  ) : (
                    <FiCopy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Size */}
              <div className="p-2.5 bg-[var(--frasto-surface)] border border-[var(--frasto-border)]">
                <p className="text-[10px] font-bold text-[var(--frasto-ink-muted)] uppercase tracking-wider">
                  Installed Size
                </p>
                <p className="text-xs font-mono text-[var(--frasto-ink)]">
                  {app.size}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            {/* Launch Button */}
            <button
              onClick={handleLaunch}
              className="flex-1 h-9 px-4 text-xs font-medium bg-[var(--frasto-ink)] text-[var(--frasto-bg)] border border-[var(--frasto-ink)] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <FiPlay className="w-3 h-3" />
              <span>Launch Application</span>
            </button>

            {/* Check Update */}
            {updateStatus !== "up-to-date" && updateStatus !== "updated" && (
              <button
                onClick={
                  updateStatus === "available" ? handleUpdate : handleCheckUpdate
                }
                disabled={
                  updateStatus === "checking" ||
                  updateStatus === "updating" ||
                  isUninstalling
                }
                className="flex-1 h-9 px-4 text-xs font-medium border border-[var(--frasto-border)] bg-[var(--frasto-surface)] text-[var(--frasto-ink)] hover:bg-[var(--frasto-surface-subtle)] flex items-center justify-center gap-2 transition-colors"
              >
                {updateStatus === "checking" || updateStatus === "updating" ? (
                  <div className="size-3 animate-spin border-b-2 border-current"></div>
                ) : (
                  <>
                    <FiLayers className="w-3 h-3" />
                    <span>
                      {updateStatus === "available"
                        ? `Update to ${newVersion}`
                        : "Check Updates"}
                    </span>
                  </>
                )}
              </button>
            )}

            {/* Uninstall */}
            <button
              onClick={() => onUninstall(app)}
              disabled={isUninstalling}
              className="h-9 px-4 text-xs font-medium border border-[var(--frasto-danger)] text-[var(--frasto-danger)] hover:bg-[var(--frasto-surface-subtle)] flex items-center justify-center gap-2 transition-colors"
            >
              <FiTrash2 className="w-3 h-3" />
              <span>Uninstall</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 bg-[var(--frasto-surface-subtle)] border-t border-[var(--frasto-border)] flex items-center justify-between text-[10px] text-[var(--frasto-ink-soft)]">
          <div className="flex items-center gap-1.5">
            <FiShield className="w-3 h-3" />
            <span>Verified Linux package manifest</span>
          </div>
          <span className="font-mono uppercase">{app.manager}</span>
        </div>
      </div>
    </div>
  );
};

export default AppDetailsModal;
