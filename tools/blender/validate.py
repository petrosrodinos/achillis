"""Validate exported GLBs against docs/contracts.md §4.1.

Checks the raw glTF JSON (node / material / animation names, durations, no skins or morphs,
animation only on non-mesh nodes, +Y up / +X facing / ground origin) and then re-imports each
file with Blender's glTF importer to make sure it loads with every node and clip.

Run:
    blender -b --factory-startup -P tools/blender/validate.py -- [humanoid.glb] [horse.glb]
Exit code 1 on any failure.
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import bpy  # noqa: E402

from lib import gltf  # noqa: E402

REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
MAX_BYTES = 1.5 * 1024 * 1024

HUMANOID_NODES = (
    ["Base_Head", "Base_Torso", "Base_Pelvis", "Base_Abdomen"]
    + ["Base_%s_%s" % (p, s) for p in ("UpperArm", "Forearm", "Hand", "Thigh", "Shin", "Foot") for s in "LR"]
    + ["Helm_Great", "Helm_Nasal", "Helm_Horned", "Helm_Turban", "Helm_Spiked", "Helm_Crown", "Helm_Hood",
       "Helm_WizardHat", "Helm_WitchHat", "Helm_Viking", "Hair_Short", "Hair_Long", "Hair_Beard",
       "Crest_Plume", "Crest_Feather", "Crest_Antlers", "Back_Cape", "Tabard_Front",
       "Weapon_Sword", "Weapon_Scimitar", "Weapon_Spear", "Weapon_Axe", "Weapon_Club", "Weapon_Dagger", "Weapon_Staff",
       "Shield_Kite", "Shield_Round", "Shield_Heater", "Shield_Buckler", "Offhand_Bow",
       "Socket_Projectile", "Socket_Head"]
)
HUMANOID_PREFIXES = ["Armor_Plate_", "Armor_Mail_", "Armor_Leather_", "Armor_Robe_", "Armor_Rags_", "Armor_Fur_"]
HUMANOID_MATERIALS = ["Primary", "Secondary", "Metal", "DarkMetal", "Leather", "Skin", "Hair", "Wood", "Cloth", "Glow"]
HUMANOID_CLIPS = {
    "Idle": 2.0, "Walk": 1.0, "Run": 0.6, "Jump": 0.4, "Fall": 0.5, "Land": 0.25, "Dodge": 0.5, "BlockRaise": 0.15,
    "BlockHold": 1.0, "AttackLight": 1.0, "AttackHeavy": 1.0, "Cast": 1.0, "Shoot": 1.0, "Throw": 1.0, "Hit": 0.4,
    "Stagger": 0.8, "Stunned": 1.0, "Death": 1.2, "Victory": 2.0, "MountedIdle": 2.0, "MountedRide": 0.6,
    "MountedAttackLight": 1.0, "MountedAttackHeavy": 1.0, "MountedBlock": 1.0, "MountedHit": 0.4, "FlyRide": 0.8,
}
HORSE_NODES = ["Saddle"]
HORSE_MATERIALS = ["Coat", "Mane", "Primary", "Secondary", "Leather", "Metal"]
HORSE_CLIPS = {"Idle": 2.0, "Walk": 1.2, "Gallop": 0.6, "Rear": 1.0, "Hit": 0.4, "Death": 1.5}

failures = []


def check(cond, msg):
    print(("  ok    " if cond else "  FAIL  ") + msg)
    if not cond:
        failures.append(msg)


def world_bounds(doc, worlds, node_name):
    idx = next(i for i, n in enumerate(doc["nodes"]) if n.get("name") == node_name)
    lo, hi = gltf.mesh_local_bounds(doc, doc["nodes"][idx]["mesh"])
    m = worlds[node_name]
    pts = [gltf.transform_point(m, (x, y, z)) for x in (lo[0], hi[0]) for y in (lo[1], hi[1]) for z in (lo[2], hi[2])]
    return [min(p[i] for p in pts) for i in range(3)], [max(p[i] for p in pts) for i in range(3)]


def check_common(path, nodes, prefixes, mats, clips):
    print("\n== %s" % path)
    check(os.path.exists(path), "file exists")
    if not os.path.exists(path):
        return None, None
    size = os.path.getsize(path)
    check(size < MAX_BYTES, "size %.0f KB < 1.5 MB" % (size / 1024))
    doc, binchunk = gltf.read_glb(path)
    names = [n.get("name") for n in doc["nodes"]]
    for n in nodes:
        check(n in names, "node %s" % n)
    for p in prefixes:
        check(any(x and x.startswith(p) for x in names), "node group %s*" % p)
    check(len(names) == len(set(names)), "node names unique")
    mnames = [m.get("name") for m in doc.get("materials", [])]
    for m in mats:
        check(m in mnames, "material %s" % m)
    if exact_mats:
        check(set(mnames) <= set(mats), "no materials outside %s (got %s)" % (sorted(mats), sorted(mnames)))
    durs = gltf.animation_durations(doc, binchunk)
    for c, d in clips.items():
        check(c in durs and abs(durs[c] - d) < 1e-3, "clip %s = %.3fs (got %s)" % (c, d, "%.4f" % durs[c] if c in durs else "missing"))
    check(set(durs) == set(clips), "no unexpected clips (extra: %s)" % sorted(set(durs) - set(clips)))
    check(not doc.get("skins"), "no skins")
    morph = any("targets" in p for m in doc.get("meshes", []) for p in m["primitives"])
    check(not morph, "no morph targets")
    targets = {}
    mesh_animated = []
    for a in doc.get("animations", []):
        tset = set()
        for ch in a["channels"]:
            node = doc["nodes"][ch["target"]["node"]]
            if "mesh" in node:
                mesh_animated.append((a["name"], node.get("name")))
            tset.add(ch["target"]["node"])
        targets[a["name"]] = tset
    check(not mesh_animated, "animation channels target joint empties only (meshes are rigid children) %s"
          % (mesh_animated[:3] if mesh_animated else ""))
    sets = list(targets.values())
    if sets:
        check(all(s == sets[0] for s in sets), "every clip drives the same joint set (%d nodes)" % len(sets[0]))
    check("KHR_draco_mesh_compression" in doc.get("extensionsUsed", []), "Draco compressed")
    tris, _ = gltf.count_triangles(doc)
    print("  info  %d triangles, %d nodes, %d meshes" % (tris, len(names), len(doc.get("meshes", []))))
    return doc, binchunk


def check_reimport(path, nodes, clips):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.context.scene.render.fps = 30
    bpy.ops.import_scene.gltf(filepath=path)
    objs = {o.name for o in bpy.data.objects}
    check(all(n in objs for n in nodes), "re-import: all contract nodes present as objects")
    acts = {a.name for a in bpy.data.actions}
    check(all(c in acts for c in clips), "re-import: all clips present as actions")


def main():
    args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    hpath = args[0] if len(args) > 0 else os.path.join(REPO, "app/public/assets/models/humanoid.glb")
    rpath = args[1] if len(args) > 1 else os.path.join(REPO, "app/public/assets/models/horse.glb")

    doc, _ = check_common(hpath, HUMANOID_NODES, HUMANOID_PREFIXES, HUMANOID_MATERIALS, HUMANOID_CLIPS)
    if doc:
        worlds, parents = gltf.world_matrices(doc)
        sock = gltf.transform_point(worlds["Socket_Head"], (0, 0, 0))
        check(1.75 < sock[1] < 1.95, "+Y up: Socket_Head at y=%.2f" % sock[1])
        lo, hi = world_bounds(doc, worlds, "Base_Foot_L")
        ankle = gltf.transform_point(worlds["J_Foot_L"], (0, 0, 0))
        check(hi[0] - ankle[0] > 0.15 and ankle[0] - lo[0] < 0.1, "faces +X: toes at x=%.2f, ankle x=%.2f" % (hi[0], ankle[0]))
        check(abs(lo[1]) < 0.02, "origin on ground: sole y=%.3f" % lo[1])
        r = gltf.transform_point(worlds["J_Hand_R"], (0, 0, 0))
        check(r[2] > 0.2, "right hand on +Z (towards a camera looking along -Z): z=%.2f" % r[2])
        root = [n.get("name") for i, n in enumerate(doc["nodes"]) if i not in parents]
        print("  info  root nodes:", root)
        check_reimport(hpath, HUMANOID_NODES, HUMANOID_CLIPS)

    doc, _ = check_common(rpath, HORSE_NODES, [], HORSE_MATERIALS, HORSE_CLIPS)
    if doc:
        worlds, parents = gltf.world_matrices(doc)
        idx = {n.get("name"): i for i, n in enumerate(doc["nodes"])}
        check(doc["nodes"][parents[idx["Saddle"]]].get("name") == "J_Body", "Saddle is a child of the animated body")
        head = gltf.transform_point(worlds["J_Head"], (0, 0, 0))
        tail = gltf.transform_point(worlds["J_Tail"], (0, 0, 0))
        check(head[0] > 0.5 > tail[0], "faces +X: head x=%.2f, tail x=%.2f" % (head[0], tail[0]))
        lo, _ = world_bounds(doc, worlds, "Horse_FrontHoof_L")
        check(abs(lo[1]) < 0.02, "hooves on ground: y=%.3f" % lo[1])
        _, hi = world_bounds(doc, worlds, "Horse_Body")
        check(1.5 < hi[1] < 1.7, "withers height %.2f m" % hi[1])
        sad = gltf.transform_point(worlds["Saddle"], (0, 0, 0))
        print("  info  Saddle rest position (glTF): (%.2f, %.2f, %.2f)" % tuple(sad))
        print("  info  root nodes:", [n.get("name") for i, n in enumerate(doc["nodes"]) if i not in parents])
        check_reimport(rpath, HORSE_NODES, HORSE_CLIPS)

    print("\n%s (%d failures)" % ("PASS" if not failures else "FAIL", len(failures)))
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
