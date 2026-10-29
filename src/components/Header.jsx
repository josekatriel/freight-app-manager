import React, { useState } from "react";
import SearchBar from "./SearchBar";
import { getTabTitle, CATEGORIES } from "../utils/appUtils";
import appService from "../services/appService";
import {
  FiRefreshCw,
  FiGlobe,
  FiGrid,
  FiList,
  FiSliders,
  FiSun,
  FiMoon,
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
  darkMode,
  onToggleDarkMode,
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
    <div className="bg-[var(--frasto-bg)] border-b border-[var(--frasto-border)] px-6 sm:px-8 pt-5 pb-3 sticky top-0 z-20 transition-colors duration-150">
      {/* Top row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-3.5">
        {/* Title & App count */}
        <div className="min-w-[200px]">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-extrabold font-display tracking-tight text-[var(--frasto-ink)]">
              {isGlobalSearch ? "All Applications" : getTabTitle(activeTab)}
            </h2>
            <span className="text-xs font-mono font-medium px-2 py-0.5 border border-[var(--frasto-border)] bg-[var(--frasto-surface-subtle)] text-[var(--frasto-ink-muted)]">
              {appCount}
            </span>
          </div>
          <p className="text-xs text-[var(--frasto-ink-muted)] mt-0.5">
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

        {/* Right controls: View Toggle, Sort, Global, Theme, Refresh */}
        <div className="flex items-center gap-2 justify-end flex-wrap">
          {/* View Mode Toggle: Grid vs List */}
          <div className="flex items-center bg-[var(--frasto-surface-subtle)] border border-[var(--frasto-border)] p-0.5">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-1.5 transition-colors ${
                viewMode === "grid"
                  ? "bg-[var(--frasto-surface)] text-[var(--frasto-ink)] border border-[var(--frasto-border)] font-semibold"
                  : "text-[var(--frasto-ink-muted)] hover:text-[var(--frasto-ink)]"
              }`}
              title="Grid Specimen View"
            >
              <FiGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange("table")}
              className={`p-1.5 transition-colors ${
                viewMode === "table"
                  ? "bg-[var(--frasto-surface)] text-[var(--frasto-ink)] border border-[var(--frasto-border)] font-semibold"
                  : "text-[var(--frasto-ink-muted)] hover:text-[var(--frasto-ink)]"
              }`}
              title="Table / Data View"
            >
              <FiList className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="text-xs font-medium bg-[var(--frasto-surface)] hover:bg-[var(--frasto-surface-subtle)] text-[var(--frasto-ink)] py-2 pl-3 pr-7 border border-[var(--frasto-border)] appearance-none cursor-pointer focus:outline-none focus:border-[var(--frasto-ink)]"
              title="Sort applications"
            >
              <option value="name-asc">Name (A → Z)</option>
              <option value="name-desc">Name (Z → A)</option>
              <option value="size-desc">Size (Largest first)</option>
              <option value="size-asc">Size (Smallest first)</option>
            </select>
            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-[var(--frasto-ink-muted)]">
              <FiSliders className="w-3 h-3" />
            </div>
          </div>

          {/* Global Search Button */}
          <button
            onClick={() => onGlobalSearchChange(!isGlobalSearch)}
            className={`px-3 py-2 text-xs font-medium flex items-center gap-1.5 transition-colors border ${
              isGlobalSearch
                ? "bg-[var(--frasto-ink)] text-[var(--frasto-bg)] border-[var(--frasto-ink)] font-semibold"
                : "bg-[var(--frasto-surface)] hover:bg-[var(--frasto-surface-subtle)] text-[var(--frasto-ink)] border-[var(--frasto-border)]"
            }`}
            title="Search across all package managers"
          >
            <FiGlobe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">All Sources</span>
          </button>

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 bg-[var(--frasto-surface)] hover:bg-[var(--frasto-surface-subtle)] border border-[var(--frasto-border)] transition-colors text-[var(--frasto-ink)]"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? (
              <FiSun className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <FiMoon className="w-3.5 h-3.5 text-[var(--frasto-ink)]" />
            )}
          </button>

          {/* Refresh Cache Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 bg-[var(--frasto-surface)] hover:bg-[var(--frasto-surface-subtle)] border border-[var(--frasto-border)] transition-colors disabled:opacity-40 text-[var(--frasto-ink)]"
            title="Refresh package index"
          >
            <FiRefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Category Filter Tabs (Frasto Tab Bar) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = categoryCounts[cat];

          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 border ${
                isSelected
                  ? "bg-[var(--frasto-ink)] text-[var(--frasto-bg)] border-[var(--frasto-ink)] font-semibold"
                  : "bg-[var(--frasto-surface)] text-[var(--frasto-ink)] border-[var(--frasto-border)] hover:bg-[var(--frasto-surface-subtle)]"
              }`}
            >
              <span>{cat}</span>
              {typeof count === "number" && (
                <span
                  className={`text-[10px] px-1 py-0.2 font-mono ${
                    isSelected
                      ? "bg-[var(--frasto-bg)] text-[var(--frasto-ink)]"
                      : "bg-[var(--frasto-surface-subtle)] text-[var(--frasto-ink-muted)] border border-[var(--frasto-border)]"
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
