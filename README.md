# <img src="src-tauri/icons/icon.png" width="40" height="40" align="center"> Freight App Manager

[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-0.6.0-indigo.svg)](https://github.com/josekatriel/freight-app-manager/releases)
[![Tauri](https://img.shields.io/badge/built%20with-Tauri%202-blue)](https://tauri.app/)
[![React](https://img.shields.io/badge/frontend-React%2018-61dafb)](https://reactjs.org/)
[![Studio](https://img.shields.io/badge/PixelFreight-Jose%20Katriel-purple)](https://web-portfolio-omega-brown.vercel.app/)

**Freight App Manager** is a modern, high-performance Linux application and package manager crafted by **PixelFreight (Jose Katriel)**, evolved from the open-source foundation of [Nexus App Manager](https://github.com/Huzaifa-code/Nexus-App-Manager).

Built with **Tauri 2**, **Rust**, and **React**, Freight delivers a unified, blazing-fast dashboard to manage **APT**, **Snap**, and **Flatpak** applications all in one place with zero friction.

---

## ⚡ Key Features

- **Unified Package Hub**: Manage APT (Debian/Ubuntu), Snap, and Flatpak software from one unified, beautiful dashboard.
- **Sub-Millisecond Speed**: Embedded SQLite3 caching in Rust provides near-instantaneous load times (up to 10,000x faster for package queries).
- **PixelFreight Design System**: Refined desktop interface with glassmorphism, responsive cards, and an electric Freight indigo aesthetic.
- **Global Search**: Query across all enabled package managers in real-time.
- **Smart Desktop Filtering**: Automatically hides low-level library bloat to surface the real applications you care about.
- **Storage Analytics**: Built-in disk usage pie chart visualizing package footprint across your Linux drive.
- **In-App Updates**: One-click check and update for Flatpak, Snap, and APT installations.
- **Native Memory Safety**: Leverages Rust's memory guarantees and Tauri's lightweight IPC architecture.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Tailwind CSS, Vite
- **Backend**: Rust, Tauri 2
- **Data Engine**: Embedded SQLite3 (via `rusqlite`)
- **System Metrics**: `sysinfo`, `dirs`, `rayon`
- **Iconography**: React Icons (`fi`, `si`)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+) & `npm`
- [Rust & Cargo](https://www.rust-lang.org/tools/install)
- Linux GTK & WebKit development packages:
  ```bash
  sudo apt install libglib2.0-dev libgtk-3-dev libwebkit2gtk-4.1-dev libsoup-3.0-dev libjavascriptcoregtk-4.1-dev
  ```

### Installation & Development

1. Clone this repository:
   ```bash
   git clone https://github.com/josekatriel/freight-app-manager.git
   cd freight-app-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run in Vite frontend preview:
   ```bash
   npm run dev
   ```

4. Run the full Tauri desktop application:
   ```bash
   npm run tauri dev
   ```

5. Build production Linux bundle (Debian `.deb` & AppImage):
   ```bash
   npm run tauri build
   ```

---

## 📂 Documentation

- [Architecture Overview](ARCHITECTURE.md) - System design and IPC flow.
- [Development & Debugging](DEVELOPMENT.md) - Cache schema and troubleshooting guide.
- [Contributing](CONTRIBUTING.md) - Guidelines for contributing.

---

## 🤝 Attribution & Credits

- Created and maintained by **Jose Katriel** ([PixelFreight](https://web-portfolio-omega-brown.vercel.app/))
- Upstream base: [Nexus-App-Manager](https://github.com/Huzaifa-code/Nexus-App-Manager) by [Huzaifa](https://github.com/Huzaifa-code)
- Licensed under the **MIT License**.
