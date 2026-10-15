"""Named material factory.

The client re-tints materials by *name* (docs/contracts.md §4.1), so the base colours here are
neutral/light and the surface response is soft and stylised (high roughness, low metalness —
three.js scenes without an environment map render high-metalness surfaces almost black).
"""
import bpy

# name: (base rgb (linear-ish sRGB values), roughness, metallic, emission strength)
PALETTE = {
    "Primary":   ((0.90, 0.90, 0.88), 0.80, 0.00, 0.0),
    "Secondary": ((0.86, 0.84, 0.80), 0.70, 0.05, 0.0),
    "Metal":     ((0.78, 0.79, 0.81), 0.38, 0.35, 0.0),
    "DarkMetal": ((0.28, 0.28, 0.30), 0.50, 0.30, 0.0),
    "Leather":   ((0.55, 0.42, 0.30), 0.85, 0.00, 0.0),
    "Skin":      ((0.86, 0.68, 0.56), 0.75, 0.00, 0.0),
    "Hair":      ((0.40, 0.30, 0.22), 0.85, 0.00, 0.0),
    "Wood":      ((0.55, 0.40, 0.26), 0.85, 0.00, 0.0),
    "Cloth":     ((0.82, 0.80, 0.76), 0.90, 0.00, 0.0),
    "Glow":      ((0.95, 0.95, 0.95), 0.40, 0.00, 2.0),
    # creature / animal extras
    "Coat":      ((0.82, 0.80, 0.78), 0.80, 0.00, 0.0),
    "Mane":      ((0.30, 0.26, 0.22), 0.85, 0.00, 0.0),
    "Feathers":  ((0.85, 0.83, 0.80), 0.85, 0.00, 0.0),
    "Beak":      ((0.85, 0.70, 0.35), 0.60, 0.00, 0.0),
    "Horn":      ((0.85, 0.80, 0.70), 0.60, 0.00, 0.0),
    "Eye":       ((0.08, 0.07, 0.06), 0.30, 0.00, 0.0),
}


def srgb_to_linear(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def hex_to_linear(hexstr):
    h = hexstr.lstrip("#")
    return tuple(srgb_to_linear(int(h[i:i + 2], 16) / 255.0) for i in (0, 2, 4))


def make(name, rgb=None, roughness=None, metallic=None, emission=None):
    """Create (or fetch) a Principled material named exactly `name`."""
    mat = bpy.data.materials.get(name)
    if mat is None:
        mat = bpy.data.materials.new(name)
    d_rgb, d_rough, d_metal, d_emit = PALETTE.get(name, ((0.8, 0.8, 0.8), 0.8, 0.0, 0.0))
    rgb = rgb if rgb is not None else d_rgb
    roughness = d_rough if roughness is None else roughness
    metallic = d_metal if metallic is None else metallic
    emission = d_emit if emission is None else emission
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*rgb, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    if emission > 0:
        bsdf.inputs["Emission Color"].default_value = (*rgb, 1.0)
        bsdf.inputs["Emission Strength"].default_value = emission
    mat.diffuse_color = (*rgb, 1.0)
    return mat


def library(names):
    """Create all named materials; returns {name: Material}."""
    return {n: make(n) for n in names}


def set_color(name, rgb_linear, emission=None):
    """Re-tint an existing material (used by previews to mimic client tinting)."""
    mat = bpy.data.materials.get(name)
    if mat is None:
        return
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*rgb_linear, 1.0)
    if emission is not None:
        bsdf.inputs["Emission Color"].default_value = (*rgb_linear, 1.0)
        bsdf.inputs["Emission Strength"].default_value = emission
