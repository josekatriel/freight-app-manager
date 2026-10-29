import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  FiX,
  FiPackage,
  FiInfo,
  FiFolder,
  FiCpu,
  FiExternalLink,
  FiLayers,
  FiShield,
  FiTrash2,
  FiCopy,
  FiCheck,
  FiPlay,
} from "react-icons/fi";
import { getManagerIcon, getDisplayName } from "../utils/appUtils";
import appService, { isTauri } from "../services/appService";

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
    if (showToast) showToast(`Copied ${fieldName} to clipboard!`, "success");
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
      if (showToast) showToast(`Failed to check for updates: ${err}`, "error");
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
          `Successfully updated ${displayName} to ${newVersion || "latest"}`,
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
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/60">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 p-2.5 flex items-center justify-center shadow-xs overflow-hidden flex-shrink-0">
              {iconSrc ? (
                <img
                  src={iconSrc}
                  alt={displayName}
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
              ) : null}
              <div
                className="text-slate-400"
                style={{ display: iconSrc ? "none" : "block" }}
              >
                {getManagerIcon(app.manager, "w-8 h-8")}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {displayName}
                </h2>
                {app.category && (
                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded-full">
                    {app.category}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono font-medium text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                  v{app.version}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {app.manager}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
            title="Close"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Description */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              Description
            </h4>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs text-slate-700 leading-relaxed">
              {app.description || "No description provided for this package."}
            </div>
          </div>

          {/* Metadata Grid */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Package Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Path */}
              <div className="sm:col-span-2 p-3 bg-white border border-slate-200/70 rounded-xl flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Binary Path
                  </p>
                  <p className="text-xs font-mono text-slate-800 truncate" title={app.path}>
                    {app.path || "Not specified"}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(app.path, "path")}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex-shrink-0"
                  title="Copy path"
                >
                  {copiedField === "path" ? (
                    <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <FiCopy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Package Identifier */}
              <div className="p-3 bg-white border border-slate-200/70 rounded-xl flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Identifier
                  </p>
                  <p className="text-xs font-mono text-slate-800 truncate">
                    {app.pkgName || app.name}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(app.pkgName || app.name, "identifier")}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex-shrink-0"
                  title="Copy identifier"
                >
                  {copiedField === "identifier" ? (
                    <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <FiCopy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Size */}
              <div className="p-3 bg-white border border-slate-200/70 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Installed Size
                </p>
                <p className="text-xs font-mono font-semibold text-slate-800">
                  {app.size}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            {/* Launch Button */}
            <button
              onClick={handleLaunch}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all active:scale-98"
            >
              <FiPlay className="w-3.5 h-3.5" />
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
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold border transition-all ${
                  updateStatus === "available"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                {updateStatus === "checking" || updateStatus === "updating" ? (
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-current"></div>
                ) : (
                  <>
                    <FiLayers className="w-3.5 h-3.5" />
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
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
              <span>Uninstall</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <FiShield className="w-3 h-3 text-slate-400" />
            <span>Verified package metadata</span>
          </div>
          <span className="font-mono">{app.manager.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};

export default AppDetailsModal;
