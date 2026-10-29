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
    return <Loader type="spinner" text="Scanning packages..." subtext="Querying system repository index" />;
  }

  if (apps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[340px] p-8 text-center bg-[var(--frasto-surface)] border border-dashed border-[var(--frasto-border)]">
        <div className="size-10 bg-[var(--frasto-surface-subtle)] border border-[var(--frasto-border)] flex items-center justify-center text-[var(--frasto-ink-soft)] text-lg mb-3">
          📦
        </div>
        <h4 className="text-sm font-bold font-display text-[var(--frasto-ink)] mb-1">
          No matching packages
        </h4>
        <p className="text-xs text-[var(--frasto-ink-muted)] max-w-sm mb-4 leading-relaxed">
          {searchQuery
            ? `No applications matched "${searchQuery}". Try another keyword or filter tab.`
            : "No applications found in this package manager."}
        </p>
        {onClearFilters && searchQuery && (
          <button
            onClick={onClearFilters}
            className="h-8 px-3 text-xs font-medium bg-[var(--frasto-surface-subtle)] border border-[var(--frasto-border)] text-[var(--frasto-ink)] hover:border-[var(--frasto-ink)] transition-colors"
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
            <Loader type="spinner" text="" fullHeight={false} spinnerSizeClass="size-5" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
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
        <div ref={observerTargetRef} className="py-8 text-center">
          <Loader type="spinner" text="Loading more..." fullHeight={false} spinnerSizeClass="size-5" />
        </div>
      )}
    </div>
  );
};

export default AppList;
