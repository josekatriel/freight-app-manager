import { invoke } from "@tauri-apps/api/core";
import { PACKAGE_MANAGERS } from "../utils/appUtils";

export const isTauri = () => {
  return typeof window !== "undefined" && Boolean(window.__TAURI_INTERNALS__);
};

const MOCK_APT_APPS = [
  { name: "firefox", version: "138.0.2-1", size: "245 MB", path: "/usr/bin/firefox", description: "Mozilla Firefox Web Browser", manager: "apt" },
  { name: "vlc", version: "3.0.21-2", size: "112 MB", path: "/usr/bin/vlc", description: "VLC media player, the open source multimedia player", manager: "apt" },
  { name: "gimp", version: "2.10.38-1", size: "186 MB", path: "/usr/bin/gimp", description: "GNU Image Manipulation Program for photo retouching and image composition", manager: "apt" },
  { name: "neovim", version: "0.10.4-1", size: "38 MB", path: "/usr/bin/nvim", description: "Vim-fork focused on extensibility and modern terminal usability", manager: "apt" },
  { name: "git", version: "2.48.1-1", size: "44 MB", path: "/usr/bin/git", description: "Fast, scalable, distributed revision control system", manager: "apt" },
  { name: "htop", version: "3.3.0-2", size: "3.2 MB", path: "/usr/bin/htop", description: "Interactive process viewer and system process manager", manager: "apt" },
  { name: "alacritty", version: "0.14.0-1", size: "28 MB", path: "/usr/bin/alacritty", description: "A fast, cross-platform, GPU-accelerated terminal emulator", manager: "apt" },
  { name: "tmux", version: "3.5a-1", size: "5.1 MB", path: "/usr/bin/tmux", description: "Terminal multiplexer with split panes and detached sessions", manager: "apt" },
  { name: "ripgrep", version: "14.1.1-1", size: "12 MB", path: "/usr/bin/rg", description: "Fast line-oriented search tool combining grep speed with modern features", manager: "apt" },
  { name: "btop", version: "1.4.0-1", size: "9.4 MB", path: "/usr/bin/btop", description: "Resource monitor that shows usage and stats for processor, memory, disks", manager: "apt" },
];

const MOCK_SNAP_APPS = [
  { name: "code", version: "1.96.2", size: "380 MB", path: "/snap/bin/code", description: "Visual Studio Code - Code editing. Redefined.", manager: "snap" },
  { name: "spotify", version: "1.2.53.440", size: "220 MB", path: "/snap/bin/spotify", description: "Spotify music streaming service desktop client", manager: "snap" },
  { name: "discord", version: "0.0.82", size: "190 MB", path: "/snap/bin/discord", description: "All-in-one voice and text chat for gamers and communities", manager: "snap" },
  { name: "slack", version: "4.41.96", size: "260 MB", path: "/snap/bin/slack", description: "Slack brings team communication and collaboration into one place", manager: "snap" },
  { name: "postman", version: "11.23.0", size: "340 MB", path: "/snap/bin/postman", description: "Comprehensive API platform for building and testing APIs", manager: "snap" },
];

const MOCK_FLATPAK_APPS = [
  { name: "md.obsidian.Obsidian", version: "1.8.4", size: "210 MB", path: "/var/lib/flatpak/app/md.obsidian.Obsidian", description: "Obsidian is a powerful knowledge base on top of local plain text Markdown files", manager: "flatpak" },
  { name: "org.blender.Blender", version: "4.3.2", size: "680 MB", path: "/var/lib/flatpak/app/org.blender.Blender", description: "Free and open source 3D creation suite supporting modeling, rigging, animation", manager: "flatpak" },
  { name: "org.inkscape.Inkscape", version: "1.4.1", size: "320 MB", path: "/var/lib/flatpak/app/org.inkscape.Inkscape", description: "Professional vector graphics editor for Linux, Windows and macOS", manager: "flatpak" },
  { name: "org.telegram.desktop", version: "5.10.3", size: "140 MB", path: "/var/lib/flatpak/app/org.telegram.desktop", description: "Telegram Desktop messaging application", manager: "flatpak" },
  { name: "org.kde.krita", version: "5.2.6", size: "410 MB", path: "/var/lib/flatpak/app/org.kde.krita", description: "Digital painting and 2D illustration program for concept artists and illustrators", manager: "flatpak" },
];

let mockState = {
  apt: [...MOCK_APT_APPS],
  snap: [...MOCK_SNAP_APPS],
  flatpak: [...MOCK_FLATPAK_APPS],
};

class AppService {
  async getAptApps(signal) {
    if (!isTauri()) {
      if (signal?.aborted) throw new Error("Request aborted");
      await new Promise((r) => setTimeout(r, 120));
      return [...mockState.apt];
    }
    try {
      if (signal?.aborted) throw new Error("Request aborted");
      return await invoke("get_apt_apps");
    } catch (error) {
      if (error.message !== "Request aborted") {
        console.error("Error loading APT apps:", error);
        throw new Error("Failed to load APT packages");
      }
      throw error;
    }
  }

  async getAptAppsPage(offset, limit, signal) {
    if (!isTauri()) {
      if (signal?.aborted) throw new Error("Request aborted");
      await new Promise((r) => setTimeout(r, 100));
      const total = mockState.apt.length;
      const apps = mockState.apt.slice(offset, offset + limit);
      return { apps, total };
    }
    try {
      if (signal?.aborted) throw new Error("Request aborted");
      return await invoke("get_apt_apps_page", { offset, limit });
    } catch (error) {
      if (error.message !== "Request aborted") {
        console.error("Error loading APT apps (paged):", error);
        throw new Error("Failed to load APT packages (paged)");
      }
      throw error;
    }
  }

  async getSnapApps(signal) {
    if (!isTauri()) {
      if (signal?.aborted) throw new Error("Request aborted");
      await new Promise((r) => setTimeout(r, 120));
      return [...mockState.snap];
    }
    try {
      if (signal?.aborted) throw new Error("Request aborted");
      return await invoke("get_snap_apps");
    } catch (error) {
      if (error.message !== "Request aborted") {
        console.error("Error loading Snap apps:", error);
        throw new Error("Failed to load Snap packages");
      }
      throw error;
    }
  }

  async getFlatpakApps(signal) {
    if (!isTauri()) {
      if (signal?.aborted) throw new Error("Request aborted");
      await new Promise((r) => setTimeout(r, 120));
      return [...mockState.flatpak];
    }
    try {
      if (signal?.aborted) throw new Error("Request aborted");
      return await invoke("get_flatpak_apps");
    } catch (error) {
      if (error.message !== "Request aborted") {
        console.error("Error loading Flatpak apps:", error);
        throw new Error("Failed to load Flatpak applications");
      }
      throw error;
    }
  }

  async getAppsByManager(manager, signal) {
    switch (manager) {
      case PACKAGE_MANAGERS.APT:
        return await this.getAptApps(signal);
      case PACKAGE_MANAGERS.SNAP:
        return await this.getSnapApps(signal);
      case PACKAGE_MANAGERS.FLATPAK:
        return await this.getFlatpakApps(signal);
      default:
        throw new Error(`Unknown package manager: ${manager}`);
    }
  }

  async getAppsPageByManager(manager, offset, limit, signal) {
    switch (manager) {
      case PACKAGE_MANAGERS.APT:
        return await this.getAptAppsPage(offset, limit, signal);
      case PACKAGE_MANAGERS.SNAP: {
        const all = await this.getSnapApps(signal);
        const total = all.length;
        const apps = all.slice(offset, offset + limit);
        return { apps, total };
      }
      case PACKAGE_MANAGERS.FLATPAK: {
        const all = await this.getFlatpakApps(signal);
        const total = all.length;
        const apps = all.slice(offset, offset + limit);
        return { apps, total };
      }
      default:
        throw new Error(`Unknown package manager: ${manager}`);
    }
  }

  async uninstallApp(name, manager) {
    if (!isTauri()) {
      await new Promise((r) => setTimeout(r, 400));
      if (mockState[manager]) {
        mockState[manager] = mockState[manager].filter((a) => a.name !== name);
      }
      return `Uninstalled ${name}`;
    }
    try {
      return await invoke("uninstall_app", { name, manager });
    } catch (error) {
      console.error("Error uninstalling app:", error);
      throw error;
    }
  }

  async getCachedApps(manager) {
    if (!isTauri()) return null;
    try {
      return await invoke("get_cached_apps", { manager });
    } catch (error) {
      console.error("Error loading cached apps:", error);
      return null;
    }
  }

  async saveCache(manager, apps) {
    if (!isTauri()) return;
    try {
      return await invoke("save_apps_cache", { manager, apps });
    } catch (error) {
      console.error("Error saving cache:", error);
    }
  }

  async clearCache(manager = null) {
    if (!isTauri()) {
      mockState = {
        apt: [...MOCK_APT_APPS],
        snap: [...MOCK_SNAP_APPS],
        flatpak: [...MOCK_FLATPAK_APPS],
      };
      return;
    }
    try {
      return await invoke("clear_cache", { manager });
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }

  async openPath(path) {
    if (!isTauri()) {
      console.log("Mock openPath:", path);
      return;
    }
    try {
      return await invoke("open_path", { path });
    } catch (error) {
      console.error("Error opening path:", error);
    }
  }

  async checkAppUpdate(name, manager) {
    if (!isTauri()) {
      await new Promise((r) => setTimeout(r, 300));
      return "v2.0.0-latest";
    }
    try {
      return await invoke("check_app_update", { name, manager });
    } catch (error) {
      console.error("Error checking app update:", error);
      throw error;
    }
  }

  async updateApp(name, manager) {
    if (!isTauri()) {
      await new Promise((r) => setTimeout(r, 500));
      return `Updated ${name}`;
    }
    try {
      return await invoke("update_app", { name, manager });
    } catch (error) {
      console.error("Error updating app:", error);
      throw error;
    }
  }
}

export default new AppService();
