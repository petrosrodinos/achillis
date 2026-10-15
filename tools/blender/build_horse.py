"""Build app/public/assets/models/horse.glb — stylised war horse with caparison.

Run:
    blender -b --factory-startup -P tools/blender/build_horse.py -- app/public/assets/models/horse.glb

Rig: animated empties (no skin). Root `Horse` → `J_Body` (barrel, animated location+rotation)
→ neck/head/tail and per leg Upper/Lower/Hoof segments. `Saddle` is an empty on J_Body at the
seat surface; a rider's root goes there (the humanoid's mounted clips sit the pelvis on it).
Faces +X (Blender and glTF).
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from mathutils import Vector  # noqa: E402

from lib import anim, export, geom, materials, scene  # noqa: E402
from lib.anim import Key  # noqa: E402
from lib.geom import Geo, cylinder, loft, rounded_box, section as S, superquad, sweep, torus  # noqa: E402
from lib.rig import Rig, dir_angle, ik2  # noqa: E402

MATERIALS = ["Coat", "Mane", "Primary", "Secondary", "Leather", "Metal"]
BODY = Vector((0.0, 0.0, 1.22))
SADDLE = (0.04, 0.0, 1.61)
HOOF_LEN = 0.17

JOINTS = [
    ("J_Body", (0.0, 0.0, 1.22), None),
    ("J_Neck", (0.48, 0.0, 1.42), "J_Body"),
    ("J_Head", (0.84, 0.0, 1.95), "J_Neck"),
    ("J_Tail", (-0.76, 0.0, 1.42), "J_Body"),
]
LEGS = {}  # leg -> (upper, lower, hoof, bend_forward)
for side, s in (("L", 1.0), ("R", -1.0)):
    JOINTS += [
        ("J_FrontUpper_" + side, (0.44, s * 0.17, 1.12), "J_Body"),
        ("J_FrontLower_" + side, (0.46, s * 0.17, 0.60), "J_FrontUpper_" + side),
        ("J_FrontHoof_" + side, (0.47, s * 0.17, HOOF_LEN), "J_FrontLower_" + side),
        ("J_HindUpper_" + side, (-0.52, s * 0.17, 1.12), "J_Body"),
        ("J_HindLower_" + side, (-0.62, s * 0.17, 0.58), "J_HindUpper_" + side),
        ("J_HindHoof_" + side, (-0.59, s * 0.17, HOOF_LEN), "J_HindLower_" + side),
    ]
    LEGS["F" + side] = ("J_FrontUpper_" + side, "J_FrontLower_" + side, "J_FrontHoof_" + side, True)
    LEGS["H" + side] = ("J_HindUpper_" + side, "J_HindLower_" + side, "J_HindHoof_" + side, False)
REST = {n: Vector(h) for n, h, _ in JOINTS}


# =============================================================================================
# geometry
# =============================================================================================

def body_geo():
    xs = [-0.84, -0.78, -0.64, -0.45, -0.20, 0.10, 0.36, 0.52, 0.62, 0.68]
    zc = [1.31, 1.31, 1.30, 1.28, 1.24, 1.24, 1.29, 1.31, 1.33, 1.34]
    up = [0.08, 0.20, 0.27, 0.30, 0.28, 0.29, 0.31, 0.27, 0.19, 0.0]
    dn = [0.10, 0.22, 0.29, 0.31, 0.33, 0.34, 0.33, 0.29, 0.21, 0.0]
    wd = [0.09, 0.20, 0.27, 0.29, 0.28, 0.29, 0.27, 0.23, 0.17, 0.0]
    g = sweep([(x, 0, z) for x, z in zip(xs, zc)], [S(u, w, 2.2, rxb=d) for u, d, w in zip(up, dn, wd)],
              seg=16, normal_hint=(0, 0, 1), mat="Coat")
    return g


def caparison_geo():
    xs = [-0.88, -0.84, -0.70, -0.45, -0.15, 0.15, 0.40, 0.56, 0.66, 0.70]
    zc = [1.30, 1.30, 1.29, 1.27, 1.24, 1.24, 1.28, 1.30, 1.31, 1.31]
    up = [0.10, 0.22, 0.30, 0.325, 0.305, 0.315, 0.335, 0.30, 0.22, 0.0]
    hem = [0.86, 0.80, 0.76, 0.74, 0.74, 0.74, 0.76, 0.82, 0.90, 0.95]
    wd = [0.12, 0.23, 0.30, 0.315, 0.305, 0.315, 0.30, 0.26, 0.20, 0.0]
    secs = [S(u, w, 3.0, rxb=max(z - h, 0.05)) if u > 0 else S(0.0, 0.0) for u, w, z, h in zip(up, wd, zc, hem)]
    g = sweep([(x, 0, z) for x, z in zip(xs, zc)], secs, seg=20, normal_hint=(0, 0, 1), mat="Primary")

    def scallop(v):
        if v.z < 0.95:
            return Vector((v.x, v.y, v.z + 0.045 * abs(math.sin(v.x * 14.0 + v.y * 6.0))))
        return v
    g.deform(scallop)
    # trim band along the hem: a slightly inflated copy, keeping only the faces near the hem
    trim = sweep([(x, 0, z) for x, z in zip(xs, zc)],
                 [S(u + 0.006, w + 0.007, 3.0, rxb=max(z - h, 0.05) + 0.004) if u > 0 else S(0.0, 0.0)
                  for u, w, z, h in zip(up, wd, zc, hem)], seg=20, normal_hint=(0, 0, 1), mat="Secondary")
    trim.deform(scallop)
    trim.keep_faces(lambda vs: max(v.z for v in vs) < 0.93 + max(0.0, vs[0].x - 0.4) * 0.5)
    g.add(trim)
    # cross emblem on the flank (both sides)
    for s in (1, -1):
        g.add(rounded_box(0.07, 0.02, 0.30, 4.0, mat="Secondary").move(-0.30, s * 0.318, 1.10))
        g.add(rounded_box(0.22, 0.02, 0.07, 4.0, mat="Secondary").move(-0.30, s * 0.318, 1.15))
    return g


def saddle_geo():
    g = Geo()
    seat = superquad(0.24, 0.20, 0.05, 3.0, 2.2, seg=16, rings=6, mat="Leather").move(0.04, 0, 1.565)
    seat.deform(lambda v: Vector((v.x, v.y, v.z - 0.06 * (v.y / 0.2) ** 2)))
    g.add(seat)
    g.add(superquad(0.05, 0.11, 0.08, 2.5, 2.5, seg=12, rings=6, mat="Leather").move(0.25, 0, 1.63))
    g.add(superquad(0.05, 0.15, 0.10, 2.5, 2.5, seg=12, rings=6, mat="Leather").rotate(15, "Y").move(-0.20, 0, 1.66))
    g.add(superquad(0.055, 0.155, 0.02, 2.5, 2.5, seg=12, rings=4, mat="Secondary").rotate(15, "Y").move(-0.225, 0, 1.75))
    for s in (1, -1):
        g.add(rounded_box(0.30, 0.02, 0.28, 4.0, mat="Leather").move(0.04, s * 0.30, 1.40))
        g.add(sweep([(0.07, s * 0.31, 1.52), (0.08, s * 0.33, 1.20), (0.08, s * 0.335, 0.98)], [S(0.02, 0.006, 4.0)] * 3,
                    seg=6, normal_hint=(1, 0, 0), mat="Leather"))
        g.add(torus(0.05, 0.012, 12, 5, mat="Metal").rotate(90, "X").scale(1.0, 1.0, 1.2).move(0.08, s * 0.335, 0.93))
    # girth & peytral
    g.add(loft([-0.03, 0.03], [S(0.33, 0.30, 2.2), S(0.33, 0.30, 2.2)], seg=16).rotate(90, "Y").set_mat("Leather").move(0.10, 0, 1.24))
    pey = [(0.30, -0.26, 1.42), (0.55, -0.22, 1.30), (0.68, 0.0, 1.27), (0.55, 0.22, 1.30), (0.30, 0.26, 1.42)]
    g.add(sweep(pey, [S(0.03, 0.01, 4.0)] * 5, seg=6, normal_hint=(0, 0, 1), mat="Leather"))
    for p in pey[1:-1]:
        g.add(superquad(0.025, 0.025, 0.025, 2.0, 2.0, seg=8, rings=4, mat="Metal").move(p[0] + 0.012, p[1], p[2] - 0.03))
    return g


def neck_geo():
    pts = [(0.36, 0, 1.36), (0.52, 0, 1.55), (0.66, 0, 1.73), (0.78, 0, 1.90), (0.86, 0, 2.00)]
    g = sweep(pts, [S(0.26, 0.20, 2.2), S(0.21, 0.165, 2.2), S(0.165, 0.13, 2.2), S(0.13, 0.105, 2.2), S(0.11, 0.095, 2.2)],
              seg=14, normal_hint=(-1, 0, 1), mat="Coat")
    crest = [(0.24, 0, 1.56), (0.40, 0, 1.73), (0.55, 0, 1.89), (0.68, 0, 2.03), (0.80, 0, 2.12)]
    mane = sweep(crest, [S(0.08, 0.04, 2.0), S(0.085, 0.045, 2.0), S(0.08, 0.045, 2.0), S(0.07, 0.04, 2.0), S(0.0, 0.0)],
                 seg=10, normal_hint=(-1, 0, 1), mat="Mane")
    mane.deform(lambda v: Vector((v.x - 0.03 * abs(math.sin(v.z * 40)), v.y, v.z)))
    g.add(mane)
    # crinet (neck armour plates)
    for i, (a, b) in enumerate(((0.44, 1.60), (0.56, 1.75), (0.67, 1.89))):
        g.add(superquad(0.07, 0.10, 0.03, 2.5, 2.5, seg=12, rings=4, mat="Metal").rotate(-40, "Y").move(a - 0.10, 0, b + 0.06))
    # reins from the saddle pommel area to the bit (rigid, sagging)
    for s in (1, -1):
        r = [(0.28, s * 0.10, 1.66), (0.55, s * 0.13, 1.56), (0.85, s * 0.12, 1.62), (1.12, s * 0.085, 1.70)]
        g.add(sweep(r, [S(0.012, 0.006, 4.0)] * 4, seg=6, normal_hint=(0, 0, 1), mat="Leather"))
    return g


def head_geo():
    pts = [(0.78, 0, 2.02), (0.92, 0, 1.96), (1.06, 0, 1.84), (1.18, 0, 1.72), (1.26, 0, 1.64), (1.30, 0, 1.60)]
    secs = [S(0.12, 0.10, 2.2), S(0.13, 0.105, 2.2), S(0.10, 0.08, 2.2), S(0.085, 0.07, 2.2), S(0.08, 0.068, 2.2), S(0.0, 0.0)]
    g = sweep(pts, secs, seg=14, normal_hint=(1, 0, 1), mat="Coat")
    g.add(superquad(0.09, 0.07, 0.065, 2.2, 2.2, seg=12, rings=6, mat="Coat").rotate(-38, "Y").move(1.22, 0, 1.64))
    g.add(superquad(0.08, 0.075, 0.07, 2.2, 2.2, seg=12, rings=6, mat="Coat").move(0.90, 0, 1.90))
    for s in (1, -1):
        g.add(sweep([(0.80, s * 0.055, 2.06), (0.79, s * 0.065, 2.14), (0.80, s * 0.07, 2.22)], [S(0.035, 0.022), S(0.03, 0.018), S(0.0, 0.0)],
                    seg=8, normal_hint=(1, 0, 0), mat="Coat"))
        g.add(superquad(0.022, 0.014, 0.02, 2.0, 2.0, seg=8, rings=4, mat="Mane").move(0.96, s * 0.098, 1.95))
        g.add(superquad(0.016, 0.01, 0.012, 2.0, 2.0, seg=6, rings=3, mat="Mane").move(1.28, s * 0.045, 1.66))
        g.add(torus(0.03, 0.008, 10, 4, mat="Metal").rotate(90, "X").move(1.17, s * 0.075, 1.66))
    # forelock
    g.add(sweep([(0.82, 0, 2.08), (0.90, 0, 2.03), (0.95, 0, 1.97)], [S(0.04, 0.04), S(0.035, 0.035), S(0.0, 0.0)],
                seg=8, normal_hint=(0, 0, 1), mat="Mane"))
    # chanfron (face plate) along the front of the face
    ch = [(0.88, 0, 2.03), (1.00, 0, 1.93), (1.11, 0, 1.82), (1.20, 0, 1.73)]
    g.add(sweep(ch, [S(0.022, 0.08, 3.0), S(0.022, 0.085, 3.0), S(0.02, 0.07, 3.0), S(0.0, 0.0)], seg=10, normal_hint=(1, 0, 1), mat="Metal"))
    g.add(superquad(0.03, 0.03, 0.03, 2.0, 2.0, seg=8, rings=4, mat="Secondary").move(0.995, 0, 1.955))
    # bridle: noseband + cheek straps
    g.add(torus(1.0, 0.09, 16, 5, mat="Leather").scale(0.09, 0.08, 0.5).rotate(52, "Y").move(1.12, 0, 1.76))
    for s in (1, -1):
        g.add(sweep([(0.84, s * 0.09, 2.02), (0.98, s * 0.095, 1.86), (1.14, s * 0.08, 1.72)], [S(0.012, 0.006, 4.0)] * 3,
                    seg=6, normal_hint=(1, 0, 0), mat="Leather"))
    return g


def tail_geo():
    pts = [(-0.76, 0, 1.44), (-0.88, 0, 1.44), (-0.98, 0, 1.30), (-1.02, 0, 1.08), (-1.00, 0, 0.88), (-0.96, 0, 0.74)]
    g = sweep(pts, [S(0.05, 0.05), S(0.07, 0.06), S(0.09, 0.065), S(0.09, 0.06), S(0.07, 0.045), S(0.0, 0.0)],
              seg=10, normal_hint=(1, 0, 0), mat="Mane")
    g.deform(lambda v: Vector((v.x + 0.015 * math.sin(v.z * 30), v.y, v.z)))
    return g


def leg_geos(side, s):
    y = s * 0.17
    out = []
    fu = loft([1.24, 1.12, 0.95, 0.78, 0.66, 0.60], [S(0.14, 0.10, 2.2), S(0.14, 0.10, 2.2), S(0.11, 0.085, 2.2),
                                                   S(0.08, 0.065, 2.2), S(0.065, 0.055, 2.2), S(0.06, 0.05, 2.2)],
              seg=10, centers=[(0.44, y), (0.44, y), (0.45, y), (0.455, y), (0.46, y), (0.46, y)], mat="Coat")
    out.append(("Horse_FrontUpper_" + side, fu, "J_FrontUpper_" + side))
    fl = loft([0.66, 0.60, 0.52, 0.35, 0.22, 0.17], [S(0.06, 0.055), S(0.068, 0.06), S(0.05, 0.045), S(0.045, 0.04),
                                                   S(0.05, 0.045), S(0.055, 0.05)], seg=10,
              centers=[(0.46, y), (0.465, y), (0.465, y), (0.468, y), (0.47, y), (0.47, y)], mat="Coat")
    out.append(("Horse_FrontLower_" + side, fl, "J_FrontLower_" + side))
    out.append(("Horse_FrontHoof_" + side, hoof(0.47, y), "J_FrontHoof_" + side))

    hu = loft([1.30, 1.15, 0.98, 0.82, 0.68, 0.58], [S(0.10, 0.12, 2.2, rxb=0.20), S(0.11, 0.13, 2.2, rxb=0.19),
                                                   S(0.09, 0.11, 2.2, rxb=0.15), S(0.07, 0.08, 2.2, rxb=0.11),
                                                   S(0.06, 0.06, 2.2, rxb=0.08), S(0.05, 0.05, 2.2, rxb=0.06)],
              seg=12, centers=[(-0.48, y), (-0.52, y), (-0.555, y), (-0.58, y), (-0.60, y), (-0.615, y)], mat="Coat")
    out.append(("Horse_HindUpper_" + side, hu, "J_HindUpper_" + side))
    hl = loft([0.64, 0.58, 0.50, 0.35, 0.22, 0.17], [S(0.05, 0.05, 2.2, rxb=0.07), S(0.055, 0.055, 2.2, rxb=0.075),
                                                   S(0.045, 0.045), S(0.042, 0.04), S(0.05, 0.045), S(0.055, 0.05)], seg=10,
              centers=[(-0.615, y), (-0.62, y), (-0.612, y), (-0.60, y), (-0.592, y), (-0.59, y)], mat="Coat")
    out.append(("Horse_HindLower_" + side, hl, "J_HindLower_" + side))
    out.append(("Horse_HindHoof_" + side, hoof(-0.59, y), "J_HindHoof_" + side))
    return out


def hoof(x, y):
    g = loft([0.19, 0.15, 0.09], [S(0.058, 0.052), S(0.052, 0.046), S(0.05, 0.045)], seg=10,
             centers=[(x, y), (x + 0.008, y), (x + 0.02, y)], mat="Coat")
    g.add(loft([0.20, 0.13, 0.07, 0.04], [S(0.07, 0.065), S(0.08, 0.07), S(0.085, 0.07), S(0.0, 0.0)], seg=10,
               centers=[(x - 0.01, y), (x + 0.0, y), (x + 0.01, y), (x + 0.01, y)], mat="Mane"))
    g.add(loft([0.0, 0.10], [S(0.075, 0.065, 2.0, rxb=0.055), S(0.062, 0.055, 2.0, rxb=0.05)], seg=10,
               centers=[(x + 0.035, y), (x + 0.025, y)], mat="Leather"))
    return g


# =============================================================================================
# animation
# =============================================================================================

def seg_rest_angle(a, b):
    d = REST[b] - REST[a]
    return dir_angle(d.x, d.z)


def joint_world(name, body_l, body_r):
    """World (x, z) of a body-child joint for body offset (dx, dz) and pitch body_r (deg)."""
    rel = REST[name] - BODY
    t = math.radians(body_r)
    x = rel.x * math.cos(t) + rel.z * math.sin(t)
    z = -rel.x * math.sin(t) + rel.z * math.cos(t)
    return BODY.x + body_l[0] + x, BODY.z + body_l[2] + z


def leg_pose(p, leg, body_l, body_r, toe_xz=None, curl=0.0, fk=None):
    """IK: toe ground point (x, z) + hoof curl angle; or fk=(upper_rel, lower_rel, hoof_rel)."""
    up, lo, ho, fwd = LEGS[leg]
    if fk is not None:
        p[up] = {"r": (0, fk[0], 0)}
        p[lo] = {"r": (0, fk[1], 0)}
        p[ho] = {"r": (0, fk[2], 0)}
        return
    c = math.radians(curl)
    fx, fz = toe_xz[0] + HOOF_LEN * math.sin(c), toe_xz[1] + HOOF_LEN * math.cos(c)
    root = joint_world(up, body_l, body_r)
    l1 = (REST[lo] - REST[up]).length
    l2 = (REST[ho] - REST[lo]).length
    ua, la = ik2(root, (fx, fz), l1, l2, bend_forward=fwd)
    ur, lr = seg_rest_angle(up, lo), seg_rest_angle(lo, ho)
    p[up] = {"r": (0, (ua - ur) - body_r, 0)}
    p[lo] = {"r": (0, (la - lr) - (ua - ur), 0)}
    p[ho] = {"r": (0, curl - (la - lr), 0)}


def hpose(body_l=(0, 0, 0), body_r=0.0, body_x=0.0, neck=0.0, head=0.0, tail=(0.0, 0.0), legs=None):
    p = {"J_Body": {"r": (body_x, body_r, 0), "l": tuple(body_l)},
         "J_Neck": {"r": (0, neck, 0)}, "J_Head": {"r": (0, head, 0)},
         "J_Tail": {"r": (0, tail[0], tail[1])}}
    legs = legs or {}
    for leg in LEGS:
        spec = legs.get(leg)
        rest_x = REST[LEGS[leg][2]].x
        if spec is None:
            leg_pose(p, leg, body_l, body_r, (rest_x, 0.0), 0.0)
        elif spec[0] == "fk":
            leg_pose(p, leg, body_l, body_r, fk=spec[1:])
        else:
            _, dx, z, curl = spec
            leg_pose(p, leg, body_l, body_r, (rest_x + dx, z), curl)
    return p


def gait_leg(phase, duty, stride, lift, curl_max):
    ph = phase % 1.0
    if ph < duty:
        t = ph / duty
        return ("ik", stride / 2 - stride * t, 0.0, 25.0 * t ** 4)
    t = (ph - duty) / (1 - duty)
    x = -stride / 2 + stride * (0.5 - 0.5 * math.cos(math.pi * t))
    z = lift * math.sin(math.pi * t) ** 1.2
    return ("ik", x, z, curl_max * math.sin(math.pi * min(1.0, t * 1.15)))


def cycle(frames, offsets, duty, stride, lift, curl, body_fn):
    keys = []
    for f in range(frames + 1):
        ph = f / frames
        legs = {}
        for leg, off in offsets.items():
            front = leg.startswith("F")
            legs[leg] = gait_leg(ph - off, duty, stride, lift * (1.15 if front else 0.85), curl * (1.0 if front else 0.7))
        b = body_fn(ph)
        keys.append(Key(f, hpose(legs=legs, **b), "LINEAR"))
    return keys


def clip_idle():
    def k(f, t):
        return Key(f, hpose(body_l=(0, 0, -0.012 * t), neck=3 * t, head=-4 * t, tail=(4 * t, 12 - 24 * t)))
    return [k(0, 0), k(30, 1), k(60, 0)]


def clip_walk():
    offs = {"HL": 0.0, "FL": 0.25, "HR": 0.5, "FR": 0.75}

    def body(ph):
        return dict(body_l=(0, 0, -0.012 + 0.012 * math.cos(4 * math.pi * ph)), body_r=1.2 * math.sin(4 * math.pi * ph),
                    neck=4 * math.sin(4 * math.pi * ph + 0.8), head=-3 * math.sin(4 * math.pi * ph + 0.8),
                    tail=(6, 10 * math.sin(2 * math.pi * ph)))
    return cycle(36, offs, 0.62, 0.62, 0.14, 70, body)


def clip_gallop():
    offs = {"HL": 0.0, "HR": 0.09, "FL": 0.36, "FR": 0.45}

    def body(ph):
        w = 2 * math.pi * ph
        return dict(body_l=(0.0, 0, 0.03 + 0.06 * math.sin(w - 1.9)), body_r=7 * math.sin(w - 0.4),
                    neck=-10 * math.sin(w - 0.9) - 6, head=6 * math.sin(w - 0.9) + 4, tail=(35 + 10 * math.sin(w), 0))
    return cycle(18, offs, 0.36, 1.25, 0.34, 95, body)


def clip_rear():
    idle = hpose()
    crouch = hpose(body_l=(-0.05, 0, -0.07), body_r=4, neck=-8, head=4,
                   legs={"HL": ("ik", 0.05, 0, 0), "HR": ("ik", 0.05, 0, 0)})
    up = dict(body_l=(-0.30, 0, 0.26), body_r=-42, neck=-12, head=18, tail=(-10, 0))
    up_legs = {"HL": ("ik", 0.18, 0, 0), "HR": ("ik", 0.26, 0, 0),
               "FL": ("fk", -70, 110, 40), "FR": ("fk", -40, 100, 40)}
    up2_legs = {"HL": ("ik", 0.18, 0, 0), "HR": ("ik", 0.26, 0, 0),
                "FL": ("fk", -40, 100, 40), "FR": ("fk", -75, 110, 40)}
    return [Key(0, idle, "EASE_OUT"), Key(6, crouch, "EASE_IN"), Key(13, hpose(legs=up_legs, **up)),
            Key(18, hpose(legs=up2_legs, **dict(up, body_r=-46, body_l=(-0.32, 0, 0.29)))),
            Key(22, hpose(legs=up_legs, **up), "EASE_IN"),
            Key(27, hpose(body_l=(0.02, 0, -0.04), body_r=3, neck=6, head=-6), "BACK_OUT"), Key(30, idle)]


def clip_hit():
    idle = hpose()
    rec = hpose(body_l=(-0.06, 0, -0.03), body_r=-5, neck=-16, head=12, tail=(20, 10))
    return [Key(0, idle, "EASE_OUT"), Key(3, rec), Key(12, idle)]


def clip_death():
    idle = hpose()
    buckle = hpose(body_l=(0.02, 0, -0.28), body_r=14, neck=14, head=-10,
                   legs={"FL": ("fk", -10, 110, 30), "FR": ("fk", -15, 100, 30)})
    sink = hpose(body_l=(-0.05, 0, -0.62), body_r=6, neck=24, head=-5,
                 legs={"FL": ("fk", -25, 140, 40), "FR": ("fk", -30, 135, 40),
                       "HL": ("fk", -60, 120, 30), "HR": ("fk", -55, 115, 30)})
    roll = hpose(body_l=(-0.05, 0, -0.82), body_r=0, body_x=70, neck=30, head=-12,
                 legs={"FL": ("fk", -20, 40, 20), "FR": ("fk", -40, 60, 20),
                       "HL": ("fk", 20, -30, 20), "HR": ("fk", 10, -10, 20)}, tail=(10, 0))
    lying = hpose(body_l=(-0.05, 0, -0.90), body_r=0, body_x=84, neck=36, head=-18,
                  legs={"FL": ("fk", -15, 30, 15), "FR": ("fk", -30, 45, 15),
                        "HL": ("fk", 25, -25, 15), "HR": ("fk", 15, -10, 15)}, tail=(20, 0))
    return [Key(0, idle, "EASE_OUT"), Key(10, buckle, "EASE_IN"), Key(22, sink), Key(32, roll, "EASE_IN"),
            Key(38, lying, "BACK_OUT"), Key(45, lying)]


CLIPS = [("Idle", 2.0, clip_idle, True), ("Walk", 1.2, clip_walk, True), ("Gallop", 0.6, clip_gallop, True),
         ("Rear", 1.0, clip_rear, False), ("Hit", 0.4, clip_hit, False), ("Death", 1.5, clip_death, False)]


def build():
    scene.reset()
    mats = materials.library(MATERIALS)
    rig = Rig("Horse")
    for name, head, parent in JOINTS:
        rig.joint(name, head, parent)
    rig.socket("Saddle", SADDLE, "J_Body")
    pieces = [("Horse_Body", body_geo(), "J_Body"), ("Horse_Caparison", caparison_geo(), "J_Body"),
              ("Horse_Saddle", saddle_geo(), "J_Body"), ("Horse_Neck", neck_geo(), "J_Neck"),
              ("Horse_Head", head_geo(), "J_Head"), ("Horse_Tail", tail_geo(), "J_Tail")]
    for side, s in (("L", 1.0), ("R", -1.0)):
        pieces += leg_geos(side, s)
    tris = 0
    for name, g, joint in pieces:
        obj = geom.to_object(name, g, mats)
        rig.attach(obj, joint)
        tris += g.tri_count()
    print("[horse] ~%d triangles" % tris)
    joints = {n: rig.joints[n] for n, _, _ in JOINTS}
    for name, secs, fn, cyc in CLIPS:
        anim.bake_clip(name, int(round(secs * 30)), fn(), joints, loc_joints=("J_Body",), cyclic=cyc)
    return rig


def main():
    args = scene.script_args()
    out = args[0] if args else os.path.join(os.path.dirname(__file__), "..", "..", "app", "public", "assets", "models", "horse.glb")
    build()
    export.export_glb(os.path.abspath(out))


if __name__ == "__main__":
    main()
