"""Build app/public/assets/models/hippogryph.glb — eagle-fronted, horse-hindquartered flying mount.

Run:
    blender -b --factory-startup -P tools/blender/build_hippogryph.py -- app/public/assets/models/hippogryph.glb

Rig: animated empties (no skin). Root `Hippogryph` → `J_Body` (barrel, animated location+rotation)
→ neck/head/tail, eagle forelegs (Upper/Lower/Foot), horse hind legs (Upper/Lower/Hoof) and two
3-segment wings (`J_Wing1..3_L/R`: shoulder / elbow / wrist). `Saddle` is an empty on J_Body at
the seat surface (same convention as horse.glb: the humanoid's mounted clips sit the pelvis
0.10 m above it). Faces +X.
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from mathutils import Vector  # noqa: E402

from lib import anim, export, geom, materials, scene  # noqa: E402
from lib.anim import Key  # noqa: E402
from lib.creature import LegRig, WingSpec, claw, eye, feather, mirror_r  # noqa: E402
from lib.geom import Geo, loft, rounded_box, section as S, superquad, sweep, torus  # noqa: E402
from lib.rig import Rig  # noqa: E402

MATERIALS = ["Feathers", "Coat", "Beak", "Eye", "Leather"]
SADDLE = (-0.22, 0.0, 1.64)

WING = WingSpec(root=(0.36, 0.22, 1.60), spans=[0.62, 0.68, 0.52], le_th=[0.075, 0.06, 0.045],
                coverts=[(0.30, 0.032), (0.30, 0.024)], secondary=(5, 0.64, 0.115),
                primary=(7, 0.62, 1.00, 0.125, 6, 60), thick=0.014)

JOINTS = [
    ("J_Body", (0.0, 0.0, 1.25), None),
    ("J_Neck", (0.50, 0.0, 1.50), "J_Body"),
    ("J_Head", (0.84, 0.0, 2.02), "J_Neck"),
    ("J_Tail", (-0.80, 0.0, 1.44), "J_Body"),
]
LEGS = {}
for _side, _s in (("L", 1.0), ("R", -1.0)):
    JOINTS += [
        ("J_FrontUpper_" + _side, (0.48, _s * 0.17, 1.08), "J_Body"),
        ("J_FrontLower_" + _side, (0.40, _s * 0.17, 0.58), "J_FrontUpper_" + _side),
        ("J_FrontFoot_" + _side, (0.46, _s * 0.17, 0.11), "J_FrontLower_" + _side),
        ("J_HindUpper_" + _side, (-0.52, _s * 0.17, 1.14), "J_Body"),
        ("J_HindLower_" + _side, (-0.62, _s * 0.17, 0.58), "J_HindUpper_" + _side),
        ("J_HindHoof_" + _side, (-0.59, _s * 0.17, 0.16), "J_HindLower_" + _side),
    ]
    LEGS["F" + _side] = ("J_FrontUpper_" + _side, "J_FrontLower_" + _side, "J_FrontFoot_" + _side, False)
    LEGS["H" + _side] = ("J_HindUpper_" + _side, "J_HindLower_" + _side, "J_HindHoof_" + _side, False)
JOINTS += WING.joints("J_Body")


# =============================================================================================
# geometry
# =============================================================================================

def body_geo():
    xs = [-0.86, -0.80, -0.66, -0.46, -0.20, 0.10, 0.36, 0.54, 0.66, 0.72]
    zc = [1.34, 1.34, 1.33, 1.31, 1.27, 1.27, 1.31, 1.34, 1.36, 1.37]
    up = [0.08, 0.20, 0.27, 0.30, 0.28, 0.29, 0.31, 0.28, 0.20, 0.0]
    dn = [0.10, 0.22, 0.29, 0.31, 0.32, 0.33, 0.33, 0.30, 0.22, 0.0]
    wd = [0.09, 0.20, 0.27, 0.29, 0.28, 0.29, 0.28, 0.25, 0.19, 0.0]
    g = sweep([(x, 0, z) for x, z in zip(xs, zc)], [S(u, w, 2.2, rxb=d) for u, d, w in zip(up, dn, wd)],
              seg=16, normal_hint=(0, 0, 1), mat="Coat")
    # feathered front half: two overlapping mantles with scalloped trailing edges
    for row, (x0, grow) in enumerate(((-0.02, 0.030), (0.22, 0.045))):
        fx = [x0, x0 + 0.12, 0.36, 0.54, 0.66, 0.74]
        fz = [1.28, 1.28, 1.31, 1.34, 1.36, 1.37]
        fu = [0.29, 0.31, 0.32, 0.29, 0.22, 0.0]
        fd = [0.33, 0.34, 0.35, 0.33, 0.26, 0.0]
        fw = [0.29, 0.30, 0.29, 0.26, 0.20, 0.0]
        m = sweep([(x, 0, z) for x, z in zip(fx, fz)],
                  [S(u + grow, w + grow, 2.2, rxb=d + grow) if u else S(0.0, 0.0) for u, d, w in zip(fu, fd, fw)],
                  seg=16, normal_hint=(0, 0, 1), mat="Feathers")

        def scal(v, x0=x0):
            if v.x < x0 + 0.13:
                a = math.atan2(v.y, v.z - 1.28)
                return Vector((v.x - 0.07 * abs(math.sin(a * 4.0)), v.y, v.z))
            return v
        m.deform(scal)
        g.add(m)
    # chest tuft hanging between the forelegs
    for k, y in enumerate((-0.12, 0.0, 0.12)):
        g.add(feather((0.66, y, 1.12), (0.25, 0, -1), 0.30, 0.07, thick=0.02, up=(1, 0, 0.2), arch=0.03))
    return g


def saddle_geo():
    sx, _, sz = SADDLE
    g = Geo()
    seat = superquad(0.24, 0.20, 0.05, 3.0, 2.2, seg=16, rings=6, mat="Leather").move(sx, 0, sz - 0.045)
    seat.deform(lambda v: Vector((v.x, v.y, v.z - 0.06 * (v.y / 0.2) ** 2)))
    g.add(seat)
    g.add(superquad(0.05, 0.11, 0.08, 2.5, 2.5, seg=12, rings=6, mat="Leather").move(sx + 0.21, 0, sz + 0.02))
    g.add(superquad(0.05, 0.15, 0.10, 2.5, 2.5, seg=12, rings=6, mat="Leather").rotate(15, "Y").move(sx - 0.24, 0, sz + 0.05))
    for s in (1, -1):
        g.add(rounded_box(0.30, 0.02, 0.26, 4.0, mat="Leather").move(sx, s * 0.30, sz - 0.22))
    g.add(loft([-0.03, 0.03], [S(0.33, 0.31, 2.2), S(0.33, 0.31, 2.2)], seg=16).rotate(90, "Y").set_mat("Leather").move(sx + 0.10, 0, 1.27))
    # breast collar running to the neck feathers
    pey = [(0.30, -0.27, 1.45), (0.62, -0.20, 1.30), (0.74, 0.0, 1.27), (0.62, 0.20, 1.30), (0.30, 0.27, 1.45)]
    g.add(sweep(pey, [S(0.03, 0.012, 4.0)] * 5, seg=6, normal_hint=(0, 0, 1), mat="Leather"))
    return g


def neck_geo():
    pts = [(0.36, 0, 1.36), (0.52, 0, 1.56), (0.66, 0, 1.76), (0.78, 0, 1.94), (0.86, 0, 2.06)]
    g = sweep(pts, [S(0.28, 0.22, 2.2), S(0.23, 0.18, 2.2), S(0.18, 0.145, 2.2), S(0.145, 0.12, 2.2), S(0.12, 0.10, 2.2)],
              seg=14, normal_hint=(-1, 0, 1), mat="Feathers")
    # hackles: layered pointed feathers down the nape and sides
    for i in range(6):
        t = i / 5
        x = 0.80 - 0.42 * t
        z = 2.10 - 0.52 * t
        for y, side_up in ((0.0, (0, 0, 1)), (0.11, (0, 1, 0.6)), (-0.11, (0, -1, 0.6))):
            if y and i == 0:
                continue
            base = Vector((x - 0.02, y * (0.8 + 0.6 * t), z))
            g.add(feather(base, (-0.75, y * 0.6, -0.55), 0.20 + 0.10 * t, 0.06 + 0.02 * t, thick=0.018,
                          up=side_up, arch=0.02))
    # reins: pommel → bridle
    for s in (1, -1):
        r = [(SADDLE[0] + 0.24, s * 0.11, SADDLE[2] + 0.05), (0.50, s * 0.15, 1.72), (0.80, s * 0.13, 1.96), (1.00, s * 0.10, 2.05)]
        g.add(sweep(r, [S(0.012, 0.006, 4.0)] * 4, seg=6, normal_hint=(0, 0, 1), mat="Leather"))
    return g


def head_geo():
    g = Geo()
    skull = superquad(0.17, 0.125, 0.15, 2.2, 2.2, seg=16, rings=8, mat="Feathers", rxb=0.20)
    g.add(skull.move(0.92, 0, 2.12))
    # cheeks / jowl feathers
    for s in (1, -1):
        g.add(feather((0.92, s * 0.10, 2.05), (-0.8, s * 0.25, -0.5), 0.20, 0.07, thick=0.02, up=(0, s, 0.3), arch=0.02))
        # brow ridge over the eye
        g.add(sweep([(0.93, s * 0.09, 2.20), (1.01, s * 0.105, 2.20), (1.07, s * 0.08, 2.17)],
                    [S(0.028, 0.03), S(0.03, 0.03), S(0.0, 0.0)], seg=8, normal_hint=(0, 0, 1), mat="Feathers"))
        g.add(eye((1.005, s * 0.103, 2.155), 0.032))
        # ear tufts
        g.add(feather((0.86, s * 0.07, 2.24), (-0.85, s * 0.15, 0.45), 0.20, 0.05, thick=0.016, up=(0.4, 0, 1), arch=0.03))
    # crest feathers
    g.add(feather((0.84, 0, 2.25), (-0.9, 0, 0.25), 0.22, 0.06, thick=0.016, up=(0.25, 0, 1), arch=0.03))
    # hooked beak: upper mandible
    up_pts = [(0.99, 0, 2.115), (1.08, 0, 2.125), (1.16, 0, 2.09), (1.215, 0, 2.03), (1.225, 0, 1.97), (1.21, 0, 1.94)]
    g.add(sweep(up_pts, [S(0.062, 0.062, 2.2, rxb=0.035), S(0.05, 0.05, 2.2, rxb=0.028), S(0.038, 0.036, 2.2, rxb=0.02),
                         S(0.026, 0.024), S(0.016, 0.014), S(0.0, 0.0)], seg=10, normal_hint=(0, 0, 1), mat="Beak"))
    g.add(sweep([(0.985, 0, 2.05), (1.08, 0, 2.035), (1.16, 0, 2.03)], [S(0.032, 0.05, 2.2), S(0.022, 0.035, 2.2), S(0.0, 0.0)],
                seg=10, normal_hint=(0, 0, 1), mat="Beak"))
    # cere band + bridle strap
    g.add(torus(1.0, 0.18, 14, 5, mat="Beak").scale(0.07, 0.07, 0.25).rotate(90, "Y").rotate(-8, "Y").move(1.0, 0, 2.09))
    g.add(torus(1.0, 0.12, 14, 5, mat="Leather").scale(0.115, 0.13, 0.35).rotate(90, "Y").rotate(-25, "Y").move(0.94, 0, 2.10))
    return g


def tail_geo():
    pts = [(-0.80, 0, 1.46), (-0.92, 0, 1.46), (-1.02, 0, 1.32), (-1.06, 0, 1.10), (-1.04, 0, 0.88), (-0.99, 0, 0.72)]
    g = sweep(pts, [S(0.05, 0.05), S(0.065, 0.055), S(0.07, 0.05), S(0.06, 0.045), S(0.04, 0.03), S(0.0, 0.0)],
              seg=10, normal_hint=(1, 0, 0), mat="Feathers")
    # layered plume: pointed feathers growing out of the dock, longer and wider towards the tip
    P = [Vector(p) for p in pts]
    for i in range(1, 5):
        a, b = P[i], P[i + 1]
        t = (b - a).normalized()
        k = i / 4
        for side in (-1, 0, 1):
            out = Vector((0, side * 0.06, 0))
            d = (t + Vector((-0.25 - 0.1 * k, side * 0.35, 0))).normalized()
            g.add(feather(a + out, d, 0.24 + 0.16 * k, 0.07 + 0.03 * k, thick=0.016,
                          up=(1.0, side * 0.6, 0.0), arch=0.03))
    for k, y in enumerate((-0.05, 0.0, 0.05)):
        g.add(feather((-1.03, y, 0.86), (-0.15 + 0.12 * (k - 1), y * 2.0, -1.0), 0.36, 0.08, thick=0.018, up=(1, 0, 0), arch=0.03))
    return g


def front_leg_geos(side, s):
    y = s * 0.17
    out = []
    # feathered "trousers"
    up = loft([1.16, 1.04, 0.90, 0.76, 0.66, 0.60], [S(0.15, 0.11, 2.2), S(0.15, 0.12, 2.2), S(0.13, 0.105, 2.2),
                                                    S(0.105, 0.09, 2.2), S(0.085, 0.075, 2.2), S(0.06, 0.055, 2.2)],
              seg=12, centers=[(0.50, y), (0.49, y), (0.465, y), (0.44, y), (0.42, y), (0.405, y)], mat="Feathers")
    for k in range(7):
        a = 2 * math.pi * k / 7
        base = Vector((0.43 + 0.08 * math.cos(a), y + 0.07 * math.sin(a), 0.70))
        up.add(feather(base, (0.15 * math.cos(a), 0.15 * math.sin(a), -1), 0.16, 0.05, thick=0.014,
                       up=(math.cos(a), math.sin(a), 0), arch=0.01))
    out.append(("Hippogryph_FrontUpper_" + side, up, "J_FrontUpper_" + side))
    # scaly tarsus
    lo = loft([0.62, 0.50, 0.30, 0.13], [S(0.055, 0.05), S(0.045, 0.042), S(0.04, 0.038), S(0.045, 0.042)], seg=10,
              centers=[(0.405, y), (0.42, y), (0.445, y), (0.46, y)], mat="Beak")
    for z in (0.46, 0.38, 0.30, 0.22):
        lo.add(torus(0.044, 0.008, 10, 4, mat="Beak").move(0.43 + (0.46 - z) * 0.1, y, z))
    out.append(("Hippogryph_FrontLower_" + side, lo, "J_FrontLower_" + side))
    # foot: three toes forward + hallux back, dark talons
    f = superquad(0.06, 0.055, 0.045, 2.2, 2.2, seg=10, rings=5, mat="Beak").move(0.47, y, 0.08)
    for ang, L in ((-22, 0.17), (0, 0.19), (22, 0.16)):
        d = Vector((math.cos(math.radians(ang)), math.sin(math.radians(ang)) * s, 0))
        base = Vector((0.47, y, 0.075))
        tip = base + d * L + Vector((0, 0, -0.04))
        f.add(sweep([base, base + d * L * 0.5 + Vector((0, 0, -0.02)), tip], [S(0.03, 0.028), S(0.025, 0.024), S(0.022, 0.02)],
                    seg=8, normal_hint=(0, 0, 1), mat="Beak"))
        f.add(claw(tip + d * 0.01, d + Vector((0, 0, -0.2)), 0.08, 0.018, "Eye", curl=0.9))
    hb = Vector((0.45, y, 0.07))
    f.add(sweep([hb, hb + Vector((-0.09, 0, -0.03))], [S(0.026), S(0.022)], seg=8, normal_hint=(0, 0, 1), mat="Beak"))
    f.add(claw(hb + Vector((-0.095, 0, -0.03)), (-1, 0, -0.2), 0.07, 0.016, "Eye", curl=0.9))
    f.deform(lambda v: Vector((v.x, v.y, max(v.z, 0.004))))
    out.append(("Hippogryph_FrontFoot_" + side, f, "J_FrontFoot_" + side))
    return out


def hind_leg_geos(side, s):
    y = s * 0.17
    out = []
    hu = loft([1.32, 1.17, 1.00, 0.84, 0.70, 0.58], [S(0.10, 0.12, 2.2, rxb=0.20), S(0.11, 0.13, 2.2, rxb=0.19),
                                                   S(0.09, 0.11, 2.2, rxb=0.15), S(0.07, 0.08, 2.2, rxb=0.11),
                                                   S(0.06, 0.06, 2.2, rxb=0.08), S(0.05, 0.05, 2.2, rxb=0.06)],
              seg=12, centers=[(-0.48, y), (-0.52, y), (-0.555, y), (-0.58, y), (-0.60, y), (-0.615, y)], mat="Coat")
    out.append(("Hippogryph_HindUpper_" + side, hu, "J_HindUpper_" + side))
    hl = loft([0.64, 0.58, 0.50, 0.35, 0.22, 0.17], [S(0.05, 0.05, 2.2, rxb=0.07), S(0.055, 0.055, 2.2, rxb=0.075),
                                                   S(0.045, 0.045), S(0.042, 0.04), S(0.05, 0.045), S(0.055, 0.05)], seg=10,
              centers=[(-0.615, y), (-0.62, y), (-0.612, y), (-0.60, y), (-0.592, y), (-0.59, y)], mat="Coat")
    out.append(("Hippogryph_HindLower_" + side, hl, "J_HindLower_" + side))
    x = -0.59
    h = loft([0.20, 0.15, 0.10], [S(0.058, 0.052), S(0.052, 0.046), S(0.05, 0.045)], seg=10,
             centers=[(x, y), (x + 0.008, y), (x + 0.02, y)], mat="Coat")
    h.add(loft([0.21, 0.13, 0.07, 0.04], [S(0.07, 0.065), S(0.08, 0.07), S(0.085, 0.07), S(0.0, 0.0)], seg=10,
               centers=[(x - 0.01, y), (x, y), (x + 0.01, y), (x + 0.01, y)], mat="Feathers"))
    h.add(loft([0.0, 0.10], [S(0.075, 0.065, 2.0, rxb=0.055), S(0.062, 0.055, 2.0, rxb=0.05)], seg=10,
               centers=[(x + 0.035, y), (x + 0.025, y)], mat="Eye"))
    out.append(("Hippogryph_HindHoof_" + side, h, "J_HindHoof_" + side))
    return out


# =============================================================================================
# animation
# =============================================================================================

RIG = None
LEGRIG = None

def folded_shoulder(tilt=30.0, roll=0.0):
    """Shoulder euler (deg, XYZ) that lays the left wing along the flank: span back-up by `tilt`,
    leading edge on top, feathers hanging back-down; `roll` lifts the trailing edge outwards."""
    from mathutils import Matrix
    m = (Matrix.Rotation(math.radians(tilt), 3, "Y") @ Matrix.Rotation(math.radians(90), 3, "Z")
         @ Matrix.Rotation(math.radians(-90), 3, "Y") @ Matrix.Rotation(math.radians(roll), 3, "X"))
    return tuple(math.degrees(a) for a in m.to_euler("XYZ"))


FOLDED = [folded_shoulder(), (6, 0, 166), (-4, 0, -158)]
SPREAD = [(0, 0, 0), (0, 0, 0), (0, 0, 0)]


def wing_pose(p, left, right=None):
    right = right if right is not None else left
    for i in range(3):
        p["J_Wing%d_L" % (i + 1)] = {"r": tuple(left[i])}
        p["J_Wing%d_R" % (i + 1)] = {"r": mirror_r(right[i], -1.0)}


def hpose(body_l=(0, 0, 0), body_r=0.0, body_x=0.0, neck=0.0, head=0.0, head_yaw=0.0, tail=(0.0, 0.0),
          wings=None, wingsR=None, legs=None):
    p = {"J_Body": {"r": (body_x, body_r, 0), "l": tuple(body_l)},
         "J_Neck": {"r": (0, neck, 0)}, "J_Head": {"r": (0, head, head_yaw)},
         "J_Tail": {"r": (0, tail[0], tail[1])}}
    wing_pose(p, wings or FOLDED, wingsR)
    LEGRIG.pose_legs(p, legs)
    return p


TUCK = {"FL": ("abs", 55, 95, 110), "FR": ("abs", 45, 85, 105),
        "HL": ("abs", 50, 78, 85), "HR": ("abs", 58, 86, 92)}


def flap_wing(t):
    """Wing segment rotations over a flap cycle t∈[0,1): 0 = top of the upstroke."""
    # downstroke takes 45 % of the cycle, upstroke 55 %
    u = 0.5 * t / 0.45 if t < 0.45 else 0.5 + 0.5 * (t - 0.45) / 0.55
    w = 2 * math.pi * u
    sh = 14 + 52 * math.cos(w)                      # +66 top … -38 bottom
    el = 16 * math.cos(w - 1.0) - 4                 # outer wing lags
    wr = 24 * math.cos(w - 1.8) + 2
    up = max(0.0, math.sin(w - math.pi))            # 1 during mid upstroke → fold the wing back
    lean = 16 * max(0.0, math.cos(w)) - 6 * max(0.0, -math.cos(w))   # tilt forward at the top, back at the bottom
    return [(sh, lean, -6 * math.sin(w)), (el, 0, 26 * up), (wr, 0, 34 * up)]


def clip_fly():
    keys = []
    n = 24
    for f in range(n + 1):
        t = f / n
        w = 2 * math.pi * t
        bob = 0.07 * math.sin(w - 0.6)
        keys.append(Key(f, hpose(body_l=(0, 0, bob), body_r=-4 + 3 * math.sin(w + 0.6), neck=12 + 4 * math.sin(w),
                                 head=-12 - 5 * math.sin(w), tail=(62 + 6 * math.sin(w - 1.2), 0),
                                 wings=flap_wing(t), legs=TUCK), "LINEAR"))
    return keys


GLIDE_W = [(24, 6, 4), (-6, 0, 6), (14, 0, 8)]


def glide(t):
    w = 2 * math.pi * t
    wing = [(GLIDE_W[0][0] + 3 * math.sin(w), GLIDE_W[0][1], GLIDE_W[0][2]), (GLIDE_W[1][0] - 2 * math.sin(w - 0.6), 0, GLIDE_W[1][2]),
            (GLIDE_W[2][0] + 3 * math.sin(w - 1.2), 0, GLIDE_W[2][2])]
    return dict(body_l=(0, 0, 0.05 * math.sin(w)), body_r=-2 + 1.5 * math.sin(w + 1.0), neck=10 + 2 * math.sin(w),
                head=-10 - 2 * math.sin(w), head_yaw=5 * math.sin(w * 0.5 + 1), tail=(66 + 4 * math.sin(w - 1.0), 4 * math.sin(w)),
                wings=wing, legs=TUCK)


def clip_glide():
    return [Key(f, hpose(**glide(f / 60.0))) for f in range(0, 61, 10)]


def clip_idle():
    def k(f, t):
        return Key(f, hpose(body_l=(0, 0, -0.012 * t), neck=4 * t - 2, head=-6 * t + 3, head_yaw=-14 + 22 * t,
                            tail=(6 * t, 14 - 28 * t),
                            wings=[folded_shoulder(30 + 4 * t, 3 * t), (6, 0, 166), (-4, 0, -158)]))
    return [k(0, 0), k(30, 1), k(60, 0)]


def clip_land():
    g0 = glide(0.0)
    g0["body_l"] = (-0.10, 0, 0.55)
    flare = dict(body_l=(-0.04, 0, 0.30), body_r=-24, neck=-6, head=14, tail=(40, 0),
                 wings=[(58, -28, -6), (-14, 0, -6), (-18, 0, 0)],
                 legs={"FL": ("abs", -38, -18, -40), "FR": ("abs", -30, -10, -36),
                       "HL": ("abs", -12, 20, 10), "HR": ("abs", -4, 26, 14)})
    reach = dict(body_l=(0.0, 0, 0.12), body_r=-14, neck=0, head=8, tail=(24, 0),
                 wings=[(70, -12, -4), (-24, 0, 8), (-28, 0, 12)],
                 legs={"FL": ("ik", 0.10, 0.04, -12), "FR": ("ik", 0.04, 0.08, -10)})
    touch = dict(body_l=(0.0, 0, -0.12), body_r=4, neck=14, head=-10, tail=(10, -8),
                 wings=[(54, -8, 10), (-30, 0, 40), (-36, 0, 50)],
                 legs={"FL": ("ik", 0.06, 0.0, 0), "FR": ("ik", 0.0, 0.0, 0), "HL": ("ik", 0.04, 0.0, 0), "HR": ("ik", 0.08, 0.0, 0)})
    fold = dict(body_l=(0.0, 0, -0.03), body_r=1, neck=6, head=-4, tail=(4, 6),
                wings=[folded_shoulder(45, 0), (6, 0, 150), (-4, 0, -150)])
    return [Key(0, hpose(**g0), "EASE_IN_OUT"), Key(9, hpose(**flare)), Key(15, hpose(**reach), "EASE_IN"),
            Key(19, hpose(**touch), "EASE_OUT"), Key(25, hpose(**fold), "EASE_IN_OUT"), Key(30, hpose())]


def clip_hit():
    base = glide(0.0)
    rec = dict(base, body_l=(-0.12, 0, 0.06), body_r=-14, body_x=4, neck=-14, head=20, tail=(40, 10),
               wings=[(70, -10, 0), (-34, 0, 20), (-30, 0, 30)], wingsR=[(40, -10, 0), (-20, 0, 30), (-26, 0, 40)])
    return [Key(0, hpose(**base), "EASE_OUT"), Key(3, hpose(**rec)), Key(12, hpose(**base))]


CLIPS = [("Fly", 0.8, clip_fly, True), ("Glide", 2.0, clip_glide, True), ("Land", 1.0, clip_land, False),
         ("Hit", 0.4, clip_hit, False), ("Idle", 2.0, clip_idle, True)]


def build():
    global RIG, LEGRIG
    scene.reset()
    mats = materials.library(MATERIALS)
    rig = Rig("Hippogryph")
    for name, head, parent in JOINTS:
        rig.joint(name, head, parent)
    rig.socket("Saddle", SADDLE, "J_Body")
    RIG = rig
    LEGRIG = LegRig(rig, LEGS)
    pieces = [("Hippogryph_Body", body_geo(), "J_Body"), ("Hippogryph_Saddle", saddle_geo(), "J_Body"),
              ("Hippogryph_Neck", neck_geo(), "J_Neck"), ("Hippogryph_Head", head_geo(), "J_Head"),
              ("Hippogryph_Tail", tail_geo(), "J_Tail")]
    for side, s in (("L", 1.0), ("R", -1.0)):
        pieces += front_leg_geos(side, s) + hind_leg_geos(side, s)
    pieces += [("Hippogryph_" + n, g, j) for n, g, j in WING.parts()]
    tris = 0
    for name, g, joint in pieces:
        obj = geom.to_object(name, g, mats)
        rig.attach(obj, joint)
        tris += g.tri_count()
    print("[hippogryph] ~%d triangles" % tris)
    joints = {n: rig.joints[n] for n, _, _ in JOINTS}
    for name, secs, fn, cyc in CLIPS:
        anim.bake_clip(name, int(round(secs * 30)), fn(), joints, loc_joints=("J_Body",), cyclic=cyc)
    return rig


def main():
    args = scene.script_args()
    out = args[0] if args else os.path.join(os.path.dirname(__file__), "..", "..", "app", "public", "assets", "models", "hippogryph.glb")
    build()
    export.export_glb(os.path.abspath(out))


if __name__ == "__main__":
    main()
