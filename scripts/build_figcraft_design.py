import json
import subprocess
import os

def generate_commands():
    cmds = []
    
    # Track steps to use with {"$step": n}
    def add_cmd(cmd, params):
        idx = len(cmds)
        cmds.append({"command": cmd, "params": params})
        return idx

    # 1. Variables & Token Collection
    add_cmd("variable.createCollection", {
        "name": "Frasto UI Tokens",
        "modes": ["Light", "Dark"]
    })

    tokens = [
        ("color/bg", "color", {"Light": "#F4F1EA", "Dark": "#11110F"}),
        ("color/surface", "color", {"Light": "#FFFFFF", "Dark": "#181816"}),
        ("color/surface-subtle", "color", {"Light": "#ECE9E2", "Dark": "#22221F"}),
        ("color/ink", "color", {"Light": "#111111", "Dark": "#F4F1EA"}),
        ("color/ink-muted", "color", {"Light": "#66645F", "Dark": "#B8B4AA"}),
        ("color/ink-soft", "color", {"Light": "#8A8882", "Dark": "#8F8B83"}),
        ("color/border", "color", {"Light": "#D7D3CA", "Dark": "#34332F"}),
        ("color/border-strong", "color", {"Light": "#B9B5AC", "Dark": "#504E48"}),
        ("color/positive", "color", {"Light": "#166534", "Dark": "#86B991"}),
        ("color/warning", "color", {"Light": "#92400E", "Dark": "#D2A46F"}),
        ("color/danger", "color", {"Light": "#991B1B", "Dark": "#D98A86"}),
        ("color/info", "color", {"Light": "#315B70", "Dark": "#8AB4C7"}),
    ]

    for name, vtype, values in tokens:
        add_cmd("variable.create", {
            "collection": "Frasto UI Tokens",
            "name": name,
            "type": vtype,
            "values": values
        })

    def build_artboard(name, ox, oy, is_dark=False):
        bg = "#11110F" if is_dark else "#F4F1EA"
        surface = "#181816" if is_dark else "#FFFFFF"
        subtle = "#22221F" if is_dark else "#ECE9E2"
        ink = "#F4F1EA" if is_dark else "#111111"
        ink_muted = "#B8B4AA" if is_dark else "#66645F"
        ink_soft = "#8F8B83" if is_dark else "#8A8882"
        border = "#34332F" if is_dark else "#D7D3CA"
        border_strong = "#504E48" if is_dark else "#B9B5AC"
        positive = "#86B991" if is_dark else "#166534"
        info = "#8AB4C7" if is_dark else "#315B70"
        danger = "#D98A86" if is_dark else "#991B1B"

        # Artboard Frame
        artboard_step = add_cmd("node.create", {
            "type": "frame",
            "name": name,
            "x": ox,
            "y": oy,
            "width": 1440,
            "height": 900,
            "props": {"fill": bg}
        })
        artboard_ref = {"$step": artboard_step}

        # ----------------------------------------------------
        # 1. Global Shell Header (y: 0 to 52)
        # ----------------------------------------------------
        add_cmd("node.create", {
            "type": "rectangle",
            "name": "HeaderBG",
            "parent": artboard_ref,
            "x": 0, "y": 0, "width": 1440, "height": 52,
            "props": {"fill": bg, "stroke": border, "strokeWeight": 1}
        })

        # Brand Lockup
        add_cmd("node.create", {
            "type": "rectangle",
            "name": "BrandMark",
            "parent": artboard_ref,
            "x": 20, "y": 14, "width": 24, "height": 24,
            "props": {"fill": ink, "stroke": border_strong, "strokeWeight": 1}
        })
        add_cmd("node.create", {
            "type": "text",
            "name": "BrandTitle",
            "parent": artboard_ref,
            "x": 52, "y": 12,
            "text": "Freight",
            "props": {"fontSize": 15, "fill": ink, "fontFamily": "Inter", "fontStyle": "bold"}
        })
        add_cmd("node.create", {
            "type": "text",
            "name": "BrandSubtitle",
            "parent": artboard_ref,
            "x": 52, "y": 28,
            "text": "APP MANAGER",
            "props": {"fontSize": 9, "fill": ink_muted, "fontFamily": "Inter", "fontStyle": "normal"}
        })

        # IPC Status Indicator
        add_cmd("node.create", {
            "type": "rectangle",
            "name": "StatusDot",
            "parent": artboard_ref,
            "x": 150, "y": 23, "width": 6, "height": 6,
            "props": {"fill": positive}
        })
        add_cmd("node.create", {
            "type": "text",
            "name": "StatusLabel",
            "parent": artboard_ref,
            "x": 162, "y": 20,
            "text": "Host Connected",
            "props": {"fontSize": 11, "fill": positive, "fontFamily": "Inter"}
        })

        # Search Bar
        add_cmd("node.create", {
            "type": "rectangle",
            "name": "SearchInput",
            "parent": artboard_ref,
            "x": 420, "y": 9, "width": 460, "height": 34,
            "props": {"fill": surface, "stroke": border, "strokeWeight": 1}
        })
        add_cmd("node.create", {
            "type": "text",
            "name": "SearchPlaceholder",
            "parent": artboard_ref,
            "x": 436, "y": 18,
            "text": "Search packages across APT, Snap, Flatpak...",
            "props": {"fontSize": 12, "fill": ink_soft, "fontFamily": "Inter"}
        })
        # Kbd shortcut
        add_cmd("node.create", {
            "type": "rectangle",
            "name": "SearchKbd",
            "parent": artboard_ref,
            "x": 850, "y": 16, "width": 20, "height": 20,
            "props": {"fill": subtle, "stroke": border, "strokeWeight": 1}
        })
        add_cmd("node.create", {
            "type": "text",
            "name": "SearchKbdText",
            "parent": artboard_ref,
            "x": 856, "y": 20,
            "text": "/",
            "props": {"fontSize": 11, "fill": ink_muted, "fontFamily": "Inter"}
        })

        # Header Right Controls
        # View Mode Toggle (Grid/Table)
        add_cmd("node.create", {
            "type": "rectangle",
            "name": "ViewToggleFrame",
            "parent": artboard_ref,
            "x": 1050, "y": 11, "width": 68, "height": 30,
            "props": {"fill": subtle, "stroke": border, "strokeWeight": 1}
        })
        add_cmd("node.create", {
            "type": "rectangle",
            "name": "ViewToggleActive",
            "parent": artboard_ref,
            "x": 1052, "y": 13, "width": 32, "height": 26,
            "props": {"fill": surface, "stroke": border, "strokeWeight": 1}
        })
        add_cmd("node.create", {
            "type": "text",
            "name": "ViewGridLabel",
            "parent": artboard_ref,
            "x": 1060, "y": 20,
            "text": "▦",
            "props": {"fontSize": 12, "fill": ink}
        })
        add_cmd("node.create", {
            "type": "text",
            "name": "ViewTableLabel",
            "parent": artboard_ref,
            "x": 1094, "y": 20,
            "text": "▤",
            "props": {"fontSize": 12, "fill": ink_muted}
        })

        # Theme Switch Button
        add_cmd("node.create", {
            "type": "rectangle",
            "name": "ThemeToggle",
            "parent": artboard_ref,
            "x": 1128, "y": 11, "width": 90, "height": 30,
            "props": {"fill": surface, "stroke": border, "strokeWeight": 1}
        })
        add_cmd("node.create", {
            "type": "text",
            "name": "ThemeLabel",
            "parent": artboard_ref,
            "x": 1140, "y": 20,
            "text": "☀ Light" if is_dark else "☾ Dark",
            "props": {"fontSize": 11, "fill": ink, "fontFamily": "Inter"}
        })

        # Count Pill
        add_cmd("node.create", {
            "type": "rectangle",
            "name": "CountPill",
            "parent": artboard_ref,
            "x": 1228, "y": 11, "width": 192, "height": 30,
            "props": {"fill": subtle, "stroke": border, "strokeWeight": 1}
        })
        add_cmd("node.create", {
            "type": "text",
            "name": "CountText",
            "parent": artboard_ref,
            "x": 1238, "y": 20,
            "text": "56 APT · 14 Snap · 1 Flatpak",
            "props": {"fontSize": 11, "fill": ink_muted, "fontFamily": "Inter"}
        })

        # ----------------------------------------------------
        # 2. Sidebar Navigation (x: 0 to 220, y: 52 to 900)
        # ----------------------------------------------------
        add_cmd("node.create", {
            "type": "rectangle",
            "name": "SidebarBG",
            "parent": artboard_ref,
            "x": 0, "y": 52, "width": 220, "height": 848,
            "props": {"fill": subtle, "stroke": border, "strokeWeight": 1}
        })

        # Section 1: Package Sources
        add_cmd("node.create", {
            "type": "text",
            "name": "SidebarSection1",
            "parent": artboard_ref,
            "x": 20, "y": 74,
            "text": "PACKAGE SOURCES",
            "props": {"fontSize": 10, "fill": ink_muted, "fontFamily": "Inter", "fontStyle": "bold"}
        })

        # Sidebar Items
        # Item 1: APT (Active)
        add_cmd("node.create", {
            "type": "rectangle",
            "name": "ItemAPT_BG",
            "parent": artboard_ref,
            "x": 12, "y": 94, "width": 196, "height": 34,
            "props": {"fill": ink, "stroke": ink, "strokeWeight": 1}
        })
        add_cmd("node.create", {
            "type": "text",
            "name": "ItemAPT_Text",
            "parent": artboard_ref,
            "x": 24, "y": 104,
            "text": "APT Packages",
            "props": {"fontSize": 12, "fill": bg, "fontFamily": "Inter", "fontStyle": "bold"}
        })
        add_cmd("node.create", {
            "type": "text",
            "name": "ItemAPT_Count",
            "parent": artboard_ref,
            "x": 178, "y": 104,
            "text": "56",
            "props": {"fontSize": 11, "fill": bg, "fontFamily": "Inter"}
        })

        # Item 2: Snap
        add_cmd("node.create", {
            "type": "text",
            "name": "ItemSnap_Text",
            "parent": artboard_ref,
            "x": 24, "y": 144,
            "text": "Snap Packages",
            "props": {"fontSize": 12, "fill": ink, "fontFamily": "Inter"}
        })
        add_cmd("node.create", {
            "type": "text",
            "name": "ItemSnap_Count",
            "parent": artboard_ref,
            "x": 178, "y": 144,
            "text": "14",
            "props": {"fontSize": 11, "fill": ink_muted, "fontFamily": "Inter"}
        })

        # Item 3: Flatpak
        add_cmd("node.create", {
            "type": "text",
            "name": "ItemFlatpak_Text",
            "parent": artboard_ref,
            "x": 24, "y": 180,
            "text": "Flatpak Apps",
            "props": {"fontSize": 12, "fill": ink, "fontFamily": "Inter"}
        })
        add_cmd("node.create", {
            "type": "text",
            "name": "ItemFlatpak_Count",
            "parent": artboard_ref,
            "x": 184, "y": 180,
            "text": "1",
            "props": {"fontSize": 11, "fill": ink_muted, "fontFamily": "Inter"}
        })

        # Separator line
        add_cmd("node.create", {
            "type": "rectangle",
            "name": "SidebarDivider",
            "parent": artboard_ref,
            "x": 16, "y": 216, "width": 188, "height": 1,
            "props": {"fill": border}
        })

        # Section 2: System & Info
        add_cmd("node.create", {
            "type": "text",
            "name": "SidebarSection2",
            "parent": artboard_ref,
            "x": 20, "y": 234,
            "text": "SYSTEM & ANALYSIS",
            "props": {"fontSize": 10, "fill": ink_muted, "fontFamily": "Inter", "fontStyle": "bold"}
        })

        add_cmd("node.create", {
            "type": "text",
            "name": "ItemUsage_Text",
            "parent": artboard_ref,
            "x": 24, "y": 256,
            "text": "Storage Usage",
            "props": {"fontSize": 12, "fill": ink, "fontFamily": "Inter"}
        })

        add_cmd("node.create", {
            "type": "text",
            "name": "ItemAbout_Text",
            "parent": artboard_ref,
            "x": 24, "y": 292,
            "text": "About Freight",
            "props": {"fontSize": 12, "fill": ink, "fontFamily": "Inter"}
        })

        # Sidebar footer
        add_cmd("node.create", {
            "type": "text",
            "name": "SidebarFooter",
            "parent": artboard_ref,
            "x": 20, "y": 864,
            "text": "v0.6.0 · Frasto Design",
            "props": {"fontSize": 10, "fill": ink_soft, "fontFamily": "Inter"}
        })

        # ----------------------------------------------------
        # 3. Main Workspace (x: 220 to 1440)
        # ----------------------------------------------------
        # Workspace Subheader
        add_cmd("node.create", {
            "type": "text",
            "name": "WorkspaceTitle",
            "parent": artboard_ref,
            "x": 256, "y": 80,
            "text": "APT Packages",
            "props": {"fontSize": 20, "fill": ink, "fontFamily": "Inter", "fontStyle": "bold"}
        })
        add_cmd("node.create", {
            "type": "text",
            "name": "WorkspaceSubtitle",
            "parent": artboard_ref,
            "x": 256, "y": 106,
            "text": "Active Debian desktop applications installed on local disk",
            "props": {"fontSize": 12, "fill": ink_muted, "fontFamily": "Inter"}
        })

        # Category Filter Bar (Tabs)
        categories = ["All (56)", "Development (12)", "Internet (6)", "Games (4)", "Media (8)", "Utilities (24)", "System (2)"]
        cx = 256
        for i, cat in enumerate(categories):
            is_first = (i == 0)
            tab_w = len(cat) * 7 + 18
            add_cmd("node.create", {
                "type": "rectangle",
                "name": f"Tab_{i}",
                "parent": artboard_ref,
                "x": cx, "y": 136, "width": tab_w, "height": 28,
                "props": {
                    "fill": ink if is_first else surface,
                    "stroke": ink if is_first else border,
                    "strokeWeight": 1
                }
            })
            add_cmd("node.create", {
                "type": "text",
                "name": f"TabText_{i}",
                "parent": artboard_ref,
                "x": cx + 9, "y": 144,
                "text": cat,
                "props": {
                    "fontSize": 11,
                    "fill": bg if is_first else ink,
                    "fontFamily": "Inter",
                    "fontStyle": "bold" if is_first else "normal"
                }
            })
            cx += tab_w + 6

        # Sort Dropdown
        add_cmd("node.create", {
            "type": "rectangle",
            "name": "SortBtn",
            "parent": artboard_ref,
            "x": 1280, "y": 136, "width": 132, "height": 28,
            "props": {"fill": surface, "stroke": border, "strokeWeight": 1}
        })
        add_cmd("node.create", {
            "type": "text",
            "name": "SortText",
            "parent": artboard_ref,
            "x": 1290, "y": 144,
            "text": "Name (A → Z) ▾",
            "props": {"fontSize": 11, "fill": ink, "fontFamily": "Inter"}
        })

        # ----------------------------------------------------
        # 4. App Cards Specimen Grid (3 columns x 2 rows)
        # ----------------------------------------------------
        cards_data = [
            ("Aseprite", "v1.3.7", "84 MB", "Graphics", "Animated sprite editor and pixel art painting studio", "/usr/bin/aseprite", info),
            ("Brave Browser", "v1.68.128", "312 MB", "Internet", "Fast, privacy-oriented web browser with built-in ad block", "/snap/bin/brave", positive),
            ("Visual Studio Code", "v1.94.0", "248 MB", "Development", "Code editing redefined for cloud and container workflows", "/snap/bin/code", info),
            ("Discord", "v0.0.58", "190 MB", "Internet", "All-in-one voice and text chat community platform", "/usr/bin/discord", positive),
            ("FigCraft", "v0.8.2", "46 MB", "Development", "Native Rust interface engineering and design system tool", "/usr/bin/figcraft", info),
            ("Steam", "v1.0.0.79", "68 MB", "Games", "Digital entertainment and Linux native gaming platform", "/snap/bin/steam", ink_muted),
        ]

        card_w = 370
        card_h = 160
        start_x = 256
        start_y = 184
        gap_x = 24
        gap_y = 20

        for idx, (app_name, ver, size, cat, desc, path, tag_color) in enumerate(cards_data):
            col = idx % 3
            row = idx // 3
            c_x = start_x + col * (card_w + gap_x)
            c_y = start_y + row * (card_h + gap_y)

            # Card Container (Frasto Surface: sharp 1px border, 0 radius, flat)
            add_cmd("node.create", {
                "type": "rectangle",
                "name": f"Card_{idx}",
                "parent": artboard_ref,
                "x": c_x, "y": c_y, "width": card_w, "height": card_h,
                "props": {"fill": surface, "stroke": border, "strokeWeight": 1}
            })

            # Borderless App Icon Frame (40x40, no border, no background box)
            add_cmd("node.create", {
                "type": "frame",
                "name": f"CardIcon_{idx}",
                "parent": artboard_ref,
                "x": c_x + 16, "y": c_y + 16, "width": 40, "height": 40,
                "props": {"fills": []}
            })
            add_cmd("node.create", {
                "type": "text",
                "name": f"CardIconGlyph_{idx}",
                "parent": artboard_ref,
                "x": c_x + 22, "y": c_y + 22,
                "text": "●" if idx % 2 == 0 else "■",
                "props": {"fontSize": 26, "fill": tag_color, "fontFamily": "Inter"}
            })

            # Title
            add_cmd("node.create", {
                "type": "text",
                "name": f"CardTitle_{idx}",
                "parent": artboard_ref,
                "x": c_x + 66, "y": c_y + 18,
                "text": app_name,
                "props": {"fontSize": 14, "fill": ink, "fontFamily": "Inter", "fontStyle": "bold"}
            })

            # Version & Size
            add_cmd("node.create", {
                "type": "text",
                "name": f"CardMeta_{idx}",
                "parent": artboard_ref,
                "x": c_x + 66, "y": c_y + 36,
                "text": f"{ver} · {size}",
                "props": {"fontSize": 11, "fill": ink_soft, "fontFamily": "Inter"}
            })

            # Category Badge
            badge_w = len(cat) * 6 + 14
            add_cmd("node.create", {
                "type": "rectangle",
                "name": f"CardBadge_{idx}",
                "parent": artboard_ref,
                "x": c_x + card_w - badge_w - 16, "y": c_y + 16, "width": badge_w, "height": 20,
                "props": {"fill": subtle, "stroke": border, "strokeWeight": 1}
            })
            add_cmd("node.create", {
                "type": "text",
                "name": f"CardBadgeText_{idx}",
                "parent": artboard_ref,
                "x": c_x + card_w - badge_w - 10, "y": c_y + 20,
                "text": cat,
                "props": {"fontSize": 10, "fill": tag_color, "fontFamily": "Inter", "fontStyle": "bold"}
            })

            # Description
            add_cmd("node.create", {
                "type": "text",
                "name": f"CardDesc_{idx}",
                "parent": artboard_ref,
                "x": c_x + 16, "y": c_y + 70,
                "text": desc,
                "props": {"fontSize": 11, "fill": ink_muted, "fontFamily": "Inter"}
            })

            # Divider line inside card
            add_cmd("node.create", {
                "type": "rectangle",
                "name": f"CardDivider_{idx}",
                "parent": artboard_ref,
                "x": c_x + 16, "y": c_y + 114, "width": card_w - 32, "height": 1,
                "props": {"fill": border}
            })

            # Path (bottom left)
            add_cmd("node.create", {
                "type": "text",
                "name": f"CardPath_{idx}",
                "parent": artboard_ref,
                "x": c_x + 16, "y": c_y + 130,
                "text": path,
                "props": {"fontSize": 10, "fill": ink_soft, "fontFamily": "Inter"}
            })

            # Actions (bottom right)
            # Inspect Button
            add_cmd("node.create", {
                "type": "rectangle",
                "name": f"BtnInspect_{idx}",
                "parent": artboard_ref,
                "x": c_x + card_w - 128, "y": c_y + 124, "width": 52, "height": 24,
                "props": {"fill": surface, "stroke": border, "strokeWeight": 1}
            })
            add_cmd("node.create", {
                "type": "text",
                "name": f"BtnInspectText_{idx}",
                "parent": artboard_ref,
                "x": c_x + card_w - 120, "y": c_y + 130,
                "text": "Inspect",
                "props": {"fontSize": 10, "fill": ink, "fontFamily": "Inter"}
            })

            # Uninstall Button
            add_cmd("node.create", {
                "type": "rectangle",
                "name": f"BtnDel_{idx}",
                "parent": artboard_ref,
                "x": c_x + card_w - 70, "y": c_y + 124, "width": 54, "height": 24,
                "props": {"fill": subtle, "stroke": danger, "strokeWeight": 1}
            })
            add_cmd("node.create", {
                "type": "text",
                "name": f"BtnDelText_{idx}",
                "parent": artboard_ref,
                "x": c_x + card_w - 63, "y": c_y + 130,
                "text": "Remove",
                "props": {"fontSize": 10, "fill": danger, "fontFamily": "Inter"}
            })

    # Generate Artboard 1: Light Mode
    build_artboard("Freight App Manager — Light (Frasto Editorial)", 0, 0, is_dark=False)

    # Generate Artboard 2: Dark Mode
    build_artboard("Freight App Manager — Dark (Frasto Obsidian)", 1500, 0, is_dark=True)

    return cmds

if __name__ == "__main__":
    commands = generate_commands()
    out_json = "/tmp/freight_figcraft_batch.json"
    out_figcraft = "/mnt/work/PixelFreight/freight-app-manager/design/freight-app-manager.figcraft"
    
    with open(out_json, "w") as f:
        json.dump(commands, f, indent=2)

    print(f"Generated {len(commands)} commands in {out_json}")
    res = subprocess.run(["figcraft-cli", "run", out_json, "--out", out_figcraft], capture_output=True, text=True)
    print("Return code:", res.returncode)
    print("STDERR:", res.stderr)
    if res.returncode == 0:
        print(f"Successfully generated FigCraft file: {out_figcraft}")
        # Export renders
        export_png = "/mnt/work/PixelFreight/freight-app-manager/design/preview.png"
        res_exp = subprocess.run(["figcraft-cli", "export", out_figcraft, "-o", export_png, "--scale", "1"], capture_output=True, text=True)
        print("Export output:", res_exp.stdout, res_exp.stderr)
    else:
        print("Error output:", res.stdout[:500])
