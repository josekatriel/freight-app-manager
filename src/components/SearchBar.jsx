import React, { useRef, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";

const SearchBar = ({ value, onChange, placeholder = "Search applications..." }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.key === "/" || (e.ctrlKey && e.key === "k")) &&
        document.activeElement !== inputRef.current &&
        !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === "Escape" && document.activeElement === inputRef.current) {
        onChange("");
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onChange]);

  return (
    <div className="relative w-full group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--frasto-ink-soft)] group-focus-within:text-[var(--frasto-ink)] transition-colors">
        <FiSearch className="w-4 h-4" />
      </div>

      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-9 pr-14 h-9 bg-[var(--frasto-surface)] border border-[var(--frasto-border)] text-xs text-[var(--frasto-ink)] placeholder-[var(--frasto-ink-soft)] shadow-none focus:outline-none focus:border-[var(--frasto-ink)] transition-colors duration-150"
      />

      <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
        {value ? (
          <button
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            className="p-1 text-[var(--frasto-ink-muted)] hover:text-[var(--frasto-ink)] transition-colors"
            title="Clear search"
          >
            <FiX className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-[var(--frasto-ink-muted)] bg-[var(--frasto-surface-subtle)] border border-[var(--frasto-border)]">
            /
          </kbd>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
