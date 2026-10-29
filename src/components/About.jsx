import React from "react";
import {
  FiGithub,
  FiInfo,
  FiHeart,
  FiCode,
  FiExternalLink,
  FiCpu,
  FiLayers,
  FiGlobe,
} from "react-icons/fi";
import { openUrl } from "@tauri-apps/plugin-opener";
import { isTauri } from "../services/appService";

const About = () => {
  const handleLink = (url) => {
    if (isTauri()) {
      openUrl(url).catch(() => window.open(url, "_blank"));
    } else {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        {/* Hero Section */}
        <div className="bg-[var(--frasto-surface)] border border-[var(--frasto-border)] p-8 flex flex-col items-center text-center mb-6 transition-colors">
          <div className="size-16 bg-[var(--frasto-ink)] text-[var(--frasto-bg)] flex items-center justify-center mb-4 border border-[var(--frasto-border-strong)]">
            <img
              src="/icon.svg"
              alt="Freight App Manager"
              className="size-10 object-contain invert dark:invert-0"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
          <h1 className="text-2xl font-extrabold font-display text-[var(--frasto-ink)] tracking-tight">
            Freight App Manager
          </h1>
          <p className="text-[var(--frasto-ink-muted)] text-xs font-medium mt-1 mb-3">
            Frasto Design System · PixelFreight · Jose Katriel
          </p>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[var(--frasto-surface-subtle)] border border-[var(--frasto-border)] text-[var(--frasto-ink-muted)] text-[11px] font-mono mb-6">
            <span>v0.6.0</span>
            <span>·</span>
            <span>Tauri 2 + React</span>
            <span>·</span>
            <span>Frasto UI</span>
          </div>

          <div className="flex flex-wrap gap-2.5 justify-center">
            <button
              onClick={() =>
                handleLink("https://github.com/josekatriel/freight-app-manager")
              }
              className="h-9 px-4 text-xs font-semibold bg-[var(--frasto-ink)] text-[var(--frasto-bg)] border border-[var(--frasto-ink)] flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <FiGithub className="w-3.5 h-3.5" />
              <span>GitHub Repository</span>
            </button>
            <button
              onClick={() =>
                handleLink(
                  "https://github.com/josekatriel/freight-app-manager/releases"
                )
              }
              className="h-9 px-4 text-xs font-semibold bg-[var(--frasto-surface)] border border-[var(--frasto-border)] text-[var(--frasto-ink)] hover:bg-[var(--frasto-surface-subtle)] flex items-center gap-2 transition-colors"
            >
              <FiExternalLink className="w-3.5 h-3.5" />
              <span>Releases</span>
            </button>
            <button
              onClick={() =>
                handleLink("https://frasto.freightpx.com")
              }
              className="h-9 px-4 text-xs font-semibold bg-[var(--frasto-surface-subtle)] border border-[var(--frasto-border)] text-[var(--frasto-ink)] hover:border-[var(--frasto-ink)] flex items-center gap-2 transition-colors"
            >
              <FiGlobe className="w-3.5 h-3.5" />
              <span>Frasto UI</span>
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <div className="bg-[var(--frasto-surface)] border border-[var(--frasto-border)] p-4">
            <div className="size-8 bg-[var(--frasto-surface-subtle)] border border-[var(--frasto-border)] flex items-center justify-center mb-2.5 text-[var(--frasto-ink)]">
              <FiLayers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold font-display text-[var(--frasto-ink)] mb-1">
              Unified Packaging
            </h3>
            <p className="text-[var(--frasto-ink-muted)] text-xs leading-relaxed">
              Consolidated management across APT, Snap, and Flatpak repositories with unified search and filtering.
            </p>
          </div>

          <div className="bg-[var(--frasto-surface)] border border-[var(--frasto-border)] p-4">
            <div className="size-8 bg-[var(--frasto-surface-subtle)] border border-[var(--frasto-border)] flex items-center justify-center mb-2.5 text-[var(--frasto-ink)]">
              <FiCpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold font-display text-[var(--frasto-ink)] mb-1">
              Rust SQLite Cache
            </h3>
            <p className="text-[var(--frasto-ink-muted)] text-xs leading-relaxed">
              Fast application queries powered by local embedded SQLite3 caching for near-instant response times.
            </p>
          </div>

          <div className="bg-[var(--frasto-surface)] border border-[var(--frasto-border)] p-4">
            <div className="size-8 bg-[var(--frasto-surface-subtle)] border border-[var(--frasto-border)] flex items-center justify-center mb-2.5 text-[var(--frasto-ink)]">
              <FiCode className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold font-display text-[var(--frasto-ink)] mb-1">
              Tauri 2 Architecture
            </h3>
            <p className="text-[var(--frasto-ink-muted)] text-xs leading-relaxed">
              Extremely light memory usage, native Linux IPC bridges, and robust security boundaries.
            </p>
          </div>

          <div className="bg-[var(--frasto-surface)] border border-[var(--frasto-border)] p-4">
            <div className="size-8 bg-[var(--frasto-surface-subtle)] border border-[var(--frasto-border)] flex items-center justify-center mb-2.5 text-[var(--frasto-ink)]">
              <FiHeart className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold font-display text-[var(--frasto-ink)] mb-1">
              Frasto UI System
            </h3>
            <p className="text-[var(--frasto-ink-muted)] text-xs leading-relaxed">
              Architectural Swiss modernism, raw paper tactile warmth, zero drop shadows, and sharp precision.
            </p>
          </div>
        </div>

        {/* Upstream Attribution */}
        <div className="bg-[var(--frasto-surface-subtle)] border border-[var(--frasto-border)] p-4 mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-[var(--frasto-surface)] border border-[var(--frasto-border)] flex items-center justify-center text-[var(--frasto-ink-muted)] flex-shrink-0">
              <FiInfo className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--frasto-ink)]">
                Upstream Attribution
              </p>
              <p className="text-xs text-[var(--frasto-ink-muted)]">
                Evolved from Nexus App Manager by Huzaifa
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              handleLink("https://github.com/Huzaifa-code/Nexus-App-Manager")
            }
            className="h-7 px-3 text-xs font-medium bg-[var(--frasto-surface)] hover:bg-[var(--frasto-surface-subtle)] text-[var(--frasto-ink)] border border-[var(--frasto-border)] transition-colors"
          >
            Upstream
          </button>
        </div>

        {/* Credits */}
        <div className="text-center text-[var(--frasto-ink-soft)] text-xs font-medium pb-6">
          <p>© 2026 Freightpx • PixelFreight. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
