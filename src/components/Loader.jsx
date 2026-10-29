import React from "react";

const Loader = ({
  text = "Loading applications...",
  subtext,
  type = "spinner",
  spinnerSizeClass = "size-7",
  fullHeight = true,
}) => {
  const containerClass = fullHeight
    ? "flex items-center justify-center h-full"
    : "flex items-center justify-center";

  if (type === "spinner") {
    return (
      <div
        className={`flex flex-col items-center justify-center ${
          fullHeight ? "flex-1 h-full p-8" : ""
        }`}
      >
        <div
          className={`animate-spin ${spinnerSizeClass} border-2 border-[var(--frasto-border)] border-t-[var(--frasto-ink)] ${
            text ? "mb-3" : ""
          }`}
        />
        {text && (
          <p className="text-xs font-semibold text-[var(--frasto-ink)]">
            {text}
          </p>
        )}
        {subtext && (
          <p className="text-[10px] text-[var(--frasto-ink-soft)] mt-1 font-mono">
            {subtext}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-1.5">
          <div className="size-1.5 bg-[var(--frasto-ink)]" />
          <div className="size-1.5 bg-[var(--frasto-ink-muted)]" />
          <div className="size-1.5 bg-[var(--frasto-ink-soft)]" />
        </div>
        {text && (
          <div className="text-xs font-medium text-[var(--frasto-ink)]">
            {text}
          </div>
        )}
      </div>
    </div>
  );
};

export default Loader;
