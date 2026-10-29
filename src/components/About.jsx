import React from "react";
import {
  FiGithub,
  FiInfo,
  FiHeart,
  FiCode,
  FiExternalLink,
  FiCpu,
  FiLayers,
  FiGlobe,
} from "react-icons/fi";
import { openUrl } from "@tauri-apps/plugin-opener";
import { isTauri } from "../services/appService";

const About = () => {
  const handleLink = (url) => {
    if (isTauri()) {
      openUrl(url).catch(() => window.open(url, "_blank"));
    } else {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        {/* Hero Section */}
        <div className="bg-white/90 dark:bg-[#131926]/90 backdrop-blur-md rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800 shadow-sm p-10 flex flex-col items-center text-center mb-8 transition-colors">
          <div className="w-24 h-24 rounded-3xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20 overflow-hidden">
            <img
              src="/icon.svg"
              alt="Freight App Manager"
              className="w-16 h-16 object-contain"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-1 tracking-tight">
            Freight App Manager
          </h1>
          <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-2">
            by PixelFreight • Jose Katriel
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 text-xs font-mono font-medium mb-6 border border-slate-200/60 dark:border-slate-700/60">
            <span>Version 0.6.0</span>
            <span>•</span>
            <span>Tauri 2 + React</span>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() =>
                handleLink("https://github.com/josekatriel/freight-app-manager")
              }
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95 text-sm"
            >
              <FiGithub className="w-4 h-4" />
              <span>GitHub Repo</span>
            </button>
            <button
              onClick={() =>
                handleLink(
                  "https://github.com/josekatriel/freight-app-manager/releases"
                )
              }
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-full font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 text-sm"
            >
              <FiExternalLink className="w-4 h-4" />
              <span>Releases</span>
            </button>
            <button
              onClick={() =>
                handleLink("https://web-portfolio-omega-brown.vercel.app/")
              }
              className="flex items-center gap-2 px-6 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-full font-bold shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95 text-sm"
            >
              <FiGlobe className="w-4 h-4" />
              <span>Portfolio</span>
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/80 dark:bg-[#131926]/80 backdrop-blur-md rounded-[1.75rem] border border-slate-200/70 dark:border-slate-800 shadow-sm p-6 group hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <FiLayers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Unified Packaging
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              Centralized management across APT, Snap, and Flatpak repositories with unified search and filtering.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-[#131926]/80 backdrop-blur-md rounded-[1.75rem] border border-slate-200/70 dark:border-slate-800 shadow-sm p-6 group hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <FiCpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Rust SQLite Cache
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              Ultra-fast application queries powered by local embedded SQLite3 caching for near-instant response times.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-[#131926]/80 backdrop-blur-md rounded-[1.75rem] border border-slate-200/70 dark:border-slate-800 shadow-sm p-6 group hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <FiCode className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Tauri 2 Architecture
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              Extremely light memory usage, native Linux IPC bridges, and robust security isolation.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-[#131926]/80 backdrop-blur-md rounded-[1.75rem] border border-slate-200/70 dark:border-slate-800 shadow-sm p-6 group hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <FiHeart className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              PixelFreight Design
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              Clean aesthetic, obsidian dark mode, glassmorphic accents, and intuitive desktop interaction tuned for daily Linux use.
            </p>
          </div>
        </div>

        {/* Upstream Attribution */}
        <div className="bg-slate-50/80 dark:bg-[#131926]/80 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5 mb-8 flex items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
              <FiInfo className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Upstream Project
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Forked and evolved from Nexus App Manager by Huzaifa
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              handleLink("https://github.com/Huzaifa-code/Nexus-App-Manager")
            }
            className="px-3.5 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
          >
            Upstream
          </button>
        </div>

        {/* Credits */}
        <div className="text-center text-slate-400 dark:text-slate-500 text-xs font-medium pb-6">
          <p>© 2026 PixelFreight • Jose Katriel. All rights reserved.</p>
          <p className="mt-1 flex items-center justify-center gap-1">
            Engineered with <FiHeart className="text-indigo-500 fill-indigo-500 w-3 h-3" /> for Linux
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
