use crate::models::AppInfo;
use crate::utils::shell;
use std::fs;
use std::path::Path;

const SYSTEM_SNAPS: &[&str] = &[
    "core", "snapd", "core18", "core20", "core22", "core24", "core26", "bare",
    "gtk-common-themes", "gnome-42-2204", "gnome-46-2404", "kf6-core24", "mesa-2404",
];

fn is_system_snap(name: &str) -> bool {
    SYSTEM_SNAPS.contains(&name)
}

fn find_snap_icon(name: &str) -> Option<String> {
    // 1. Search /var/lib/snapd/desktop/applications/<name>_*.desktop
    let desktop_dir = Path::new("/var/lib/snapd/desktop/applications");
    if let Ok(entries) = fs::read_dir(desktop_dir) {
        for entry in entries.flatten() {
            let file_name = entry.file_name();
            let file_name_str = file_name.to_string_lossy();
            if file_name_str.starts_with(&format!("{}_", name)) && file_name_str.ends_with(".desktop") {
                if let Ok(content) = fs::read_to_string(entry.path()) {
                    for line in content.lines() {
                        if line.starts_with("Icon=") {
                            let icon_val = line.strip_prefix("Icon=").unwrap_or("").trim();
                            if !icon_val.is_empty() && Path::new(icon_val).exists() {
                                return Some(icon_val.to_string());
                            }
                        }
                    }
                }
            }
        }
    }

    // 2. Search /snap/<name>/current/meta/gui/
    let gui_dir = Path::new(&format!("/snap/{}/current/meta/gui", name));
    if let Ok(entries) = fs::read_dir(gui_dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if let Some(ext) = path.extension().and_then(|e| e.to_str()) {
                if ext == "png" || ext == "svg" {
                    return Some(path.to_string_lossy().to_string());
                }
            }
        }
    }

    None
}

pub fn get_snap_apps() -> Result<Vec<AppInfo>, String> {
    let output = shell::run_command("snap", &["list", "--all"])?;

    let mut apps = Vec::new();
    let mut seen = std::collections::HashSet::new();

    for (i, line) in output.lines().enumerate() {
        if i == 0 {
            continue;
        }

        let parts: Vec<&str> = line.split_whitespace().collect();

        if parts.len() < 6 {
            continue;
        }

        let name = parts[0];
        let rev = parts[2];

        if is_system_snap(name) {
            continue;
        }

        let status = parts[5];
        if status == "disabled" || status == "removed" {
            continue;
        }

        if !seen.contains(name) {
            seen.insert(name.to_string());

            let snap_file = format!("/var/lib/snapd/snaps/{}_{}.snap", name, rev);
            let size = if let Ok(metadata) = std::fs::metadata(&snap_file) {
                let bytes = metadata.len();
                if bytes > 1024 * 1024 {
                    format!("{} MB", bytes / (1024 * 1024))
                } else {
                    format!("{} KB", bytes / 1024)
                }
            } else {
                "Snap".to_string()
            };

            let icon = find_snap_icon(name);

            apps.push(AppInfo {
                name: name.to_string(),
                version: parts[1].to_string(),
                size,
                path: format!("/snap/{}", name),
                description: format!("Snap package: {}", name),
                manager: "snap".to_string(),
                homepage: None,
                icon,
            });
        }
    }

    Ok(apps)
}
