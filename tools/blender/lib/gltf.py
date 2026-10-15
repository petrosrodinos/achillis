"""Minimal GLB reader/writer + inspection helpers (pure Python, no bpy needed)."""
import json
import math
import struct

GLB_MAGIC = 0x46546C67
CHUNK_JSON = 0x4E4F534A
CHUNK_BIN = 0x004E4942

COMPONENT = {5120: ("b", 1), 5121: ("B", 1), 5122: ("h", 2), 5123: ("H", 2), 5125: ("I", 4), 5126: ("f", 4)}
NCOMP = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4, "MAT4": 16}


def read_glb(path):
    with open(path, "rb") as f:
        data = f.read()
    magic, _version, _length = struct.unpack_from("<III", data, 0)
    assert magic == GLB_MAGIC, "not a GLB"
    off = 12
    doc, binchunk = None, b""
    while off < len(data):
        clen, ctype = struct.unpack_from("<II", data, off)
        chunk = data[off + 8: off + 8 + clen]
        if ctype == CHUNK_JSON:
            doc = json.loads(chunk.decode("utf-8"))
        elif ctype == CHUNK_BIN:
            binchunk = bytearray(chunk)
        off += 8 + clen
    return doc, binchunk


def write_glb(path, doc, binchunk):
    js = json.dumps(doc, separators=(",", ":")).encode("utf-8")
    js += b" " * ((4 - len(js) % 4) % 4)
    binchunk = bytes(binchunk)
    binchunk += b"\0" * ((4 - len(binchunk) % 4) % 4)
    total = 12 + 8 + len(js) + (8 + len(binchunk) if binchunk else 0)
    with open(path, "wb") as f:
        f.write(struct.pack("<III", GLB_MAGIC, 2, total))
        f.write(struct.pack("<II", len(js), CHUNK_JSON))
        f.write(js)
        if binchunk:
            f.write(struct.pack("<II", len(binchunk), CHUNK_BIN))
            f.write(binchunk)


def read_accessor(doc, binchunk, idx):
    acc = doc["accessors"][idx]
    bv = doc["bufferViews"][acc["bufferView"]]
    fmt, size = COMPONENT[acc["componentType"]]
    n = NCOMP[acc["type"]]
    stride = bv.get("byteStride", size * n)
    base = bv.get("byteOffset", 0) + acc.get("byteOffset", 0)
    out = []
    for i in range(acc["count"]):
        vals = struct.unpack_from("<" + fmt * n, binchunk, base + i * stride)
        out.append(vals if n > 1 else vals[0])
    return out


def write_scalar_accessor(doc, binchunk, idx, values):
    acc = doc["accessors"][idx]
    bv = doc["bufferViews"][acc["bufferView"]]
    assert acc["componentType"] == 5126 and acc["type"] == "SCALAR"
    stride = bv.get("byteStride", 4)
    base = bv.get("byteOffset", 0) + acc.get("byteOffset", 0)
    for i, v in enumerate(values):
        struct.pack_into("<f", binchunk, base + i * stride, v)
    acc["min"] = [min(values)]
    acc["max"] = [max(values)]


def animation_durations(doc, binchunk=None):
    """{animation name: duration seconds} using accessor max (or data when min/max missing)."""
    out = {}
    for anim in doc.get("animations", []):
        tmax = 0.0
        for s in anim["samplers"]:
            acc = doc["accessors"][s["input"]]
            if "max" in acc:
                tmax = max(tmax, acc["max"][0])
            elif binchunk is not None:
                tmax = max(tmax, max(read_accessor(doc, binchunk, s["input"])))
        out[anim["name"]] = tmax
    return out


def retime_animations(path, targets):
    """Rescale time inputs so that animation `name` lasts exactly targets[name] seconds.

    Used for clips whose contract duration is not a whole number of 30 fps frames
    (e.g. BlockRaise 0.15 s = 4.5 frames): they are baked over the next whole frame count and
    uniformly compressed here. Input accessors shared with other animations are duplicated.
    """
    doc, binchunk = read_glb(path)
    used_by = {}
    for ai, anim in enumerate(doc.get("animations", [])):
        for s in anim["samplers"]:
            used_by.setdefault(s["input"], set()).add(ai)
    changed = False
    for ai, anim in enumerate(doc.get("animations", [])):
        want = targets.get(anim["name"])
        if want is None:
            continue
        inputs = {s["input"] for s in anim["samplers"]}
        tmax = max(doc["accessors"][i]["max"][0] for i in inputs)
        if tmax <= 0 or abs(tmax - want) < 1e-6:
            continue
        k = want / tmax
        remap = {}
        for i in inputs:
            vals = read_accessor(doc, binchunk, i)
            if used_by[i] != {ai}:
                # duplicate the accessor data at the end of the binary chunk
                pad = (4 - len(binchunk) % 4) % 4
                binchunk.extend(b"\0" * pad)
                offset = len(binchunk)
                binchunk.extend(struct.pack("<%df" % len(vals), *vals))
                doc["bufferViews"].append({"buffer": 0, "byteOffset": offset, "byteLength": 4 * len(vals)})
                acc = dict(doc["accessors"][i])
                acc["bufferView"] = len(doc["bufferViews"]) - 1
                acc["byteOffset"] = 0
                doc["accessors"].append(acc)
                remap[i] = len(doc["accessors"]) - 1
            else:
                remap[i] = i
            write_scalar_accessor(doc, binchunk, remap[i], [v * k for v in vals])
        for s in anim["samplers"]:
            s["input"] = remap[s["input"]]
        changed = True
    if changed:
        doc["buffers"][0]["byteLength"] = len(binchunk)
        write_glb(path, doc, binchunk)
    return changed


# ---------------------------------------------------------------------------------------------
# node transforms (rest pose) for axis checks
# ---------------------------------------------------------------------------------------------

def _quat_to_mat(q):
    x, y, z, w = q
    return [
        [1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)],
        [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)],
        [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)],
    ]


def node_local(node):
    if "matrix" in node:
        m = node["matrix"]
        return [[m[c * 4 + r] for c in range(4)] for r in range(4)]
    t = node.get("translation", [0, 0, 0])
    r = node.get("rotation", [0, 0, 0, 1])
    s = node.get("scale", [1, 1, 1])
    R = _quat_to_mat(r)
    return [[R[i][0] * s[0], R[i][1] * s[1], R[i][2] * s[2], t[i]] for i in range(3)] + [[0, 0, 0, 1]]


def _mul(a, b):
    return [[sum(a[i][k] * b[k][j] for k in range(4)) for j in range(4)] for i in range(4)]


def world_matrices(doc, nodes=None):
    nodes = nodes if nodes is not None else doc["nodes"]
    parents = {}
    for i, n in enumerate(nodes):
        for c in n.get("children", []):
            parents[c] = i
    cache = {}

    def get(i):
        if i not in cache:
            loc = node_local(nodes[i])
            cache[i] = _mul(get(parents[i]), loc) if i in parents else loc
        return cache[i]

    return {nodes[i].get("name", str(i)): get(i) for i in range(len(nodes))}, parents


def _sample(times, values, t, is_quat):
    if t <= times[0]:
        return list(values[0])
    if t >= times[-1]:
        return list(values[-1])
    lo, hi = 0, len(times) - 1
    while hi - lo > 1:
        mid = (lo + hi) // 2
        if times[mid] <= t:
            lo = mid
        else:
            hi = mid
    k = (t - times[lo]) / max(1e-9, times[hi] - times[lo])
    a, b = values[lo], values[hi]
    if is_quat and sum(x * y for x, y in zip(a, b)) < 0:
        b = [-x for x in b]
    v = [x + (y - x) * k for x, y in zip(a, b)]
    if is_quat:
        n = math.sqrt(sum(x * x for x in v)) or 1.0
        v = [x / n for x in v]
    return v


def posed_nodes(doc, binchunk, anim_name, t):
    """Copy of doc['nodes'] with TRS overridden by animation `anim_name` sampled at time t (s)."""
    nodes = [dict(n) for n in doc["nodes"]]
    anim = next(a for a in doc.get("animations", []) if a.get("name") == anim_name)
    for ch in anim["channels"]:
        path = ch["target"]["path"]
        if path not in ("translation", "rotation", "scale"):
            continue
        s = anim["samplers"][ch["sampler"]]
        times = read_accessor(doc, binchunk, s["input"])
        vals = read_accessor(doc, binchunk, s["output"])
        nodes[ch["target"]["node"]][path] = _sample(times, vals, t, path == "rotation")
        nodes[ch["target"]["node"]].pop("matrix", None)
    return nodes


def mesh_world_bounds(doc, worlds, nodes=None, names=None):
    """AABB (lo, hi) over mesh nodes (optionally only `names`) using each mesh's local bounds corners."""
    nodes = nodes if nodes is not None else doc["nodes"]
    lo, hi = [math.inf] * 3, [-math.inf] * 3
    for n in nodes:
        if "mesh" not in n or (names is not None and n.get("name") not in names):
            continue
        a, b = mesh_local_bounds(doc, n["mesh"])
        m = worlds[n.get("name")]
        for x in (a[0], b[0]):
            for y in (a[1], b[1]):
                for z in (a[2], b[2]):
                    p = transform_point(m, (x, y, z))
                    lo = [min(u, v) for u, v in zip(lo, p)]
                    hi = [max(u, v) for u, v in zip(hi, p)]
    return lo, hi


def transform_point(m, p):
    return [m[i][0] * p[0] + m[i][1] * p[1] + m[i][2] * p[2] + m[i][3] for i in range(3)]


def mesh_local_bounds(doc, mesh_index):
    lo, hi = [math.inf] * 3, [-math.inf] * 3
    for prim in doc["meshes"][mesh_index]["primitives"]:
        acc = doc["accessors"][prim["attributes"]["POSITION"]]
        lo = [min(a, b) for a, b in zip(lo, acc["min"])]
        hi = [max(a, b) for a, b in zip(hi, acc["max"])]
    return lo, hi


def count_triangles(doc):
    tris = 0
    per_mesh = {}
    for mi, mesh in enumerate(doc.get("meshes", [])):
        t = 0
        for prim in mesh["primitives"]:
            if prim.get("mode", 4) != 4:
                continue
            if "indices" in prim:
                t += doc["accessors"][prim["indices"]]["count"] // 3
            else:
                t += doc["accessors"][prim["attributes"]["POSITION"]]["count"] // 3
        per_mesh[mesh.get("name", str(mi))] = t
        tris += t
    return tris, per_mesh
