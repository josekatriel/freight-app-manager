import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { FiHardDrive, FiPieChart, FiRefreshCw } from "react-icons/fi";
import Loader from "./Loader";
import { isTauri } from "../services/appService";

const formatBytes = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-slate-900/95 dark:bg-[#1E2738]/95 backdrop-blur-md text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700/80 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: data.payload.color }}
          />
          <span className="font-semibold">{data.name}</span>
        </div>
        <div className="font-mono text-slate-300">
          {formatBytes(data.value)}
        </div>
      </div>
    );
  }
  return null;
};

const Usage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!isTauri()) {
        try {
          const sRes = await fetch("/api/system/storage");
          if (sRes.ok) {
            const realData = await sRes.json();
            setData(realData);
            return;
          }
        } catch (_) {}
      }
      const res = await invoke("get_storage_usage");
      setData(res);
    } catch (err) {
      console.error("Failed to get storage usage:", err);
      setError("Failed to load storage details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Loader
        type="spinner"
        text="Calculating disk storage..."
        subtext="Inspecting APT, Snap, Flatpak, and root partition"
      />
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 h-full text-rose-500">
        <p className="text-sm font-semibold mb-3">{error}</p>
        <button
          onClick={fetchUsage}
          className="px-4 py-2 text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data) return null;

  const chartData = [
    { name: "APT Packages", value: data.apt, color: "#F43F5E" },
    { name: "Snap Packages", value: data.snap, color: "#F97316" },
    { name: "Flatpak Apps", value: data.flatpak, color: "#0EA5E9" },
    { name: "Other System Files", value: data.other, color: "#64748B" },
    { name: "Free Space", value: data.free, color: "#10B981" },
  ].filter((item) => item.value > 0);

  const totalUsed = data.total - data.free;
  const percentageUsed = ((totalUsed / data.total) * 100).toFixed(1);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Top Header */}
      <div className="bg-white/80 dark:bg-[#0E131F]/90 backdrop-blur-md px-8 py-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between sticky top-0 z-10 transition-colors">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/50 dark:border-indigo-800/50 flex items-center justify-center flex-shrink-0">
            <FiPieChart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Storage Usage
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Live disk space analysis across package managers on root (/)
            </p>
          </div>
        </div>

        <button
          onClick={fetchUsage}
          className="p-2 bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl shadow-xs border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
          title="Refresh storage statistics"
        >
          <FiRefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 sm:p-8 max-w-5xl mx-auto w-full flex-1">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white dark:bg-[#131926] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200/50 dark:border-sky-800/50 flex items-center justify-center flex-shrink-0">
              <FiHardDrive className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Total Disk Space
              </p>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5 font-mono">
                {formatBytes(data.total)}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#131926] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/50 dark:border-indigo-800/50 flex items-center justify-center flex-shrink-0">
              <FiPieChart className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Used Storage
              </p>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5 font-mono">
                {formatBytes(totalUsed)}{" "}
                <span className="text-xs font-normal text-slate-400">
                  ({percentageUsed}%)
                </span>
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#131926] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/50 flex items-center justify-center flex-shrink-0">
              <FiHardDrive className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Free Space
              </p>
              <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
                {formatBytes(data.free)}
              </p>
            </div>
          </div>
        </div>

        {/* Charts & Breakdown Card */}
        <div className="bg-white dark:bg-[#131926] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row transition-colors">
          <div className="p-8 md:w-1/2 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-slate-200/80 dark:border-slate-800">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 w-full text-left tracking-tight">
              Storage Distribution
            </h3>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => (
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-8 md:w-1/2 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col justify-center">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-5 tracking-tight">
              Detailed Breakdown
            </h3>
            <div className="space-y-3">
              {chartData.map((item, index) => {
                const percent = ((item.value / data.total) * 100).toFixed(1);
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-[#0E131F] p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/90 shadow-2xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xs font-mono text-slate-900 dark:text-white">
                        {formatBytes(item.value)}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                        {percent}% of disk
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Usage;
