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
    <div className="md:w-64 bg-[#f8fafc] border-r border-slate-200/60 flex flex-col h-full flex-shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200 overflow-hidden flex-shrink-0">
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
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
              Freight
            </h1>
            <p className="text-[11px] font-semibold tracking-wider text-indigo-600 uppercase mt-0.5">
              App Manager
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-4 flex flex-col gap-6 overflow-y-auto">
        <nav className="space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
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
                    ? "bg-white text-indigo-600 font-semibold shadow-xs border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-indigo-600 rounded-r-full" />
                  )}
                  <Icon
                    className={`w-4 h-4 transition-transform duration-150 flex-shrink-0 ${
                      isActive
                        ? "scale-110 text-indigo-600"
                        : "text-slate-400 group-hover:scale-110 group-hover:text-slate-700"
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
                        ? "bg-indigo-50 text-indigo-600 font-bold"
                        : "bg-slate-100 text-slate-500 font-medium group-hover:bg-slate-200"
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
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
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
                    ? "bg-white text-indigo-600 font-semibold shadow-xs border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-indigo-600 rounded-r-full" />
                )}
                <Icon
                  className={`w-4 h-4 transition-transform duration-150 flex-shrink-0 ${
                    isActive
                      ? "scale-110 text-indigo-600"
                      : "text-slate-400 group-hover:scale-110 group-hover:text-slate-700"
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
      <div className="p-4 border-t border-slate-200/60 text-center">
        <span className="text-[11px] font-mono font-medium text-slate-400">
          v0.6.0 • PixelFreight
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
