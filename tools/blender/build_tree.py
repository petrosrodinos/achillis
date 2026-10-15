"""Build app/public/assets/models/haunted-tree.glb — ≈4 m gnarled dead tree with a glowing face.

Run:
    blender -b --factory-startup -P tools/blender/build_tree.py -- app/public/assets/models/haunted-tree.glb

Rig: root `HauntedTree` → `J_Root` (animated location: rises out of / sinks into the ground)
→ `J_Trunk` → `J_Upper` (face) → `J_Crown`; branch arms `J_ArmR1/2` (near, camera side) and
`J_ArmL1/2`. The carved face looks forward and ~40° towards the camera (game sees it 3/4).
Clips: Rise (1.0, starts fully below y=0), Idle (loop 2.0), Swipe† (1.0), Death (1.0, collapses and
sinks below ground).
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from mathutils import Vector  # noqa: E402

from lib import anim, export, geom, materials, scene  # noqa: E402
from lib.anim import Key  # noqa: E402
from lib.geom import Geo, extrude_outline, section as S, superquad, sweep  # noqa: E402
from lib.rig import Rig  # noqa: E402

MATERIALS = ["Wood", "Glow"]
FACE_YAW = -40.0          # face direction: +X turned towards the camera (-Y)
FACE_Z = 2.55
ARM_R = [(0.12, -0.38, 2.62), (0.62, -0.80, 1.82), (1.06, -0.90, 1.00)]
ARM_L = [(0.02, 0.38, 2.80), (0.48, 0.82, 2.10), (0.90, 0.95, 1.40)]
JOINTS = [
    ("J_Root", (0.0, 0.0, 0.0), None),
    ("J_Trunk", (0.0, 0.0, 0.85), "J_Root"),
    ("J_Upper", (0.04, 0.0, 2.05), "J_Trunk"),
    ("J_Crown", (0.0, 0.0, 3.30), "J_Upper"),
    ("J_ArmR1", ARM_R[0], "J_Upper"), ("J_ArmR2", ARM_R[1], "J_ArmR1"),
    ("J_ArmL1", ARM_L[0], "J_Upper"), ("J_ArmL2", ARM_L[1], "J_ArmL1"),
]


def gnarl(g, axis_pts, amp=0.035, twist=2.2, lobes=7):
    """Bark ridges: radial bumps that spiral up around a vertical-ish axis."""
    zs = [p[2] for p in axis_pts]

    def centre(z):
        if z <= zs[0]:
            return Vector(axis_pts[0])
        for a, b in zip(axis_pts, axis_pts[1:]):
            if a[2] <= z <= b[2]:
                t = (z - a[2]) / max(1e-6, b[2] - a[2])
                return Vector(a).lerp(Vector(b), t)
        return Vector(axis_pts[-1])

    def f(v):
        c = centre(v.z)
        d = Vector((v.x - c.x, v.y - c.y, 0))
        if d.length < 1e-6:
            return v
        ang = math.atan2(d.y, d.x)
        k = 1.0 + amp / max(0.15, d.length) * (math.sin(ang * lobes + v.z * twist) + 0.5 * math.sin(ang * 3 - v.z * 1.3))
        return Vector((c.x + d.x * k, c.y + d.y * k, v.z))
    g.deform(f)
    return g


def branch(pts, r0, r1, mat="Wood", seg=8, lumpy=0.18):
    n = len(pts)
    secs = []
    for i in range(n):
        t = i / (n - 1)
        r = r0 + (r1 - r0) * t
        r *= 1.0 + lumpy * math.sin(i * 2.7)
        secs.append(S(r, r * 0.9) if i < n - 1 or r1 > 0 else S(0.0, 0.0))
    return sweep(pts, secs, seg=seg, normal_hint=(1, 0, 0), mat=mat)


def twig_claw(base, direction, length, r, spread=28, count=3, mat="Wood"):
    g = Geo()
    d = Vector(direction).normalized()
    side = d.cross(Vector((0, 0, 1)))
    if side.length < 1e-6:
        side = Vector((0, 1, 0))
    side.normalize()
    for i in range(count):
        a = math.radians(-spread + 2 * spread * i / max(1, count - 1))
        di = (d * math.cos(a) + side * math.sin(a)).normalized()
        b = Vector(base)
        pts = [b, b + di * length * 0.5 + Vector((0, 0, -0.04)), b + di * length + Vector((0, 0, -0.14))]
        g.add(sweep(pts, [S(r), S(r * 0.6), S(0.0, 0.0)], seg=6, normal_hint=(0, 0, 1), mat=mat))
    return g


# =============================================================================================
# geometry
# =============================================================================================

def base_geo():
    zs = [0.0, 0.25, 0.55, 0.95]
    rs = [0.78, 0.58, 0.47, 0.44]
    g = sweep([(0.0, 0, z) for z in zs], [S(r, r * 0.92, 2.2) for r in rs], seg=20, normal_hint=(1, 0, 0), mat="Wood")
    g.deform(lambda v: Vector((v.x, v.y, max(v.z, -0.25))))
    gnarl(g, [(0, 0, 0), (0, 0, 1.0)], amp=0.05)
    # roots snaking along the ground
    for i in range(7):
        a = math.radians(20 + i * 51 + 9 * math.sin(i * 1.9))
        d = Vector((math.cos(a), math.sin(a), 0))
        L = 1.0 + 0.35 * math.sin(i * 2.3)
        pts = [d * 0.30 + Vector((0, 0, 0.45)), d * 0.70 + Vector((0, 0, 0.18)), d * (0.70 + 0.4 * L) + Vector((0, 0, 0.08)),
               d * (0.70 + 0.8 * L) + Vector((0.05 * math.sin(i), 0, 0.02))]
        g.add(branch(pts, 0.17, 0.0, seg=8, lumpy=0.12))
    return g


def trunk_geo():
    pts = [(0.0, 0, 0.80), (0.05, 0, 1.30), (0.02, 0, 1.75), (0.06, 0, 2.15)]
    g = sweep(pts, [S(0.46, 0.43, 2.2), S(0.42, 0.40, 2.2), S(0.43, 0.40, 2.2), S(0.42, 0.40, 2.2)], seg=18,
              normal_hint=(1, 0, 0), mat="Wood")
    gnarl(g, pts, amp=0.07)
    # burl + snapped stub
    g.add(superquad(0.16, 0.14, 0.18, 2.0, 2.0, seg=10, rings=6, mat="Wood").move(-0.32, -0.22, 1.45))
    g.add(branch([(-0.30, 0.15, 1.65), (-0.62, 0.30, 1.85), (-0.74, 0.34, 2.05)], 0.10, 0.03))
    return g


def upper_geo():
    pts = [(0.06, 0, 1.98), (0.04, 0, 2.40), (0.0, 0, 2.85), (-0.04, 0, 3.40)]
    g = sweep(pts, [S(0.42, 0.40, 2.2), S(0.43, 0.40, 2.2), S(0.38, 0.35, 2.2), S(0.30, 0.28, 2.2)], seg=18,
              normal_hint=(1, 0, 0), mat="Wood")
    gnarl(g, pts, amp=0.06, lobes=6)
    g.add(face_geo())
    # shoulder bosses where the arms grow out
    g.add(superquad(0.22, 0.20, 0.24, 2.0, 2.0, seg=10, rings=6, mat="Wood").move(0.10, -0.30, 2.62))
    g.add(superquad(0.20, 0.20, 0.22, 2.0, 2.0, seg=10, rings=6, mat="Wood").move(0.02, 0.30, 2.80))
    return g


def face_frame():
    a = math.radians(FACE_YAW)
    n = Vector((math.cos(a), math.sin(a), 0.0))
    return n


def place(g, depth_on_surface=0.40, z=FACE_Z, lateral=0.0):
    """Transform a face element built in the XZ plane (facing -Y... built facing +Y) onto the trunk."""
    n = face_frame()
    g.rotate(FACE_YAW - 90.0 + 180.0, "Z")       # +Y (extrude axis) → n
    side = Vector((n.y, -n.x, 0))                   # to the face's right
    c = n * depth_on_surface + side * lateral
    g.move(c.x + 0.04, c.y, z)
    return g


def face_geo():
    g = Geo()
    # glowing eyes: slanted angry slits, set slightly into the bark
    for s in (-1, 1):
        eye = [(-0.11, 0.0), (0.0, 0.05 if s < 0 else 0.03), (0.11, 0.0), (0.06, -0.05), (-0.06, -0.05)]
        if s > 0:
            eye = [(-x, y) for x, y in eye]
        e = extrude_outline([(x * 1.5, y * 1.6) for x, y in eye], 0.12, bevel=0.012, mat="Glow")
        g.add(place(e, 0.36, FACE_Z + 0.20, s * 0.17))
        # heavy brow above each eye
        brow = sweep([(-0.15, 0, 0.0), (0.0, 0, 0.05 if s > 0 else 0.02), (0.15, 0, -0.04)],
                     [S(0.045, 0.06), S(0.055, 0.07), S(0.035, 0.05)], seg=8, normal_hint=(0, 0, 1), mat="Wood")
        if s > 0:
            brow.scale(-1.0, 1.0, 1.0)
        g.add(place(brow.scale(1.4, 1.2, 1.2), 0.43, FACE_Z + 0.33, s * 0.17))
    # gaping jagged maw
    mouth = [(-0.20, 0.06), (-0.12, 0.02), (-0.08, 0.09), (-0.03, 0.03), (0.02, 0.10), (0.07, 0.03), (0.12, 0.08), (0.20, 0.04),
             (0.17, -0.10), (0.10, -0.06), (0.06, -0.15), (0.01, -0.08), (-0.05, -0.16), (-0.09, -0.07), (-0.16, -0.12)]
    m = extrude_outline([(x * 1.35, y * 1.4) for x, y in mouth], 0.12, bevel=0.01, mat="Glow", fan=True)
    g.add(place(m, 0.37, FACE_Z - 0.16, 0.0))
    # lips / bark rim around the maw and a knot nose
    rim = sweep([(-0.25, 0, 0.0), (-0.12, 0, 0.13), (0.0, 0, 0.15), (0.12, 0, 0.12), (0.25, 0, 0.0), (0.12, 0, -0.20),
                 (0.0, 0, -0.22), (-0.13, 0, -0.19), (-0.25, 0, 0.0)], [S(0.035, 0.045)] * 9, seg=6, normal_hint=(0, 0, 1), mat="Wood")
    g.add(place(rim.scale(1.35, 1.0, 1.4), 0.41, FACE_Z - 0.16, 0.0))
    nose = superquad(0.06, 0.07, 0.10, 2.0, 2.0, seg=8, rings=5, mat="Wood")
    g.add(place(nose, 0.44, FACE_Z + 0.04, 0.0))
    return g


def crown_geo():
    g = Geo()
    g.add(branch([(-0.04, 0, 3.25), (-0.06, 0, 3.55), (-0.02, 0, 3.80)], 0.28, 0.16, seg=12))
    specs = [((0.8, -0.25, 0.75), 1.15, 0.14), ((-0.85, 0.25, 0.65), 1.2, 0.14), ((0.2, 0.7, 0.8), 0.95, 0.12),
             ((-0.35, -0.75, 0.8), 1.0, 0.12), ((0.1, 0.0, 1.0), 0.75, 0.12), ((-0.5, -0.2, 0.85), 0.9, 0.10)]
    for i, (d, L, r) in enumerate(specs):
        d = Vector(d).normalized()
        b = Vector((-0.03, 0, 3.55 + 0.05 * i))
        bend = Vector((d.x, d.y, 0)) * 0.25
        pts = [b, b + d * L * 0.4, b + d * L * 0.75 + bend, b + d * L + bend * 2.0 + Vector((0, 0, -0.05))]
        g.add(branch(pts, r, 0.0, seg=8))
        tip = b + d * L * 0.75 + bend
        g.add(branch([tip, tip + Vector((d.x * 0.3, d.y * 0.3 + 0.1 * math.sin(i), 0.25)),
                      tip + Vector((d.x * 0.5, d.y * 0.5, 0.35))], r * 0.45, 0.0, seg=6))
    return g


def arm_geos(side):
    A = ARM_R if side == "R" else ARM_L
    out = []
    up = branch([A[0], Vector(A[0]).lerp(Vector(A[1]), 0.5) + Vector((0.05, 0, 0.06)), A[1]], 0.15, 0.11, seg=10)
    up.add(superquad(0.12, 0.12, 0.12, 2.0, 2.0, seg=8, rings=5, mat="Wood").move(*A[1]))
    up.add(branch([Vector(A[0]).lerp(Vector(A[1]), 0.55), Vector(A[0]).lerp(Vector(A[1]), 0.55) + Vector((-0.1, 0, 0.35)),
                   Vector(A[0]).lerp(Vector(A[1]), 0.55) + Vector((-0.05, 0, 0.55))], 0.05, 0.0, seg=6))
    out.append(("Tree_Arm%s1" % side, up, "J_Arm%s1" % side))
    lo = branch([A[1], Vector(A[1]).lerp(Vector(A[2]), 0.5) + Vector((0.06, 0, 0.04)), A[2]], 0.11, 0.06, seg=8)
    d = (Vector(A[2]) - Vector(A[1])).normalized()
    lo.add(twig_claw(A[2], d + Vector((0.3, 0, 0)), 0.45, 0.045, spread=30, count=4))
    out.append(("Tree_Arm%s2" % side, lo, "J_Arm%s2" % side))
    return out


# =============================================================================================
# animation
# =============================================================================================

def tpose(root=(0, 0, 0), root_r=(0, 0, 0), trunk=(0, 0, 0), upper=(0, 0, 0), crown=(0, 0, 0),
          armR=(0, 0), armL=(0, 0), armR_x=0.0, armL_x=0.0):
    return {"J_Root": {"r": tuple(root_r), "l": tuple(root)}, "J_Trunk": {"r": tuple(trunk)}, "J_Upper": {"r": tuple(upper)},
            "J_Crown": {"r": tuple(crown)},
            "J_ArmR1": {"r": (armR_x, armR[0], 0)}, "J_ArmR2": {"r": (0, armR[1], 0)},
            "J_ArmL1": {"r": (armL_x, armL[0], 0)}, "J_ArmL2": {"r": (0, armL[1], 0)}}


IDLE = dict()


def clip_rise():
    return [Key(0, tpose(root=(0, 0, -4.6), upper=(0, -8, 0), armR=(-120, -30), armL=(-130, -20)), "LINEAR"),
            Key(6, tpose(root=(0, 0, -3.2), root_r=(4, -3, 6), upper=(3, -10, 0), armR=(-150, -10), armL=(-110, -40))),
            Key(12, tpose(root=(0, 0, -1.9), root_r=(-4, 3, -4), upper=(-3, -6, 4), crown=(4, 0, 0), armR=(-110, -40), armL=(-150, -10))),
            Key(18, tpose(root=(0, 0, -0.8), root_r=(3, -2, 3), trunk=(0, -4, 0), upper=(2, -10, 0), crown=(-4, -6, 0),
                          armR=(-150, -20), armL=(-120, -30)), "EASE_OUT"),
            Key(24, tpose(root=(0, 0, 0.08), trunk=(0, 3, 0), upper=(0, 6, 0), crown=(0, 6, 0), armR=(-40, -20), armL=(-30, -10)), "EASE_IN_OUT"),
            Key(30, tpose())]


def clip_idle():
    def k(f, t):
        s = math.sin(2 * math.pi * t)
        c = math.cos(2 * math.pi * t)
        return Key(f, tpose(trunk=(1.2 * c, 1.5 * s, 0), upper=(2.0 * c, 3.0 * s, 1.5 * s), crown=(3 * c, 4 * s, 0),
                            armR=(-6 + 6 * s, -4 - 4 * c), armL=(4 - 5 * s, -6 + 4 * c), armR_x=-2 * c, armL_x=2 * s))
    return [k(f, f / 60.0) for f in range(0, 61, 10)]


def clip_swipe():
    rest = tpose()
    wind = tpose(trunk=(0, -5, 0), upper=(0, -12, -6), crown=(0, -10, 0), armR=(-168, -50), armL=(30, -10), armR_x=-10)
    wind2 = tpose(trunk=(0, -6, 0), upper=(0, -14, -8), crown=(0, -12, 0), armR=(-176, -60), armL=(34, -10), armR_x=-12)
    imp = tpose(trunk=(0, 6, 0), upper=(0, 18, 6), crown=(0, 14, 0), armR=(-86, -8), armL=(-20, -20), armR_x=-4)
    fol = tpose(trunk=(0, 7, 0), upper=(0, 20, 8), crown=(0, 20, 0), armR=(-66, 0), armL=(-24, -20), armR_x=-4)
    return [Key(0, rest, "EASE_OUT"), Key(8, wind), Key(10.5, wind2, "EASE_IN"), Key(15, imp, "EASE_OUT"), Key(18, fol),
            Key(30, rest)]


def clip_death():
    rest = tpose()
    shud1 = tpose(root_r=(3, 0, 4), upper=(-4, -6, 0), crown=(6, -8, 0), armR=(-60, -40), armL=(-70, -30))
    shud2 = tpose(root_r=(-3, 0, -4), upper=(4, -4, 0), crown=(-6, -4, 0), armR=(-50, -60), armL=(-60, -50))
    crack = tpose(root=(0, 0, -0.4), root_r=(4, 8, 0), trunk=(0, 8, 0), upper=(6, 22, 0), crown=(0, 18, 0), armR=(10, 30), armL=(20, 20))
    sink = tpose(root=(0, 0, -2.6), root_r=(6, 16, 0), trunk=(0, 10, 0), upper=(8, 30, 0), crown=(0, 24, 0), armR=(30, 40), armL=(30, 30))
    gone = tpose(root=(0, 0, -5.4), root_r=(6, 20, 0), trunk=(0, 10, 0), upper=(8, 32, 0), crown=(0, 26, 0), armR=(40, 40), armL=(36, 30))
    return [Key(0, rest, "EASE_OUT"), Key(3, shud1), Key(6, shud2), Key(12, crack, "EASE_IN"), Key(22, sink), Key(30, gone)]


def build():
    scene.reset()
    mats = materials.library(MATERIALS)
    rig = Rig("HauntedTree", root_size=0.5)
    for name, head, parent in JOINTS:
        rig.joint(name, head, parent, size=0.15)
    pieces = [("Tree_Base", base_geo(), "J_Root"), ("Tree_Trunk", trunk_geo(), "J_Trunk"), ("Tree_Upper", upper_geo(), "J_Upper"),
              ("Tree_Crown", crown_geo(), "J_Crown")] + arm_geos("R") + arm_geos("L")
    tris = 0
    for name, g, joint in pieces:
        obj = geom.to_object(name, g, mats, sharp_angle=50.0)
        rig.attach(obj, joint)
        tris += g.tri_count()
    print("[haunted-tree] ~%d triangles" % tris)
    joints = {n: rig.joints[n] for n, _, _ in JOINTS}
    for name, frames, keys, cyc in (("Rise", 30, clip_rise(), False), ("Idle", 60, clip_idle(), True),
                                    ("Swipe", 30, clip_swipe(), False), ("Death", 30, clip_death(), False)):
        anim.bake_clip(name, frames, keys, joints, loc_joints=("J_Root",), cyclic=cyc)


def main():
    args = scene.script_args()
    out = args[0] if args else os.path.join(os.path.dirname(__file__), "..", "..", "app", "public", "assets", "models", "haunted-tree.glb")
    build()
    export.export_glb(os.path.abspath(out))


if __name__ == "__main__":
    main()
