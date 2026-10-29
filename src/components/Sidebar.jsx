import React from "react";
import { FiPackage, FiInfo, FiPieChart } from "react-icons/fi";
import { SiDebian, SiSnapcraft, SiFlatpak } from "react-icons/si";
import { PACKAGE_MANAGERS } from "../utils/appUtils";

const SIDEBAR_ITEMS = [
  {
    id: PACKAGE_MANAGERS.APT,
    label: "APT Packages",
    icon: SiDebian,
  },
  {
    id: PACKAGE_MANAGERS.SNAP,
    label: "Snap Packages",
    icon: SiSnapcraft,
  },
  {
    id: PACKAGE_MANAGERS.FLATPAK,
    label: "Flatpak Apps",
    icon: SiFlatpak,
  },
];

const GENERAL_ITEMS = [
  {
    id: "usage",
    label: "Storage Usage",
    icon: FiPieChart,
  },
  {
    id: "about",
    label: "About Freight",
    icon: FiInfo,
  },
];

const Sidebar = ({ activeTab, onTabChange, counts = {} }) => {
  return (
    <div className="md:w-60 bg-[var(--frasto-surface-subtle)] border-r border-[var(--frasto-border)] flex flex-col h-full flex-shrink-0 select-none transition-colors duration-150">
      {/* Brand Header */}
      <div className="p-5 pb-4 border-b border-[var(--frasto-border)]">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-[var(--frasto-ink)] text-[var(--frasto-bg)] flex items-center justify-center overflow-hidden flex-shrink-0 border border-[var(--frasto-border-strong)]">
            <img
              src="/icon.svg"
              alt="Freight"
              className="w-5 h-5 object-contain invert dark:invert-0"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <FiPackage className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-extrabold font-display tracking-tight text-[var(--frasto-ink)] leading-none">
              Freight
            </h1>
            <p className="text-[9px] font-bold tracking-widest text-[var(--frasto-ink-muted)] uppercase mt-0.5">
              APP MANAGER
            </p>
          </div>
        </div>

        {/* Host Connected Status Specimen */}
        <div className="mt-3.5 flex items-center gap-2 px-2.5 py-1 border border-[var(--frasto-border)] bg-[var(--frasto-surface)] text-[var(--frasto-positive)] text-[11px] font-medium">
          <span className="size-1.5 shrink-0 bg-current" />
          <span>Host Connected</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 flex flex-col gap-6 overflow-y-auto">
        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-[var(--frasto-ink-muted)] uppercase tracking-wider mb-2">
            Package Sources
          </p>
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const count = counts[item.id];

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors duration-100 ${
                  isActive
                    ? "bg-[var(--frasto-ink)] text-[var(--frasto-bg)] font-semibold border border-[var(--frasto-ink)]"
                    : "text-[var(--frasto-ink)] hover:bg-[var(--frasto-border)]/50 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="hidden md:block tracking-tight truncate">
                    {item.label}
                  </span>
                </div>

                {typeof count === "number" && (
                  <span
                    className={`hidden md:inline-flex text-[11px] font-mono px-1.5 py-0.2 ${
                      isActive
                        ? "bg-[var(--frasto-bg)] text-[var(--frasto-ink)] font-bold"
                        : "bg-[var(--frasto-surface)] text-[var(--frasto-ink-muted)] border border-[var(--frasto-border)]"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-[var(--frasto-ink-muted)] uppercase tracking-wider mb-2">
            System & Info
          </p>
          {GENERAL_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors duration-100 ${
                  isActive
                    ? "bg-[var(--frasto-ink)] text-[var(--frasto-bg)] font-semibold border border-[var(--frasto-ink)]"
                    : "text-[var(--frasto-ink)] hover:bg-[var(--frasto-border)]/50 border border-transparent"
                }`}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden md:block tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Attribution */}
      <div className="p-3.5 border-t border-[var(--frasto-border)] text-center">
        <span className="text-[10px] font-mono text-[var(--frasto-ink-soft)]">
          Frasto UI · PixelFreight
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
