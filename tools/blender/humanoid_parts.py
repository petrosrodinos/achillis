"""Humanoid mesh parts. Each builder returns a list of (object_name, Geo, joint, attach_pose).

Geometry is authored in Blender world space for the rest pose (or for `attach_pose`), then
rigidly parented to the joint by build_humanoid.py.
"""
import math

from mathutils import Matrix, Vector

from lib.geom import (Geo, bezier3, cylinder, extrude_outline, lathe, loft, rounded_box, section as S,
                      superquad, sweep, torus)
from humanoid_rig import HAND_CENTER_L, HAND_CENTER_R, WEAPON_GRIP_ANGLE, pose

SIDES = (("L", 1.0), ("R", -1.0))

# reference poses used to author attachments (must match the clips' guard / draw poses)
GUARD_ARM_L = ("abs", -25.0, -100.0, 0.0)
SHOOT_ARM_L = ("abs", -88.0, -90.0, 0.0)
ATTACH_GUARD = pose(armL=GUARD_ARM_L)
ATTACH_SHOOT = pose(armL=SHOOT_ARM_L)


def limb(zs, rs, ys, xs=None, ry=1.0, rxb=1.0, n=2.0, seg=10, mat="Cloth"):
    xs = xs or [0.0] * len(zs)
    secs = [S(r, r * ry, n, rxb=r * rxb) for r in rs]
    return loft(zs, secs, seg=seg, centers=list(zip(xs, ys)), mat=mat)


def lerp(a, b, t):
    return a + (b - a) * t


def ys_line(y0, y1, count):
    return [lerp(y0, y1, i / (count - 1)) for i in range(count)]


def ribbed(zs, rx, rxb, ry, amp, n=2.3, seg=14, x=0.0, mat="Metal"):
    """Loft whose radius alternates by +-amp every section (reads as mail / quilting)."""
    secs = []
    for i, _ in enumerate(zs):
        k = amp if i % 2 else 0.0
        secs.append(S(rx[i] + k, ry[i] + k, n, rxb=rxb[i] + k))
    return loft(zs, secs, seg=seg, centers=[(x, 0.0)] * len(zs), mat=mat)


def resample(zs, vals, count):
    """Linear resample of a (zs, vals) profile to `count` evenly spaced heights."""
    out_z, out_v = [], []
    for i in range(count):
        z = lerp(zs[0], zs[-1], i / (count - 1))
        for k in range(len(zs) - 1):
            a, b = zs[k], zs[k + 1]
            if (a - z) * (b - z) <= 0 and a != b:
                t = (z - a) / (b - a)
                out_v.append(lerp(vals[k], vals[k + 1], t))
                break
        else:
            out_v.append(vals[-1])
        out_z.append(z)
    return out_z, out_v


def front_band(z, rx, ry, n, half_width, height, thick, x0=0.0, mat="Secondary", steps=8):
    """Strip hugging the front of a superelliptic shell (helmet brow bands, crosses)."""
    pts, secs = [], []
    for i in range(steps + 1):
        y = lerp(-half_width, half_width, i / steps)
        t = min(abs(y) / ry, 0.999)
        x = x0 + rx * (1 - t ** n) ** (1 / n) + thick * 0.5
        pts.append((x, y, z))
        secs.append(S(height / 2, thick, 4.0))
    return sweep(pts, secs, seg=8, normal_hint=(0, 0, 1), mat=mat)


def slab(zs, ry, x, thick=0.012, k=0.0, mat="Primary", n=6.0):
    """Thin cloth panel hanging along Z, centred at x(z), half-width ry(z), curved by x -= k*y^2."""
    secs = [S(thick, r, n) for r in ry]
    g = loft(zs, secs, seg=16, centers=[(xx, 0.0) for xx in x], mat=mat)
    return g.deform(lambda v: Vector((v.x - k * v.y * v.y, v.y, v.z)))


# =============================================================================================
# BASE BODY
# =============================================================================================

def base_parts():
    parts = []
    pelvis = loft([0.83, 0.87, 0.93, 1.00, 1.07, 1.11],
                  [S(0.10, 0.12, 2.3, rxb=0.11), S(0.135, 0.165, 2.3, rxb=0.15), S(0.148, 0.18, 2.3, rxb=0.165),
                   S(0.15, 0.18, 2.3, rxb=0.16), S(0.142, 0.17, 2.3, rxb=0.145), S(0.13, 0.16, 2.3, rxb=0.13)],
                  seg=14, mat="Cloth")
    parts.append(("Base_Pelvis", pelvis, "J_Hips", None))

    abdomen = loft([1.04, 1.10, 1.18, 1.26, 1.30],
                   [S(0.135, 0.165, 2.3), S(0.135, 0.165, 2.3), S(0.14, 0.17, 2.3), S(0.15, 0.19, 2.3), S(0.15, 0.20, 2.3)],
                   seg=14, mat="Cloth")
    parts.append(("Base_Abdomen", abdomen, "J_Spine", None))

    zs = [1.20, 1.27, 1.35, 1.42, 1.47, 1.51, 1.545]
    rx = [0.145, 0.16, 0.172, 0.17, 0.155, 0.13, 0.07]
    rxb = [0.14, 0.15, 0.155, 0.155, 0.145, 0.12, 0.07]
    ry = [0.19, 0.215, 0.245, 0.265, 0.26, 0.20, 0.08]
    torso = loft(zs, [S(a, c, 2.5, rxb=b) for a, b, c in zip(rx, rxb, ry)], seg=14, mat="Cloth")
    parts.append(("Base_Torso", torso, "J_Chest", None))

    head = Geo()
    head.add(cylinder(0.058, 0.16, seg=10, mat="Skin").move(0.0, 0, 1.47))
    head.add(superquad(0.112, 0.102, 0.135, 2.2, 2.2, seg=16, rings=10, rxb=0.118, rzb=0.125, mat="Skin").move(0.012, 0, 1.665))
    head.add(superquad(0.065, 0.075, 0.05, 2.2, 2.2, seg=12, rings=6, mat="Skin").move(0.055, 0, 1.585))
    head.add(superquad(0.026, 0.018, 0.032, 2.0, 2.0, seg=8, rings=5, mat="Skin").rotate(-15, "Y").move(0.122, 0, 1.64))
    for s in (1, -1):
        head.add(superquad(0.025, 0.012, 0.035, 2.0, 2.0, seg=8, rings=5, mat="Skin").move(0.0, s * 0.105, 1.66))
        head.add(superquad(0.014, 0.014, 0.014, 2.0, 2.0, seg=8, rings=4, mat="DarkMetal").move(0.104, s * 0.038, 1.69))
        head.add(rounded_box(0.022, 0.045, 0.013, 3.0, seg=8, rings=4, mat="Hair").rotate(s * 8, "X").move(0.112, s * 0.042, 1.712))
    parts.append(("Base_Head", head, "J_Head", None))

    for side, s in SIDES:
        ua = limb([1.52, 1.48, 1.42, 1.33, 1.24, 1.17, 1.135],
                  [0.035, 0.075, 0.085, 0.075, 0.066, 0.058, 0.03],
                  ys_line(s * 0.25, s * 0.265, 7), ry=0.95, mat="Cloth")
        parts.append(("Base_UpperArm_" + side, ua, "J_UpperArm_" + side, None))

        fa = limb([1.19, 1.16, 1.10, 1.02, 0.95, 0.91, 0.89],
                  [0.03, 0.058, 0.066, 0.060, 0.050, 0.046, 0.03],
                  ys_line(s * 0.265, s * 0.275, 7), mat="Cloth")
        fa.add(limb([0.885, 0.90, 0.99, 1.0], [0.045, 0.054, 0.058, 0.05], [s * 0.275] * 4, mat="Leather"))
        parts.append(("Base_Forearm_" + side, fa, "J_Forearm_" + side, None))

        hc = Vector(HAND_CENTER_L if s > 0 else HAND_CENTER_R)
        hand = Geo()
        hand.add(rounded_box(0.105, 0.10, 0.125, 3.2, seg=12, rings=6, mat="Skin").move(*hc))
        hand.add(rounded_box(0.035, 0.098, 0.105, 3.0, seg=10, rings=5, mat="Skin").move(hc.x + 0.05, hc.y, hc.z - 0.008))
        hand.add(superquad(0.024, 0.022, 0.045, 2.0, 2.0, seg=8, rings=5, mat="Skin").rotate(25, "Y").move(hc.x + 0.045, hc.y - s * 0.048, hc.z + 0.02))
        parts.append(("Base_Hand_" + side, hand, "J_Hand_" + side, None))

        th = limb([0.99, 0.94, 0.85, 0.74, 0.62, 0.54, 0.50],
                  [0.05, 0.095, 0.098, 0.088, 0.075, 0.066, 0.04],
                  ys_line(s * 0.11, s * 0.115, 7), rxb=1.05, mat="Cloth")
        parts.append(("Base_Thigh_" + side, th, "J_Thigh_" + side, None))

        sh = limb([0.56, 0.52, 0.45, 0.36, 0.26, 0.17, 0.11],
                  [0.04, 0.062, 0.066, 0.064, 0.052, 0.046, 0.044], [s * 0.115] * 7, mat="Cloth")
        sh.add(limb([0.10, 0.14, 0.30, 0.345, 0.36], [0.058, 0.057, 0.065, 0.071, 0.066], [s * 0.118] * 5, mat="Leather"))
        parts.append(("Base_Shin_" + side, sh, "J_Shin_" + side, None))

        foot_pts = [(-0.075, s * 0.12, 0.06), (-0.06, s * 0.12, 0.065), (0.0, s * 0.12, 0.066), (0.08, s * 0.12, 0.05),
                    (0.15, s * 0.12, 0.042), (0.20, s * 0.12, 0.038), (0.218, s * 0.12, 0.036)]
        fsecs = [S(0.03, 0.035, 2.4, rxb=0.06), S(0.055, 0.05, 2.4, rxb=0.065), S(0.065, 0.056, 2.4, rxb=0.066),
                 S(0.05, 0.058, 2.4, rxb=0.05), S(0.042, 0.055, 2.4, rxb=0.042), S(0.034, 0.045, 2.4, rxb=0.038),
                 S(0.0, 0.0)]
        foot = sweep(foot_pts, fsecs, seg=12, normal_hint=(0, 0, 1), mat="Leather")
        parts.append(("Base_Foot_" + side, foot, "J_Foot_" + side, None))
    return parts


# =============================================================================================
# ARMOUR SETS
# =============================================================================================

CHEST_Z = [1.17, 1.21, 1.28, 1.36, 1.43, 1.48, 1.52, 1.555]
CHEST_RX = [0.165, 0.18, 0.20, 0.21, 0.205, 0.18, 0.145, 0.09]
CHEST_RXB = [0.155, 0.165, 0.175, 0.178, 0.175, 0.16, 0.135, 0.09]
CHEST_RY = [0.20, 0.22, 0.245, 0.265, 0.278, 0.275, 0.22, 0.11]


def chest_shell(pad=0.0, mat="Metal", n=2.4, seg=16, z_top=None):
    zs = list(CHEST_Z)
    if z_top:
        zs[-1] = z_top
    return loft(zs, [S(a + pad, c + pad, n, rxb=b + pad) for a, b, c in zip(CHEST_RX, CHEST_RXB, CHEST_RY)],
                seg=seg, mat=mat)


def plate_parts():
    parts = []
    chest = chest_shell(mat="Metal")
    # central ridge (keel) of the breastplate
    chest.add(sweep([(0.205, 0, 1.20), (0.222, 0, 1.30), (0.222, 0, 1.40), (0.20, 0, 1.47)],
                    [S(0.012, 0.012, 2.0)] * 4, seg=6, normal_hint=(1, 0, 0), mat="Metal"))
    chest.add(loft([1.16, 1.19], [S(0.172, 0.207, 2.4, rxb=0.162)] * 2, seg=16, mat="Secondary"))
    chest.add(loft([1.49, 1.53, 1.585], [S(0.115, 0.13, 2.2), S(0.092, 0.095, 2.0), S(0.082, 0.082, 2.0)], seg=14, mat="Metal"))
    chest.add(loft([1.485, 1.50], [S(0.152, 0.25, 2.4, rxb=0.142)] * 2, seg=16, mat="Secondary"))
    parts.append(("Armor_Plate_Chest", chest, "J_Chest", None))

    ab = Geo()
    for z0, z1, rx, rxb, ry in ((1.04, 1.12, 0.158, 0.15, 0.188), (1.11, 1.19, 0.163, 0.154, 0.196), (1.18, 1.26, 0.168, 0.158, 0.205)):
        ab.add(loft([z0, z1], [S(rx + 0.008, ry + 0.008, 2.4, rxb=rxb + 0.008), S(rx, ry, 2.4, rxb=rxb)], seg=16, mat="Metal"))
    parts.append(("Armor_Plate_Abdomen", ab, "J_Spine", None))

    fauld = Geo()
    for z0, z1, r0, r1 in ((1.10, 1.02, 0.172, 0.182), (1.035, 0.955, 0.184, 0.196), (0.97, 0.885, 0.197, 0.212)):
        fauld.add(loft([z1, z0], [S(r1, r1 + 0.03, 2.4, rxb=r1 + 0.01), S(r0, r0 + 0.025, 2.4, rxb=r0 + 0.005)], seg=16, mat="Metal"))
    fauld.add(loft([1.06, 1.105], [S(0.181, 0.207, 2.4, rxb=0.182)] * 2, seg=16, mat="Leather"))
    fauld.add(rounded_box(0.02, 0.06, 0.05, 4.0, mat="Secondary").move(0.19, 0, 1.083))
    parts.append(("Armor_Plate_Fauld", fauld, "J_Hips", None))

    for side, s in SIDES:
        y = s * 0.27
        pa = superquad(0.125, 0.118, 0.095, 2.2, 2.2, seg=16, rings=8, rzb=0.035, mat="Metal").move(0.0, y, 1.455)
        pa.add(loft([1.415, 1.432], [S(0.13, 0.122, 2.2)] * 2, seg=16, centers=[(0, y)] * 2, mat="Secondary"))
        for z0, z1, r in ((1.42, 1.36, 0.100), (1.365, 1.305, 0.094)):
            pa.add(loft([z1, z0], [S(r, r * 0.95, 2.2), S(r - 0.006, r * 0.95 - 0.006, 2.2)], seg=12,
                        centers=[(0, s * 0.262)] * 2, mat="Metal"))
        parts.append(("Armor_Plate_Pauldron_" + side, pa, "J_UpperArm_" + side, None))

        va = limb([1.12, 1.09, 1.00, 0.94, 0.915], [0.066, 0.072, 0.07, 0.06, 0.058], [s * 0.268] * 5, mat="Metal")
        va.add(limb([0.935, 0.90, 0.865], [0.064, 0.076, 0.088], [s * 0.275] * 3, mat="Metal"))
        va.add(loft([0.862, 0.872], [S(0.09, 0.09, 2.0)] * 2, seg=12, centers=[(0, s * 0.275)] * 2, mat="Secondary"))
        va.add(superquad(0.06, 0.07, 0.065, 2.2, 2.2, seg=12, rings=6, mat="Metal").move(-0.025, s * 0.268, 1.16))
        va.add(superquad(0.055, 0.016, 0.055, 2.0, 2.0, seg=12, rings=6, mat="Metal").move(-0.015, s * 0.335, 1.16))
        parts.append(("Armor_Plate_Vambrace_" + side, va, "J_Forearm_" + side, None))

        hc = Vector(HAND_CENTER_L if s > 0 else HAND_CENTER_R)
        ga = rounded_box(0.118, 0.112, 0.085, 3.2, seg=12, rings=6, mat="Metal").move(hc.x + 0.003, hc.y, hc.z + 0.03)
        ga.add(rounded_box(0.035, 0.11, 0.06, 3.0, seg=10, rings=4, mat="Metal").move(hc.x + 0.056, hc.y, hc.z + 0.012))
        parts.append(("Armor_Plate_Gauntlet_" + side, ga, "J_Hand_" + side, None))

        cu = limb([0.925, 0.885, 0.78, 0.66, 0.575], [0.104, 0.108, 0.103, 0.09, 0.078],
                  ys_line(s * 0.11, s * 0.114, 5), rxb=0.97, seg=12, mat="Metal")
        parts.append(("Armor_Plate_Cuisse_" + side, cu, "J_Thigh_" + side, None))

        gr = limb([0.475, 0.42, 0.32, 0.22, 0.15, 0.118], [0.072, 0.078, 0.076, 0.066, 0.064, 0.066],
                  [s * 0.116] * 6, seg=12, mat="Metal")
        gr.add(superquad(0.052, 0.075, 0.07, 2.2, 2.2, seg=12, rings=6, mat="Metal").move(0.05, s * 0.115, 0.515))
        gr.add(superquad(0.055, 0.016, 0.055, 2.0, 2.0, seg=12, rings=6, mat="Metal").move(0.02, s * 0.188, 0.51))
        gr.add(loft([0.455, 0.47], [S(0.08, 0.08, 2.0)] * 2, seg=12, centers=[(0.0, s * 0.116)] * 2, mat="Secondary"))
        parts.append(("Armor_Plate_Greave_" + side, gr, "J_Shin_" + side, None))

        sab_pts = [(-0.06, s * 0.12, 0.072), (0.0, s * 0.12, 0.074), (0.07, s * 0.12, 0.064), (0.14, s * 0.12, 0.052),
                   (0.20, s * 0.12, 0.045), (0.232, s * 0.12, 0.04)]
        sab_secs = [S(0.05, 0.058, 2.4, rxb=0.04), S(0.07, 0.064, 2.4, rxb=0.035), S(0.06, 0.066, 2.4, rxb=0.035),
                    S(0.05, 0.063, 2.4, rxb=0.032), S(0.038, 0.052, 2.4, rxb=0.03), S(0.0, 0.0)]
        parts.append(("Armor_Plate_Sabaton_" + side,
                      sweep(sab_pts, sab_secs, seg=12, normal_hint=(0, 0, 1), mat="Metal"), "J_Foot_" + side, None))
    return parts


def mail_parts():
    parts = []
    zs, rx = resample(CHEST_Z[:-1], CHEST_RX[:-1], 16)
    _, rxb = resample(CHEST_Z[:-1], CHEST_RXB[:-1], 16)
    _, ry = resample(CHEST_Z[:-1], CHEST_RY[:-1], 16)
    chest = ribbed(zs, [r - 0.03 for r in rx], [r - 0.012 for r in rxb], [r - 0.006 for r in ry], 0.005, mat="Metal")
    chest.add(loft([1.47, 1.53, 1.60], [S(0.135, 0.17, 2.2), S(0.10, 0.10, 2.0), S(0.085, 0.085, 2.0)], seg=14, mat="Metal"))
    parts.append(("Armor_Mail_Chest", chest, "J_Chest", None))

    zs = [1.03 + 0.024 * i for i in range(10)]
    parts.append(("Armor_Mail_Abdomen", ribbed(zs, [0.15] * 10, [0.15] * 10, [0.18 + 0.0025 * i for i in range(10)], 0.005), "J_Spine", None))

    zs = [1.12 - 0.026 * i for i in range(17)]
    sk = ribbed(zs, [0.155 + 0.004 * i for i in range(17)], [0.165 + 0.005 * i for i in range(17)],
                [0.185 + 0.0045 * i for i in range(17)], 0.005)
    sk.add(loft([1.06, 1.10], [S(0.168, 0.193, 2.3, rxb=0.178)] * 2, seg=16, mat="Leather"))
    sk.add(rounded_box(0.02, 0.055, 0.05, 4.0, mat="Secondary").move(0.175, 0, 1.08))
    parts.append(("Armor_Mail_Skirt", sk, "J_Hips", None))

    for side, s in SIDES:
        zs = [1.52 - 0.025 * i for i in range(13)]
        rs = [0.09 - 0.0015 * i for i in range(13)]
        sl = Geo()
        secs = [S(r + (0.005 if i % 2 else 0), (r + (0.005 if i % 2 else 0)) * 0.95, 2.0) for i, r in enumerate(rs)]
        sl.add(loft(zs, secs, seg=12, centers=[(0, lerp(s * 0.25, s * 0.265, i / 12)) for i in range(13)], mat="Metal"))
        parts.append(("Armor_Mail_Sleeve_" + side, sl, "J_UpperArm_" + side, None))
    return parts


def quilted(g, center_x=0.0, amp=0.01, count=10):
    """Vertical quilting ripples on a lofted shell."""
    def fn(v):
        a = math.atan2(v.y, v.x - center_x)
        k = 1.0 + amp * math.cos(count * a)
        return Vector((center_x + (v.x - center_x) * k, v.y * k, v.z))
    return g.deform(fn)


def leather_parts():
    parts = []
    chest = quilted(chest_shell(pad=-0.012, mat="Primary", z_top=1.54), amp=0.025, count=12)
    chest.add(loft([1.48, 1.53, 1.57], [S(0.13, 0.16, 2.2), S(0.095, 0.095, 2.0), S(0.08, 0.08, 2.0)], seg=12, mat="Primary"))
    # baldric strap across the chest (right shoulder to left hip)
    strap = [(0.0, -0.20, 1.52), (0.17, -0.12, 1.43), (0.205, 0.0, 1.33), (0.18, 0.12, 1.22), (0.12, 0.2, 1.16)]
    chest.add(sweep(strap, [S(0.022, 0.008, 4.0)] * 5, seg=8, normal_hint=(0, 0, 1), mat="Leather"))
    parts.append(("Armor_Leather_Chest", chest, "J_Chest", None))

    zs = [1.03 + 0.03 * i for i in range(8)]
    ab = loft(zs, [S(0.152, 0.18 + 0.003 * i, 2.3) for i in range(8)], seg=14, mat="Primary")
    parts.append(("Armor_Leather_Abdomen", quilted(ab, amp=0.03, count=12), "J_Spine", None))

    sk = loft([1.12, 1.00, 0.88, 0.74, 0.70], [S(0.155, 0.185, 2.3, rxb=0.165), S(0.17, 0.2, 2.3, rxb=0.18),
                                               S(0.19, 0.215, 2.3, rxb=0.2), S(0.215, 0.235, 2.3, rxb=0.225),
                                               S(0.21, 0.23, 2.3, rxb=0.22)], seg=16, mat="Primary")
    quilted(sk, amp=0.03, count=12)
    sk.add(loft([1.06, 1.11], [S(0.17, 0.195, 2.3, rxb=0.178)] * 2, seg=16, mat="Leather"))
    sk.add(rounded_box(0.02, 0.05, 0.045, 4.0, mat="Metal").move(0.178, 0, 1.085))
    sk.add(rounded_box(0.07, 0.04, 0.09, 3.0, mat="Leather").move(-0.02, -0.21, 1.01))
    parts.append(("Armor_Leather_Skirt", sk, "J_Hips", None))

    for side, s in SIDES:
        y = s * 0.265
        pad = superquad(0.11, 0.105, 0.085, 2.2, 2.2, seg=14, rings=7, rzb=0.03, mat="Leather").move(0.0, y, 1.45)
        pad.add(loft([1.40, 1.33], [S(0.093, 0.09, 2.2), S(0.088, 0.085, 2.2)], seg=12, centers=[(0, s * 0.258)] * 2, mat="Leather"))
        for dx in (-0.05, 0.0, 0.05):
            pad.add(superquad(0.012, 0.012, 0.012, 2.0, 2.0, seg=6, rings=3, mat="Metal").move(dx, y + s * 0.098, 1.452))
        parts.append(("Armor_Leather_Pad_" + side, pad, "J_UpperArm_" + side, None))

        br = limb([1.08, 1.04, 0.96, 0.905], [0.066, 0.07, 0.064, 0.06], [s * 0.272] * 4, mat="Leather")
        for z in (1.03, 0.98, 0.93):
            br.add(loft([z - 0.006, z + 0.006], [S(0.071, 0.071, 2.0)] * 2, seg=10, centers=[(0, s * 0.272)] * 2, mat="Primary"))
        parts.append(("Armor_Leather_Bracer_" + side, br, "J_Forearm_" + side, None))
    return parts


def robe_parts():
    parts = []
    chest = chest_shell(pad=0.008, mat="Primary", n=2.2, z_top=1.545)
    chest.add(loft([1.47, 1.52, 1.56], [S(0.165, 0.2, 2.2), S(0.115, 0.125, 2.0), S(0.095, 0.095, 2.0)], seg=14, mat="Secondary"))
    chest.add(sweep([(0.17, -0.07, 1.47), (0.212, -0.02, 1.36), (0.218, 0.0, 1.30), (0.212, 0.02, 1.36), (0.17, 0.07, 1.47)],
                    [S(0.012, 0.006, 4.0)] * 5, seg=6, normal_hint=(1, 0, 0), mat="Secondary"))
    parts.append(("Armor_Robe_Chest", chest, "J_Chest", None))

    zs = [1.03 + 0.03 * i for i in range(8)]
    ab = loft(zs, [S(0.16, 0.19 + 0.003 * i, 2.2) for i in range(8)], seg=14, mat="Primary")
    ab.add(loft([1.08, 1.15], [S(0.172, 0.205, 2.2)] * 2, seg=14, mat="Secondary"))
    ab.add(rounded_box(0.02, 0.06, 0.26, 4.0, mat="Secondary").rotate(-6, "X").move(0.17, 0.08, 0.98))
    parts.append(("Armor_Robe_Abdomen", ab, "J_Spine", None))

    zs = [1.13, 1.02, 0.85, 0.62, 0.38, 0.16, 0.07]
    rx = [0.16, 0.18, 0.21, 0.25, 0.29, 0.32, 0.33]
    rxb = [0.168, 0.19, 0.225, 0.27, 0.31, 0.34, 0.35]
    ry = [0.19, 0.205, 0.225, 0.25, 0.275, 0.295, 0.30]
    sk = loft(zs, [S(a, c, 2.1, rxb=b) for a, b, c in zip(rx, rxb, ry)], seg=18, mat="Primary")
    # soft vertical folds
    quilted(sk, amp=0.035, count=9)
    sk.add(loft([0.055, 0.12], [S(0.34, 0.31, 2.1, rxb=0.36)] * 2, seg=18, mat="Secondary"))
    parts.append(("Armor_Robe_Skirt", sk, "J_Hips", None))

    for side, s in SIDES:
        sl = limb([1.53, 1.49, 1.40, 1.30, 1.20, 1.16], [0.04, 0.095, 0.098, 0.095, 0.092, 0.06],
                  ys_line(s * 0.25, s * 0.265, 6), seg=12, mat="Primary")
        parts.append(("Armor_Robe_Sleeve_" + side, sl, "J_UpperArm_" + side, None))
        cu = limb([1.20, 1.16, 1.06, 0.97, 0.93], [0.07, 0.085, 0.10, 0.125, 0.13], [s * 0.27] * 5,
                  xs=[0.0, 0.0, -0.005, -0.015, -0.02], seg=14, mat="Primary")
        cu.add(limb([0.915, 0.95], [0.135, 0.13], [s * 0.27] * 2, xs=[-0.02, -0.018], seg=14, mat="Secondary"))
        parts.append(("Armor_Robe_Cuff_" + side, cu, "J_Forearm_" + side, None))
    return parts


def zigzag_hem(g, z_below, depth, count, phase=0.0):
    """Push vertices under z_below down/up alternately around the axis (torn hems)."""
    def fn(v):
        if v.z < z_below:
            a = math.atan2(v.y, v.x) + phase
            tri = abs(((a * count / (2 * math.pi)) % 1.0) * 2 - 1)
            return Vector((v.x, v.y, v.z - depth * tri))
        return v
    return g.deform(fn)


def rags_parts():
    parts = []
    chest = chest_shell(pad=-0.014, mat="Primary", n=2.3, z_top=1.54)
    chest.add(rounded_box(0.012, 0.09, 0.08, 4.0, mat="Cloth").rotate(8, "X").move(0.19, -0.08, 1.33))
    chest.add(rounded_box(0.06, 0.012, 0.07, 4.0, mat="Cloth").move(-0.02, -0.262, 1.40))
    parts.append(("Armor_Rags_Chest", chest, "J_Chest", None))

    zs = [1.03 + 0.03 * i for i in range(8)]
    parts.append(("Armor_Rags_Abdomen", loft(zs, [S(0.15, 0.178 + 0.003 * i, 2.3) for i in range(8)], seg=14, mat="Primary"),
                  "J_Spine", None))

    zs = [1.12, 1.02, 0.92, 0.80, 0.78, 0.76]
    sk = loft(zs, [S(0.155, 0.185, 2.3, rxb=0.165), S(0.17, 0.2, 2.3, rxb=0.18), S(0.19, 0.215, 2.3, rxb=0.2),
                   S(0.21, 0.23, 2.3, rxb=0.22), S(0.212, 0.232, 2.3, rxb=0.222), S(0.205, 0.225, 2.3, rxb=0.215)],
              seg=20, mat="Primary")
    zigzag_hem(sk, 0.81, 0.09, 7)
    rope = torus(1.0, 0.11, 18, 6, mat="Leather").scale(0.175, 0.2, 0.1).move(0, 0, 1.075)
    sk.add(rope)
    sk.add(sweep([(0.17, 0.07, 1.07), (0.185, 0.08, 0.98), (0.19, 0.09, 0.90)], [S(0.012, 0.012)] * 3, seg=6, mat="Leather"))
    parts.append(("Armor_Rags_Skirt", sk, "J_Hips", None))

    for side, s in SIDES:
        zs = [1.10 - 0.022 * i for i in range(10)]
        w = loft(zs, [S(0.064 - 0.001 * i + (0.006 if i % 2 else 0.0), 0.064 - 0.001 * i + (0.006 if i % 2 else 0.0), 2.0)
                      for i in range(10)], seg=10, centers=[(0, s * 0.27)] * 10, mat="Cloth")
        parts.append(("Armor_Rags_Wrap_" + side, w, "J_Forearm_" + side, None))
    return parts


def fur_parts():
    parts = []
    zs = [1.36, 1.40, 1.45, 1.50, 1.55, 1.58]
    mantle = loft(zs, [S(0.20, 0.30, 2.2, rxb=0.20), S(0.215, 0.325, 2.2, rxb=0.22), S(0.21, 0.32, 2.2, rxb=0.215),
                       S(0.18, 0.28, 2.2, rxb=0.19), S(0.13, 0.17, 2.2, rxb=0.14), S(0.10, 0.11, 2.2)],
                  seg=24, mat="Leather")

    def shag(v):
        a = math.atan2(v.y, v.x)
        k = 1.0 + 0.06 * math.sin(11 * a) * (1.0 if v.z < 1.53 else 0.4)
        return Vector((v.x * k, v.y * k, v.z))
    mantle.deform(shag)
    zigzag_hem(mantle, 1.385, 0.05, 12)
    parts.append(("Armor_Fur_Mantle", mantle, "J_Chest", None))

    parts.append(("Armor_Fur_Chest", chest_shell(pad=-0.012, mat="Primary", n=2.3, z_top=1.54), "J_Chest", None))
    zs = [1.03 + 0.03 * i for i in range(8)]
    parts.append(("Armor_Fur_Abdomen", loft(zs, [S(0.152, 0.18 + 0.003 * i, 2.3) for i in range(8)], seg=14, mat="Primary"),
                  "J_Spine", None))

    sk = loft([1.12, 1.0, 0.86, 0.70, 0.66], [S(0.155, 0.185, 2.3, rxb=0.165), S(0.17, 0.2, 2.3, rxb=0.18),
                                              S(0.195, 0.22, 2.3, rxb=0.205), S(0.225, 0.245, 2.3, rxb=0.235),
                                              S(0.22, 0.24, 2.3, rxb=0.23)], seg=16, mat="Primary")
    quilted(sk, amp=0.03, count=8)
    sk.add(loft([1.05, 1.12], [S(0.172, 0.198, 2.3, rxb=0.18)] * 2, seg=16, mat="Leather"))
    sk.add(superquad(0.015, 0.045, 0.045, 2.0, 2.0, seg=10, rings=5, mat="Metal").move(0.185, 0, 1.085))
    parts.append(("Armor_Fur_Skirt", sk, "J_Hips", None))

    for side, s in SIDES:
        br = limb([1.08, 1.04, 0.96, 0.905], [0.068, 0.072, 0.066, 0.062], [s * 0.272] * 4, mat="Leather")
        br.add(loft([1.055, 1.07], [S(0.075, 0.075, 2.0)] * 2, seg=10, centers=[(0, s * 0.272)] * 2, mat="Metal"))
        parts.append(("Armor_Fur_Bracer_" + side, br, "J_Forearm_" + side, None))
        zs = [0.40 - 0.026 * i for i in range(12)]
        wr = loft(zs, [S(0.07 - 0.0012 * i + (0.007 if i % 2 else 0), 0.07 - 0.0012 * i + (0.007 if i % 2 else 0), 2.0)
                       for i in range(12)], seg=10, centers=[(0, s * 0.117)] * 12, mat="Cloth")
        parts.append(("Armor_Fur_Wrap_" + side, wr, "J_Shin_" + side, None))
    return parts


# =============================================================================================
# HELMS / HAIR / CRESTS  (all on J_Head)
# =============================================================================================

def great_helm(top_round=False, cross=True, vents=True, trim="Secondary"):
    g = Geo()
    n = 2.8
    x0 = 0.01
    lower_z = [1.50, 1.53, 1.58, 1.63, 1.66, 1.682]
    lower = [(0.135, 0.145, 0.135), (0.15, 0.15, 0.14), (0.157, 0.152, 0.142), (0.157, 0.152, 0.142),
             (0.154, 0.152, 0.142), (0.152, 0.152, 0.142)]
    g.add(loft(lower_z, [S(a, c, n, rxb=b) for a, b, c in lower], seg=20, centers=[(x0, 0)] * 6, mat="Metal"))
    g.add(loft([1.674, 1.718], [S(0.128, 0.139, n, rxb=0.149)] * 2, seg=20, centers=[(x0, 0)] * 2, mat="DarkMetal"))
    if top_round:
        up_z = [1.71, 1.72, 1.76, 1.80, 1.84, 1.87, 1.885]
        up = [(0.152, 0.152, 0.142), (0.154, 0.152, 0.142), (0.15, 0.15, 0.14), (0.138, 0.14, 0.13),
              (0.11, 0.112, 0.105), (0.065, 0.066, 0.062), (0.0, 0.0, 0.0)]
    else:
        up_z = [1.71, 1.72, 1.76, 1.80, 1.835, 1.852, 1.858]
        up = [(0.152, 0.152, 0.142), (0.154, 0.152, 0.142), (0.152, 0.151, 0.141), (0.148, 0.148, 0.139),
              (0.135, 0.136, 0.128), (0.10, 0.10, 0.095), (0.0, 0.0, 0.0)]
    g.add(loft(up_z, [S(a, c, n, rxb=b) for a, b, c in up], seg=20, centers=[(x0, 0)] * len(up_z), mat="Metal"))
    g.add(loft([1.495, 1.515], [S(0.142, 0.143, n, rxb=0.152)] * 2, seg=20, centers=[(x0, 0)] * 2, mat=trim))
    g.add(front_band(1.732, 0.152, 0.142, n, 0.12, 0.022, 0.008, x0=x0, mat=trim))
    if cross:
        g.add(rounded_box(0.012, 0.035, 0.16, 4.0, seg=8, rings=4, mat=trim).move(x0 + 0.161, 0, 1.592))
        g.add(rounded_box(0.012, 0.035, 0.11, 4.0, seg=8, rings=4, mat=trim).move(x0 + 0.155, 0, 1.79))
    if vents:
        for s in (1, -1):
            for i in range(4):
                g.add(rounded_box(0.012, 0.03, 0.009, 4.0, seg=8, rings=3, mat="DarkMetal")
                      .rotate(s * 30, "Z").move(x0 + 0.138, s * 0.085, 1.555 + 0.022 * i))
    return g


def helm_parts():
    parts = []
    parts.append(("Helm_Great", great_helm(), "J_Head", None))

    nasal = lathe([(0.138, 1.585), (0.142, 1.62), (0.138, 1.68), (0.125, 1.74), (0.095, 1.80), (0.055, 1.86),
                   (0.02, 1.905), (0.0, 1.925)], seg=18, mat="Metal").move(0.008, 0, 0)
    nasal.add(loft([1.578, 1.615], [S(0.147, 0.147, 2.0)] * 2, seg=18, centers=[(0.008, 0)] * 2, mat="Secondary"))
    nasal.add(rounded_box(0.018, 0.032, 0.12, 4.0, mat="Metal").rotate(-8, "Y").move(0.162, 0, 1.56))
    nasal.add(ribbed([1.43, 1.45, 1.47, 1.49, 1.51, 1.53, 1.55, 1.58], [0.03, 0.035, 0.04, 0.05, 0.06, 0.07, 0.09, 0.10],
                     [0.16, 0.158, 0.155, 0.152, 0.15, 0.147, 0.145, 0.142], [0.152, 0.15, 0.148, 0.146, 0.144, 0.142, 0.14, 0.14],
                     0.004, n=2.0, seg=16, mat="DarkMetal"))
    parts.append(("Helm_Nasal", nasal, "J_Head", None))

    horned = great_helm(top_round=True, cross=False, trim="DarkMetal")
    for s in (1, -1):
        pts = [(0.02, s * 0.125, 1.76), (0.02, s * 0.2, 1.80), (0.05, s * 0.265, 1.875), (0.11, s * 0.29, 1.97),
               (0.19, s * 0.28, 2.03), (0.25, s * 0.26, 2.05)]
        rs = [0.048, 0.044, 0.036, 0.026, 0.014, 0.0]
        horned.add(sweep(pts, [S(r) for r in rs], seg=10, normal_hint=(0, 0, 1), mat="Horn"))
        horned.add(torus(0.05, 0.012, 12, 5, mat="DarkMetal").rotate(90, "X").move(0.02, s * 0.14, 1.76))
    parts.append(("Helm_Horned", horned, "J_Head", None))

    turban = superquad(0.135, 0.13, 0.10, 2.2, 2.2, seg=16, rings=8, rzb=0.02, mat="Cloth").move(0.0, 0, 1.745)
    turban.add(torus(0.125, 0.036, 18, 7, mat="Cloth").rotate(-8, "Y").move(0.0, 0, 1.712))
    turban.add(torus(0.118, 0.034, 18, 7, mat="Cloth").rotate(6, "Y").move(-0.005, 0, 1.755))
    turban.add(torus(0.095, 0.032, 16, 7, mat="Cloth").rotate(-4, "Y").move(-0.01, 0, 1.795))
    turban.add(superquad(0.06, 0.06, 0.05, 2.0, 2.0, seg=12, rings=6, mat="Cloth").move(-0.015, 0, 1.83))
    turban.add(superquad(0.018, 0.024, 0.03, 2.0, 2.0, seg=8, rings=5, mat="Secondary").move(0.158, 0, 1.745))
    turban.add(sweep([(0.155, 0, 1.775), (0.17, 0, 1.84), (0.15, 0, 1.92)], [S(0.012, 0.03, 2.0), S(0.016, 0.035, 2.0), S(0.0, 0.0)],
                     seg=8, normal_hint=(1, 0, 0), mat="Secondary"))
    parts.append(("Helm_Turban", turban, "J_Head", None))

    spiked = lathe([(0.138, 1.59), (0.145, 1.64), (0.142, 1.70), (0.125, 1.76), (0.09, 1.82), (0.05, 1.87),
                    (0.022, 1.92), (0.012, 1.97), (0.0, 2.04)], seg=18, mat="Metal").move(0.008, 0, 0)
    spiked.add(loft([1.583, 1.62], [S(0.149, 0.149, 2.0)] * 2, seg=18, centers=[(0.008, 0)] * 2, mat="Secondary"))
    spiked.add(ribbed([1.42, 1.44, 1.46, 1.48, 1.50, 1.52, 1.54, 1.56, 1.59], [0.08, 0.085, 0.09, 0.095, 0.10, 0.105, 0.11, 0.115, 0.12],
                      [0.165, 0.16, 0.157, 0.154, 0.15, 0.148, 0.146, 0.144, 0.142],
                      [0.165, 0.16, 0.157, 0.153, 0.15, 0.147, 0.145, 0.143, 0.142], 0.004, n=2.0, seg=16, mat="DarkMetal"))
    spiked.add(rounded_box(0.016, 0.03, 0.10, 4.0, mat="Metal").rotate(-8, "Y").move(0.162, 0, 1.565))
    parts.append(("Helm_Spiked", spiked, "J_Head", None))

    crown = great_helm(top_round=True, cross=True)
    crown.add(loft([1.795, 1.84], [S(0.145, 0.137, 2.6, rxb=0.143)] * 2, seg=20, centers=[(0.01, 0)] * 2, mat="Secondary"))
    for i in range(8):
        a = 2 * math.pi * i / 8 + math.pi / 8
        cx, cy = 0.01 + 0.142 * math.cos(a), 0.135 * math.sin(a)
        crown.add(loft([1.835, 1.91], [S(0.03, 0.015, 2.0), S(0.0, 0.0)], seg=6, mat="Secondary")
                  .rotate(math.degrees(a), "Z").move(cx, cy, 0))
        crown.add(superquad(0.013, 0.013, 0.013, 2.0, 2.0, seg=6, rings=3, mat="Secondary").move(cx * 1.01, cy * 1.01, 1.918))
    parts.append(("Helm_Crown", crown, "J_Head", None))

    hz = [1.38, 1.42, 1.47, 1.52, 1.58, 1.64, 1.70, 1.76, 1.81, 1.845, 1.862]
    hrx = [0.20, 0.19, 0.12, 0.085, 0.075, 0.08, 0.085, 0.08, 0.06, 0.03, 0.0]
    hrxb = [0.21, 0.20, 0.17, 0.16, 0.158, 0.155, 0.15, 0.14, 0.12, 0.08, 0.0]
    hry = [0.285, 0.275, 0.19, 0.15, 0.145, 0.143, 0.14, 0.13, 0.11, 0.07, 0.0]
    hood = loft(hz, [S(a, c, 2.2, rxb=b) for a, b, c in zip(hrx, hrxb, hry)], seg=18, centers=[(0.0, 0)] * len(hz), mat="Primary")
    hood.add(sweep([(-0.10, 0, 1.79), (-0.19, 0, 1.75), (-0.25, 0, 1.66), (-0.27, 0, 1.55)],
                   [S(0.06, 0.05), S(0.045, 0.04), S(0.03, 0.03), S(0.0, 0.0)], seg=10, normal_hint=(1, 0, 0), mat="Primary"))
    parts.append(("Helm_Hood", hood, "J_Head", None))

    def brim(r_out, z, wave=0.0, droop=0.03):
        b = lathe([(0.0, z - 0.008), (r_out * 0.95, z - 0.008), (r_out, z), (r_out * 0.95, z + 0.01), (0.12, z + 0.014),
                   (0.0, z + 0.014)], seg=28, mat="Primary")

        def fn(v):
            r = math.hypot(v.x, v.y)
            a = math.atan2(v.y, v.x)
            return Vector((v.x, v.y, v.z - droop * (r / r_out) ** 2 + wave * math.sin(5 * a) * (r / r_out) ** 2))
        return b.deform(fn)

    wiz = brim(0.32, 1.755)
    wpts = [(0, 0, 1.755), (-0.01, 0, 1.86), (-0.04, 0, 1.98), (-0.10, 0, 2.09), (-0.19, 0, 2.15), (-0.27, 0, 2.13)]
    wiz.add(sweep(wpts, [S(r) for r in (0.14, 0.12, 0.09, 0.058, 0.03, 0.0)], seg=16, normal_hint=(1, 0, 0), mat="Primary"))
    wiz.add(loft([1.765, 1.81], [S(0.142, 0.142), S(0.128, 0.128)], seg=16, mat="Secondary"))
    for i, (x, z) in enumerate(((0.07, 1.95), (-0.05, 2.07), (0.10, 1.84))):
        wiz.add(superquad(0.02, 0.006, 0.02, 1.0, 1.0, seg=8, rings=4, mat="Secondary").move(x + 0.03, -0.11 + 0.04 * i, z))
    parts.append(("Helm_WizardHat", wiz, "J_Head", None))

    witch = brim(0.30, 1.755, wave=0.02, droop=0.02)
    tpts = [(0, 0, 1.755), (-0.01, 0, 1.90), (-0.05, 0, 2.03), (-0.06, 0, 2.15), (-0.01, 0, 2.24), (0.07, 0, 2.27)]
    witch.add(sweep(tpts, [S(r) for r in (0.13, 0.095, 0.065, 0.04, 0.02, 0.0)], seg=14, normal_hint=(1, 0, 0), mat="Primary"))
    witch.add(loft([1.765, 1.805], [S(0.133, 0.133), S(0.12, 0.12)], seg=14, mat="Secondary"))
    witch.add(rounded_box(0.014, 0.05, 0.045, 5.0, mat="Metal").move(0.13, 0, 1.785))
    parts.append(("Helm_WitchHat", witch, "J_Head", None))

    vk = lathe([(0.14, 1.60), (0.146, 1.66), (0.14, 1.72), (0.115, 1.79), (0.07, 1.84), (0.0, 1.868)], seg=18, mat="Metal").move(0.008, 0, 0)
    vk.add(loft([1.592, 1.625], [S(0.151, 0.151, 2.0)] * 2, seg=18, centers=[(0.008, 0)] * 2, mat="Secondary"))
    vk.add(sweep([(0.008 + 0.15 * math.cos(math.radians(a)), 0.0, 1.62 + 0.25 * math.sin(math.radians(a)) ** 1.2)
                  for a in range(0, 181, 20)], [S(0.006, 0.018, 4.0)] * 10, seg=8, normal_hint=(1, 0, 0), mat="Secondary"))
    for s in (1, -1):
        vk.add(torus(0.034, 0.009, 12, 5, mat="Metal").rotate(90, "Y").move(0.142, s * 0.042, 1.688))
        pts = [(0.0, s * 0.135, 1.72), (0.0, s * 0.22, 1.755), (0.025, s * 0.27, 1.835), (0.07, s * 0.26, 1.92)]
        vk.add(sweep(pts, [S(r) for r in (0.036, 0.03, 0.018, 0.0)], seg=10, normal_hint=(0, 0, 1), mat="Horn"))
    vk.add(rounded_box(0.016, 0.026, 0.09, 4.0, mat="Metal").rotate(-6, "Y").move(0.16, 0, 1.64))
    parts.append(("Helm_Viking", vk, "J_Head", None))
    return parts


def hair_parts():
    parts = []
    cap = superquad(0.124, 0.113, 0.145, 2.2, 2.2, seg=18, rings=10, rxb=0.132, rzb=0.11, mat="Hair").move(0.008, 0, 1.672)

    def hairline(v):
        if v.x > 0.03 and v.z < 1.74:
            c = Vector((0.0, 0.0, 1.66))
            return c + (v - c) * 0.82
        k = 1.0 + 0.04 * math.sin(9 * math.atan2(v.y, v.x)) * max(0.0, (v.z - 1.66) / 0.15)
        return Vector((v.x * k, v.y * k, v.z + 0.006 * math.sin(7 * math.atan2(v.y, v.x))))
    cap.deform(hairline)
    parts.append(("Hair_Short", cap, "J_Head", None))

    long = cap.copy()
    long.add(superquad(0.075, 0.13, 0.17, 2.2, 2.2, seg=14, rings=8, mat="Hair").move(-0.075, 0, 1.56))
    for s in (1, -1):
        long.add(sweep([(-0.02, s * 0.11, 1.68), (0.0, s * 0.125, 1.58), (-0.01, s * 0.13, 1.47)],
                       [S(0.035, 0.02), S(0.03, 0.02), S(0.0, 0.0)], seg=8, normal_hint=(1, 0, 0), mat="Hair"))
    parts.append(("Hair_Long", long, "J_Head", None))

    beard = superquad(0.072, 0.09, 0.07, 2.2, 2.2, seg=14, rings=8, rzb=0.11, mat="Hair").move(0.072, 0, 1.585)
    beard.deform(lambda v: Vector((v.x + max(0.0, 1.56 - v.z) * 0.35, v.y, v.z)))
    beard.add(sweep([(0.12, -0.065, 1.60), (0.142, -0.03, 1.618), (0.146, 0.0, 1.62), (0.142, 0.03, 1.618), (0.12, 0.065, 1.60)],
                    [S(0.0, 0.0), S(0.012, 0.014), S(0.014, 0.014), S(0.012, 0.014), S(0.0, 0.0)], seg=8,
                    normal_hint=(1, 0, 0), mat="Hair"))
    parts.append(("Hair_Beard", beard, "J_Head", None))
    return parts


def feather(pts, width, thick=0.012, mat="Primary"):
    count = len(pts)
    secs = []
    for i in range(count):
        t = i / (count - 1)
        w = width * math.sin(math.pi * min(0.98, 0.15 + t * 0.85)) if i < count - 1 else 0.0
        secs.append(S(w, thick * (1 - t * 0.6), 2.2) if i < count - 1 else S(0.0, 0.0))
    return sweep(pts, secs, seg=8, normal_hint=(0, 0, 1), mat=mat)


def crest_parts():
    parts = []
    plume = cylinder(0.026, 0.06, seg=10, r2=0.02, mat="Secondary").move(-0.005, 0, 1.835)
    for i, (y, ln, lift) in enumerate(((-0.045, 0.85, 0.0), (-0.022, 0.95, 0.02), (0.0, 1.0, 0.03), (0.022, 0.95, 0.02), (0.045, 0.85, 0.0))):
        p = bezier3((0.0, y * 0.4, 1.87), (0.02, y, 2.02 + lift), (-0.30 * ln, y * 1.5, 2.12 + lift), (-0.52 * ln, y * 2.2, 1.78 + lift * 2), 7)
        plume.add(feather(p, 0.05 if abs(y) < 0.03 else 0.042, 0.022))
    parts.append(("Crest_Plume", plume, "J_Head", None))

    fe = cylinder(0.018, 0.05, seg=8, mat="Secondary").rotate(-12, "Y").move(-0.03, 0.135, 1.72)
    p = bezier3((-0.03, 0.14, 1.75), (-0.04, 0.15, 1.95), (-0.12, 0.155, 2.12), (-0.24, 0.15, 2.22), 9)
    fe.add(feather(p, 0.055, 0.008))
    fe.add(sweep(p[:-1], [S(0.006, 0.01)] * (len(p) - 1), seg=6, normal_hint=(0, 0, 1), mat="Secondary"))
    parts.append(("Crest_Feather", fe, "J_Head", None))

    ant = Geo()
    for s in (1, -1):
        beam = [(0.0, s * 0.06, 1.835), (-0.02, s * 0.14, 1.95), (-0.05, s * 0.22, 2.06), (-0.08, s * 0.26, 2.16), (-0.06, s * 0.28, 2.27)]
        ant.add(sweep(beam, [S(r) for r in (0.032, 0.027, 0.022, 0.015, 0.0)], seg=8, normal_hint=(1, 0, 0), mat="Horn"))
        for t0, t1, t2 in (((-0.02, s * 0.15, 1.97), (0.05, s * 0.18, 2.03), (0.10, s * 0.2, 2.09)),
                           ((-0.06, s * 0.235, 2.10), (0.0, s * 0.27, 2.17), (0.02, s * 0.30, 2.25)),
                           ((-0.075, s * 0.25, 2.14), (-0.14, s * 0.28, 2.2), (-0.16, s * 0.31, 2.25))):
            ant.add(sweep([t0, t1, t2], [S(0.017), S(0.011), S(0.0)], seg=6, normal_hint=(0, 0, 1), mat="Horn"))
    ant.add(cylinder(0.03, 0.04, seg=10, mat="Secondary").move(0, 0, 1.83))
    parts.append(("Crest_Antlers", ant, "J_Head", None))
    return parts


# =============================================================================================
# CAPE / TABARD
# =============================================================================================

def cape_parts():
    parts = []
    k = 1.6
    up = slab([1.535, 1.50, 1.40, 1.25, 1.10, 1.01], [0.16, 0.235, 0.27, 0.272, 0.275, 0.277],
              [-0.10, -0.165, -0.19, -0.20, -0.205, -0.208], thick=0.014, k=k)
    up.add(loft([1.505, 1.54], [S(0.11, 0.12, 2.0, rxb=0.17)] * 2, seg=14, centers=[(-0.02, 0)] * 2, mat="Secondary"))
    parts.append(("Back_Cape", up, "J_Cape", None))
    lo = slab([1.06, 0.90, 0.72, 0.54, 0.40], [0.277, 0.285, 0.295, 0.305, 0.31], [-0.208, -0.215, -0.23, -0.245, -0.255],
              thick=0.014, k=k)
    lo.add(slab([0.42, 0.37], [0.312, 0.313], [-0.255, -0.258], thick=0.018, k=k, mat="Secondary"))
    parts.append(("Back_Cape_2", lo, "J_Cape_2", None))
    return parts


def tabard_parts():
    parts = []
    zs = [1.16, 1.22, 1.30, 1.38, 1.44, 1.475]
    rx = [0.19, 0.205, 0.222, 0.228, 0.22, 0.20]
    rxb = [0.18, 0.188, 0.195, 0.198, 0.195, 0.18]
    ry = [0.222, 0.24, 0.262, 0.28, 0.288, 0.285]
    top = loft(zs, [S(a, c, 2.4, rxb=b) for a, b, c in zip(rx, rxb, ry)], seg=18, mat="Primary")
    top.add(loft([1.465, 1.49], [S(0.205, 0.29, 2.4, rxb=0.185)] * 2, seg=18, mat="Secondary"))
    top.add(rounded_box(0.014, 0.05, 0.25, 4.0, mat="Secondary").move(0.232, 0, 1.31))
    top.add(rounded_box(0.014, 0.19, 0.045, 4.0, mat="Secondary").move(0.236, 0, 1.36))
    parts.append(("Tabard_Front", top, "J_Chest", None))

    flap = slab([1.14, 1.0, 0.86, 0.72, 0.64], [0.15, 0.15, 0.155, 0.16, 0.16], [0.222, 0.224, 0.228, 0.232, 0.235], thick=0.013, k=0.6)
    flap.add(slab([0.665, 0.625], [0.163, 0.164], [0.236, 0.237], thick=0.017, k=0.6, mat="Secondary"))
    flap.add(rounded_box(0.016, 0.045, 0.2, 4.0, mat="Secondary").move(0.244, 0, 0.92))
    parts.append(("Tabard_Front_2", flap, "J_Tabard", None))

    sk = loft([1.17, 1.06, 0.94, 0.80, 0.76], [S(0.14, 0.215, 2.4, rxb=0.185), S(0.15, 0.228, 2.4, rxb=0.20),
                                              S(0.16, 0.245, 2.4, rxb=0.225), S(0.17, 0.265, 2.4, rxb=0.25),
                                              S(0.17, 0.268, 2.4, rxb=0.252)], seg=18, mat="Primary")
    sk.add(loft([0.79, 0.755], [S(0.172, 0.271, 2.4, rxb=0.256)] * 2, seg=18, mat="Secondary"))
    sk.add(loft([1.085, 1.125], [S(0.205, 0.226, 2.4, rxb=0.196)] * 2, seg=18, mat="Leather"))
    sk.add(rounded_box(0.02, 0.06, 0.055, 4.0, mat="Secondary").move(0.248, 0, 1.105))
    parts.append(("Tabard_Front_3", sk, "J_Hips", None))
    return parts


# =============================================================================================
# WEAPONS (J_Hand_R). Built in weapon space: grip centre at origin, blade along +X,
# leading (cutting) side = -Z, flat faces = +-Y (towards the camera).
# =============================================================================================

def _along_x(g):
    """Rotate geometry built along +Z so it lies along +X."""
    return g.rotate(90, "Y")


def grip(x0, x1, r=0.024, mat="Leather", ribs=6):
    zs = [x0 + (x1 - x0) * i / (ribs * 2) for i in range(ribs * 2 + 1)]
    g = loft(zs, [S(r + (0.003 if i % 2 else 0.0)) for i in range(len(zs))], seg=8, mat=mat)
    return _along_x(g)


def blade(xs, widths, thick, curve=None, mat="Metal", back_bias=1.0):
    """Lofted blade along X: widths are half-widths (edge direction Z), thickness along Y."""
    curve = curve or [0.0] * len(xs)
    pts = [(x, 0.0, c) for x, c in zip(xs, curve)]
    secs = [S(w, thick if w > 0 else 0.0, 1.15, rxb=w * back_bias) if w > 0 else S(0.0, 0.0) for w in widths]
    return sweep(pts, secs, seg=8, normal_hint=(0, 0, -1), mat=mat, phase=0.0)


def weapon_to_world(g):
    hc = Vector(HAND_CENTER_R)
    return g.transform(Matrix.Translation(hc) @ Matrix.Rotation(math.radians(WEAPON_GRIP_ANGLE), 4, "Y"))


def weapon_parts():
    parts = []
    sw = blade([0.10, 0.14, 0.40, 0.80, 1.10, 1.22, 1.28], [0.052, 0.05, 0.047, 0.042, 0.034, 0.016, 0.0], 0.014)
    sw.add(blade([0.13, 0.20, 0.70, 1.05], [0.012, 0.012, 0.01, 0.0], 0.017, mat="DarkMetal"))
    guard = rounded_box(0.045, 0.055, 0.36, 3.5, seg=10, rings=8, mat="Secondary")
    guard.deform(lambda v: Vector((v.x + 0.05 * (v.z / 0.18) ** 2, v.y, v.z)))
    sw.add(guard.move(0.085, 0, 0))
    sw.add(superquad(0.03, 0.03, 0.03, 2.0, 2.0, seg=8, rings=4, mat="Secondary").move(0.15, 0, 0.19))
    sw.add(superquad(0.03, 0.03, 0.03, 2.0, 2.0, seg=8, rings=4, mat="Secondary").move(0.15, 0, -0.19))
    sw.add(grip(-0.12, 0.065, 0.025))
    sw.add(superquad(0.04, 0.032, 0.045, 2.0, 2.0, seg=10, rings=6, mat="Secondary").move(-0.15, 0, 0))
    parts.append(("Weapon_Sword", weapon_to_world(sw), "J_Hand_R", None))

    xs = [0.09, 0.2, 0.4, 0.6, 0.8, 0.95, 1.05, 1.10]
    sc = blade(xs, [0.045, 0.046, 0.05, 0.058, 0.066, 0.06, 0.035, 0.0], 0.012,
               curve=[0.0, 0.004, 0.02, 0.05, 0.095, 0.14, 0.18, 0.21])
    g2 = rounded_box(0.035, 0.05, 0.22, 3.5, seg=10, rings=6, mat="Secondary")
    g2.deform(lambda v: Vector((v.x - 0.04 * (v.z / 0.11) ** 2, v.y, v.z)))
    sc.add(g2.move(0.07, 0, 0))
    sc.add(grip(-0.11, 0.055, 0.024))
    sc.add(sweep([(-0.11, 0, 0), (-0.15, 0, -0.01), (-0.17, 0, -0.04)], [S(0.03), S(0.028), S(0.0)], seg=8, normal_hint=(0, 0, 1),
                 mat="Secondary"))
    parts.append(("Weapon_Scimitar", weapon_to_world(sc), "J_Hand_R", None))

    sp = _along_x(cylinder(0.023, 2.12, seg=8, mat="Wood")).move(-0.82, 0, 0)
    sp.add(blade([1.25, 1.33, 1.45, 1.58, 1.66], [0.03, 0.06, 0.055, 0.03, 0.0], 0.016))
    sp.add(_along_x(cylinder(0.03, 0.10, seg=8, r2=0.026, mat="Metal")).move(1.20, 0, 0))
    sp.add(_along_x(cylinder(0.028, 0.06, seg=8, mat="Metal")).move(-0.86, 0, 0))
    sp.add(grip(-0.12, 0.12, 0.026))
    parts.append(("Weapon_Spear", weapon_to_world(sp), "J_Hand_R", None))

    ax = _along_x(cylinder(0.027, 1.05, seg=8, r2=0.03, mat="Wood")).move(-0.28, 0, 0)
    head_outline = [(0.56, 0.05), (0.72, 0.05), (0.735, 0.0), (0.78, -0.08), (0.86, -0.20), (0.87, -0.29), (0.80, -0.33),
                    (0.70, -0.32), (0.60, -0.26), (0.58, -0.16), (0.60, -0.06)]
    ax.add(extrude_outline(head_outline, 0.034, bevel=0.012, mat="Metal", fan=True))
    ax.add(extrude_outline([(0.85, -0.18), (0.89, -0.25), (0.88, -0.31), (0.84, -0.34), (0.86, -0.27)], 0.02, bevel=0.0,
                           mat="DarkMetal", fan=True).move(0.0, 0.0, 0.0))
    ax.add(sweep([(0.64, 0, 0.05), (0.64, 0, 0.12), (0.62, 0, 0.18)], [S(0.03, 0.016), S(0.022, 0.014), S(0.0, 0.0)], seg=8,
                 normal_hint=(1, 0, 0), mat="Metal"))
    ax.add(grip(-0.14, 0.10, 0.03))
    parts.append(("Weapon_Axe", weapon_to_world(ax), "J_Hand_R", None))

    club_z = [-0.16, -0.12, 0.10, 0.40, 0.60, 0.75, 0.84, 0.88]
    club = _along_x(loft(club_z, [S(0.0, 0.0), S(0.032), S(0.034), S(0.055), S(0.085), S(0.10), S(0.08), S(0.0)], seg=12, mat="Wood"))
    for i in range(10):
        a = i * 137.5
        x = 0.48 + 0.035 * i
        r = 0.06 + 0.04 * min(1.0, i / 6)
        d = Vector((0, math.cos(math.radians(a)), math.sin(math.radians(a))))
        base = Vector((x, 0, 0)) + d * (r * 0.9)
        tip = Vector((x, 0, 0)) + d * (r + 0.055)
        club.add(sweep([tuple(base), tuple(tip)], [S(0.016), S(0.0)], seg=4, normal_hint=(1, 0, 0), mat="DarkMetal"))
    club.add(grip(-0.12, 0.10, 0.036))
    parts.append(("Weapon_Club", weapon_to_world(club), "J_Hand_R", None))

    dg = blade([0.07, 0.10, 0.25, 0.40, 0.46], [0.04, 0.038, 0.032, 0.014, 0.0], 0.012)
    dg.add(rounded_box(0.03, 0.04, 0.18, 3.5, seg=8, rings=5, mat="Secondary").move(0.055, 0, 0))
    dg.add(grip(-0.09, 0.045, 0.022))
    dg.add(superquad(0.028, 0.026, 0.028, 2.0, 2.0, seg=8, rings=4, mat="Secondary").move(-0.11, 0, 0))
    parts.append(("Weapon_Dagger", weapon_to_world(dg), "J_Hand_R", None))

    st_z = [-0.70 + 0.12 * i for i in range(16)]
    st = _along_x(loft(st_z, [S(0.024 + 0.004 * math.sin(i * 1.7) + 0.0006 * i) for i in range(16)], seg=8, mat="Wood"))
    for a in (0, 120, 240):
        d = Vector((0, math.cos(math.radians(a)), math.sin(math.radians(a))))
        pts = [Vector((1.10, 0, 0)) + d * 0.02, Vector((1.17, 0, 0)) + d * 0.075, Vector((1.27, 0, 0)) + d * 0.07,
               Vector((1.33, 0, 0)) + d * 0.025]
        st.add(sweep([tuple(p) for p in pts], [S(0.02), S(0.018), S(0.013), S(0.0)], seg=6, normal_hint=(1, 0, 0), mat="Wood"))
    st.add(superquad(0.07, 0.07, 0.07, 2.0, 2.0, seg=14, rings=8, mat="Glow").move(1.22, 0, 0))
    for x in (0.95, 1.05):
        st.add(_along_x(cylinder(0.034, 0.025, seg=8, mat="Secondary")).move(x, 0, 0))
    st.add(grip(-0.12, 0.12, 0.03))
    parts.append(("Weapon_Staff", weapon_to_world(st), "J_Hand_R", None))
    return parts


# =============================================================================================
# OFF-HAND (shields on J_Forearm_L authored in the guard pose; bow on J_Hand_L in the draw pose)
# Shield space: u -> X (width), v -> Z (height), face towards -Y (camera), centred at origin.
# =============================================================================================

SHIELD_CENTER = Vector((0.31, -0.02, 1.10))
SHIELD_TILT = 28.0


def shield_to_world(g, center=SHIELD_CENTER, tilt=SHIELD_TILT):
    return g.transform(Matrix.Translation(center) @ Matrix.Rotation(math.radians(tilt), 4, "Z"))


def bend_shield(g, k):
    """Curve the shield around its vertical axis: edges go back (+Y)."""
    return g.deform(lambda v: Vector((v.x, v.y + k * v.x * v.x, v.z)))


def rim_tube(outline, y, r, mat="Secondary"):
    pts = [(u, y, v) for u, v in outline] + [(outline[0][0], y, outline[0][1])]
    return sweep(pts, [S(r, r * 0.8, 2.0)] * len(pts), seg=6, normal_hint=(0, -1, 0), mat=mat, cap_start=True, cap_end=True)


def kite_outline(steps=10):
    top = [(-0.30, 0.38), (-0.15, 0.44), (0.0, 0.46), (0.15, 0.44), (0.30, 0.38)]
    right = bezier3((0.30, 0.38), (0.34, 0.10), (0.20, -0.25), (0.0, -0.62), steps)[1:]
    left = bezier3((0.0, -0.62), (-0.20, -0.25), (-0.34, 0.10), (-0.30, 0.38), steps)[1:-1]
    return top + right + left


def offhand_parts():
    parts = []
    t = 0.04
    ko = kite_outline()
    kite = extrude_outline(ko, t, bevel=0.012, mat="Primary", fan=True)
    kite.add(rim_tube(ko, 0.0, 0.026))
    # emblem: cross with flared ends + boss
    kite.add(rounded_box(0.07, 0.03, 0.70, 4.0, seg=8, rings=6, mat="Secondary").move(0, -t / 2 - 0.004, -0.06))
    kite.add(rounded_box(0.42, 0.03, 0.07, 4.0, seg=8, rings=6, mat="Secondary").move(0, -t / 2 - 0.004, 0.16))
    for u, v in ((0.0, 0.29), (0.0, -0.41), (0.21, 0.16), (-0.21, 0.16)):
        kite.add(superquad(0.045, 0.02, 0.045, 1.4, 2.0, seg=8, rings=4, mat="Secondary").move(u, -t / 2 - 0.006, v))
    kite.add(superquad(0.065, 0.04, 0.065, 2.0, 2.0, seg=12, rings=6, rzb=0.065, mat="Metal").move(0, -t / 2 - 0.012, 0.16))
    bend_shield(kite, 0.55)
    kite.add(rounded_box(0.06, 0.05, 0.16, 3.0, mat="Leather").move(0.0, t / 2 + 0.03, 0.05))
    parts.append(("Shield_Kite", shield_to_world(kite), "J_Forearm_L", ATTACH_GUARD))

    ro_out = [(0.36 * math.cos(2 * math.pi * i / 24), 0.36 * math.sin(2 * math.pi * i / 24)) for i in range(24)]
    rnd = extrude_outline(ro_out, 0.04, bevel=0.01, mat="Wood")
    for i in range(4):
        a = 2 * math.pi * i / 4 + math.pi / 4
        rnd.add(sweep([(0.08 * math.cos(a), -0.024, 0.08 * math.sin(a)), (0.33 * math.cos(a), -0.024, 0.33 * math.sin(a))],
                      [S(0.035, 0.006, 4.0)] * 2, seg=6, normal_hint=(0, -1, 0), mat="Primary"))
    rnd.add(rim_tube(ro_out, 0.0, 0.026, mat="Metal"))
    rnd.add(superquad(0.09, 0.06, 0.09, 2.0, 2.0, seg=14, rings=6, mat="Metal").move(0, -0.02, 0))
    rnd.deform(lambda v: Vector((v.x, v.y + 0.25 * (v.x * v.x + v.z * v.z), v.z)))
    rnd.add(rounded_box(0.06, 0.05, 0.14, 3.0, mat="Leather").move(0, 0.05, 0))
    parts.append(("Shield_Round", shield_to_world(rnd, center=SHIELD_CENTER + Vector((0, 0, 0.06)), tilt=24), "J_Forearm_L", ATTACH_GUARD))

    ho = [(-0.30, 0.36), (0.30, 0.36)] + bezier3((0.30, 0.36), (0.31, 0.0), (0.22, -0.30), (0.0, -0.46), 8)[1:] + \
        bezier3((0.0, -0.46), (-0.22, -0.30), (-0.31, 0.0), (-0.30, 0.36), 8)[1:-1]
    heater = extrude_outline(ho, t, bevel=0.012, mat="Primary", fan=True)
    heater.add(rim_tube(ho, 0.0, 0.024))
    chev = [(-0.27, -0.02), (0.0, 0.22), (0.27, -0.02), (0.27, -0.13), (0.0, 0.11), (-0.27, -0.13)]
    heater.add(extrude_outline(chev, 0.02, bevel=0.004, mat="Secondary", fan=True).move(0, -t / 2 - 0.006, 0))
    bend_shield(heater, 0.5)
    heater.add(rounded_box(0.06, 0.05, 0.15, 3.0, mat="Leather").move(0.0, t / 2 + 0.03, 0.05))
    parts.append(("Shield_Heater", shield_to_world(heater, center=SHIELD_CENTER + Vector((0, 0, 0.05))), "J_Forearm_L", ATTACH_GUARD))

    bo = [(0.18 * math.cos(2 * math.pi * i / 20), 0.18 * math.sin(2 * math.pi * i / 20)) for i in range(20)]
    buck = extrude_outline(bo, 0.025, bevel=0.008, mat="Metal")
    buck.add(rim_tube(bo, 0.0, 0.016, mat="Secondary"))
    buck.add(superquad(0.07, 0.05, 0.07, 2.0, 2.0, seg=12, rings=6, mat="Metal").move(0, -0.012, 0))
    buck.add(superquad(0.02, 0.03, 0.02, 2.0, 2.0, seg=8, rings=4, mat="Secondary").move(0, -0.06, 0))
    buck.deform(lambda v: Vector((v.x, v.y + 0.6 * (v.x * v.x + v.z * v.z), v.z)))
    # buckler is held in the fist: centre it in front of the left hand in the guard pose
    from_hand = Vector((0.14, -0.04, 0.0))
    parts.append(("Shield_Buckler", shield_to_world(buck, center=_hand_center_in_pose("L", ATTACH_GUARD) + from_hand, tilt=30),
                  "J_Forearm_L", ATTACH_GUARD))

    # bow: vertical in the XZ plane at the left hand (draw pose), limbs bend back towards the archer
    hc = _hand_center_in_pose("L", ATTACH_SHOOT)
    upper = [(0.0, 0.0), (-0.02, 0.15), (-0.07, 0.34), (-0.11, 0.52), (-0.105, 0.64), (-0.065, 0.71)]
    bow = Geo()
    for sgn in (1, -1):
        pts = [(hc.x + 0.03 + x, hc.y - 0.01, hc.z + sgn * z) for x, z in upper]
        rs = [0.03, 0.026, 0.022, 0.018, 0.014, 0.01]
        bow.add(sweep(pts, [S(r, r * 1.3, 2.0) for r in rs], seg=8, normal_hint=(1, 0, 0), mat="Wood"))
        bow.add(superquad(0.014, 0.014, 0.014, 2.0, 2.0, seg=6, rings=3, mat="Secondary").move(hc.x + 0.03 - 0.065, hc.y - 0.01, hc.z + sgn * 0.71))
    bow.add(cylinder(0.005, 1.40, seg=6, mat="Cloth").move(hc.x + 0.03 - 0.066, hc.y - 0.01, hc.z - 0.70))
    bow.add(cylinder(0.034, 0.14, seg=8, mat="Leather").move(hc.x + 0.025, hc.y - 0.01, hc.z - 0.07))
    parts.append(("Offhand_Bow", bow, "J_Hand_L", ATTACH_SHOOT))
    return parts


_RIG = None


def set_rig(rig):
    global _RIG
    _RIG = rig


def _hand_center_in_pose(side, p):
    hc = Vector(HAND_CENTER_L if side == "L" else HAND_CENTER_R)
    j = "J_Hand_" + side
    local = hc - _RIG.rest[j]
    return _RIG.world_matrix(j, p) @ local


def all_parts():
    return (base_parts() + plate_parts() + mail_parts() + leather_parts() + robe_parts() + rags_parts() + fur_parts()
            + helm_parts() + hair_parts() + crest_parts() + cape_parts() + tabard_parts() + weapon_parts() + offhand_parts())
