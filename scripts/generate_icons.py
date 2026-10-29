import os
from PIL import Image, ImageDraw

def create_freight_icon():
    # Render at 2048x2048 for crisp supersampled downscaling
    size = 2048
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Base rounded rectangle
    # Background gradient approximation with rounded rect
    corner_radius = int(size * 0.22)
    # Background color #121520
    draw.rounded_rectangle([0, 0, size, size], radius=corner_radius, fill=(18, 21, 32, 255))
    # Border stroke #2B3046
    draw.rounded_rectangle([4, 4, size-4, size-4], radius=corner_radius, outline=(43, 48, 70, 255), width=8)

    # Center coordinates
    cx = size // 2
    cy = int(size * 0.52)

    # Isometric cube parameters
    # Top face: (cx, top_y), (right_x, mid_y), (cx, center_y), (left_x, mid_y)
    dx = int(size * 0.26)
    dy_top = int(size * 0.14)
    cube_height = int(size * 0.25)

    top_v = (cx, cy - cube_height - dy_top)
    right_v = (cx + dx, cy - cube_height)
    bot_v = (cx, cy - cube_height + dy_top)
    left_v = (cx - dx, cy - cube_height)

    # Cube lower vertices
    left_bot = (left_v[0], left_v[1] + cube_height)
    center_bot = (bot_v[0], bot_v[1] + cube_height)
    right_bot = (right_v[0], right_v[1] + cube_height)

    # Draw Drop Shadow (soft purple / indigo glow)
    shadow_offset = int(size * 0.03)
    shadow_pts = [
        (left_v[0], left_bot[1] + shadow_offset),
        (center_bot[0], center_bot[1] + shadow_offset + int(size * 0.02)),
        (right_v[0], right_bot[1] + shadow_offset),
        (cx, bot_v[1] + cube_height + shadow_offset)
    ]
    # Draw Left Face (Deep Indigo: #4338CA)
    left_face_poly = [left_v, bot_v, center_bot, left_bot]
    draw.polygon(left_face_poly, fill=(67, 56, 202, 255))

    # Draw Right Face (Darker Violet/Indigo: #312E81)
    right_face_poly = [bot_v, right_v, right_bot, center_bot]
    draw.polygon(right_face_poly, fill=(49, 46, 129, 255))

    # Draw Top Face (Vibrant Indigo: #6366F1)
    top_face_poly = [top_v, right_v, bot_v, left_v]
    draw.polygon(top_face_poly, fill=(99, 102, 241, 255))

    # Container grooves on left face
    groove_count = 3
    for i in range(1, groove_count + 1):
        ratio = i / (groove_count + 1)
        gx_top = int(left_v[0] + (bot_v[0] - left_v[0]) * ratio)
        gy_top = int(left_v[1] + (bot_v[1] - left_v[1]) * ratio)
        gx_bot = gx_top
        gy_bot = gy_top + cube_height
        draw.line([(gx_top, gy_top), (gx_bot, gy_bot)], fill=(49, 46, 129, 255), width=int(size * 0.008))

    # Container grooves on right face
    for i in range(1, groove_count + 1):
        ratio = i / (groove_count + 1)
        gx_top = int(bot_v[0] + (right_v[0] - bot_v[0]) * ratio)
        gy_top = int(bot_v[1] + (right_v[1] - bot_v[1]) * ratio)
        gx_bot = gx_top
        gy_bot = gy_top + cube_height
        draw.line([(gx_top, gy_top), (gx_bot, gy_bot)], fill=(30, 27, 75, 255), width=int(size * 0.008))

    # Center Seam & Highlight lines
    draw.line([bot_v, center_bot], fill=(129, 140, 248, 255), width=int(size * 0.01))
    draw.line([left_v, bot_v], fill=(56, 189, 248, 255), width=int(size * 0.007))
    draw.line([bot_v, right_v], fill=(192, 132, 252, 255), width=int(size * 0.007))
    draw.line([top_v, bot_v], fill=(165, 180, 252, 180), width=int(size * 0.006))

    # Freight Dispatch Chevron on top face (White / Light cyan)
    chev_cy = (top_v[1] + bot_v[1]) // 2
    chev_w = int(size * 0.09)
    chev_h = int(size * 0.045)
    
    # Inner diamond
    diamond = [
        (cx, chev_cy - chev_h),
        (cx + chev_w, chev_cy),
        (cx, chev_cy + chev_h),
        (cx - chev_w, chev_cy)
    ]
    draw.polygon(diamond, fill=(240, 245, 255, 255))
    
    # Outer chevron ring
    draw.line([
        (cx - int(chev_w * 1.5), chev_cy + int(chev_h * 0.5)),
        (cx, chev_cy - int(chev_h * 0.8)),
        (cx + int(chev_w * 1.5), chev_cy + int(chev_h * 0.5))
    ], fill=(255, 255, 255, 255), width=int(size * 0.012), joint="curve")

    # Lower arrow highlight
    draw.line([
        (cx - chev_w, chev_cy + int(chev_h * 1.6)),
        (cx, chev_cy + int(chev_h * 0.6)),
        (cx + chev_w, chev_cy + int(chev_h * 1.6))
    ], fill=(56, 189, 248, 255), width=int(size * 0.008), joint="curve")

    return img

def main():
    base_img = create_freight_icon()
    icons_dir = "/mnt/work/PixelFreight/freight-app-manager/src-tauri/icons"
    public_dir = "/mnt/work/PixelFreight/freight-app-manager/public"

    targets = {
        os.path.join(icons_dir, "icon.png"): 512,
        os.path.join(icons_dir, "128x128.png"): 128,
        os.path.join(icons_dir, "128x128@2x.png"): 256,
        os.path.join(icons_dir, "64x64.png"): 64,
        os.path.join(icons_dir, "32x32.png"): 32,
        os.path.join(icons_dir, "Square30x30Logo.png"): 30,
        os.path.join(icons_dir, "Square44x44Logo.png"): 44,
        os.path.join(icons_dir, "Square71x71Logo.png"): 71,
        os.path.join(icons_dir, "Square89x89Logo.png"): 89,
        os.path.join(icons_dir, "Square107x107Logo.png"): 107,
        os.path.join(icons_dir, "Square142x142Logo.png"): 142,
        os.path.join(icons_dir, "Square150x150Logo.png"): 150,
        os.path.join(icons_dir, "Square284x284Logo.png"): 284,
        os.path.join(icons_dir, "Square310x310Logo.png"): 310,
        os.path.join(icons_dir, "StoreLogo.png"): 50,
        os.path.join(public_dir, "ICON.png"): 512,
    }

    for path, s in targets.items():
        resized = base_img.resize((s, s), Image.Resampling.LANCZOS)
        resized.save(path, "PNG")
        print(f"Generated: {path} ({s}x{s})")

if __name__ == "__main__":
    main()
