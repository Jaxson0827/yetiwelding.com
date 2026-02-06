# 3D Preview and Configurator Text Fixes

## Overview
Fix the embed-plate configurator so the 3D preview is visible (not black) with steel-looking plate and studs, and normalize configurator text so labels/values and buttons look consistent.

---

## 1. Why the 3D preview looks black

- **No scene background:** The R3F `<Canvas>` never sets a scene background, so the WebGL default (transparent/black) shows.
- **Lighting:** Current lighting can leave gray materials too dark.

**Fix in [components/steel-embeds/PreviewCanvas.tsx](components/steel-embeds/PreviewCanvas.tsx):**
- Add `<color attach="background" args={['#1a1a1a']} />` inside `<Canvas>`.
- Increase ambient (e.g. `ambientLight intensity={0.7}` or `0.8`).
- Add a fill light (e.g. `pointLight position={[-8, 8, 8]} intensity={0.6}`).

---

## 2. Make plate and studs look like steel

Currently in [components/steel-embeds/EmbedGeometry.tsx](components/steel-embeds/EmbedGeometry.tsx) the plate and studs use a neutral gray (`0x808080`) with `metalness: 0.7`, `roughness: 0.3`. They read as generic gray, not clearly steel.

**Changes in EmbedGeometry.tsx:**

- **Steel color:** Use a cooler, slightly blue-gray typical of raw/mill steel (e.g. `0x7a8088` or `0x8a8f94`) instead of `0x808080`.
- **Metallic look:** Raise `metalness` (e.g. `0.88–0.92`) and lower `roughness` (e.g. `0.25–0.35`) so they read as reflective metal.
- **Optional:** Slight `envMapIntensity` if an environment map is added later; for now material tweaks are enough.

Apply the same base steel material to both `plateMaterial` and `studMaterial`. Keep `studHighlightMaterial` as-is (crimson tint for selection) or give it the same steel base with a red tint so the highlighted stud still reads as steel.

**Concrete material values (example):**
- `color: 0x7e8488` (cool gray)
- `metalness: 0.9`
- `roughness: 0.28`

---

## 3. Configurator text (“weird” styling)

- **Stud description line** ([EmbedSpecForm.tsx](components/steel-embeds/EmbedSpecForm.tsx)): Use one consistent style (e.g. `font-normal`) for the whole line; optionally wrap only numeric values in `font-mono font-normal` so label vs value is intentional.
- **Remove button:** Use “Remove stud” and keep `text-red-400`; align hierarchy with “Advanced: customize this stud” (same weight, color different).
- **Plate Size / Studs** ([CoordinateEditor.tsx](components/steel-embeds/CoordinateEditor.tsx)): Same font/weight for label and values, or keep `font-mono` with `font-normal` so values don’t look unexpectedly bold.
- **Input borders** ([EmbedSpecForm.tsx](components/steel-embeds/EmbedSpecForm.tsx)): Use `border-white/20` instead of `border-white/10` on configurator inputs.
- **SVG dimension labels** ([CoordinateEditor.tsx](components/steel-embeds/CoordinateEditor.tsx)): Bump dimension text from 9/8 to 10/9 and use a brighter fill (e.g. `rgba(255,255,255,0.7)`).

---

## 4. Summary of file changes

| File | Changes |
|------|--------|
| **PreviewCanvas.tsx** | Scene background color; higher ambient; one fill point light. |
| **EmbedGeometry.tsx** | Steel-like materials: cooler gray color, higher metalness, lower roughness for plate and studs. |
| **EmbedSpecForm.tsx** | Stud line styling; “Remove stud” label; input borders `white/20`. |
| **CoordinateEditor.tsx** | Plate Size/Studs styling; SVG dimension text size and opacity. |

No new dependencies. After edits, the 3D preview should show a dark gray background with clearly visible, steel-looking plate and studs, and configurator text/inputs should be consistent and readable.
