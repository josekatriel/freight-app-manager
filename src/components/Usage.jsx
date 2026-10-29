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
      <div className="bg-[var(--frasto-surface)] text-[var(--frasto-ink)] text-xs px-3 py-2 border border-[var(--frasto-border-strong)] shadow-none">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="size-2 shrink-0"
            style={{ backgroundColor: data.payload.color }}
          />
          <span className="font-semibold">{data.name}</span>
        </div>
        <div className="font-mono text-[var(--frasto-ink-muted)]">
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
      <div className="flex-1 flex flex-col items-center justify-center p-8 h-full text-[var(--frasto-danger)]">
        <p className="text-xs font-semibold mb-3">{error}</p>
        <button
          onClick={fetchUsage}
          className="h-8 px-3 text-xs font-medium border border-[var(--frasto-border)] bg-[var(--frasto-surface)] text-[var(--frasto-ink)] hover:bg-[var(--frasto-surface-subtle)]"
        >
          Retry Inspection
        </button>
      </div>
    );
  }

  if (!data) return null;

  const chartData = [
    { name: "APT Packages", value: data.apt, color: "#991B1B" },
    { name: "Snap Packages", value: data.snap, color: "#92400E" },
    { name: "Flatpak Apps", value: data.flatpak, color: "#315B70" },
    { name: "Other System Files", value: data.other, color: "#66645F" },
    { name: "Free Space", value: data.free, color: "#166534" },
  ].filter((item) => item.value > 0);

  const totalUsed = data.total - data.free;
  const percentageUsed = ((totalUsed / data.total) * 100).toFixed(1);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Top Header */}
      <div className="bg-[var(--frasto-bg)] px-8 py-5 border-b border-[var(--frasto-border)] flex items-center justify-between sticky top-0 z-10 transition-colors">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-[var(--frasto-surface-subtle)] border border-[var(--frasto-border)] flex items-center justify-center flex-shrink-0">
            <FiPieChart className="w-4 h-4 text-[var(--frasto-ink)]" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-display text-[var(--frasto-ink)] tracking-tight">
              Storage Usage
            </h2>
            <p className="text-xs text-[var(--frasto-ink-muted)]">
              Real disk footprint inspection across system packaging roots
            </p>
          </div>
        </div>

        <button
          onClick={fetchUsage}
          className="p-2 bg-[var(--frasto-surface)] hover:bg-[var(--frasto-surface-subtle)] border border-[var(--frasto-border)] text-[var(--frasto-ink)] transition-colors"
          title="Refresh storage statistics"
        >
          <FiRefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-6 sm:p-8 max-w-5xl mx-auto w-full flex-1">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[var(--frasto-surface)] p-5 border border-[var(--frasto-border)] flex items-center gap-4">
            <div className="size-10 bg-[var(--frasto-surface-subtle)] border border-[var(--frasto-border)] flex items-center justify-center flex-shrink-0">
              <FiHardDrive className="w-5 h-5 text-[var(--frasto-ink)]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--frasto-ink-muted)] uppercase tracking-wider">
                Total Disk Space
              </p>
              <p className="text-lg font-extrabold font-mono text-[var(--frasto-ink)] mt-0.5">
                {formatBytes(data.total)}
              </p>
            </div>
          </div>

          <div className="bg-[var(--frasto-surface)] p-5 border border-[var(--frasto-border)] flex items-center gap-4">
            <div className="size-10 bg-[var(--frasto-surface-subtle)] border border-[var(--frasto-border)] flex items-center justify-center flex-shrink-0">
              <FiPieChart className="w-5 h-5 text-[var(--frasto-ink)]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--frasto-ink-muted)] uppercase tracking-wider">
                Used Storage
              </p>
              <p className="text-lg font-extrabold font-mono text-[var(--frasto-ink)] mt-0.5">
                {formatBytes(totalUsed)}{" "}
                <span className="text-xs font-normal text-[var(--frasto-ink-muted)]">
                  ({percentageUsed}%)
                </span>
              </p>
            </div>
          </div>

          <div className="bg-[var(--frasto-surface)] p-5 border border-[var(--frasto-border)] flex items-center gap-4">
            <div className="size-10 bg-[var(--frasto-surface-subtle)] border border-[var(--frasto-border)] flex items-center justify-center flex-shrink-0">
              <FiHardDrive className="w-5 h-5 text-[var(--frasto-positive)]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--frasto-ink-muted)] uppercase tracking-wider">
                Free Space
              </p>
              <p className="text-lg font-extrabold font-mono text-[var(--frasto-positive)] mt-0.5">
                {formatBytes(data.free)}
              </p>
            </div>
          </div>
        </div>

        {/* Charts & Breakdown */}
        <div className="bg-[var(--frasto-surface)] border border-[var(--frasto-border)] overflow-hidden flex flex-col md:flex-row">
          <div className="p-6 md:w-1/2 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-[var(--frasto-border)]">
            <h3 className="text-xs font-bold text-[var(--frasto-ink-muted)] uppercase tracking-wider mb-4 w-full text-left">
              Disk Distribution
            </h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={2}
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
                    iconType="square"
                    formatter={(value) => (
                      <span className="text-[11px] text-[var(--frasto-ink)] font-medium">
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 md:w-1/2 bg-[var(--frasto-surface-subtle)] flex flex-col justify-center">
            <h3 className="text-xs font-bold text-[var(--frasto-ink-muted)] uppercase tracking-wider mb-4">
              Detailed Breakdown
            </h3>
            <div className="space-y-2">
              {chartData.map((item, index) => {
                const percent = ((item.value / data.total) * 100).toFixed(1);
                return (
                  <div
                    key={index}
                    className="bg-[var(--frasto-surface)] p-3 border border-[var(--frasto-border)] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="size-2 shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium text-xs text-[var(--frasto-ink)]">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xs font-mono text-[var(--frasto-ink)]">
                        {formatBytes(item.value)}
                      </div>
                      <div className="text-[10px] text-[var(--frasto-ink-soft)] font-mono">
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
