"""Creature helpers shared by the quadruped / winged builders.

LegRig  — planar 2-bone leg IK on top of a `Rig` (root position from full FK of the pose, so
          spine segments such as J_Chest are honoured), with gait-cycle helpers (generalised
          from build_horse.py).
feather / wing_parts — stylised layered wings (leading-edge tube, covert rows, flight feathers)
          split over N joint segments so the flap can curl through the wing.
"""
import math

from mathutils import Vector

from .anim import Key
from .geom import Geo, section as S, superquad, sweep
from .rig import dir_angle, ik2


# =============================================================================================
# legs
# =============================================================================================

class LegRig:
    """legs: {key: (upper, lower, foot, bend_forward)}; foot rest direction is straight down.

    Leg specs used by `pose_legs`:
        None                     → toe planted at its rest ground point
        ("ik", dx, z, curl)      → toe at (rest_x + dx, z); curl = absolute foot angle (deg)
        ("fk", u, l, f)          → relative joint rotations
        ("abs", ua, la, fa)      → absolute sagittal segment angles (0 = hanging, -90 = forward)
    """

    def __init__(self, rig, legs):
        self.rig = rig
        self.legs = legs
        self.foot_len = {k: rig.rest[v[2]].z for k, v in legs.items()}

    def pitch_above(self, joint, pose):
        a = 0.0
        j = self.rig.parent[joint]
        while j:
            a += pose.get(j, {}).get("r", (0, 0, 0))[1]
            j = self.rig.parent[j]
        return a

    def seg_rest(self, a, b):
        d = self.rig.rest[b] - self.rig.rest[a]
        return dir_angle(d.x, d.z)

    def solve(self, pose, key, spec):
        up, lo, ft, fwd = self.legs[key]
        ur, lr = self.seg_rest(up, lo), self.seg_rest(lo, ft)
        pitch = self.pitch_above(up, pose)
        if spec is not None and spec[0] == "fk":
            pose[up] = {"r": (0, spec[1], 0)}
            pose[lo] = {"r": (0, spec[2], 0)}
            pose[ft] = {"r": (0, spec[3], 0)}
            return
        if spec is not None and spec[0] == "abs":
            ua, la, fa = spec[1:]
        else:
            rest_x = self.rig.rest[ft].x
            dx, z, curl = (0.0, 0.0, 0.0) if spec is None else spec[1:]
            c = math.radians(curl)
            fl = self.foot_len[key]
            fx, fz = rest_x + dx + fl * math.sin(c), z + fl * math.cos(c)
            root = self.rig.world_point(up, pose=pose)
            l1 = (self.rig.rest[lo] - self.rig.rest[up]).length
            l2 = (self.rig.rest[ft] - self.rig.rest[lo]).length
            ua, la = ik2((root.x, root.z), (fx, fz), l1, l2, bend_forward=fwd)
            fa = curl
        pose[up] = {"r": (0, (ua - ur) - pitch, 0)}
        pose[lo] = {"r": (0, (la - lr) - (ua - ur), 0)}
        pose[ft] = {"r": (0, fa - (la - lr), 0)}

    def pose_legs(self, pose, specs=None):
        specs = specs or {}
        for key in self.legs:
            self.solve(pose, key, specs.get(key))
        return pose


def gait_leg(phase, duty, stride, lift, curl_max, plant_curl=25.0):
    """One leg's ("ik", dx, z, curl) at a cycle phase (stance first, then swing)."""
    ph = phase % 1.0
    if ph < duty:
        t = ph / duty
        return ("ik", stride / 2 - stride * t, 0.0, plant_curl * t ** 4)
    t = (ph - duty) / (1 - duty)
    x = -stride / 2 + stride * (0.5 - 0.5 * math.cos(math.pi * t))
    z = lift * math.sin(math.pi * t) ** 1.2
    return ("ik", x, z, curl_max * math.sin(math.pi * min(1.0, t * 1.15)))


def gait_cycle(frames, offsets, duty, stride, lift, curl, pose_fn, body_fn, front_scale=(1.15, 1.0), hind_scale=(0.85, 0.7)):
    """Baked LINEAR keys for a looping gait. pose_fn(legs=..., **body_fn(phase)) -> pose."""
    keys = []
    for f in range(frames + 1):
        ph = f / frames
        legs = {}
        for leg, off in offsets.items():
            ls, cs = front_scale if leg.startswith("F") else hind_scale
            legs[leg] = gait_leg(ph - off, duty, stride, lift * ls, curl * cs)
        keys.append(Key(f, pose_fn(legs=legs, **body_fn(ph)), "LINEAR"))
    return keys


def mirror_r(r, sign):
    """Mirror an (rx, ry, rz) rotation for the right (-Y) side: rx and rz flip."""
    return (r[0] * sign, r[1], r[2] * sign)


# =============================================================================================
# feathers & wings
# =============================================================================================

def feather(base, direction, length, width, thick=0.012, arch=0.0, up=(0, 0, 1), mat="Feathers", seg=6, droop=0.0):
    """Flat stylised feather: pointed blade from `base` along `direction` (in the plane ⟂ up)."""
    d = Vector(direction).normalized()
    upv = Vector(up).normalized()
    b = Vector(base)
    ts = (0.0, 0.18, 0.55, 0.86, 1.0)
    pts = [b + d * length * t + upv * (arch * math.sin(math.pi * t) - droop * t * t) for t in ts]
    ws = (0.45, 0.9, 1.0, 0.7, 0.0)
    secs = [S(thick * (1.0 if w else 0.0), width * w, 2.0) if w else S(0.0, 0.0) for w in ws]
    return sweep(pts, secs, seg=seg, normal_hint=upv, mat=mat)


class WingSpec:
    """Geometry/joint layout of one wing (built for the LEFT side, +Y; mirrored for the right).

    root      — shoulder joint (x, y>0, z)
    spans     — segment lengths along +Y (2 or 3 segments)
    le_th     — leading-edge tube half thickness per segment
    coverts   — list of rows: (chord, thickness) — layered covert bands behind the leading edge
    secondary — (count per non-tip segment, length, width)
    primary   — (count, min length, max length, width, fan from°, fan to°)
    """

    def __init__(self, root, spans, le_th, coverts, secondary, primary, thick=0.012, prefix="J_Wing", name="Wing"):
        self.root = Vector(root)
        self.spans = spans
        self.le_th = le_th
        self.coverts = coverts
        self.secondary = secondary
        self.primary = primary
        self.thick = thick
        self.prefix = prefix
        self.name = name

    def joints(self, parent):
        """[(joint, head, parent)] for both sides."""
        out = []
        for side, s in (("L", 1.0), ("R", -1.0)):
            y = self.root.y
            prev = parent
            for i, L in enumerate(self.spans):
                j = "%s%d_%s" % (self.prefix, i + 1, side)
                out.append((j, (self.root.x, s * y, self.root.z), prev))
                prev = j
                y += L
        return out

    def parts(self):
        """[(object name, Geo, joint)] for both sides."""
        out = []
        for side, s in (("L", 1.0), ("R", -1.0)):
            for i, g in enumerate(self._segments()):
                if s < 0:
                    g = g.copy().mirror_y()
                out.append(("%s_%d_%s" % (self.name, i + 1, side), g, "%s%d_%s" % (self.prefix, i + 1, side)))
        return out

    def _segments(self):
        x0, z0 = self.root.x, self.root.z
        ys = [self.root.y]
        for L in self.spans:
            ys.append(ys[-1] + L)
        n = len(self.spans)
        segs = []
        for i in range(n):
            g = Geo()
            ya, yb = ys[i], ys[i + 1]
            tip = i == n - 1
            th = self.le_th[i]
            th_b = self.le_th[i + 1] if i + 1 < n else th * 0.55
            # leading-edge "arm" (bone + marginal coverts): a plump tube, overlapping its neighbours
            ya_o = ya - (0.04 if i else 0.06)
            yb_o = yb + (0.03 if not tip else 0.0)
            pts = [(x0, ya_o, z0), (x0, (ya_o + yb_o) / 2, z0 + 0.01), (x0 - (0.04 if tip else 0.0), yb_o, z0)]
            g.add(sweep(pts, [S(th, th * 1.5, 2.0, rxb=th * 0.7), S(th * 0.9, th * 1.35, 2.0, rxb=th * 0.6),
                              S(th_b * 0.9, th_b * 1.3, 2.0, rxb=th_b * 0.6)],
                        seg=10, normal_hint=(0, 0, 1), mat="Feathers"))
            # covert rows: flattened bands with a scalloped trailing edge
            off = th * 0.8
            for r, (chord, cth) in enumerate(self.coverts):
                k = 1.0 - (0.35 if tip else 0.0) * (r + 1) / len(self.coverts)
                c = chord * k
                cx = x0 - off - c / 2
                zc = z0 + 0.012 * (len(self.coverts) - r)
                yc = [ya - 0.02, (ya + yb) / 2, yb + (0.0 if tip else 0.02)]
                taper = [1.0, 0.95, 0.7 if tip else 0.95]
                band = sweep([(cx + c / 2 * (1 - t), y, zc) for y, t in zip(yc, taper)],
                             [S(cth, c / 2 * t, 2.6) for t in taper], seg=10, normal_hint=(0, 0, 1), mat="Feathers")
                amp = c * 0.12

                def scallop(v, cx=cx, c=c, amp=amp):
                    if v.x < cx - c * 0.2:
                        return Vector((v.x - amp * abs(math.sin(v.y * 9.0)), v.y, v.z))
                    return v
                band.deform(scallop)
                g.add(band)
                off += c * 0.55
            # flight feathers
            if not tip:
                cnt, length, width = self.secondary
                for k in range(cnt):
                    t = (k + 0.5) / cnt
                    y = ya + (yb - ya) * t
                    ang = math.radians(4 + 10 * (i + t) / max(1, n - 1))
                    d = (-math.cos(ang), math.sin(ang), 0)
                    L = length * (0.92 + 0.08 * math.sin(k * 2.1))
                    z = z0 - 0.006 * (k % 2) - 0.004 * i
                    g.add(feather((x0 - th * 0.4, y, z), d, L, width, thick=self.thick, droop=0.02))
            else:
                cnt, lmin, lmax, width, a0, a1 = self.primary
                for k in range(cnt):
                    t = k / max(1, cnt - 1)
                    y = ya + (yb - ya) * (0.1 + 0.85 * t)
                    ang = math.radians(a0 + (a1 - a0) * t)
                    d = (-math.cos(ang), math.sin(ang), 0)
                    L = lmin + (lmax - lmin) * math.sin(t * math.pi / 2) ** 0.8
                    z = z0 - 0.007 * k
                    g.add(feather((x0 - th * 0.3, y, z), d, L, width * (1.0 - 0.15 * t), thick=self.thick, arch=0.015))
            segs.append(g)
        return segs


def eye(center, r, mat="Eye", seg=10):
    return superquad(r, r, r, 2.0, 2.0, seg=seg, rings=6, mat=mat).move(*center)


def claw(base, direction, length, r, mat, seg=6, curl=0.4):
    """Curved tapering claw / talon / tusk from base along direction, curling downwards."""
    d = Vector(direction).normalized()
    side = d.cross(Vector((0, 0, 1)))
    if side.length < 1e-6:
        side = Vector((0, 1, 0))
    down = side.cross(d).normalized() * -1.0
    b = Vector(base)
    pts = [b + d * length * t + down * (curl * length * t * t) for t in (0.0, 0.35, 0.7, 1.0)]
    return sweep(pts, [S(r), S(r * 0.8), S(r * 0.45), S(0.0, 0.0)], seg=seg, normal_hint=(0, 0, 1), mat=mat)
