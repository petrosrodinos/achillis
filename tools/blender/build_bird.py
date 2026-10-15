"""Build app/public/assets/models/bird.glb — large dark bird of prey (wingspan ≈ 1.4 m).

Run:
    blender -b --factory-startup -P tools/blender/build_bird.py -- app/public/assets/models/bird.glb

Rig: root `Bird` → `J_Body` (animated location+rotation) → `J_Head`, `J_Tail`, 3-segment wings
`J_Wing1..3_L/R`. Origin on the "ground" below the body (body centre 0.30 m up). Faces +X.
Clips: Flap (loop 0.4), Dive (loop 0.6, wings tucked, nose down).
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from lib import anim, export, geom, materials, scene  # noqa: E402
from lib.anim import Key  # noqa: E402
from lib.creature import WingSpec, claw, eye, feather, mirror_r  # noqa: E402
from lib.geom import section as S, superquad, sweep  # noqa: E402
from lib.rig import Rig  # noqa: E402

MATERIALS = ["Feathers", "Beak", "Eye"]
WING = WingSpec(root=(0.05, 0.06, 0.34), spans=[0.15, 0.17, 0.11], le_th=[0.028, 0.022, 0.016],
                coverts=[(0.09, 0.011), (0.08, 0.009)], secondary=(4, 0.18, 0.048),
                primary=(6, 0.17, 0.26, 0.046, 8, 64), thick=0.006)
JOINTS = [("J_Body", (0.0, 0.0, 0.30), None), ("J_Head", (0.15, 0.0, 0.35), "J_Body"),
          ("J_Tail", (-0.17, 0.0, 0.31), "J_Body")] + WING.joints("J_Body")


def body_geo():
    xs = [-0.22, -0.17, -0.08, 0.04, 0.13, 0.18]
    zc = [0.315, 0.31, 0.30, 0.305, 0.33, 0.35]
    up = [0.02, 0.05, 0.075, 0.08, 0.065, 0.0]
    dn = [0.02, 0.05, 0.08, 0.095, 0.075, 0.0]
    wd = [0.02, 0.05, 0.075, 0.08, 0.06, 0.0]
    g = sweep([(x, 0, z) for x, z in zip(xs, zc)], [S(u, w, 2.2, rxb=d) if u else S(0.0, 0.0) for u, d, w in zip(up, dn, wd)],
              seg=14, normal_hint=(0, 0, 1), mat="Feathers")
    # breast & flank feather layers
    for i in range(4):
        for s in (-1, 1):
            g.add(feather((0.10 - 0.07 * i, s * 0.055, 0.27), (-1, s * 0.15, -0.2), 0.10, 0.035, thick=0.008,
                          up=(0, s, 0.4), arch=0.006))
    # tucked legs + talons
    for s in (1, -1):
        g.add(sweep([(0.02, s * 0.04, 0.24), (-0.04, s * 0.04, 0.21), (-0.08, s * 0.04, 0.205)], [S(0.022), S(0.016), S(0.014)],
                    seg=6, normal_hint=(0, 0, 1), mat="Beak"))
        for k in (-1, 0, 1):
            g.add(claw((-0.08, s * 0.04 + k * 0.012, 0.205), (-1, k * 0.3, -0.3), 0.04, 0.007, "Eye", seg=5, curl=0.8))
    return g


def head_geo():
    g = superquad(0.065, 0.055, 0.058, 2.2, 2.2, seg=12, rings=6, mat="Feathers", rxb=0.06).move(0.19, 0, 0.38)
    g.add(sweep([(0.12, 0, 0.36), (0.16, 0, 0.37)], [S(0.06, 0.055), S(0.06, 0.055)], seg=10, normal_hint=(0, 0, 1), mat="Feathers"))
    beak = [(0.235, 0, 0.385), (0.27, 0, 0.385), (0.295, 0, 0.37), (0.305, 0, 0.35), (0.298, 0, 0.335)]
    g.add(sweep(beak, [S(0.026, 0.022, 2.2, rxb=0.016), S(0.02, 0.017, 2.2, rxb=0.012), S(0.013, 0.011), S(0.007, 0.006), S(0.0, 0.0)],
                seg=8, normal_hint=(0, 0, 1), mat="Beak"))
    g.add(sweep([(0.236, 0, 0.368), (0.27, 0, 0.364), (0.285, 0, 0.362)], [S(0.012, 0.016), S(0.008, 0.011), S(0.0, 0.0)], seg=8,
                normal_hint=(0, 0, 1), mat="Beak"))
    for s in (1, -1):
        g.add(eye((0.228, s * 0.038, 0.395), 0.013))
        g.add(sweep([(0.205, s * 0.04, 0.412), (0.245, s * 0.037, 0.408)], [S(0.012, 0.012), S(0.0, 0.0)], seg=6,
                    normal_hint=(0, 0, 1), mat="Feathers"))
    return g


def tail_geo():
    g = sweep([(-0.15, 0, 0.31), (-0.22, 0, 0.315)], [S(0.03, 0.04), S(0.02, 0.05)], seg=8, normal_hint=(0, 0, 1), mat="Feathers")
    for k in range(5):
        a = math.radians(-24 + 12 * k)
        g.add(feather((-0.18, 0.015 * (k - 2), 0.315 + 0.002 * abs(k - 2)), (-math.cos(a), math.sin(a), 0.0), 0.22, 0.05,
                      thick=0.006, arch=0.008))
    return g


def wing_pose(p, segs, segsR=None):
    segsR = segsR or segs
    for i in range(3):
        p["J_Wing%d_L" % (i + 1)] = {"r": tuple(segs[i])}
        p["J_Wing%d_R" % (i + 1)] = {"r": mirror_r(segsR[i], -1.0)}


def bpose(body_l=(0, 0, 0), body_r=0.0, head=0.0, tail=(0.0, 0.0), wings=None):
    p = {"J_Body": {"r": (0, body_r, 0), "l": tuple(body_l)}, "J_Head": {"r": (0, head, 0)},
         "J_Tail": {"r": (0, tail[0], tail[1])}}
    wing_pose(p, wings)
    return p


def flap_wing(t):
    u = 0.5 * t / 0.45 if t < 0.45 else 0.5 + 0.5 * (t - 0.45) / 0.55
    w = 2 * math.pi * u
    sh = 12 + 50 * math.cos(w)
    el = 18 * math.cos(w - 1.0) - 4
    wr = 26 * math.cos(w - 1.8) + 4
    up = max(0.0, math.sin(w - math.pi))
    lean = 14 * max(0.0, math.cos(w)) - 6 * max(0.0, -math.cos(w))
    return [(sh, lean, -6 * math.sin(w)), (el, 0, 30 * up), (wr, 0, 40 * up)]


def clip_flap():
    keys = []
    for f in range(13):
        t = f / 12
        w = 2 * math.pi * t
        keys.append(Key(f, bpose(body_l=(0, 0, 0.03 * math.sin(w - 0.6)), body_r=-3 + 3 * math.sin(w + 0.6),
                                 head=-2 * math.sin(w), tail=(-4 * math.sin(w - 1.0), 0), wings=flap_wing(t)), "LINEAR"))
    return keys


TUCK = [(26, 10, 62), (-8, 0, 78), (6, 0, -40)]


def clip_dive():
    keys = []
    for f in range(0, 19, 3):
        t = f / 18
        w = 2 * math.pi * t
        wings = [(TUCK[0][0] + 4 * math.sin(w), TUCK[0][1], TUCK[0][2] + 3 * math.sin(w + 1)), TUCK[1],
                 (TUCK[2][0] + 6 * math.sin(w - 1), 0, TUCK[2][2])]
        keys.append(Key(f, bpose(body_l=(0, 0, 0.02 * math.sin(w)), body_r=38 + 3 * math.sin(w), head=-24 - 2 * math.sin(w),
                                 tail=(-8, 6 * math.sin(w)), wings=wings)))
    return keys


def build():
    scene.reset()
    mats = materials.library(MATERIALS)
    rig = Rig("Bird", root_size=0.1)
    for name, head, parent in JOINTS:
        rig.joint(name, head, parent, size=0.03)
    pieces = [("Bird_Body", body_geo(), "J_Body"), ("Bird_Head", head_geo(), "J_Head"), ("Bird_Tail", tail_geo(), "J_Tail")]
    pieces += [("Bird_" + n, g, j) for n, g, j in WING.parts()]
    tris = 0
    for name, g, joint in pieces:
        obj = geom.to_object(name, g, mats)
        rig.attach(obj, joint)
        tris += g.tri_count()
    print("[bird] ~%d triangles" % tris)
    joints = {n: rig.joints[n] for n, _, _ in JOINTS}
    anim.bake_clip("Flap", 12, clip_flap(), joints, loc_joints=("J_Body",), cyclic=True)
    anim.bake_clip("Dive", 18, clip_dive(), joints, loc_joints=("J_Body",), cyclic=True)


def main():
    args = scene.script_args()
    out = args[0] if args else os.path.join(os.path.dirname(__file__), "..", "..", "app", "public", "assets", "models", "bird.glb")
    build()
    export.export_glb(os.path.abspath(out))


if __name__ == "__main__":
    main()
