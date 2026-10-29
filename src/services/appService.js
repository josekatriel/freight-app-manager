import { invoke } from "@tauri-apps/api/core";
import { PACKAGE_MANAGERS } from "../utils/appUtils";

export const isTauri = () => {
  return typeof window !== "undefined" && Boolean(window.__TAURI_INTERNALS__);
};

class AppService {
  async getAptApps(signal) {
    if (!isTauri()) {
      try {
        const res = await fetch("/api/system/apps?manager=apt", { signal });
        if (res.ok) return await res.json();
      } catch (err) {
        if (err.name === "AbortError") throw err;
      }
      return [];
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
      const all = await this.getAptApps(signal);
      const total = all.length;
      const apps = all.slice(offset, offset + limit);
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
      try {
        const res = await fetch("/api/system/apps?manager=snap", { signal });
        if (res.ok) return await res.json();
      } catch (err) {
        if (err.name === "AbortError") throw err;
      }
      return [];
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
      try {
        const res = await fetch("/api/system/apps?manager=flatpak", { signal });
        if (res.ok) return await res.json();
      } catch (err) {
        if (err.name === "AbortError") throw err;
      }
      return [];
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
      return `Uninstalled ${name} (simulation)`;
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
      try {
        await fetch("/api/system/apps?reload=true");
      } catch (_) {}
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
      return null;
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
