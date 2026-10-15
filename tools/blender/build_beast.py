"""Build app/public/assets/models/wolf.glb and boar.glb — ≈0.9 m quadrupeds.

Run:
    blender -b --factory-startup -P tools/blender/build_beast.py -- app/public/assets/models/wolf.glb --kind wolf
    blender -b --factory-startup -P tools/blender/build_beast.py -- app/public/assets/models/boar.glb --kind boar

Rig: animated empties. Root `Wolf`/`Boar` → `J_Body` (hindquarters, animated location+rotation)
→ `J_Chest` (spine flex) → `J_Neck` → `J_Head` → `J_Jaw`; `J_Tail`; legs Upper/Lower/Foot
(front legs on J_Chest, hind legs on J_Body). Faces +X.
Clips: Idle (loop 2.0), Run (loop 0.5, rotary gallop), Attack† (1.0: wolf lunge-bite, boar tusk
charge), Hit (0.4), Death (1.0, ends lying on its side).
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from mathutils import Vector  # noqa: E402

from lib import anim, export, geom, materials, scene  # noqa: E402
from lib.anim import Key  # noqa: E402
from lib.creature import LegRig, claw, eye, feather, gait_cycle  # noqa: E402
from lib.geom import Geo, loft, section as S, superquad, sweep  # noqa: E402
from lib.rig import Rig  # noqa: E402


def leg_joints(front, hind):
    """front/hind = (upper, lower, foot) (x, y, z) heads for the left side."""
    joints, legs = [], {}
    for side, s in (("L", 1.0), ("R", -1.0)):
        for tag, spec, parent, fwd in (("Front", front, "J_Chest", True), ("Hind", hind, "J_Body", False)):
            u, l, f = [(p[0], s * p[1], p[2]) for p in spec]
            joints += [("J_%sUpper_%s" % (tag, side), u, parent),
                       ("J_%sLower_%s" % (tag, side), l, "J_%sUpper_%s" % (tag, side)),
                       ("J_%sFoot_%s" % (tag, side), f, "J_%sLower_%s" % (tag, side))]
            legs[tag[0] + side] = ("J_%sUpper_%s" % (tag, side), "J_%sLower_%s" % (tag, side), "J_%sFoot_%s" % (tag, side), fwd)
    return joints, legs


# =============================================================================================
# WOLF
# =============================================================================================

def fur_tufts(points, direction, length, width, mat, up=(0, 0, 1), jitter=0.25):
    g = Geo()
    d0 = Vector(direction).normalized()
    for i, p in enumerate(points):
        j = Vector((math.sin(i * 2.3), math.cos(i * 1.7), math.sin(i * 3.1))) * jitter
        g.add(feather(p, d0 + j * 0.5, length * (0.85 + 0.3 * abs(math.sin(i * 1.3))), width, thick=0.012, up=up,
                      mat=mat, seg=5, arch=0.01))
    return g


def fur_cap(xs, zc, up, wd, mat, amp=0.035, freq=38.0, grow=0.018, below=0.25):
    """Shaggy overlay hugging the top of a body sweep, with a sawtooth (tufted) silhouette."""
    secs = [S(u + grow, w + grow, 2.2, rxb=max(0.01, u * below)) if u else S(0.0, 0.0) for u, w in zip(up, wd)]
    g = sweep([(x, 0, z) for x, z in zip(xs, zc)], secs, seg=16, normal_hint=(0, 0, 1), mat=mat)
    z0 = min(zc)

    def tuft(v):
        h = v.z - z0
        if h <= 0.02:
            return v
        saw = (v.x * freq + 0.37 * math.sin(v.y * 40)) % 1.0
        k = amp * saw * min(1.0, h / 0.08)
        return Vector((v.x - k * 0.9, v.y * (1 + k * 2), v.z + k * 0.6))
    g.deform(tuft)
    return g


def wolf_parts():
    out = []
    # hindquarters + waist
    xs = [-0.50, -0.46, -0.34, -0.14, 0.06, 0.20]
    zc = [0.64, 0.645, 0.645, 0.635, 0.63, 0.63]
    up = [0.06, 0.12, 0.145, 0.135, 0.135, 0.14]
    dn = [0.06, 0.13, 0.16, 0.125, 0.12, 0.14]
    wd = [0.06, 0.12, 0.14, 0.12, 0.12, 0.13]
    body = sweep([(x, 0, z) for x, z in zip(xs, zc)], [S(u, w, 2.2, rxb=d) for u, d, w in zip(up, dn, wd)],
                 seg=14, normal_hint=(0, 0, 1), mat="Coat")
    body.add(fur_cap(xs[1:], zc[1:], up[1:], [w * 0.8 for w in wd[1:]], "Mane", amp=0.05, freq=24.0))
    out.append(("Wolf_Body", body, "J_Body"))
    # deep chest
    xs = [0.04, 0.14, 0.28, 0.42, 0.52, 0.57]
    zc = [0.63, 0.63, 0.62, 0.635, 0.66, 0.68]
    up = [0.14, 0.165, 0.175, 0.175, 0.14, 0.0]
    dn = [0.15, 0.19, 0.24, 0.24, 0.18, 0.0]
    wd = [0.13, 0.15, 0.16, 0.15, 0.13, 0.0]
    ch = sweep([(x, 0, z) for x, z in zip(xs, zc)], [S(u, w, 2.2, rxb=d) if u else S(0.0, 0.0) for u, d, w in zip(up, dn, wd)],
               seg=14, normal_hint=(0, 0, 1), mat="Coat")
    # shaggy ruff over the withers
    ch.add(fur_cap([0.04, 0.14, 0.28, 0.42, 0.56], [0.63, 0.63, 0.62, 0.635, 0.69], [0.15, 0.18, 0.20, 0.20, 0.0],
                   [0.13, 0.16, 0.17, 0.16, 0.0], "Mane", amp=0.075, freq=20.0, grow=0.02))
    ch.add(fur_tufts([(0.48, 0.07 * (i - 1), 0.46) for i in range(3)], (0.2, 0, -1), 0.13, 0.05, "Coat", up=(1, 0, 0)))
    out.append(("Wolf_Chest", ch, "J_Chest"))
    # neck with ruff
    nk = sweep([(0.38, 0, 0.66), (0.50, 0, 0.73), (0.60, 0, 0.80), (0.68, 0, 0.86)],
               [S(0.14, 0.13), S(0.135, 0.125), S(0.12, 0.105), S(0.10, 0.09)], seg=12, normal_hint=(-1, 0, 1), mat="Coat")
    nk.add(fur_cap([0.40, 0.50, 0.60, 0.67], [0.70, 0.77, 0.84, 0.89], [0.10, 0.11, 0.09, 0.0], [0.13, 0.13, 0.11, 0.0], "Mane",
                   amp=0.07, freq=20.0, grow=0.03, below=0.5))
    nk.add(fur_tufts([(0.52 + 0.04 * i, 0.06 * (i % 3 - 1), 0.64) for i in range(4)], (-0.3, 0, -1), 0.12, 0.05, "Coat", up=(1, 0, 0)))
    out.append(("Wolf_Neck", nk, "J_Neck"))
    # head
    hd = superquad(0.125, 0.105, 0.105, 2.2, 2.2, seg=14, rings=7, mat="Coat", rxb=0.11).move(0.72, 0, 0.88)
    hd.add(sweep([(0.76, 0, 0.875), (0.86, 0, 0.85), (0.945, 0, 0.83)],
                 [S(0.06, 0.056, 2.3, rxb=0.04), S(0.05, 0.046, 2.3, rxb=0.034), S(0.036, 0.034, 2.3, rxb=0.025)],
                 seg=12, normal_hint=(0, 0, 1), mat="Coat"))
    hd.add(superquad(0.025, 0.03, 0.022, 2.2, 2.2, seg=8, rings=4, mat="Mane").move(0.95, 0, 0.84))
    for s in (1, -1):
        hd.add(sweep([(0.69, s * 0.055, 0.95), (0.675, s * 0.07, 1.02), (0.655, s * 0.08, 1.09)],
                     [S(0.04, 0.012, 2.0), S(0.03, 0.01, 2.0), S(0.0, 0.0)], seg=8, normal_hint=(1, 0, 0), mat="Coat"))
        hd.add(sweep([(0.695, s * 0.062, 0.955), (0.68, s * 0.075, 1.01), (0.665, s * 0.082, 1.06)],
                     [S(0.026, 0.006, 2.0), S(0.018, 0.005, 2.0), S(0.0, 0.0)], seg=6, normal_hint=(1, 0, 0), mat="Mane"))
        hd.add(eye((0.80, s * 0.058, 0.895), 0.017))
        hd.add(sweep([(0.77, s * 0.06, 0.92), (0.82, s * 0.055, 0.915)], [S(0.015), S(0.0, 0.0)], seg=6,
                     normal_hint=(0, 0, 1), mat="Coat"))
        hd.add(fur_tufts([(0.70, s * 0.085, 0.84), (0.68, s * 0.08, 0.80)], (-1, s * 0.4, -0.3), 0.11, 0.04, "Coat",
                         up=(0, s, 0.3)))
    out.append(("Wolf_Head", hd, "J_Head"))
    jw = sweep([(0.74, 0, 0.80), (0.84, 0, 0.785), (0.92, 0, 0.79)], [S(0.032, 0.042), S(0.024, 0.032), S(0.012, 0.02)],
               seg=10, normal_hint=(0, 0, 1), mat="Coat")
    jw.add(superquad(0.06, 0.03, 0.01, 2.0, 2.0, seg=8, rings=3, mat="Mane").move(0.85, 0, 0.81))
    out.append(("Wolf_Jaw", jw, "J_Jaw"))
    # bushy tail
    tp = [(-0.44, 0, 0.67), (-0.56, 0, 0.63), (-0.66, 0, 0.53), (-0.72, 0, 0.42), (-0.74, 0, 0.32)]
    tl = sweep(tp, [S(0.035), S(0.06, 0.055), S(0.07, 0.06), S(0.06, 0.05), S(0.0, 0.0)], seg=10, normal_hint=(1, 0, 0), mat="Coat")
    tl.add(sweep(tp[2:], [S(0.075, 0.065), S(0.066, 0.056), S(0.0, 0.0)], seg=10, normal_hint=(1, 0, 0), mat="Mane").move(-0.005, 0, -0.01))
    out.append(("Wolf_Tail", tl, "J_Tail"))
    for side, s in (("L", 1.0), ("R", -1.0)):
        y = s * 0.11
        fu = loft([0.70, 0.58, 0.46, 0.36, 0.31], [S(0.10, 0.065), S(0.09, 0.062), S(0.065, 0.05), S(0.05, 0.044), S(0.045, 0.04)],
                  seg=10, centers=[(0.40, y), (0.405, y), (0.39, y), (0.375, y), (0.375, y)], mat="Coat")
        out.append(("Wolf_FrontUpper_" + side, fu, "J_FrontUpper_" + side))
        fl = loft([0.34, 0.24, 0.12, 0.07], [S(0.045, 0.04), S(0.038, 0.035), S(0.036, 0.033), S(0.04, 0.036)], seg=8,
                  centers=[(0.38, y), (0.385, y), (0.395, y), (0.40, y)], mat="Coat")
        out.append(("Wolf_FrontLower_" + side, fl, "J_FrontLower_" + side))
        out.append(("Wolf_FrontFoot_" + side, paw(0.41, y), "J_FrontFoot_" + side))
        hu = sweep([(-0.31, y, 0.70), (-0.27, y, 0.54), (-0.30, y, 0.42), (-0.42, y, 0.31)],
                   [S(0.13, 0.075), S(0.115, 0.07), S(0.07, 0.05), S(0.045, 0.038)], seg=10, normal_hint=(1, 0, 0), mat="Coat")
        out.append(("Wolf_HindUpper_" + side, hu, "J_HindUpper_" + side))
        hl = sweep([(-0.425, y, 0.32), (-0.40, y, 0.19), (-0.385, y, 0.075)], [S(0.042, 0.036), S(0.036, 0.032), S(0.038, 0.034)],
                   seg=8, normal_hint=(1, 0, 0), mat="Coat")
        out.append(("Wolf_HindLower_" + side, hl, "J_HindLower_" + side))
        out.append(("Wolf_HindFoot_" + side, paw(-0.37, y), "J_HindFoot_" + side))
    return out


def paw(x, y):
    g = superquad(0.065, 0.048, 0.04, 2.3, 2.2, seg=10, rings=5, mat="Coat").move(x + 0.03, y, 0.04)
    g.deform(lambda v: Vector((v.x, v.y, max(v.z, 0.0))))
    for k in (-1, 0, 1):
        g.add(claw((x + 0.085, y + 0.025 * k, 0.025), (1, 0, -0.6), 0.03, 0.008, "Mane", seg=5, curl=0.3))
    return g


WOLF = dict(
    root="Wolf",
    materials=["Coat", "Mane", "Eye"],
    joints=[("J_Body", (-0.05, 0.0, 0.62), None), ("J_Chest", (0.24, 0.0, 0.63), "J_Body"),
            ("J_Neck", (0.46, 0.0, 0.70), "J_Chest"), ("J_Head", (0.66, 0.0, 0.85), "J_Neck"),
            ("J_Jaw", (0.76, 0.0, 0.81), "J_Head"), ("J_Tail", (-0.46, 0.0, 0.67), "J_Body")],
    legs=(((0.40, 0.11, 0.60), (0.375, 0.11, 0.33), (0.40, 0.11, 0.075)),
          ((-0.31, 0.11, 0.62), (-0.425, 0.11, 0.32), (-0.385, 0.11, 0.075))),
    parts=wolf_parts,
    gait=dict(offsets={"HL": 0.0, "HR": 0.08, "FL": 0.44, "FR": 0.54}, duty=0.32, stride=0.95, lift=0.16, curl=80,
              bob=0.05, pitch=6.0, flex=12.0),
)


# =============================================================================================
# BOAR
# =============================================================================================

def boar_parts():
    out = []
    xs = [-0.60, -0.55, -0.42, -0.20, 0.05, 0.22]
    zc = [0.57, 0.575, 0.58, 0.58, 0.58, 0.585]
    up = [0.05, 0.16, 0.23, 0.25, 0.26, 0.27]
    dn = [0.06, 0.17, 0.24, 0.26, 0.27, 0.27]
    wd = [0.05, 0.15, 0.21, 0.23, 0.24, 0.25]
    body = sweep([(x, 0, z) for x, z in zip(xs, zc)], [S(u, w, 2.3, rxb=d) for u, d, w in zip(up, dn, wd)],
                 seg=16, normal_hint=(0, 0, 1), mat="Coat")
    body.add(fur_tufts([(-0.40 + 0.11 * i, 0.0, 0.81 + 0.01 * i) for i in range(5)], (-0.6, 0, 1), 0.10, 0.05, "Mane",
                       up=(1, 0, 0), jitter=0.15))
    out.append(("Boar_Body", body, "J_Body"))
    xs = [0.04, 0.18, 0.33, 0.46, 0.55]
    zc = [0.59, 0.61, 0.615, 0.60, 0.585]
    up = [0.28, 0.315, 0.30, 0.23, 0.0]
    dn = [0.28, 0.29, 0.27, 0.21, 0.0]
    wd = [0.25, 0.26, 0.24, 0.19, 0.0]
    ch = sweep([(x, 0, z) for x, z in zip(xs, zc)], [S(u, w, 2.3, rxb=d) if u else S(0.0, 0.0) for u, d, w in zip(up, dn, wd)],
               seg=16, normal_hint=(0, 0, 1), mat="Coat")
    ch.add(fur_tufts([(0.12 + 0.08 * i, 0.03 * ((i % 3) - 1), 0.90 - 0.012 * i) for i in range(6)], (-0.5, 0, 1), 0.13, 0.055,
                     "Mane", up=(1, 0, 0), jitter=0.2))
    ch.add(fur_tufts([(0.35, 0.18 * math.sin(i), 0.40 + 0.03 * i) for i in range(4)], (0.2, 0, -1), 0.07, 0.04, "Mane",
                     up=(1, 0, 0)))
    out.append(("Boar_Chest", ch, "J_Chest"))
    nk = superquad(0.15, 0.21, 0.22, 2.2, 2.2, seg=14, rings=7, mat="Coat").move(0.50, 0, 0.62)
    out.append(("Boar_Neck", nk, "J_Neck"))
    hp = [(0.50, 0, 0.66), (0.62, 0, 0.60), (0.76, 0, 0.52), (0.88, 0, 0.45), (0.95, 0, 0.42)]
    hd = sweep(hp, [S(0.19, 0.17, 2.3, rxb=0.17), S(0.17, 0.145, 2.3, rxb=0.15), S(0.12, 0.10, 2.3, rxb=0.10),
                    S(0.085, 0.075, 2.3, rxb=0.07), S(0.075, 0.07, 2.3, rxb=0.065)], seg=14, normal_hint=(0, 0, 1), mat="Coat")
    hd.add(superquad(0.02, 0.075, 0.065, 2.5, 2.5, seg=12, rings=5, mat="Mane").rotate(-28, "Y").move(0.965, 0, 0.42))
    for s in (1, -1):
        hd.add(eye((0.71, s * 0.105, 0.62), 0.02))
        hd.add(sweep([(0.66, s * 0.10, 0.65), (0.73, s * 0.11, 0.645)], [S(0.02), S(0.0, 0.0)], seg=6, normal_hint=(0, 0, 1), mat="Coat"))
        hd.add(sweep([(0.56, s * 0.11, 0.76), (0.53, s * 0.15, 0.84), (0.50, s * 0.17, 0.89)],
                     [S(0.05, 0.015, 2.0), S(0.035, 0.012, 2.0), S(0.0, 0.0)], seg=8, normal_hint=(1, 0, 0), mat="Coat"))
        hd.add(sweep([(0.86, s * 0.075, 0.43), (0.92, s * 0.11, 0.48), (0.935, s * 0.125, 0.55), (0.90, s * 0.12, 0.60)],
                     [S(0.026), S(0.022), S(0.014), S(0.0, 0.0)], seg=8, normal_hint=(1, 0, 0), mat="Horn"))
    hd.add(fur_tufts([(0.52 + 0.05 * i, 0.0, 0.80 - 0.04 * i) for i in range(3)], (-0.6, 0, 1), 0.09, 0.045, "Mane",
                     up=(1, 0, 0), jitter=0.15))
    out.append(("Boar_Head", hd, "J_Head"))
    jw = sweep([(0.70, 0, 0.42), (0.82, 0, 0.38), (0.90, 0, 0.375)], [S(0.04, 0.07), S(0.03, 0.055), S(0.02, 0.04)],
               seg=10, normal_hint=(0, 0, 1), mat="Coat")
    out.append(("Boar_Jaw", jw, "J_Jaw"))
    tl = sweep([(-0.58, 0, 0.64), (-0.64, 0, 0.60), (-0.66, 0, 0.52), (-0.65, 0, 0.46)], [S(0.02), S(0.017), S(0.014), S(0.012)],
               seg=6, normal_hint=(1, 0, 0), mat="Coat")
    tl.add(fur_tufts([(-0.65, 0, 0.47)], (0.1, 0, -1), 0.08, 0.035, "Mane", up=(1, 0, 0)))
    out.append(("Boar_Tail", tl, "J_Tail"))
    for side, s in (("L", 1.0), ("R", -1.0)):
        y = s * 0.15
        fu = loft([0.56, 0.44, 0.32, 0.21], [S(0.10, 0.07), S(0.085, 0.065), S(0.06, 0.05), S(0.05, 0.045)], seg=10,
                  centers=[(0.32, y), (0.33, y), (0.335, y), (0.34, y)], mat="Coat")
        out.append(("Boar_FrontUpper_" + side, fu, "J_FrontUpper_" + side))
        fl = loft([0.23, 0.14, 0.07], [S(0.045, 0.042), S(0.04, 0.038), S(0.04, 0.038)], seg=8,
                  centers=[(0.34, y), (0.345, y), (0.35, y)], mat="Coat")
        out.append(("Boar_FrontLower_" + side, fl, "J_FrontLower_" + side))
        out.append(("Boar_FrontFoot_" + side, trotter(0.355, y), "J_FrontFoot_" + side))
        hu = sweep([(-0.34, y, 0.60), (-0.33, y, 0.42), (-0.42, y, 0.23)], [S(0.14, 0.09), S(0.11, 0.075), S(0.05, 0.045)],
                   seg=10, normal_hint=(1, 0, 0), mat="Coat")
        out.append(("Boar_HindUpper_" + side, hu, "J_HindUpper_" + side))
        hl = sweep([(-0.42, y, 0.24), (-0.40, y, 0.14), (-0.385, y, 0.07)], [S(0.045, 0.04), S(0.04, 0.036), S(0.04, 0.037)],
                   seg=8, normal_hint=(1, 0, 0), mat="Coat")
        out.append(("Boar_HindLower_" + side, hl, "J_HindLower_" + side))
        out.append(("Boar_HindFoot_" + side, trotter(-0.38, y), "J_HindFoot_" + side))
    return out


def trotter(x, y):
    g = Geo()
    for k in (-1, 1):
        h = loft([0.0, 0.035, 0.075], [S(0.035, 0.02), S(0.033, 0.019), S(0.02, 0.016)], seg=8,
                 centers=[(x + 0.02, y + k * 0.021), (x + 0.015, y + k * 0.02), (x + 0.005, y + k * 0.018)], mat="Mane")
        g.add(h)
    return g


BOAR = dict(
    root="Boar",
    materials=["Coat", "Mane", "Eye", "Horn"],
    joints=[("J_Body", (-0.05, 0.0, 0.57), None), ("J_Chest", (0.22, 0.0, 0.59), "J_Body"),
            ("J_Neck", (0.42, 0.0, 0.62), "J_Chest"), ("J_Head", (0.56, 0.0, 0.64), "J_Neck"),
            ("J_Jaw", (0.72, 0.0, 0.43), "J_Head"), ("J_Tail", (-0.58, 0.0, 0.64), "J_Body")],
    legs=(((0.33, 0.15, 0.46), (0.34, 0.15, 0.22), (0.355, 0.15, 0.07)),
          ((-0.34, 0.15, 0.50), (-0.42, 0.15, 0.24), (-0.385, 0.15, 0.07))),
    parts=boar_parts,
    gait=dict(offsets={"HL": 0.0, "HR": 0.10, "FL": 0.42, "FR": 0.52}, duty=0.38, stride=0.62, lift=0.12, curl=70,
              bob=0.04, pitch=4.0, flex=6.0),
)

KINDS = {"wolf": WOLF, "boar": BOAR}


# =============================================================================================
# animation
# =============================================================================================

LEGRIG = None


def bpose(body_l=(0, 0, 0), body_r=0.0, body_x=0.0, chest=0.0, neck=0.0, head=0.0, head_yaw=0.0, jaw=0.0,
          tail=(0.0, 0.0), legs=None):
    p = {"J_Body": {"r": (body_x, body_r, 0), "l": tuple(body_l)}, "J_Chest": {"r": (0, chest, 0)},
         "J_Neck": {"r": (0, neck, 0)}, "J_Head": {"r": (0, head, head_yaw)}, "J_Jaw": {"r": (0, -jaw, 0)},
         "J_Tail": {"r": (0, tail[0], tail[1])}}
    LEGRIG.pose_legs(p, legs)
    return p


def clip_idle(kind):
    if kind == "wolf":
        def k(f, t):
            return Key(f, bpose(body_l=(0, 0, -0.008 * t), chest=1.5 * t, neck=-4 + 6 * t, head=2 - 5 * t, head_yaw=-10 + 18 * t,
                                jaw=4 * t, tail=(-8 + 4 * t, 10 - 20 * t)))
    else:
        def k(f, t):
            return Key(f, bpose(body_l=(0, 0, -0.01 * t), chest=1 * t, neck=2 + 6 * t, head=4 + 10 * t, head_yaw=6 - 10 * t,
                                jaw=3 * t, tail=(10, -25 + 50 * t)))
    return [k(0, 0), k(30, 1), k(60, 0)]


def clip_run(kind, cfg):
    g = cfg["gait"]

    def body(ph):
        w = 2 * math.pi * ph
        flex = g["flex"] * math.sin(w - 1.0)
        return dict(body_l=(0, 0, 0.01 + g["bob"] * math.sin(w - 1.9)), body_r=g["pitch"] * math.sin(w - 0.4), chest=flex,
                    neck=-6 - flex * 0.6, head=6 + 4 * math.sin(w - 0.9), jaw=(10 if kind == "wolf" else 4),
                    tail=((-30 if kind == "wolf" else 25) + 8 * math.sin(w), 0))
    return gait_cycle(15, g["offsets"], g["duty"], g["stride"], g["lift"], g["curl"], bpose, body)


def clip_attack(kind):
    idle = bpose()
    if kind == "wolf":
        crouch = bpose(body_l=(-0.12, 0, -0.12), body_r=6, chest=6, neck=-14, head=12, jaw=14, tail=(-12, 0),
                       legs={"HL": ("ik", 0.10, 0, 20), "HR": ("ik", 0.14, 0, 20), "FL": ("ik", 0.02, 0, 0), "FR": ("ik", 0.08, 0, 0)})
        crouch2 = bpose(body_l=(-0.15, 0, -0.15), body_r=8, chest=8, neck=-16, head=14, jaw=18, tail=(-16, 0),
                        legs={"HL": ("ik", 0.10, 0, 30), "HR": ("ik", 0.14, 0, 30), "FL": ("ik", 0.02, 0, 0), "FR": ("ik", 0.08, 0, 0)})
        leap = bpose(body_l=(0.45, 0, 0.14), body_r=-6, chest=-4, neck=4, head=-2, jaw=42, tail=(-50, 0),
                     legs={"FL": ("abs", -95, -70, -40), "FR": ("abs", -80, -60, -30), "HL": ("abs", 60, 90, 100), "HR": ("abs", 50, 80, 95)})
        bite = bpose(body_l=(0.62, 0, -0.02), body_r=6, chest=8, neck=10, head=10, jaw=0, tail=(-25, 10),
                     legs={"FL": ("ik", 0.58, 0, -10), "FR": ("ik", 0.70, 0.04, -10), "HL": ("ik", 0.30, 0.0, 30), "HR": ("ik", 0.42, 0.05, 40)})
        shake = bpose(body_l=(0.60, 0, -0.04), body_r=8, chest=10, neck=14, head=14, head_yaw=12, jaw=0, tail=(-20, -10),
                      legs={"FL": ("ik", 0.58, 0, -10), "FR": ("ik", 0.68, 0, -10), "HL": ("ik", 0.30, 0.0, 30), "HR": ("ik", 0.40, 0, 30)})
        back = bpose(body_l=(0.25, 0, 0.0), body_r=-2, neck=-4, head=4, jaw=6,
                     legs={"FL": ("ik", 0.22, 0.05, 0), "FR": ("ik", 0.30, 0, 0), "HL": ("ik", 0.20, 0, 0), "HR": ("ik", 0.28, 0, 0)})
    else:
        crouch = bpose(body_l=(-0.10, 0, -0.06), body_r=10, chest=6, neck=-4, head=20, jaw=4, tail=(40, 20),
                       legs={"HL": ("ik", 0.04, 0, 10), "HR": ("ik", -0.10, 0.06, 40), "FL": ("ik", 0.0, 0, 0), "FR": ("ik", 0.06, 0, 0)})
        crouch2 = bpose(body_l=(-0.12, 0, -0.08), body_r=12, chest=8, neck=-4, head=24, jaw=6, tail=(40, -20),
                        legs={"HL": ("ik", -0.10, 0.06, 40), "HR": ("ik", 0.04, 0, 10), "FL": ("ik", 0.0, 0, 0), "FR": ("ik", 0.06, 0, 0)})
        leap = bpose(body_l=(0.40, 0, 0.04), body_r=10, chest=6, neck=4, head=24, jaw=8, tail=(55, 0),
                     legs={"FL": ("abs", -60, -40, -20), "FR": ("abs", -40, -30, -10), "HL": ("abs", 50, 70, 80), "HR": ("abs", 40, 60, 70)})
        bite = bpose(body_l=(0.60, 0, 0.04), body_r=-10, chest=-6, neck=-10, head=-22, jaw=14, tail=(50, 10),
                     legs={"FL": ("ik", 0.62, 0.10, -20), "FR": ("ik", 0.70, 0.0, -10), "HL": ("ik", 0.50, 0.0, 20), "HR": ("ik", 0.62, 0, 20)})
        shake = bpose(body_l=(0.62, 0, 0.02), body_r=-8, chest=-6, neck=-10, head=-26, jaw=10, tail=(50, -10),
                      legs={"FL": ("ik", 0.64, 0, -10), "FR": ("ik", 0.70, 0, -10), "HL": ("ik", 0.52, 0, 20), "HR": ("ik", 0.62, 0, 20)})
        back = bpose(body_l=(0.25, 0, 0.0), body_r=2, neck=0, head=6, jaw=4,
                     legs={"FL": ("ik", 0.22, 0.05, 0), "FR": ("ik", 0.30, 0, 0), "HL": ("ik", 0.20, 0, 0), "HR": ("ik", 0.28, 0, 0)})
    return [Key(0, idle, "EASE_OUT"), Key(8, crouch), Key(10.5, crouch2, "EASE_IN"), Key(13, leap), Key(15, bite, "EASE_OUT"),
            Key(18, shake), Key(24, back, "EASE_IN_OUT"), Key(30, idle)]


def clip_hit(kind):
    idle = bpose()
    rec = bpose(body_l=(-0.07, 0, -0.03), body_r=-6, chest=-6, neck=-16, head=14, jaw=20, tail=(-40, 15) if kind == "wolf" else (40, 15),
                legs={"FL": ("ik", -0.04, 0.06, 0), "FR": ("ik", 0.02, 0, 0)})
    return [Key(0, idle, "EASE_OUT"), Key(3, rec), Key(12, idle)]


def clip_death(kind):
    idle = bpose()
    h = WOLF["joints"][0][1][2] if kind == "wolf" else BOAR["joints"][0][1][2]
    stag = bpose(body_l=(-0.06, 0, -0.04), body_r=-8, chest=-6, neck=-24, head=20, jaw=24,
                 legs={"FL": ("ik", -0.06, 0.08, 0), "FR": ("ik", 0.02, 0, 0)})
    buckle = bpose(body_l=(-0.04, 0, -0.22), body_r=8, body_x=12, chest=8, neck=10, head=-6, jaw=20,
                   legs={"FL": ("fk", -10, 100, 30), "FR": ("fk", -20, 90, 30), "HL": ("fk", -40, 70, 20), "HR": ("fk", -30, 60, 20)})
    roll = bpose(body_l=(-0.04, 0, -h + 0.22), body_r=0, body_x=60, chest=4, neck=16, head=-10, jaw=16,
                 legs={"FL": ("fk", -30, 40, 20), "FR": ("fk", -50, 50, 20), "HL": ("fk", 30, -20, 10), "HR": ("fk", 20, -10, 10)},
                 tail=(20, 0))
    lying = bpose(body_l=(-0.04, 0, -h + 0.16), body_r=0, body_x=84, chest=4, neck=20, head=-14, jaw=22,
                  legs={"FL": ("fk", -40, 20, 10), "FR": ("fk", -55, 30, 10), "HL": ("fk", 40, -20, 10), "HR": ("fk", 30, -10, 10)},
                  tail=(30, 0))
    return [Key(0, idle, "EASE_OUT"), Key(4, stag), Key(12, buckle, "EASE_IN"), Key(20, roll, "EASE_IN"),
            Key(25, lying, "BACK_OUT"), Key(30, lying)]


def build(kind):
    global LEGRIG
    cfg = KINDS[kind]
    scene.reset()
    mats = materials.library(cfg["materials"])
    rig = Rig(cfg["root"])
    lj, legs = leg_joints(*cfg["legs"])
    joints = cfg["joints"] + lj
    for name, head, parent in joints:
        rig.joint(name, head, parent)
    LEGRIG = LegRig(rig, legs)
    tris = 0
    for name, g, joint in cfg["parts"]():
        obj = geom.to_object(name, g, mats)
        rig.attach(obj, joint)
        tris += g.tri_count()
    print("[%s] ~%d triangles" % (kind, tris))
    jobs = {n: rig.joints[n] for n, _, _ in joints}
    clips = [("Idle", 60, clip_idle(kind), True), ("Run", 15, clip_run(kind, cfg), True), ("Attack", 30, clip_attack(kind), False),
             ("Hit", 12, clip_hit(kind), False), ("Death", 30, clip_death(kind), False)]
    for name, frames, keys, cyc in clips:
        anim.bake_clip(name, frames, keys, jobs, loc_joints=("J_Body",), cyclic=cyc)


def main():
    args = scene.script_args()
    kind = args[args.index("--kind") + 1] if "--kind" in args else "wolf"
    paths = [a for a in args if a.endswith(".glb")]
    out = paths[0] if paths else os.path.join(os.path.dirname(__file__), "..", "..", "app", "public", "assets", "models", kind + ".glb")
    build(kind)
    export.export_glb(os.path.abspath(out))


if __name__ == "__main__":
    main()
