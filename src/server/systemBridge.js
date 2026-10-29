import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Cache to prevent re-querying every single second
let cachedApps = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 10000;

function resolveCategory(catString = "") {
  const lower = catString.toLowerCase();
  if (lower.includes("graphics") || lower.includes("2dgraphics") || lower.includes("rastergraphics") || lower.includes("vectorgraphics")) return "Graphics";
  if (lower.includes("audiovideo") || lower.includes("audio") || lower.includes("video") || lower.includes("audiovideoediting")) return "Audio & Video";
  if (lower.includes("development") || lower.includes("programming") || lower.includes("ide") || lower.includes("texteditor")) return "Development";
  if (lower.includes("office") || lower.includes("wordprocessor") || lower.includes("spreadsheet") || lower.includes("presentation")) return "Office";
  if (lower.includes("network") || lower.includes("webbrowser") || lower.includes("instantmessaging") || lower.includes("email") || lower.includes("chat")) return "Internet";
  if (lower.includes("game")) return "Games";
  if (lower.includes("system") || lower.includes("settings") || lower.includes("packagemanager")) return "System";
  return "Utilities";
}

function findIcon(iconName, baseName = "") {
  if (!iconName && !baseName) return null;
  const names = [iconName, baseName].filter(Boolean);

  for (const name of names) {
    if (name.startsWith("/") && fs.existsSync(name)) return name;

    const searchDirs = [
      "/usr/share/pixmaps",
      "/usr/share/icons/hicolor/scalable/apps",
      "/usr/share/icons/hicolor/128x128/apps",
      "/usr/share/icons/hicolor/64x64/apps",
      "/usr/share/icons/hicolor/48x48/apps",
      "/usr/share/icons/hicolor/32x32/apps",
      "/usr/share/icons/Yaru/scalable/apps",
      "/usr/share/icons/Yaru/128x128/apps",
      "/usr/share/icons/Yaru/48x48/apps",
      "/usr/share/icons/Adwaita/scalable/apps",
      "/usr/share/icons/Adwaita/128x128/apps",
      path.join(process.env.HOME || "", ".local/share/icons/hicolor/scalable/apps"),
      path.join(process.env.HOME || "", ".local/share/icons/hicolor/128x128/apps"),
      path.join(process.env.HOME || "", ".local/share/icons"),
    ];

    for (const dir of searchDirs) {
      if (!fs.existsSync(dir)) continue;
      for (const ext of ["svg", "png", "xpm", "jpg"]) {
        const full = path.join(dir, `${name}.${ext}`);
        if (fs.existsSync(full)) return full;
      }
    }
  }

  return null;
}

export function getRealAptApps() {
  const dpkgMap = new Map();
  try {
    const out = execSync(
      "dpkg-query -W -f='${Package}\t${Version}\t${Installed-Size}\t${Description}\n'",
      { encoding: "utf-8", maxBuffer: 15 * 1024 * 1024 }
    );
    for (const line of out.split("\n")) {
      const p = line.split("\t");
      if (p.length >= 4) {
        dpkgMap.set(p[0].trim(), {
          version: p[1].trim(),
          sizeKb: parseInt(p[2]) || 0,
          desc: p[3].trim(),
        });
      }
    }
  } catch (err) {
    console.error("dpkg-query warning:", err.message);
  }

  const apps = [];
  const seen = new Set();
  const dirs = [
    "/usr/share/applications",
    path.join(process.env.HOME || "", ".local/share/applications"),
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    try {
      const files = fs.readdirSync(dir);
      for (const f of files) {
        if (!f.endsWith(".desktop")) continue;
        try {
          const fullPath = path.join(dir, f);
          const content = fs.readFileSync(fullPath, "utf-8");
          let name = "",
            exec = "",
            iconName = "",
            categories = "",
            comment = "",
            noDisplay = false;

          for (const line of content.split("\n")) {
            if (line.startsWith("Name=") && !name) name = line.slice(5).trim();
            else if (line.startsWith("Exec=") && !exec) exec = line.slice(5).trim();
            else if (line.startsWith("Icon=") && !iconName) iconName = line.slice(5).trim();
            else if (line.startsWith("Categories=") && !categories) categories = line.slice(11).trim();
            else if (line.startsWith("Comment=") && !comment) comment = line.slice(8).trim();
            else if (line.startsWith("NoDisplay=true")) noDisplay = true;
          }

          if (noDisplay || !name) continue;
          const baseName = f.replace(".desktop", "");
          const key = name.toLowerCase();
          if (seen.has(key)) continue;
          seen.add(key);

          const dpkg = dpkgMap.get(baseName) || dpkgMap.get(key) || {};
          const sizeKb = dpkg.sizeKb || 0;
          const size = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : sizeKb ? `${sizeKb} KB` : "45 MB";
          const resolvedIcon = findIcon(iconName, baseName);

          // Clean exec command to get path
          const cleanExec = exec.replace(/%[uUfFdi]/g, "").trim();
          const binPath = cleanExec.split(/\s+/)[0] || `/usr/bin/${baseName}`;

          apps.push({
            name,
            pkgName: baseName,
            version: dpkg.version || "1.0.0",
            size,
            sizeBytes: sizeKb * 1024,
            path: binPath,
            description: comment || dpkg.desc || `Desktop application: ${name}`,
            manager: "apt",
            category: resolveCategory(categories),
            icon: resolvedIcon ? `/api/system/icon?path=${encodeURIComponent(resolvedIcon)}` : null,
            desktopFile: fullPath,
          });
        } catch (_) {}
      }
    } catch (_) {}
  }

  // Stable sort by application name
  apps.sort((a, b) => a.name.localeCompare(b.name));
  return apps;
}

export function getRealSnapApps() {
  try {
    const stdout = execSync("snap list --all 2>/dev/null", { encoding: "utf-8" });
    const lines = stdout.trim().split("\n");
    const apps = [];
    const seen = new Set();
    const systemSnaps = new Set([
      "core",
      "snapd",
      "core18",
      "core20",
      "core22",
      "core24",
      "core26",
      "bare",
      "gtk-common-themes",
      "gnome-42-2204",
      "gnome-46-2404",
      "kf6-core24",
      "mesa-2404",
    ]);

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(/\s+/);
      if (parts.length < 6) continue;
      const [name, version, rev, tracking, publisher, notes] = parts;
      if (systemSnaps.has(name) || notes === "disabled") continue;

      if (!seen.has(name)) {
        seen.add(name);
        const iconPath = `/snap/${name}/current/meta/gui/icon.png`;
        const hasIcon = fs.existsSync(iconPath);
        const iconUrl = hasIcon ? `/api/system/icon?path=${encodeURIComponent(iconPath)}` : null;

        apps.push({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          pkgName: name,
          version,
          size: "Snap",
          sizeBytes: 150 * 1024 * 1024,
          path: `/snap/bin/${name}`,
          description: `Snap package by ${publisher || "developer"}`,
          manager: "snap",
          category: "System",
          icon: iconUrl,
        });
      }
    }
    apps.sort((a, b) => a.name.localeCompare(b.name));
    return apps;
  } catch (_) {
    return [];
  }
}

export function getRealFlatpakApps() {
  try {
    const stdout = execSync("flatpak list --app --columns=application,version,size,description 2>/dev/null", {
      encoding: "utf-8",
    });
    const lines = stdout.trim().split("\n").filter(Boolean);
    const apps = lines.map((line) => {
      const [id, version, size, description] = line.split("\t");
      const shortName = (id || "App").split(".").pop();
      const possibleIcon = findIcon(id, shortName);

      return {
        name: shortName,
        pkgName: id,
        version: version || "latest",
        size: size || "Flatpak",
        sizeBytes: 200 * 1024 * 1024,
        path: `/var/lib/flatpak/app/${id}`,
        description: description || `Flatpak application: ${id}`,
        manager: "flatpak",
        category: "Utilities",
        icon: possibleIcon ? `/api/system/icon?path=${encodeURIComponent(possibleIcon)}` : null,
      };
    });
    apps.sort((a, b) => a.name.localeCompare(b.name));
    return apps;
  } catch (_) {
    return [];
  }
}

export function getRealStorageUsage() {
  try {
    const df = execSync("df -B1 / | tail -n 1", { encoding: "utf-8" }).trim().split(/\s+/);
    const total = parseInt(df[1], 10) || 250000000000;
    const used = parseInt(df[2], 10) || 110000000000;
    const free = parseInt(df[3], 10) || 125000000000;

    let aptSize = 0;
    try {
      const aptBytes = execSync("dpkg-query -W -f='${Installed-Size}\\n' | awk '{s+=$1} END {print s*1024}'", {
        encoding: "utf-8",
      });
      aptSize = parseInt(aptBytes.trim(), 10) || 8000000000;
    } catch (_) {
      aptSize = 8000000000;
    }

    let snapSize = 0;
    try {
      const snapBytes = execSync("du -sb /var/lib/snapd/snaps 2>/dev/null | awk '{print $1}'", { encoding: "utf-8" });
      snapSize = parseInt(snapBytes.trim(), 10) || 4000000000;
    } catch (_) {
      snapSize = 4000000000;
    }

    let flatpakSize = 0;
    try {
      const fpBytes = execSync("du -sb /var/lib/flatpak 2>/dev/null | awk '{print $1}'", { encoding: "utf-8" });
      flatpakSize = parseInt(fpBytes.trim(), 10) || 2000000000;
    } catch (_) {
      flatpakSize = 2000000000;
    }

    const other = Math.max(0, used - (aptSize + snapSize + flatpakSize));

    return {
      total,
      free,
      apt: aptSize,
      snap: snapSize,
      flatpak: flatpakSize,
      other,
    };
  } catch (_) {
    return {
      total: 250000000000,
      free: 125000000000,
      apt: 8000000000,
      snap: 4000000000,
      flatpak: 2000000000,
      other: 96000000000,
    };
  }
}

export function getAllSystemApps(forceReload = false) {
  const now = Date.now();
  if (!forceReload && cachedApps && now - lastCacheTime < CACHE_TTL_MS) {
    return cachedApps;
  }

  const apt = getRealAptApps();
  const snap = getRealSnapApps();
  const flatpak = getRealFlatpakApps();

  cachedApps = { apt, snap, flatpak };
  lastCacheTime = now;
  return cachedApps;
}
