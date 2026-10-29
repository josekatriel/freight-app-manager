import React from "react";
import { FiPackage } from "react-icons/fi";
import { SiDebian, SiSnapcraft, SiFlatpak } from "react-icons/si";

export const PACKAGE_MANAGERS = {
  APT: "apt",
  SNAP: "snap",
  FLATPAK: "flatpak",
};

export const CATEGORIES = [
  "All",
  "Graphics",
  "Audio & Video",
  "Development",
  "Office",
  "Internet",
  "System",
  "Utilities",
];

export const getManagerIcon = (manager, className = "w-5 h-5") => {
  const iconProps = { className };

  switch (manager) {
    case PACKAGE_MANAGERS.APT:
      return <SiDebian {...iconProps} className={`${className} text-[#E95420]`} />;
    case PACKAGE_MANAGERS.SNAP:
      return <SiSnapcraft {...iconProps} className={`${className} text-[#E95420]`} />;
    case PACKAGE_MANAGERS.FLATPAK:
      return <SiFlatpak {...iconProps} className={`${className} text-[#4A90E2]`} />;
    default:
      return <FiPackage {...iconProps} className={`${className} text-slate-500`} />;
  }
};

export const getDisplayName = (app) => {
  if (!app) return "";
  if (app.manager === PACKAGE_MANAGERS.FLATPAK) {
    return app.name.split(".").slice(-2).join(".");
  }
  return app.name;
};

export const getTabTitle = (tab) => {
  const titles = {
    [PACKAGE_MANAGERS.APT]: "APT Packages",
    [PACKAGE_MANAGERS.SNAP]: "Snap Packages",
    [PACKAGE_MANAGERS.FLATPAK]: "Flatpak Applications",
  };
  return titles[tab] || "Applications";
};

export const requiresPassword = (manager) => {
  return manager === PACKAGE_MANAGERS.APT || manager === PACKAGE_MANAGERS.SNAP;
};

export const parseSizeInBytes = (sizeStr) => {
  if (!sizeStr) return 0;
  const match = sizeStr.toString().trim().match(/([\d.]+)\s*([KkMmGgTt]?[Bb])/);
  if (!match) return 0;
  const num = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  if (unit.startsWith("G")) return num * 1024 * 1024 * 1024;
  if (unit.startsWith("M")) return num * 1024 * 1024;
  if (unit.startsWith("K")) return num * 1024;
  return num;
};

export const filterApps = (apps = [], searchQuery = "") => {
  if (!searchQuery.trim()) {
    return apps;
  }

  const query = searchQuery.toLowerCase().trim();
  return apps.filter(
    (app) =>
      app.name?.toLowerCase().includes(query) ||
      app.pkgName?.toLowerCase().includes(query) ||
      app.description?.toLowerCase().includes(query) ||
      app.path?.toLowerCase().includes(query) ||
      app.category?.toLowerCase().includes(query)
  );
};

export const filterAndSortApps = (
  apps = [],
  searchQuery = "",
  selectedCategory = "All",
  sortBy = "name-asc"
) => {
  let result = filterApps(apps, searchQuery);

  if (selectedCategory && selectedCategory !== "All") {
    result = result.filter(
      (app) =>
        app.category === selectedCategory ||
        (selectedCategory === "Utilities" && !app.category)
    );
  }

  const sorted = [...result];
  switch (sortBy) {
    case "name-asc":
      sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      break;
    case "name-desc":
      sorted.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
      break;
    case "size-desc":
      sorted.sort(
        (a, b) =>
          (b.sizeBytes || parseSizeInBytes(b.size)) -
          (a.sizeBytes || parseSizeInBytes(a.size))
      );
      break;
    case "size-asc":
      sorted.sort(
        (a, b) =>
          (a.sizeBytes || parseSizeInBytes(a.size)) -
          (b.sizeBytes || parseSizeInBytes(b.size))
      );
      break;
    default:
      sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }

  return sorted;
};

export const filterAppsByManager = (apps, managers) => {
  if (!managers || managers.length === 0) {
    return apps;
  }
  return apps.filter((app) => managers.includes(app.manager));
};
