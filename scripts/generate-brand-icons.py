#!/usr/bin/env python3
"""Render all favicons/app icons from public/logo-mark.svg.

Outputs PNGs and a multi-size .ico into public/. Re-run any time the SVG mark changes:
    python3 scripts/generate-brand-icons.py
"""
import io
import os
from pathlib import Path

import resvg_py
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / "public"
MARK = PUB / "logo-mark.svg"

# Brand backgrounds for opaque icons (iOS/maskable/tile)
BG_PINK = (192, 38, 211, 255)  # #C026D3
BG_WHITE = (255, 255, 255, 255)


def _rasterize(svg_path: Path, w: int, h: int) -> Image.Image:
    svg_str = svg_path.read_text()
    png_bytes = bytes(resvg_py.svg_to_bytes(svg_string=svg_str, width=w, height=h))
    return Image.open(io.BytesIO(png_bytes)).convert("RGBA")


def render_svg(svg_path: Path, size: int, bg=None, safe_pct: float = 0.0) -> Image.Image:
    """Rasterize SVG to a square PIL image, optionally with opaque bg + inner safe area."""
    if safe_pct > 0:
        inner = int(size * (1 - safe_pct * 2))
        fg = _rasterize(svg_path, inner, inner)
        canvas = Image.new("RGBA", (size, size), bg or (0, 0, 0, 0))
        off = (size - inner) // 2
        canvas.alpha_composite(fg, (off, off))
        return canvas
    fg = _rasterize(svg_path, size, size)
    if bg is not None:
        canvas = Image.new("RGBA", (size, size), bg)
        canvas.alpha_composite(fg)
        return canvas
    return fg


def save(img: Image.Image, name: str):
    out = PUB / name
    img.save(out, "PNG", optimize=True)
    print(f"  ✓ {name} ({img.size[0]}×{img.size[1]})")


def main():
    print(f"Rendering brand icons from {MARK.relative_to(ROOT)}…")

    # Transparent favicons / Android (Chrome handles transparent)
    save(render_svg(MARK, 16), "favicon-16x16.png")
    save(render_svg(MARK, 32), "favicon-32x32.png")
    save(render_svg(MARK, 48), "favicon-48x48.png")
    save(render_svg(MARK, 192), "android-chrome-192x192.png")
    save(render_svg(MARK, 512), "android-chrome-512x512.png")

    # Opaque-background icons (Apple, Windows, maskable)
    save(render_svg(MARK, 180, bg=BG_WHITE), "apple-touch-icon.png")
    save(render_svg(MARK, 150, bg=BG_WHITE), "mstile-150x150.png")
    # Maskable needs ~20% safe area padding (Android adaptive masks)
    save(render_svg(MARK, 512, bg=BG_PINK, safe_pct=0.2), "maskable-icon-512x512.png")

    # Splash screens (mark centered on solid bg, 30% safe area for comfort)
    save(render_svg(MARK, 1024, bg=BG_WHITE, safe_pct=0.30), "splash-light-1024.png")
    save(render_svg(MARK, 1024, bg=(15, 12, 26, 255), safe_pct=0.30), "splash-dark-1024.png")

    # Email header (600×200, white bg, centered horizontal logo)
    horiz = _rasterize(PUB / "logo-horizontal.svg", 480, 96)
    email = Image.new("RGBA", (600, 200), BG_WHITE)
    email.alpha_composite(horiz, ((600 - 480) // 2, (200 - 96) // 2))
    save(email, "email-header.png")

    # Multi-size .ico (16, 32, 48)
    ico_sizes = [(16, 16), (32, 32), (48, 48)]
    ico_imgs = [render_svg(MARK, s) for s, _ in ico_sizes]
    ico_out = PUB / "favicon.ico"
    ico_imgs[0].save(ico_out, format="ICO", sizes=ico_sizes, append_images=ico_imgs[1:])
    print(f"  ✓ favicon.ico (multi-size 16/32/48)")

    print("Done.")


if __name__ == "__main__":
    main()
