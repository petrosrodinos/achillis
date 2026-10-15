"""Build app/public/assets/models/troll.glb — Swamp Troll boss (≈3.0 m, hunched, mossy, huge club).

Run:
    blender -b --factory-startup -P tools/blender/build_troll.py -- app/public/assets/models/troll.glb

Rig: animated empties (no skin), humanoid-like joint names (J_Hips … J_Hand_R) so the client can
drive it with the humanoid clip mapping. Club = mesh `Weapon_Club` on J_Hand_R. Faces +X.
Clip names are the humanoid subset (+ `Stunned` as a convenience for the shared pose mapper).
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from mathutils import Vector  # noqa: E402

from lib import anim, export, geom, materials, scene  # noqa: E402
from lib.anim import Key  # noqa: E402
from lib.creature import claw, eye  # noqa: E402
from lib.geom import Geo, extrude_outline, loft, section as S, superquad, sweep, torus  # noqa: E402
from lib.rig import Rig, dir_angle, ik2  # noqa: E402

MATERIALS = ["Skin", "Primary", "Cloth", "Wood", "Hair"]
HIP_Z = 1.30
ANKLE_Z = 0.13
CLUB_LEN = 1.95
SH = {"L": (0.36, 0.62, 2.38), "R": (0.36, -0.62, 2.38)}

JOINTS = [
    ("J_Hips", (0.0, 0.0, HIP_Z), None),
    ("J_Spine", (0.02, 0.0, 1.55), "J_Hips"),
    ("J_Chest", (0.18, 0.0, 2.05), "J_Spine"),
    ("J_Head", (0.62, 0.0, 2.42), "J_Chest"),
    ("J_Jaw", (0.80, 0.0, 2.40), "J_Head"),
    ("J_Loin", (0.30, 0.0, 1.20), "J_Hips"),
    ("J_LoinBack", (-0.32, 0.0, 1.22), "J_Hips"),
]
for _s, _k in (("L", 1.0), ("R", -1.0)):
    JOINTS += [
        ("J_UpperArm_" + _s, (0.36, _k * 0.62, 2.38), "J_Chest"),
        ("J_Forearm_" + _s, (0.36, _k * 0.66, 1.56), "J_UpperArm_" + _s),
        ("J_Hand_" + _s, (0.36, _k * 0.68, 0.80), "J_Forearm_" + _s),
        ("J_Thigh_" + _s, (0.0, _k * 0.30, 1.22), "J_Hips"),
        ("J_Shin_" + _s, (0.05, _k * 0.32, 0.66), "J_Thigh_" + _s),
        ("J_Foot_" + _s, (0.0, _k * 0.33, ANKLE_Z), "J_Shin_" + _s),
    ]
REST = {n: Vector(h) for n, h, _ in JOINTS}
HAND_C = {"L": Vector((0.40, 0.68, 0.64)), "R": Vector((0.40, -0.68, 0.64))}


def seg_len(a, b):
    return (REST[b] - REST[a]).length


def seg_rest(a, b):
    d = REST[b] - REST[a]
    return dir_angle(d.x, d.z)


# =============================================================================================
# geometry
# =============================================================================================

def lumps(center, n, spread, size, mat, seed=1.0, flat=0.55):
    """Cluster of squashed blobs (moss / warts)."""
    g = Geo()
    cx, cy, cz = center
    for i in range(n):
        a = seed * 7.3 + i * 2.39996
        r = spread * math.sqrt((i + 0.5) / n)
        s = size * (0.75 + 0.35 * math.sin(a * 3.1))
        g.add(superquad(s, s * 0.9, s * flat, 2.0, 2.0, seg=8, rings=4, mat=mat)
              .move(cx + r * math.cos(a), cy + r * math.sin(a) * 1.2, cz + 0.02 * math.sin(a * 5)))
    return g


def strands(base_pts, direction, length, width, mat, seg=5):
    g = Geo()
    d = Vector(direction).normalized()
    for i, b in enumerate(base_pts):
        b = Vector(b)
        L = length * (0.8 + 0.3 * math.sin(i * 2.7))
        wob = Vector((0.03 * math.sin(i * 1.7), 0.03 * math.cos(i * 2.3), 0))
        pts = [b, b + d * L * 0.45 + wob, b + d * L + wob * 1.8]
        g.add(sweep(pts, [S(width, width * 0.8), S(width * 0.7, width * 0.6), S(0.0, 0.0)], seg=seg,
                    normal_hint=(1, 0, 0), mat=mat))
    return g


def pelvis_geo():
    g = superquad(0.40, 0.42, 0.30, 2.3, 2.2, seg=16, rings=8, mat="Skin").move(-0.02, 0, 1.30)
    # belt + loincloth wrap
    g.add(torus(1.0, 0.05, 20, 5, mat="Cloth").scale(0.45, 0.47, 1.4).move(0.0, 0, 1.40))
    g.add(superquad(0.43, 0.45, 0.13, 2.6, 2.6, seg=16, rings=5, mat="Cloth").move(-0.01, 0, 1.24))
    g.add(superquad(0.10, 0.04, 0.08, 2.5, 2.5, seg=8, rings=4, mat="Wood").move(0.43, 0, 1.40))   # bone toggle
    return g


def loin_geo(front=True):
    sgn = 1 if front else -1
    x0 = 0.33 if front else -0.36
    w = 0.30 if front else 0.36
    pts = [(-w, 0.0), (w, 0.0), (w * 0.92, -0.42), (w * 0.55, -0.50), (w * 0.2, -0.40), (-w * 0.1, -0.54), (-w * 0.5, -0.44),
           (-w * 0.9, -0.50)]
    g = extrude_outline(pts, 0.035, bevel=0.01, mat="Cloth", fan=True)
    g.rotate(90, "Z").move(x0, 0, 1.22)
    g.deform(lambda v: Vector((v.x + sgn * 0.05 * (1.22 - v.z), v.y, v.z)))
    return g


def belly_geo():
    g = superquad(0.48, 0.48, 0.42, 2.2, 2.2, seg=18, rings=9, mat="Skin", rxb=0.40).move(0.12, 0, 1.64)
    g.add(superquad(0.035, 0.03, 0.025, 2.0, 2.0, seg=8, rings=4, mat="Skin").move(0.60, 0, 1.58))  # navel knot
    return g


def chest_geo():
    g = Geo()
    # torso mass leaning forward, then the hump
    path = [(0.02, 0, 1.80), (0.10, 0, 2.05), (0.24, 0, 2.30), (0.38, 0, 2.46)]
    g.add(sweep(path, [S(0.44, 0.52, 2.3, rxb=0.42), S(0.46, 0.60, 2.3, rxb=0.44), S(0.40, 0.62, 2.3, rxb=0.40),
                       S(0.26, 0.46, 2.3, rxb=0.24)], seg=18, normal_hint=(1, 0, 0), mat="Skin"))
    g.add(superquad(0.46, 0.55, 0.42, 2.2, 2.2, seg=18, rings=9, mat="Skin").move(0.02, 0, 2.52))   # hump
    for s in (1, -1):
        g.add(superquad(0.26, 0.24, 0.26, 2.2, 2.2, seg=14, rings=7, mat="Skin").move(0.34, s * 0.56, 2.44))   # shoulders
        g.add(superquad(0.22, 0.22, 0.16, 2.2, 2.2, seg=12, rings=6, mat="Skin").move(0.44, s * 0.26, 2.10))   # pecs
        # moss on the shoulders
        g.add(lumps((0.30, s * 0.60, 2.68), 7, 0.16, 0.085, "Primary", seed=2 + s))
        g.add(strands([(0.42, s * (0.68 + 0.04 * i), 2.50 - 0.05 * i) for i in range(4)], (0.15, s * 0.2, -1), 0.30, 0.03, "Primary"))
    g.add(lumps((-0.02, 0.0, 2.92), 11, 0.30, 0.10, "Primary", seed=5.0))
    g.add(lumps((-0.28, 0.0, 2.62), 7, 0.28, 0.08, "Primary", seed=9.0))
    # shaggy hair down the spine
    spine_pts = [(-0.10 - 0.06 * i, 0.12 * ((i % 3) - 1), 2.80 - 0.13 * i) for i in range(9)]
    g.add(strands(spine_pts, (-0.6, 0, -1), 0.34, 0.05, "Hair"))
    # warts
    for p in ((0.50, -0.40, 2.25), (0.15, -0.55, 2.0), (0.40, 0.42, 2.30), (-0.2, -0.45, 2.3)):
        g.add(superquad(0.035, 0.035, 0.035, 2.0, 2.0, seg=8, rings=4, mat="Skin").move(*p))
    return g


def head_geo():
    g = Geo()
    g.add(superquad(0.25, 0.23, 0.24, 2.2, 2.2, seg=16, rings=8, mat="Skin", rxb=0.20).move(0.80, 0, 2.52))
    # brow ridge
    g.add(sweep([(0.98, -0.20, 2.58), (1.04, -0.10, 2.63), (1.06, 0.0, 2.60), (1.04, 0.10, 2.63), (0.98, 0.20, 2.58)],
                [S(0.06, 0.06)] * 5, seg=10, normal_hint=(0, 0, 1), mat="Skin"))
    # bulbous drooping nose
    g.add(sweep([(1.04, 0, 2.58), (1.12, 0, 2.52), (1.16, 0, 2.44), (1.14, 0, 2.39)],
                [S(0.05, 0.05), S(0.07, 0.07), S(0.085, 0.09), S(0.0, 0.0)], seg=12, normal_hint=(1, 0, 0), mat="Skin"))
    for s in (1, -1):
        g.add(eye((1.02, s * 0.10, 2.545), 0.035, mat="Hair"))
        # drooping pointed ears
        g.add(sweep([(0.80, s * 0.21, 2.55), (0.78, s * 0.34, 2.56), (0.72, s * 0.46, 2.50)],
                    [S(0.07, 0.025, 2.0), S(0.05, 0.02, 2.0), S(0.0, 0.0)], seg=8, normal_hint=(0, 0, 1), mat="Skin"))
        g.add(superquad(0.08, 0.05, 0.05, 2.0, 2.0, seg=8, rings=4, mat="Skin").move(0.98, s * 0.17, 2.44))   # cheeks
    # mossy scalp + lank hair
    g.add(lumps((0.74, 0.0, 2.74), 8, 0.16, 0.08, "Primary", seed=3.0))
    g.add(strands([(0.62 + 0.03 * (i % 2), 0.18 * (i / 3 - 1), 2.70) for i in range(7)], (-0.7, 0, -0.9), 0.38, 0.045, "Hair"))
    return g


def jaw_geo():
    g = superquad(0.19, 0.20, 0.10, 2.4, 2.2, seg=14, rings=6, mat="Skin").move(0.95, 0, 2.32)
    for s in (1, -1):
        g.add(sweep([(1.08, s * 0.09, 2.36), (1.11, s * 0.10, 2.44), (1.10, s * 0.09, 2.52)],
                    [S(0.028, 0.025), S(0.02, 0.018), S(0.0, 0.0)], seg=8, normal_hint=(1, 0, 0), mat="Cloth"))
    g.add(lumps((0.98, 0.0, 2.22), 6, 0.08, 0.05, "Hair", seed=4.0, flat=0.8))   # scraggly beard
    return g


def arm_geos(side, k):
    out = []
    sx, sy, sz = SH[side]
    up = sweep([(sx, sy, sz + 0.05), (sx + 0.02, sy + k * 0.02, 2.05), (sx, sy + k * 0.04, 1.62)],
               [S(0.21, 0.20), S(0.19, 0.18), S(0.15, 0.15)], seg=14, normal_hint=(1, 0, 0), mat="Skin")
    out.append(("Troll_UpperArm_" + side, up, "J_UpperArm_" + side))
    fx, fy = 0.36, k * 0.66
    fo = sweep([(fx, fy, 1.62), (fx + 0.02, fy, 1.40), (fx + 0.02, fy + k * 0.01, 1.10), (fx + 0.02, fy + k * 0.02, 0.86)],
               [S(0.15, 0.15), S(0.20, 0.19), S(0.19, 0.18), S(0.14, 0.13)], seg=14, normal_hint=(1, 0, 0), mat="Skin")
    fo.add(torus(1.0, 0.25, 14, 5, mat="Cloth").scale(0.15, 0.14, 0.25).move(fx + 0.02, fy + k * 0.02, 0.92))
    fo.add(torus(1.0, 0.25, 14, 5, mat="Cloth").scale(0.16, 0.15, 0.25).move(fx + 0.02, fy + k * 0.02, 1.00))
    fo.add(strands([(fx + 0.12, fy + k * 0.1, 1.36), (fx - 0.05, fy + k * 0.15, 1.30), (fx + 0.15, fy + k * 0.05, 1.25)],
                   (0, k * 0.1, -1), 0.24, 0.03, "Primary"))
    out.append(("Troll_Forearm_" + side, fo, "J_Forearm_" + side))
    hc = HAND_C[side]
    h = superquad(0.17, 0.15, 0.18, 2.5, 2.4, seg=14, rings=7, mat="Skin").move(*hc)
    for i in range(4):                                   # knuckles
        h.add(superquad(0.05, 0.045, 0.045, 2.0, 2.0, seg=8, rings=4, mat="Skin")
              .move(hc.x + 0.16, hc.y + k * (-0.09 + 0.06 * i), hc.z - 0.04))
        h.add(claw((hc.x + 0.20, hc.y + k * (-0.09 + 0.06 * i), hc.z - 0.07), (0.3, 0, -1), 0.05, 0.016, "Cloth", curl=0.3))
    h.add(superquad(0.06, 0.05, 0.08, 2.0, 2.0, seg=8, rings=4, mat="Skin").move(hc.x + 0.08, hc.y - k * 0.13, hc.z + 0.02))  # thumb
    out.append(("Troll_Hand_" + side, h, "J_Hand_" + side))
    return out


def leg_geos(side, k):
    out = []
    y = k * 0.30
    th = sweep([(0.0, y, 1.30), (0.03, y + k * 0.01, 1.00), (0.05, y + k * 0.02, 0.70)],
               [S(0.25, 0.23), S(0.22, 0.20), S(0.16, 0.15)], seg=14, normal_hint=(1, 0, 0), mat="Skin")
    out.append(("Troll_Thigh_" + side, th, "J_Thigh_" + side))
    sh = sweep([(0.05, k * 0.32, 0.72), (0.06, k * 0.325, 0.50), (0.02, k * 0.33, 0.24), (0.0, k * 0.33, 0.16)],
               [S(0.15, 0.14), S(0.16, 0.14), S(0.12, 0.11), S(0.12, 0.11)], seg=12, normal_hint=(1, 0, 0), mat="Skin")
    sh.add(torus(1.0, 0.2, 12, 5, mat="Cloth").scale(0.14, 0.13, 0.2).move(0.01, k * 0.33, 0.30))
    out.append(("Troll_Shin_" + side, sh, "J_Shin_" + side))
    ft = superquad(0.27, 0.15, 0.10, 2.4, 2.4, seg=14, rings=6, mat="Skin", rxb=0.14, rzb=0.13).move(0.09, k * 0.34, 0.13)
    ft.deform(lambda v: Vector((v.x, v.y, max(v.z, 0.0))))
    for i in range(3):
        yy = k * (0.34 + 0.08 * (i - 1))
        ft.add(superquad(0.07, 0.05, 0.05, 2.0, 2.0, seg=8, rings=4, mat="Skin").move(0.34, yy, 0.05))
        ft.add(claw((0.40, yy, 0.06), (1, 0, -0.4), 0.06, 0.02, "Cloth", curl=0.3))
    out.append(("Troll_Foot_" + side, ft, "J_Foot_" + side))
    return out


def club_geo():
    """Built pointing +X from the right fist (rest club angle = -90, i.e. forward)."""
    hc = HAND_C["R"]
    x0 = hc.x - 0.22
    pts = [(x0 + d, hc.y, hc.z + 0.02 * math.sin(d * 3)) for d in (0.0, 0.25, 0.6, 1.0, 1.4, 1.75, CLUB_LEN)]
    rs = [0.07, 0.065, 0.075, 0.11, 0.17, 0.23, 0.0]
    g = sweep(pts, [S(r, r * 0.95) if r else S(0.0, 0.0) for r in rs], seg=12, normal_hint=(0, 0, 1), mat="Wood")
    g.deform(lambda v: Vector((v.x, v.y + 0.015 * math.sin(v.x * 17 + v.z * 9), v.z + 0.015 * math.cos(v.x * 13 + v.y * 11))))
    # rounded gnarled head end
    g.add(superquad(0.20, 0.21, 0.21, 2.0, 2.0, seg=12, rings=6, mat="Wood").move(x0 + 1.86, hc.y, hc.z))
    # knots / snapped-branch stubs
    for i, (d, a) in enumerate(((1.10, 30), (1.35, 160), (1.55, 260), (1.70, 80), (1.85, 200), (1.62, 330), (1.95, 20))):
        r = 0.08 + 0.12 * (d - 1.0)
        dirv = Vector((0.25, math.cos(math.radians(a)), math.sin(math.radians(a))))
        base = Vector((x0 + d, hc.y, hc.z)) + Vector((0, math.cos(math.radians(a)), math.sin(math.radians(a)))) * r * 0.8
        g.add(claw(base, dirv, 0.10 + 0.03 * (i % 3), 0.035, "Wood", curl=0.15))
    # rag-wrapped grip
    for d in (0.05, 0.13, 0.30, 0.38):
        g.add(torus(1.0, 0.25, 12, 4, mat="Cloth").scale(0.075, 0.075, 0.12).rotate(90, "Y").move(x0 + d, hc.y, hc.z))
    return g


# =============================================================================================
# pose builder (absolute sagittal angles like humanoid_rig.pose)
# =============================================================================================

def _leg(spec, side, hx, hz, hr):
    hip = REST["J_Thigh_" + side] - REST["J_Hips"]
    t = math.radians(hr)
    hipx = hx + hip.x * math.cos(t) + hip.z * math.sin(t)
    hipz = HIP_Z + hz - hip.x * math.sin(t) + hip.z * math.cos(t)
    tr = seg_rest("J_Thigh_" + side, "J_Shin_" + side)
    sr = seg_rest("J_Shin_" + side, "J_Foot_" + side)
    kind = spec[0]
    if kind == "ik":
        _, ax, az, foot = spec
        ta, sa = ik2((hipx, hipz), (ax, az), seg_len("J_Thigh_" + side, "J_Shin_" + side),
                     seg_len("J_Shin_" + side, "J_Foot_" + side), bend_forward=True)
    elif kind == "fk":
        _, ta, sa, foot = spec
    else:
        return spec[1:]
    return (ta - tr) - hr, (sa - sr) - (ta - tr), foot - (sa - sr)


def pose(hips=(0.0, 0.0, 0.0), hr=0.0, hrx=0.0, spine=0.0, chest=0.0, chest_x=0.0, twist=0.0, head=0.0, headz=0.0,
         jaw=0.0, armL=("rel", 0, 0, 0), armR=("rel", 0, 0, 0), splayArmL=6.0, splayArmR=6.0,
         legL=("ik", 0.0, ANKLE_Z, 0.0), legR=("ik", 0.0, ANKLE_Z, 0.0), splayL=0.0, splayR=0.0, loin=None):
    p = {"J_Hips": {"r": (hrx, hr, 0.0), "l": tuple(hips)},
         "J_Spine": {"r": (0.0, spine, twist * 0.4)},
         "J_Chest": {"r": (chest_x, chest, twist * 0.6)},
         "J_Head": {"r": (0.0, head, headz - twist * 0.5)},
         "J_Jaw": {"r": (0.0, -jaw, 0.0)}}
    chest_abs = hr + spine + chest

    def arm(spec, side, splay):
        if spec[0] == "rel":
            u, f, h = spec[1:]
        else:
            ua, fa, ca = spec[1:]
            u, f = ua - chest_abs, fa - ua
            h = (ca + 90.0) - fa if side == "R" else ca - fa
        p["J_UpperArm_" + side] = {"r": (splay if side == "L" else -splay, u, 0.0)}
        p["J_Forearm_" + side] = {"r": (0.0, f, 0.0)}
        p["J_Hand_" + side] = {"r": (0.0, h, 0.0)}

    arm(armL, "L", splayArmL)
    arm(armR, "R", splayArmR)
    hx, hz = hips[0], hips[2]
    tl, sl, fl = _leg(legL, "L", hx, hz, hr)
    tr, sr, fr = _leg(legR, "R", hx, hz, hr)
    p["J_Thigh_L"] = {"r": (splayL, tl, 0.0)}
    p["J_Shin_L"] = {"r": (0.0, sl, 0.0)}
    p["J_Foot_L"] = {"r": (0.0, fl, 0.0)}
    p["J_Thigh_R"] = {"r": (-splayR, tr, 0.0)}
    p["J_Shin_R"] = {"r": (0.0, sr, 0.0)}
    p["J_Foot_R"] = {"r": (0.0, fr, 0.0)}
    fwd = min(tl, tr, 0.0)
    p["J_Loin"] = {"r": (0.0, fwd * 0.85 if loin is None else loin, 0.0)}
    p["J_LoinBack"] = {"r": (0.0, max(tl, tr, 0.0) * 0.6 + 4, 0.0)}
    return p


A_ANT, A_SWING, A_IMP, A_END = 10.5, 15.0, 18.0, 30.0

GUARD = dict(hips=(0.0, 0, -0.08), hr=4, spine=3, chest=3, head=-12,
             armL=("abs", -12, -40, -30), armR=("abs", -14, -62, -46), splayArmL=8, splayArmR=8,
             legL=("ik", 0.24, ANKLE_Z, 0), legR=("ik", -0.20, ANKLE_Z, 0), splayL=2, splayR=2)
BLOCK = dict(hips=(-0.04, 0, -0.16), hr=8, spine=4, chest=6, head=-18,
             armL=("abs", -40, -150, -150), armR=("abs", -30, -115, -172), splayArmL=2, splayArmR=12,
             legL=("ik", 0.30, ANKLE_Z, 0), legR=("ik", -0.30, ANKLE_Z, 0), splayL=4, splayR=4)


def P(base, **over):
    kw = dict(base)
    kw.update(over)
    return pose(**kw)


def K(frame, base, interp="BEZIER", **over):
    return Key(frame, P(base, **over), interp)


def attack(wind, imp, fol, wind_in=None, hold=0.8):
    return [K(0, GUARD, "EASE_OUT"), K(A_ANT * hold, wind_in or wind), K(A_ANT, wind, "EASE_IN"), K(A_SWING, imp, "EASE_OUT"),
            K(A_IMP, fol), K(A_END, GUARD)]


def idle():
    return [K(0, GUARD), K(30, GUARD, hips=(0, 0, -0.11), chest=6, head=-14, jaw=6, armL=("abs", -10, -36, -28),
                         armR=("abs", -12, -60, -44)), K(60, GUARD)]


def walk():
    W = dict(GUARD, hr=8)

    def contact(front, back, f, sw):
        legs = {"leg" + front: ("ik", 0.42, ANKLE_Z, -10), "leg" + back: ("ik", -0.36, ANKLE_Z + 0.04, 18)}
        side = 1 if front == "L" else -1
        return K(f, W, hips=(0, 0, -0.14), hrx=-4 * side, twist=6 * side, **legs,
                 armL=("abs", -12 - 14 * sw, -40 - 10 * sw, -30), armR=("abs", -14 + 12 * sw, -62, -46))

    def passing(stance, swing, f, sw):
        legs = {"leg" + stance: ("ik", 0.02, ANKLE_Z, 0), "leg" + swing: ("ik", 0.06, ANKLE_Z + 0.24, 12)}
        side = 1 if stance == "L" else -1
        return K(f, W, hips=(0, 0, -0.05), hrx=6 * side, **legs, armL=("abs", -12, -40, -30), armR=("abs", -14, -62, -46))

    return [contact("L", "R", 0, 1), passing("L", "R", 9, 0), contact("R", "L", 18, -1), passing("R", "L", 27, 0),
            contact("L", "R", 36, 1)]


def attack_light():
    wind = dict(GUARD, hips=(-0.10, 0, -0.10), hr=-8, spine=-6, chest=-8, twist=-24, head=4,
                armR=("abs", -150, -190, -215), armL=("abs", 20, -10, -20), splayArmR=16,
                legL=("ik", 0.30, ANKLE_Z, 0), legR=("ik", -0.30, ANKLE_Z, 0))
    wind_in = dict(wind, armR=("abs", -140, -180, -205), twist=-20)
    imp = dict(GUARD, hips=(0.20, 0, -0.20), hr=18, spine=8, chest=10, twist=22, head=-30, jaw=12,
               armR=("abs", -72, -82, -62), armL=("abs", 30, 10, 0), splayArmR=8,
               legL=("ik", 0.62, ANKLE_Z, 0), legR=("ik", -0.30, ANKLE_Z + 0.04, 26))
    fol = dict(imp, armR=("abs", -60, -64, -46), hips=(0.22, 0, -0.22), chest=12, twist=26)
    return attack(wind, imp, fol, wind_in)


def attack_heavy():
    wind = dict(GUARD, hips=(-0.14, 0, 0.0), hr=-14, spine=-10, chest=-12, head=12, jaw=16,
                armR=("abs", -195, -215, -250), armL=("abs", -190, -212, 0), splayArmR=-8, splayArmL=-8,
                legL=("ik", 0.32, ANKLE_Z + 0.02, -6), legR=("ik", -0.32, ANKLE_Z, 0))
    wind_in = dict(wind, armR=("abs", -185, -205, -238), armL=("abs", -180, -202, 0), hr=-10)
    imp = dict(GUARD, hips=(0.24, 0, -0.42), hr=34, spine=12, chest=14, head=-46, jaw=22,
               armR=("abs", -84, -84, -70), armL=("abs", -86, -86, 0), splayArmR=-12, splayArmL=-12,
               legL=("ik", 0.72, ANKLE_Z, 0), legR=("ik", -0.36, ANKLE_Z + 0.04, 30))
    fol = dict(imp, armR=("abs", -78, -78, -64), armL=("abs", -80, -80, 0), hips=(0.25, 0, -0.44), chest=16)
    return attack(wind, imp, fol, wind_in, hold=0.75)


def block_raise():
    return [K(0, GUARD, "EASE_OUT"), K(5, BLOCK)]


def block_hold():
    return [K(0, BLOCK), K(15, BLOCK, hips=(-0.04, 0, -0.18), chest=8, jaw=10), K(30, BLOCK)]


def hit():
    rec = dict(GUARD, hips=(-0.10, 0, -0.10), hr=-12, chest=-12, head=-4, jaw=18,
               armR=("abs", 30, -10, -60), armL=("abs", 25, 0, 0))
    return [K(0, GUARD, "EASE_OUT"), K(3, rec), K(12, GUARD)]


def stagger():
    rec = dict(GUARD, hips=(-0.14, 0, -0.10), hr=-18, chest=-16, head=-2, jaw=20, armR=("abs", 50, 20, -40), armL=("abs", 45, 20, 0))
    step = dict(rec, hips=(-0.28, 0, -0.06), hr=-12, legL=("ik", 0.08, ANKLE_Z + 0.2, 10), legR=("ik", -0.60, ANKLE_Z, -6),
                armR=("abs", 70, 40, -20), armL=("abs", 60, 30, 0))
    catch = dict(GUARD, hips=(-0.22, 0, -0.24), hr=14, chest=10, head=-24,
                 legL=("ik", 0.12, ANKLE_Z, 0), legR=("ik", -0.58, ANKLE_Z, 0))
    return [K(0, GUARD, "EASE_OUT"), K(4, rec), K(10, step), K(16, catch), K(24, GUARD)]


def stunned():
    base = dict(GUARD, hips=(0, 0, -0.14), hr=8, spine=6, chest=10, head=6, jaw=20,
                armR=("abs", 4, -22, -55), armL=("abs", -2, -10, 0))
    return [K(0, base, hrx=5, headz=12), K(15, base, hrx=-5, headz=-12, head=12), K(30, base, hrx=5, headz=12)]


def death():
    rec = dict(GUARD, hips=(-0.08, 0, -0.12), hr=-14, chest=-14, head=-4, jaw=24, armR=("abs", 50, 10, -50), armL=("abs", 40, 0, 0))
    buckle = dict(GUARD, hips=(-0.16, 0, -0.46), hr=-10, chest=-6, head=-8, jaw=18,
                  legL=("ik", 0.16, ANKLE_Z, 0), legR=("ik", -0.10, ANKLE_Z, 0), armR=("abs", 40, 20, -40), armL=("abs", 30, 10, 0))
    falling = dict(GUARD, hips=(-0.50, 0, -0.80), hr=-60, spine=-8, chest=-8, head=-10, jaw=20,
                   legL=("rel", -50, 40, 10), legR=("rel", -25, 20, 10),
                   armR=("abs", 20, 40, 60), armL=("abs", 10, 30, 0), splayArmR=40, splayArmL=30)
    lying = dict(GUARD, hips=(-0.70, 0, -HIP_Z + 0.42), hr=-90, spine=-2, chest=-4, head=-20, jaw=26,
                 legL=("rel", -14, 10, 10), legR=("rel", -6, 4, 10), splayL=8, splayR=6,
                 armR=("abs", 78, 84, 92), armL=("abs", 70, 76, 0), splayArmR=55, splayArmL=45)
    bounce = dict(lying, hips=(-0.70, 0, -HIP_Z + 0.50), hr=-84, head=-10)
    return [K(0, GUARD, "EASE_OUT"), K(4, rec), K(12, buckle, "EASE_IN"), K(22, falling, "EASE_IN"),
            K(28, lying, "EASE_OUT"), K(32, bounce, "EASE_IN"), K(36, lying)]


def victory():
    v = dict(GUARD, hips=(0, 0, -0.04), hr=-4, spine=-4, chest=-8, head=4, jaw=26,
             armR=("abs", -170, -180, -200), splayArmR=14, armL=("abs", -40, -150, -60), splayArmL=-14,
             legL=("ik", 0.26, ANKLE_Z, 0), legR=("ik", -0.26, ANKLE_Z, 0))
    beat = dict(v, armL=("abs", -10, -135, -50), chest=-6, jaw=30, hips=(0, 0, -0.08))
    keys = []
    for i in range(4):
        f = i * 15
        keys += [K(f, v, "EASE_IN"), K(f + 6, beat, "EASE_OUT")]
    keys.append(K(60, v))
    return keys


CLIPS = [("Idle", 2.0, idle, True), ("Walk", 1.2, walk, True), ("AttackLight", 1.0, attack_light, False),
         ("AttackHeavy", 1.0, attack_heavy, False), ("BlockRaise", 0.15, block_raise, False),
         ("BlockHold", 1.0, block_hold, True), ("Hit", 0.4, hit, False), ("Stagger", 0.8, stagger, False),
         ("Death", 1.2, death, False), ("Victory", 2.0, victory, True), ("Stunned", 1.0, stunned, True)]


def baked_frames(secs):
    return int(math.ceil(secs * 30 - 1e-6))


def build():
    scene.reset()
    mats = materials.library(MATERIALS)
    rig = Rig("Troll")
    for name, head, parent in JOINTS:
        rig.joint(name, head, parent)
    rig.socket("Socket_Head", (0.80, 0.0, 2.95), "J_Head")
    rig.socket("Socket_Projectile", tuple(HAND_C["R"]), "J_Hand_R")
    pieces = [("Troll_Pelvis", pelvis_geo(), "J_Hips"), ("Troll_LoinFront", loin_geo(True), "J_Loin"),
              ("Troll_LoinBack", loin_geo(False), "J_LoinBack"), ("Troll_Belly", belly_geo(), "J_Spine"),
              ("Troll_Chest", chest_geo(), "J_Chest"), ("Troll_Head", head_geo(), "J_Head"), ("Troll_Jaw", jaw_geo(), "J_Jaw"),
              ("Weapon_Club", club_geo(), "J_Hand_R")]
    for side, k in (("L", 1.0), ("R", -1.0)):
        pieces += arm_geos(side, k) + leg_geos(side, k)
    tris = 0
    for name, g, joint in pieces:
        obj = geom.to_object(name, g, mats)
        rig.attach(obj, joint)
        tris += g.tri_count()
    print("[troll] ~%d triangles" % tris)
    joints = {n: rig.joints[n] for n, _, _ in JOINTS}
    for name, secs, fn, cyc in CLIPS:
        anim.bake_clip(name, baked_frames(secs), fn(), joints, loc_joints=("J_Hips",), cyclic=cyc)
    return rig


def main():
    args = scene.script_args()
    out = args[0] if args else os.path.join(os.path.dirname(__file__), "..", "..", "app", "public", "assets", "models", "troll.glb")
    build()
    retime = {name: secs for name, secs, _, _ in CLIPS if abs(secs * 30 - round(secs * 30)) > 1e-6}
    export.export_glb(os.path.abspath(out), retime=retime)


if __name__ == "__main__":
    main()
