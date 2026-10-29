import React from "react";

const Loader = ({
  text = "Loading applications...",
  subtext,
  type = "dots",
  colorClass = "bg-indigo-600 dark:bg-indigo-400",
  spinnerColorClass = "border-indigo-600 dark:border-indigo-400",
  spinnerSizeClass = "h-10 w-10",
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
          className={`animate-spin rounded-full ${spinnerSizeClass} border-b-2 ${spinnerColorClass} ${
            text ? "mb-3" : ""
          }`}
        />
        {text && (
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {text}
          </p>
        )}
        {subtext && (
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
            {subtext}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-1.5">
          <div
            className={`w-2 h-2 ${colorClass} rounded-full animate-bounce`}
            style={{ animationDelay: "0ms" }}
          />
          <div
            className={`w-2 h-2 ${colorClass} rounded-full animate-bounce`}
            style={{ animationDelay: "150ms" }}
          />
          <div
            className={`w-2 h-2 ${colorClass} rounded-full animate-bounce`}
            style={{ animationDelay: "300ms" }}
          />
        </div>
        {text && (
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {text}
          </div>
        )}
        {subtext && (
          <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
};

export default Loader;
