"""Build app/public/assets/models/ship.glb — enemy medieval cog (≈14 m hull), seen from the side.

Run:
    blender -b --factory-startup -P tools/blender/build_ship.py -- app/public/assets/models/ship.glb

Static (no animation). Root `Ship`; bow points +X, origin on the WATERLINE at mid-ship (keel ≈1.1 m
below). Clinker hull, aft- and forecastle with crenellated parapets, mast with fighting top, big
square sail (`Primary`, tinted by the client) braced ~20° off the keel so it faces the camera,
rigging, round shields along the rails. Empties `Deck_Archer_Spot_1..3` (aft castle, forecastle,
main deck) mark standing points on the walkable surfaces.

The client renders the ship as a raw scene (only `Primary` is re-tinted), so the other materials
carry final art colours.
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from mathutils import Vector  # noqa: E402

from lib import export, geom, materials, scene  # noqa: E402
from lib.geom import Geo, cylinder, rounded_box, section as S, superquad, sweep  # noqa: E402
from lib.materials import hex_to_linear  # noqa: E402

COLORS = {"Wood": ("#6b4a2f", 0.85, 0.0), "Metal": ("#9a9a96", 0.45, 0.35), "DarkMetal": ("#3a3a3e", 0.55, 0.3),
          "Cloth": ("#c2b79e", 0.9, 0.0), "Primary": None}

XS = [-6.7, -6.4, -5.6, -4.0, -1.5, 1.5, 4.0, 5.6, 6.5, 6.9]
RY = [0.14, 0.75, 1.55, 2.05, 2.25, 2.25, 2.0, 1.45, 0.65, 0.14]
KEEL = [1.25, 1.45, 1.55, 1.6, 1.6, 1.6, 1.6, 1.55, 1.45, 1.25]   # depth below ZC
ZC = 0.5
UP = 2.45
N_HULL = 2.6


def deck_z(x):
    return 1.7 + 0.75 * (abs(x) / 6.9) ** 2.2


def rake(v):
    """Raked stem / sternpost: push the ends outwards with height."""
    ax = abs(v.x)
    if ax < 4.8:
        return v
    t = min(1.0, (ax - 4.8) / 2.1)
    t = t * t * (3 - 2 * t)
    h = (v.z + 1.1) / 3.6
    return Vector((v.x + math.copysign(0.75 * h * t, v.x), v.y, v.z))


def half_beam(i, z):
    r = UP if z >= ZC else KEEL[i]
    dz = abs(z - ZC) / r
    if dz >= 1:
        return 0.0
    return RY[i] * (1 - dz ** N_HULL) ** (1 / N_HULL)


def hull_geo():
    secs = [S(10.0 - ZC, ry, N_HULL, rxb=k) for ry, k in zip(RY, KEEL)]
    g = sweep([(x, 0, ZC) for x in XS], secs, seg=28, normal_hint=(0, 0, 1), mat="Wood")
    g.deform(lambda v: Vector((v.x, v.y, min(v.z, deck_z(v.x)))))
    # clinker strakes: rope-like ridges following the hull surface
    for k in range(7):
        z = -0.75 + 0.36 * k
        for s in (1, -1):
            pts = []
            for i, x in enumerate(XS):
                if z > deck_z(x) - 0.12:
                    continue
                y = half_beam(i, z)
                if y < 0.05:
                    continue
                pts.append((x, s * (y + 0.012), z))
            if len(pts) >= 3:
                g.add(sweep(pts, [S(0.05, 0.035)] * len(pts), seg=6, normal_hint=(0, 0, 1), cap_start=True, cap_end=True, mat="Wood"))
    # heavy wale just under the deck line + keel
    for s in (1, -1):
        pts = [(x, s * (half_beam(i, deck_z(x) - 0.3) + 0.03), deck_z(x) - 0.3) for i, x in enumerate(XS[1:-1], start=1)]
        g.add(sweep(pts, [S(0.09, 0.07)] * len(pts), seg=6, normal_hint=(0, 0, 1), mat="Wood"))
    g.add(sweep([(x, 0, ZC - k - 0.02) for x, k in zip(XS[1:-1], KEEL[1:-1])], [S(0.12, 0.10)] * 8, seg=6,
                normal_hint=(0, 0, 1), mat="Wood"))
    g.deform(rake)
    # stem & stern posts
    g.add(sweep([(6.8, 0, -0.8), (7.25, 0, 1.2), (7.65, 0, 2.95)], [S(0.13, 0.12)] * 3, seg=6, normal_hint=(1, 0, 0), mat="Wood"))
    g.add(sweep([(-6.6, 0, -0.8), (-7.05, 0, 1.2), (-7.4, 0, 2.6)], [S(0.13, 0.12)] * 3, seg=6, normal_hint=(1, 0, 0), mat="Wood"))
    return g


def rails_geo():
    g = Geo()
    i0, i1 = 3, 6
    for s in (1, -1):
        pts = []
        for x in [XS[i0] + (XS[i1] - XS[i0]) * t / 8 for t in range(9)]:
            i = min(range(len(XS)), key=lambda j: abs(XS[j] - x))
            yb = max(half_beam(j, deck_z(x) - 0.05) for j in (i,))
            pts.append((x, s * (yb - 0.04), deck_z(x) + 0.42))
        g.add(sweep(pts, [S(0.45, 0.05, 4.0)] * len(pts), seg=8, normal_hint=(0, 0, 1), mat="Wood"))
        g.add(sweep([(p[0], p[1], p[2] + 0.45) for p in pts], [S(0.05, 0.09)] * len(pts), seg=6, normal_hint=(0, 0, 1), mat="Wood"))
        # shields hung along the rail
        for k in range(9):
            x = -3.5 + 0.86 * k
            i = min(range(len(XS)), key=lambda j: abs(XS[j] - x))
            y = s * (half_beam(i, deck_z(x) - 0.05) + 0.03)
            z = deck_z(x) + 0.42
            mat = "Primary" if k % 2 == 0 else "Cloth"
            g.add(superquad(0.33, 0.035, 0.33, 2.0, 2.0, seg=16, rings=6, mat=mat).move(x, y, z))
            g.add(superquad(0.335, 0.025, 0.335, 2.0, 2.0, seg=16, rings=4, mat="Wood").move(x, y - s * 0.012, z))
            g.add(superquad(0.08, 0.05, 0.08, 2.0, 2.0, seg=8, rings=4, mat="Metal").move(x, y + s * 0.03, z))
    return g


def crenel(g, x0, x1, y0, y1, z, h=0.42, step=0.55, w=0.32, t=0.16):
    """Merlons around a rectangle at height z."""
    def row(a, b, fixed, along_x):
        n = max(2, int(abs(b - a) / step))
        for k in range(n + 1):
            p = a + (b - a) * k / n
            if along_x:
                g.add(rounded_box(w, t, h, 5.0, mat="Wood").move(p, fixed, z + h / 2))
            else:
                g.add(rounded_box(t, w, h, 5.0, mat="Wood").move(fixed, p, z + h / 2))
    row(x0, x1, y0, True)
    row(x0, x1, y1, True)
    row(y0, y1, x0, False)
    row(y0, y1, x1, False)


def castles_geo():
    g = Geo()
    # aft castle (stern), built on the raised stern
    ax0, ax1 = -6.9, -3.7
    az0, az1 = deck_z(-3.7) - 0.1, 3.95
    g.add(rounded_box(ax1 - ax0, 4.0, az1 - az0, 8.0, mat="Wood").move((ax0 + ax1) / 2, 0, (az0 + az1) / 2))
    g.add(rounded_box(ax1 - ax0 + 0.1, 4.1, 0.14, 8.0, mat="Wood").move((ax0 + ax1) / 2, 0, az1))
    crenel(g, ax0 + 0.15, ax1 - 0.1, -1.95, 1.95, az1)
    for k in range(3):                                   # windows + a door onto the main deck
        g.add(rounded_box(0.36, 0.06, 0.6, 6.0, mat="DarkMetal").move(-6.2 + 0.85 * k, -2.0, 3.05))
    g.add(rounded_box(0.06, 0.9, 1.5, 6.0, mat="DarkMetal").move(ax1 + 0.01, 0.0, az0 + 0.75))
    for x in (-6.4, -5.2, -4.0):                          # timber framing
        g.add(rounded_box(0.12, 4.06, az1 - az0, 6.0, mat="Wood").move(x, 0, (az0 + az1) / 2))
    # forecastle (bow), overhanging
    fx0, fx1 = 4.7, 7.6
    fz0, fz1 = 2.85, 4.25
    g.add(rounded_box(fx1 - fx0, 3.6, fz1 - fz0, 8.0, mat="Wood").move((fx0 + fx1) / 2, 0, (fz0 + fz1) / 2))
    g.add(rounded_box(fx1 - fx0 + 0.1, 3.7, 0.14, 8.0, mat="Wood").move((fx0 + fx1) / 2, 0, fz1))
    crenel(g, fx0 + 0.1, fx1 - 0.1, -1.75, 1.75, fz1)
    for x in (4.9, 5.7, 6.5):                            # supports down to the deck
        for s in (1, -1):
            g.add(cylinder(0.11, fz0 - deck_z(x) + 0.05, seg=8, mat="Wood").move(x, s * 1.4, deck_z(x) - 0.05))
    for k in range(2):
        g.add(rounded_box(0.34, 0.06, 0.5, 6.0, mat="DarkMetal").move(5.4 + 1.1 * k, -1.81, 3.55))
    # bowsprit, rudder
    g.add(sweep([(7.3, 0, 3.4), (8.6, 0, 4.0)], [S(0.13), S(0.07)], seg=8, normal_hint=(0, 0, 1), mat="Wood"))
    g.add(rounded_box(0.32, 0.12, 3.0, 6.0, mat="Wood").rotate(-14, "Y").move(-7.22, 0, 0.35))
    for z in (-0.4, 0.6, 1.5):
        g.add(rounded_box(0.5, 0.16, 0.08, 4.0, mat="DarkMetal").rotate(-14, "Y").move(-7.10 - 0.25 * (z + 0.4) / 1.9, 0, z))
    return g


MAST_X = 0.6
MAST_TOP = 13.2
YARD_Z = 10.4
BRACE = 20.0


def mast_geo():
    g = Geo()
    g.add(cylinder(0.2, MAST_TOP - 1.6, seg=12, r2=0.11, mat="Wood").move(MAST_X, 0, 1.6))
    # fighting top
    g.add(cylinder(0.62, 0.65, seg=16, r2=0.7, mat="Wood").move(MAST_X, 0, 11.05))
    for k in range(8):
        a = 2 * math.pi * k / 8
        g.add(rounded_box(0.26, 0.26, 0.3, 5.0, mat="Wood").move(MAST_X + 0.7 * math.cos(a), 0.7 * math.sin(a), 11.85))
    g.add(superquad(0.6, 0.12, 0.05, 2.0, 2.0, seg=8, rings=3, mat="Wood").move(MAST_X, 0, 11.0))
    # yard (braced) and pennant
    d = Vector((math.cos(math.radians(BRACE)), -math.sin(math.radians(BRACE)), 0))
    c = Vector((MAST_X, 0, YARD_Z))
    g.add(sweep([c - d * 3.9, c, c + d * 3.9], [S(0.07), S(0.13), S(0.07)], seg=8, normal_hint=(0, 0, 1), mat="Wood"))
    pts = [(0, 0), (1.6, 0.18), (0, 0.38)]
    pen = Geo()
    from lib.geom import extrude_outline
    pen.add(extrude_outline(pts, 0.03, mat="Primary"))
    pen.deform(lambda v: Vector((v.x * -1.0, v.y + 0.12 * math.sin(v.x * 3.0), v.z)))
    g.add(pen.move(MAST_X - 0.05, 0, MAST_TOP - 0.45))
    return g


def sail_geo():
    """Billowing square sail hanging from the braced yard, facing the camera (-Y)."""
    g = Geo()
    W, H = 7.2, 5.9
    nu, nv = 14, 10
    d = Vector((math.cos(math.radians(BRACE)), -math.sin(math.radians(BRACE)), 0))
    n = Vector((d.y, -d.x, 0)) * -1.0           # outward normal (towards -Y)
    if n.y > 0:
        n = -n
    top = Vector((MAST_X, 0, YARD_Z - 0.12)) + n * 0.25
    grid = []
    for j in range(nv + 1):
        v = j / nv
        row = []
        for i in range(nu + 1):
            u = i / nu
            w = W * (1.0 - 0.08 * v)                  # slight taper towards the foot
            p = top + d * (w * (u - 0.5)) + Vector((0, 0, -H * v))
            bulge = 0.9 * math.sin(math.pi * u) * math.sin(math.pi * min(1.0, v * 1.05)) ** 0.8
            p += n * bulge
            row.append(p)
        grid.append(row)
    for layer, off in ((0, 0.0), (1, -0.03)):
        base = len(g.verts)
        for row in grid:
            for p in row:
                g.verts.append(p + n * off)
        for j in range(nv):
            for i in range(nu):
                a = base + j * (nu + 1) + i
                f = [a, a + 1, a + nu + 2, a + nu + 1]
                g.faces.append(f if layer == 0 else list(reversed(f)))
                g.mats.append("Primary")
    # bolt-rope border + two reef bands (Cloth)
    edge = [grid[0][i] for i in range(nu + 1)] + [grid[j][nu] for j in range(1, nv + 1)] + \
           [grid[nv][i] for i in range(nu - 1, -1, -1)] + [grid[j][0] for j in range(nv - 1, 0, -1)]
    edge = [p + n * 0.02 for p in edge] + [edge[0] + n * 0.02]
    g.add(sweep(edge, [S(0.05)] * len(edge), seg=6, normal_hint=(0, 0, 1), mat="Cloth"))
    for j in (3, 6):
        band = [grid[j][i] + n * 0.03 for i in range(nu + 1)]
        g.add(sweep(band, [S(0.06, 0.03)] * len(band), seg=6, normal_hint=(0, 0, 1), mat="Cloth"))
    # big emblem stripe down the middle
    mid = [grid[j][nu // 2] + n * 0.03 for j in range(nv + 1)]
    g.add(sweep(mid, [S(0.04, 0.45, 4.0)] * len(mid), seg=8, normal_hint=(n.x, n.y, 0), mat="Cloth"))
    return g, grid, n


def rigging_geo(grid, n):
    g = Geo()
    top = Vector((MAST_X, 0, 10.9))

    def rope(a, b, r=0.03, sag=0.0):
        a, b = Vector(a), Vector(b)
        m = (a + b) / 2 + Vector((0, 0, -sag))
        g.add(sweep([a, m, b], [S(r)] * 3, seg=5, normal_hint=(0, 0, 1), mat="Cloth"))
    for s in (1, -1):
        for k, x in enumerate((-0.6, 0.4, 1.4)):
            i = min(range(len(XS)), key=lambda j: abs(XS[j] - x))
            rope(top + Vector((0, s * 0.15, 0)), (x, s * (half_beam(i, deck_z(x)) + 0.05), deck_z(x) + 0.85))
    rope((MAST_X + 0.1, 0, MAST_TOP - 0.3), (8.5, 0, 3.95), sag=0.15)                 # forestay to the bowsprit
    rope((MAST_X - 0.1, 0, MAST_TOP - 0.6), (-5.4, 0, 4.0), sag=0.2)                 # backstay to the aft castle
    # sheets from the clews down to the rails
    nu = len(grid[0]) - 1
    for p, tgt in ((grid[-1][0], (-3.2, -2.1, 2.3)), (grid[-1][nu], (3.6, -2.0, 2.4))):
        rope(p, tgt, r=0.025, sag=0.2)
    return g


def build():
    scene.reset()
    mats = materials.library(["Wood", "Primary", "Metal", "DarkMetal", "Cloth"])
    for name, spec in COLORS.items():
        if spec is None:
            continue
        hexv, rough, metal = spec
        m = materials.make(name, rgb=hex_to_linear(hexv), roughness=rough, metallic=metal)
        mats[name] = m
    root = scene.empty("Ship", size=1.0, display="ARROWS")
    sail, grid, n = sail_geo()
    pieces = [("Ship_Hull", hull_geo()), ("Ship_Rails", rails_geo()), ("Ship_Castles", castles_geo()),
              ("Ship_Mast", mast_geo()), ("Ship_Sail", sail), ("Ship_Rigging", rigging_geo(grid, n))]
    tris = 0
    for name, g in pieces:
        obj = geom.to_object(name, g, mats, sharp_angle=45.0)
        obj.parent = root
        tris += g.tri_count()
    print("[ship] ~%d triangles" % tris)
    spots = [(-5.3, 0.0, 3.95 + 0.07), (6.1, 0.0, 4.25 + 0.07), (2.3, 0.0, deck_z(2.3))]
    for i, p in enumerate(spots):
        scene.empty("Deck_Archer_Spot_%d" % (i + 1), p, parent=root, size=0.4, display="SINGLE_ARROW")


def main():
    args = scene.script_args()
    out = args[0] if args else os.path.join(os.path.dirname(__file__), "..", "..", "app", "public", "assets", "models", "ship.glb")
    build()
    export.export_glb(os.path.abspath(out), animation_mode="ACTIONS")


if __name__ == "__main__":
    main()
