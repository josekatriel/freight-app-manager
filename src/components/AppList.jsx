import React, { useEffect, useRef } from "react";
import AppCard from "./AppCard";
import AppTable from "./AppTable";
import Loader from "./Loader";

const AppList = ({
  apps,
  searchQuery,
  loading,
  loadingMore,
  loadMore,
  hasMore,
  onUninstall,
  uninstalling,
  onAppClick,
  viewMode = "grid",
  onClearFilters,
  onCopyPath,
}) => {
  const observerTargetRef = useRef(null);

  useEffect(() => {
    if (!loadMore || !observerTargetRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerTargetRef.current);

    return () => {
      if (observerTargetRef.current) observer.unobserve(observerTargetRef.current);
    };
  }, [loadMore, observerTargetRef]);

  if (loading) {
    return <Loader type="spinner" text="Scanning packages..." subtext="Querying system repository" />;
  }

  if (apps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[340px] p-8 text-center bg-white/40 rounded-3xl border border-dashed border-slate-200">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          📦
        </div>
        <h4 className="text-base font-bold text-slate-800 mb-1">No matching applications</h4>
        <p className="text-xs text-slate-500 max-w-sm mb-4">
          {searchQuery
            ? `No applications matched "${searchQuery}". Try a different keyword or category.`
            : "No applications found in this package manager."}
        </p>
        {onClearFilters && searchQuery && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 text-xs font-semibold bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  if (viewMode === "table") {
    return (
      <div className="pb-10">
        <AppTable
          apps={apps}
          onUninstall={onUninstall}
          uninstalling={uninstalling}
          onAppClick={onAppClick}
          onCopyPath={onCopyPath}
        />
        {(hasMore || loadingMore) && (
          <div ref={observerTargetRef} className="py-6 text-center">
            <Loader type="spinner" text="" fullHeight={false} spinnerSizeClass="h-6 w-6" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {apps.map((app, index) => (
          <AppCard
            key={`${app.manager}-${app.name}-${index}`}
            app={app}
            onUninstall={onUninstall}
            isUninstalling={uninstalling === app.name}
            onClick={() => onAppClick(app)}
            onCopyPath={onCopyPath}
          />
        ))}
      </div>

      {(hasMore || loadingMore) && (
        <div ref={observerTargetRef} className="col-span-full py-8 text-center">
          <Loader type="spinner" text="" fullHeight={false} spinnerSizeClass="h-6 w-6" />
        </div>
      )}
    </div>
  );
};

export default AppList;
