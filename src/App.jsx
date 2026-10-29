import React, { useState, useMemo, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AppList from "./components/AppList";
import { useApps } from "./hooks/useApps";
import { useGlobalApps } from "./hooks/useGlobalApps";
import { useUninstall } from "./hooks/useUninstall";
import {
  PACKAGE_MANAGERS,
  CATEGORIES,
  filterAndSortApps,
} from "./utils/appUtils";
import "./index.css";

import About from "./components/About";
import Usage from "./components/Usage";
import AppDetailsModal from "./components/AppDetailsModal";
import ConfirmModal from "./components/ConfirmModal";
import Toast from "./components/Toast";

function App() {
  const [activeTab, setActiveTab] = useState(PACKAGE_MANAGERS.APT);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGlobalSearch, setIsGlobalSearch] = useState(false);
  const [selectedAppForDetails, setSelectedAppForDetails] = useState(null);

  // Dark / Light Mode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("freight-theme");
    if (saved) return saved === "dark";
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("freight-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("freight-theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // View & Filter States
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");

  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (text, type = "success") =>
    setToastMessage({ text, type });
  const clearToast = () => setToastMessage(null);

  const {
    apps: tabApps,
    loading: tabLoading,
    loadingMore: tabLoadingMore,
    reloadApps: reloadTabApps,
    loadMore: loadMoreTab,
    hasMore: tabHasMore,
  } = useApps(activeTab);

  const {
    apps: globalApps,
    loading: globalLoading,
    reloadApps: reloadGlobalApps,
  } = useGlobalApps();

  const {
    uninstalling,
    requestUninstall,
    handleConfirmUninstall,
    handleCancelUninstall,
    confirmModalConfig,
  } = useUninstall(() => {
    if (isGlobalSearch) {
      reloadGlobalApps();
    } else {
      reloadTabApps();
    }
  }, showToast);

  const rawApps = isGlobalSearch ? globalApps : tabApps;
  const loading = isGlobalSearch ? globalLoading : tabLoading;
  const loadingMore = isGlobalSearch ? false : tabLoadingMore;
  const loadMore = isGlobalSearch ? null : loadMoreTab;
  const hasMore = isGlobalSearch ? false : tabHasMore;

  // Dynamically calculate category counts for the active apps
  const categoryCounts = useMemo(() => {
    const counts = { All: rawApps.length };
    CATEGORIES.forEach((cat) => {
      if (cat !== "All") {
        counts[cat] = rawApps.filter(
          (a) =>
            a.category === cat ||
            (cat === "Utilities" && (!a.category || a.category === "Utilities"))
        ).length;
      }
    });
    return counts;
  }, [rawApps]);

  // Sidebar source counts
  const sidebarCounts = useMemo(() => {
    if (isGlobalSearch && globalApps.length > 0) {
      return {
        [PACKAGE_MANAGERS.APT]: globalApps.filter((a) => a.manager === "apt").length,
        [PACKAGE_MANAGERS.SNAP]: globalApps.filter((a) => a.manager === "snap").length,
        [PACKAGE_MANAGERS.FLATPAK]: globalApps.filter((a) => a.manager === "flatpak").length,
      };
    }
    return {
      [activeTab]: rawApps.length,
    };
  }, [isGlobalSearch, globalApps, activeTab, rawApps.length]);

  // Filtered and sorted applications
  const processedApps = useMemo(() => {
    return filterAndSortApps(rawApps, searchQuery, selectedCategory, sortBy);
  }, [rawApps, searchQuery, selectedCategory, sortBy]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsGlobalSearch(false);
    setSelectedAppForDetails(null);
    setSelectedCategory("All");
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0A0D14] text-slate-800 dark:text-slate-100 antialiased overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        counts={sidebarCounts}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-slate-50/50 dark:bg-[#0A0D14]">
        {activeTab === "about" ? (
          <About />
        ) : activeTab === "usage" ? (
          <Usage />
        ) : (
          <>
            {/* Rich Header with search, category pills, view toggles, dark mode */}
            <Header
              activeTab={activeTab}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              appCount={processedApps.length}
              totalCount={rawApps.length}
              onRefresh={isGlobalSearch ? reloadGlobalApps : reloadTabApps}
              isGlobalSearch={isGlobalSearch}
              onGlobalSearchChange={setIsGlobalSearch}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categoryCounts={categoryCounts}
              sortBy={sortBy}
              onSortChange={setSortBy}
              darkMode={darkMode}
              onToggleDarkMode={toggleDarkMode}
            />

            {/* Application List (Grid or Table) */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 pt-4">
              <AppList
                apps={processedApps}
                searchQuery={searchQuery}
                loading={loading}
                loadingMore={loadingMore}
                loadMore={loadMore}
                hasMore={hasMore}
                onUninstall={requestUninstall}
                uninstalling={uninstalling}
                onAppClick={setSelectedAppForDetails}
                viewMode={viewMode}
                onClearFilters={handleClearFilters}
                onCopyPath={(path) =>
                  showToast(`Copied ${path} to clipboard!`, "success")
                }
              />
            </div>
          </>
        )}
      </div>

      {/* App Details Modal */}
      <AppDetailsModal
        app={selectedAppForDetails}
        onClose={() => setSelectedAppForDetails(null)}
        onUninstall={requestUninstall}
        isUninstalling={uninstalling === selectedAppForDetails?.name}
        showToast={showToast}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalConfig.isOpen}
        onClose={handleCancelUninstall}
        onConfirm={handleConfirmUninstall}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        confirmText="Uninstall"
        cancelText="Cancel"
        isDestructive={true}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage?.text}
        type={toastMessage?.type}
        onClose={clearToast}
      />
    </div>
  );
}

export default App;
