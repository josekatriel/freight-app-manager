import React from "react";
import { FiPackage, FiInfo, FiPieChart, FiActivity } from "react-icons/fi";
import { SiDebian, SiSnapcraft, SiFlatpak } from "react-icons/si";
import { PACKAGE_MANAGERS } from "../utils/appUtils";

const SIDEBAR_ITEMS = [
  {
    id: PACKAGE_MANAGERS.APT,
    label: "APT Packages",
    icon: SiDebian,
    badgeColor: "group-hover:text-rose-500",
    activeColor: "text-rose-600 dark:text-rose-400",
  },
  {
    id: PACKAGE_MANAGERS.SNAP,
    label: "Snap Packages",
    icon: SiSnapcraft,
    badgeColor: "group-hover:text-amber-500",
    activeColor: "text-amber-600 dark:text-amber-400",
  },
  {
    id: PACKAGE_MANAGERS.FLATPAK,
    label: "Flatpak Apps",
    icon: SiFlatpak,
    badgeColor: "group-hover:text-sky-500",
    activeColor: "text-sky-600 dark:text-sky-400",
  },
];

const GENERAL_ITEMS = [
  {
    id: "usage",
    label: "Storage Usage",
    icon: FiPieChart,
    activeColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    id: "about",
    label: "About Freight",
    icon: FiInfo,
    activeColor: "text-indigo-600 dark:text-indigo-400",
  },
];

const Sidebar = ({ activeTab, onTabChange, counts = {} }) => {
  return (
    <div className="md:w-64 bg-slate-50/90 dark:bg-[#0E131F] border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col h-full flex-shrink-0 select-none transition-colors duration-200">
      {/* Brand Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center shadow-md shadow-indigo-500/20 overflow-hidden flex-shrink-0">
            <img
              src="/icon.svg"
              alt="Freight"
              className="w-7 h-7 object-contain"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <FiPackage className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
              Freight
            </h1>
            <p className="text-[11px] font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase mt-0.5">
              App Manager
            </p>
          </div>
        </div>

        {/* System Bridge Live Indicator */}
        <div className="mt-4 flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>System Connected</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-3 flex flex-col gap-6 overflow-y-auto">
        <nav className="space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
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
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-150 relative group ${
                  isActive
                    ? "bg-white dark:bg-slate-800/90 text-slate-900 dark:text-white font-semibold shadow-xs border border-slate-200/80 dark:border-slate-700/80"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-indigo-600 dark:bg-indigo-500 rounded-r-full" />
                  )}
                  <Icon
                    className={`w-4 h-4 transition-transform duration-150 flex-shrink-0 ${
                      isActive
                        ? item.activeColor
                        : `text-slate-400 dark:text-slate-500 group-hover:scale-110 ${item.badgeColor}`
                    }`}
                  />
                  <span className="hidden md:block tracking-tight text-sm truncate">
                    {item.label}
                  </span>
                </div>

                {typeof count === "number" && (
                  <span
                    className={`hidden md:inline-flex text-[11px] font-mono px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold"
                        : "bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
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
          <p className="px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
            System & Info
          </p>
          {GENERAL_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-all duration-150 relative group ${
                  isActive
                    ? "bg-white dark:bg-slate-800/90 text-slate-900 dark:text-white font-semibold shadow-xs border border-slate-200/80 dark:border-slate-700/80"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-indigo-600 dark:bg-indigo-500 rounded-r-full" />
                )}
                <Icon
                  className={`w-4 h-4 transition-transform duration-150 flex-shrink-0 ${
                    isActive
                      ? item.activeColor
                      : "text-slate-400 dark:text-slate-500 group-hover:scale-110 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                  }`}
                />
                <span className="hidden md:block tracking-tight text-sm">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Branding */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 text-center">
        <span className="text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500">
          v0.6.0 • PixelFreight
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
