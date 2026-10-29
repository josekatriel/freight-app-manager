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
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
        <FiSearch className="w-4 h-4" />
      </div>

      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-16 py-2.5 bg-white border border-slate-200/80 rounded-xl text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-150"
      />

      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1">
        {value ? (
          <button
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Clear search"
          >
            <FiX className="w-4 h-4" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded">
            /
          </kbd>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
