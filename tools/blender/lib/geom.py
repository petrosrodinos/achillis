"""Procedural low-poly geometry builders.

Everything is built as plain Python vertex/face lists (`Geo`) and turned into a Blender mesh at
the end, so builders compose freely (transform, merge, bend) without touching bpy state.

Main builders
    sweep()          — generalised loft along a 3D path; each section is a superellipse with
                       independent +/- radii (asymmetric shapes: helmets with face plates,
                       tapered limbs, horns, feathers, blades, tails …)
    loft()           — sweep along +Z with explicit section heights (lathe/profile shapes)
    lathe()          — rotational solid from a (radius, z) profile
    superquad()      — rounded/bevelled boxes, capsules, spheres, cylinders (superquadric)
    rounded_box()    — superquad with bevel-like rounded edges
    extrude_outline()— 2D outline (u, v) extruded with a bevelled rim (shields, blades, plates)
    torus()          — rings, belts, turban wraps
"""
import math

import bpy
from mathutils import Matrix, Vector


class Geo:
    def __init__(self):
        self.verts = []
        self.faces = []
        self.mats = []

    # -- composition ---------------------------------------------------------------------
    def add(self, other, matrix=None, mat=None):
        off = len(self.verts)
        if matrix is None:
            self.verts.extend(Vector(v) for v in other.verts)
        else:
            self.verts.extend(matrix @ Vector(v) for v in other.verts)
        self.faces.extend([i + off for i in f] for f in other.faces)
        self.mats.extend([mat] * len(other.faces) if mat else other.mats)
        return self

    def copy(self):
        return Geo().add(self)

    def set_mat(self, mat):
        self.mats = [mat] * len(self.faces)
        return self

    # -- transforms ----------------------------------------------------------------------
    def transform(self, matrix):
        self.verts = [matrix @ Vector(v) for v in self.verts]
        if matrix.determinant() < 0:
            self.faces = [list(reversed(f)) for f in self.faces]
        return self

    def move(self, x=0.0, y=0.0, z=0.0):
        return self.transform(Matrix.Translation((x, y, z)))

    def rotate(self, deg, axis):
        return self.transform(Matrix.Rotation(math.radians(deg), 4, axis))

    def scale(self, sx, sy=None, sz=None):
        sy = sx if sy is None else sy
        sz = sx if sz is None else sz
        return self.transform(Matrix.Diagonal((sx, sy, sz, 1.0)))

    def mirror_y(self):
        """Mirror across the XZ plane (left <-> right)."""
        return self.transform(Matrix.Diagonal((1.0, -1.0, 1.0, 1.0)))

    def keep_faces(self, fn):
        """Keep only faces whose vertex list satisfies fn([Vector]) (unused verts are left, harmless)."""
        keep = [(f, m) for f, m in zip(self.faces, self.mats) if fn([self.verts[i] for i in f])]
        self.faces = [f for f, _ in keep]
        self.mats = [m for _, m in keep]
        return self

    def deform(self, fn):
        """fn(Vector) -> Vector applied to every vertex (bends, tapers, noise)."""
        self.verts = [Vector(fn(Vector(v))) for v in self.verts]
        return self

    # -- checks --------------------------------------------------------------------------
    def signed_volume(self):
        vol = 0.0
        for f in self.faces:
            a = self.verts[f[0]]
            for i in range(1, len(f) - 1):
                b, c = self.verts[f[i]], self.verts[f[i + 1]]
                vol += a.dot(b.cross(c))
        return vol / 6.0

    def fix_orientation(self):
        """Make a closed part's normals point outwards."""
        if self.signed_volume() < 0:
            self.faces = [list(reversed(f)) for f in self.faces]
        return self

    def tri_count(self):
        return sum(len(f) - 2 for f in self.faces)

    def bounds(self):
        xs = [v.x for v in self.verts]
        ys = [v.y for v in self.verts]
        zs = [v.z for v in self.verts]
        return (min(xs), min(ys), min(zs)), (max(xs), max(ys), max(zs))


def _se(c, n):
    """Superellipse component: sign(c)*|c|^(2/n)."""
    return math.copysign(abs(c) ** (2.0 / n), c) if c else 0.0


def section(rx, ry=None, n=2.0, rxb=None, ryn=None):
    """Cross-section spec: rx forward(+N) radius, rxb backward, ry +B radius, ryn -B radius."""
    ry = rx if ry is None else ry
    return {"rx": rx, "rxb": rx if rxb is None else rxb, "ry": ry, "ryn": ry if ryn is None else ryn, "n": n}


def _ring(center, nvec, bvec, sec, seg, phase=0.0):
    rx, rxb, ry, ryn, n = sec["rx"], sec["rxb"], sec["ry"], sec["ryn"], sec["n"]
    if max(rx, rxb, ry, ryn) < 1e-7:
        return [Vector(center)]
    pts = []
    for i in range(seg):
        a = 2 * math.pi * i / seg + phase
        c, s = math.cos(a), math.sin(a)
        u = _se(c, n) * (rx if c >= 0 else rxb)
        w = _se(s, n) * (ry if s >= 0 else ryn)
        pts.append(Vector(center) + nvec * u + bvec * w)
    return pts


def sweep(points, sections, seg=12, cap_start=True, cap_end=True, normal_hint=(1, 0, 0), phase=None,
          mat=None, frames=None):
    """Loft rings along a polyline.

    points   — list of 3D centres
    sections — list of `section()` dicts (same length as points)
    normal_hint — direction the section's +rx axis should point (projected per ring, parallel
                  transported along the path)
    """
    pts = [Vector(p) for p in points]
    count = len(pts)
    if phase is None:
        phase = math.pi / seg if seg % 4 == 0 else 0.0
    # tangents
    tangents = []
    for k in range(count):
        a = pts[max(k - 1, 0)]
        b = pts[min(k + 1, count - 1)]
        t = b - a
        tangents.append(t.normalized() if t.length > 1e-9 else Vector((0, 0, 1)))
    if frames is None:
        frames = []
        nprev = Vector(normal_hint)
        for k in range(count):
            t = tangents[k]
            nv = nprev - t * nprev.dot(t)
            if nv.length < 1e-6:
                nv = Vector((0, 0, 1)) - t * t.z
                if nv.length < 1e-6:
                    nv = Vector((1, 0, 0)) - t * t.x
            nv.normalize()
            bv = t.cross(nv).normalized()
            frames.append((nv, bv))
            nprev = nv
    rings = [_ring(pts[k], frames[k][0], frames[k][1], sections[k], seg, phase) for k in range(count)]
    g = Geo()
    idx = []
    for r in rings:
        start = len(g.verts)
        g.verts.extend(r)
        idx.append(list(range(start, start + len(r))))
    for k in range(count - 1):
        a, b = idx[k], idx[k + 1]
        if len(a) > 1 and len(b) > 1:
            for i in range(seg):
                j = (i + 1) % seg
                g.faces.append([a[i], a[j], b[j], b[i]])
        elif len(a) == 1 and len(b) > 1:
            for i in range(seg):
                g.faces.append([a[0], b[(i + 1) % seg], b[i]])
        elif len(a) > 1 and len(b) == 1:
            for i in range(seg):
                g.faces.append([a[i], a[(i + 1) % seg], b[0]])
    if cap_start and len(idx[0]) > 1:
        g.faces.append(list(reversed(idx[0])))
    if cap_end and len(idx[-1]) > 1:
        g.faces.append(list(idx[-1]))
    g.mats = [mat] * len(g.faces)
    closed = (cap_start or len(idx[0]) == 1) and (cap_end or len(idx[-1]) == 1)
    return g.fix_orientation() if closed else g


def loft(zs, sections, seg=12, centers=None, cap_start=True, cap_end=True, mat=None, normal_hint=(1, 0, 0)):
    """Vertical loft: section k sits at height zs[k] (offset by centers[k]=(x,y) if given)."""
    centers = centers or [(0.0, 0.0)] * len(zs)
    pts = [(c[0], c[1], z) for c, z in zip(centers, zs)]
    # straight vertical frames keep sections axis-aligned even when centres shift
    frames = [(Vector(normal_hint), Vector((0, 0, 1)).cross(Vector(normal_hint)).normalized())] * len(zs)
    return sweep(pts, sections, seg=seg, cap_start=cap_start, cap_end=cap_end, mat=mat, frames=frames)


def lathe(profile, seg=16, n=2.0, sy=1.0, sx=1.0, sxb=None, mat=None, cap=True):
    """profile: [(radius, z), ...] bottom→top. Radius 0 closes to a point."""
    zs = [p[1] for p in profile]
    secs = [section(p[0] * sx, p[0] * sy, n, rxb=p[0] * (sxb if sxb is not None else sx)) for p in profile]
    return loft(zs, secs, seg=seg, cap_start=cap, cap_end=cap, mat=mat)


def superquad(rx, ry, rz, n_h=2.0, n_v=2.0, seg=12, rings=8, mat=None, rxb=None, ryn=None, rzb=None):
    """Superquadric centred at origin (n=2 ellipsoid, n>2 rounded box, rzb = bottom half-height)."""
    rzb = rz if rzb is None else rzb
    zs, secs = [], []
    for j in range(rings + 1):
        v = -math.pi / 2 + math.pi * j / rings
        sv, cv = math.sin(v), math.cos(v)
        z = _se(sv, n_v) * (rz if sv >= 0 else rzb)
        k = abs(cv) ** (2.0 / n_v) if abs(cv) > 1e-9 else 0.0
        zs.append(z)
        secs.append(section(rx * k, ry * k, n_h, rxb=(rxb if rxb is not None else rx) * k,
                            ryn=(ryn if ryn is not None else ry) * k))
    return loft(zs, secs, seg=seg, mat=mat)


def rounded_box(sx, sy, sz, roundness=6.0, seg=12, rings=6, mat=None):
    """Box of full size (sx, sy, sz) with soft bevel-like edges."""
    return superquad(sx / 2, sy / 2, sz / 2, roundness, roundness, seg, rings, mat)


def cylinder(r, h, seg=12, r2=None, n=2.0, mat=None, bevel=0.0):
    """Tapered cylinder from z=0 to z=h (optionally with a small chamfer at both ends)."""
    r2 = r if r2 is None else r2
    if bevel > 0:
        zs = [0, 0, bevel, h - bevel, h, h]
        rs = [0, r - bevel, r, r2, r2 - bevel, 0]
        secs = [section(x, x, n) for x in rs]
        return loft(zs, secs, seg=seg, mat=mat)
    return loft([0, h], [section(r, r, n), section(r2, r2, n)], seg=seg, mat=mat)


def torus(R, r, seg_u=16, seg_v=6, ry_scale=1.0, mat=None, n_v=2.0):
    """Torus in the XY plane around Z."""
    g = Geo()
    for i in range(seg_u):
        a = 2 * math.pi * i / seg_u
        ca, sa = math.cos(a), math.sin(a)
        for j in range(seg_v):
            b = 2 * math.pi * j / seg_v
            cb, sb = _se(math.cos(b), n_v), _se(math.sin(b), n_v)
            rr = R + r * cb
            g.verts.append(Vector((rr * ca, rr * sa * ry_scale, r * sb)))
    for i in range(seg_u):
        for j in range(seg_v):
            a = i * seg_v + j
            b = ((i + 1) % seg_u) * seg_v + j
            c = ((i + 1) % seg_u) * seg_v + (j + 1) % seg_v
            d = i * seg_v + (j + 1) % seg_v
            g.faces.append([a, b, c, d])
    g.mats = [mat] * len(g.faces)
    return g.fix_orientation()


def _offset_polygon(pts, dist):
    """Offset a CCW polygon outward by `dist` (negative = inset) using miter normals."""
    n = len(pts)
    out = []
    for i in range(n):
        p0, p1, p2 = Vector(pts[i - 1]), Vector(pts[i]), Vector(pts[(i + 1) % n])
        e0 = (p1 - p0).normalized()
        e1 = (p2 - p1).normalized()
        n0 = Vector((e0.y, -e0.x))
        n1 = Vector((e1.y, -e1.x))
        m = n0 + n1
        if m.length < 1e-6:
            m = n0
        m.normalize()
        cosh = max(m.dot(n0), 0.35)
        out.append(p1 + m * (dist / cosh))
    return out


def polygon_area(pts):
    a = 0.0
    for i in range(len(pts)):
        x0, y0 = pts[i - 1]
        x1, y1 = pts[i]
        a += x0 * y1 - x1 * y0
    return a / 2


def extrude_outline(pts, depth, bevel=0.0, mat=None, side_mat=None, fan=False):
    """Extrude a 2D outline (u→X, v→Z) along Y with a chamfered rim. Centred on y=0.

    fan=True triangulates caps around the centroid (safe for star-convex concave outlines).
    """
    pts = [Vector(p) for p in pts]
    if polygon_area(pts) < 0:
        pts.reverse()
    half = depth / 2
    if bevel > 0:
        inset = _offset_polygon(pts, -bevel)
        layers = [(inset, -half), (pts, -half + bevel), (pts, half - bevel), (inset, half)]
    else:
        layers = [(pts, -half), (pts, half)]
    g = Geo()
    n = len(pts)
    for poly, y in layers:
        g.verts.extend(Vector((p.x, y, p.y)) for p in poly)
    for L in range(len(layers) - 1):
        a0, b0 = L * n, (L + 1) * n
        for i in range(n):
            j = (i + 1) % n
            g.faces.append([a0 + i, a0 + j, b0 + j, b0 + i])
            g.mats.append(side_mat or mat)
    last = (len(layers) - 1) * n
    if fan:
        for base, rev in ((0, True), (last, False)):
            c = sum((g.verts[base + i] for i in range(n)), Vector()) / n
            ci = len(g.verts)
            g.verts.append(c)
            for i in range(n):
                j = (i + 1) % n
                f = [ci, base + i, base + j]
                g.faces.append(list(reversed(f)) if rev else f)
                g.mats.append(mat)
    else:
        g.faces.append(list(reversed(range(0, n))))
        g.mats.append(mat)
        g.faces.append(list(range(last, last + n)))
        g.mats.append(mat)
    return g.fix_orientation()


def arc_points(cx, cy, r, a0, a1, steps):
    """Points on an arc (degrees, inclusive)."""
    return [(cx + r * math.cos(math.radians(a0 + (a1 - a0) * i / steps)),
             cy + r * math.sin(math.radians(a0 + (a1 - a0) * i / steps))) for i in range(steps + 1)]


def bezier2(p0, p1, p2, steps):
    """Quadratic bezier polyline (inclusive)."""
    out = []
    for i in range(steps + 1):
        t = i / steps
        out.append(tuple((1 - t) ** 2 * a + 2 * (1 - t) * t * b + t * t * c for a, b, c in zip(p0, p1, p2)))
    return out


def bezier3(p0, p1, p2, p3, steps):
    out = []
    for i in range(steps + 1):
        t = i / steps
        mt = 1 - t
        out.append(tuple(mt ** 3 * a + 3 * mt * mt * t * b + 3 * mt * t * t * c + t ** 3 * d
                         for a, b, c, d in zip(p0, p1, p2, p3)))
    return out


# ---------------------------------------------------------------------------------------------
# Blender object creation
# ---------------------------------------------------------------------------------------------

def to_object(name, geo, materials, smooth=True, sharp_angle=38.0, collection=None):
    """Create a mesh object from a Geo. `materials` maps material name -> bpy Material."""
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata([tuple(v) for v in geo.verts], [], [list(f) for f in geo.faces])
    order = []
    for m in geo.mats:
        if m not in order:
            order.append(m)
    for m in order:
        mesh.materials.append(materials[m])
    lookup = {m: i for i, m in enumerate(order)}
    mesh.polygons.foreach_set("material_index", [lookup[m] for m in geo.mats])
    mesh.validate(clean_customdata=False)
    mesh.update()
    if smooth:
        mesh.shade_smooth()
        if sharp_angle is not None:
            mesh.set_sharp_from_angle(angle=math.radians(sharp_angle))
    else:
        mesh.shade_flat()
    obj = bpy.data.objects.new(name, mesh)
    (collection or bpy.context.scene.collection).objects.link(obj)
    return obj


def merge(*parts):
    g = Geo()
    for p in parts:
        g.add(p)
    return g
