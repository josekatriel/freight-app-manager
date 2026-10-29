import React, { useState } from "react";
import SearchBar from "./SearchBar";
import { getTabTitle, CATEGORIES } from "../utils/appUtils";
import appService from "../services/appService";
import {
  FiRefreshCw,
  FiGlobe,
  FiGrid,
  FiList,
  FiArrowUp,
  FiArrowDown,
  FiSliders,
} from "react-icons/fi";

const Header = ({
  activeTab,
  searchQuery,
  onSearchChange,
  appCount,
  totalCount,
  onRefresh,
  isGlobalSearch,
  onGlobalSearchChange,
  viewMode,
  onViewModeChange,
  selectedCategory,
  onCategoryChange,
  categoryCounts = {},
  sortBy,
  onSortChange,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await appService.clearCache(activeTab);
      if (onRefresh) {
        onRefresh();
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-md border-b border-slate-200/60 px-6 sm:px-8 pt-5 pb-3 sticky top-0 z-20">
      {/* Top row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-4">
        {/* Title & App count */}
        <div className="min-w-[180px]">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{isGlobalSearch ? "All Applications" : getTabTitle(activeTab)}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
              {appCount}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isGlobalSearch
              ? "All installed package ecosystems on this system"
              : `Active packages managed by ${activeTab.toUpperCase()}`}
          </p>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-lg mx-auto w-full">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            placeholder={
              isGlobalSearch
                ? "Search across APT, Snap, Flatpak..."
                : `Search in ${getTabTitle(activeTab)}...`
            }
          />
        </div>

        {/* Right controls: View Toggle, Sort, Global, Refresh */}
        <div className="flex items-center gap-2 justify-end flex-wrap">
          {/* View Mode Toggle: Grid vs List */}
          <div className="flex items-center bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/60">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-white text-indigo-600 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Grid View"
            >
              <FiGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("table")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "table"
                  ? "bg-white text-indigo-600 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Table / List View"
            >
              <FiList className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 py-2 pl-3 pr-7 rounded-xl border border-slate-200/80 shadow-xs appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              title="Sort applications"
            >
              <option value="name-asc">Name (A → Z)</option>
              <option value="name-desc">Name (Z → A)</option>
              <option value="size-desc">Size (Largest first)</option>
              <option value="size-asc">Size (Smallest first)</option>
            </select>
            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
              <FiSliders className="w-3 h-3" />
            </div>
          </div>

          {/* Global Search Button */}
          <button
            onClick={() => onGlobalSearchChange(!isGlobalSearch)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isGlobalSearch
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 shadow-xs"
            }`}
            title="Search across all package managers"
          >
            <FiGlobe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">All Sources</span>
          </button>

          {/* Refresh Cache Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 bg-white hover:bg-slate-50 rounded-xl shadow-xs border border-slate-200/80 transition-all disabled:opacity-50 text-slate-600 hover:text-indigo-600"
            title="Refresh package list"
          >
            <FiRefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin text-indigo-600" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Category Filter Pills (Desktop and Scrollable on Mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = categoryCounts[cat];

          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 ${
                isSelected
                  ? "bg-slate-900 text-white font-semibold shadow-xs"
                  : "bg-slate-100/70 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
              }`}
            >
              <span>{cat}</span>
              {typeof count === "number" && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-slate-200/80 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Header;
