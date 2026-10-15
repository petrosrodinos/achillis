"""Render PNG contact sheets of the EXPORTED .glb files (orthographic game-style side view).

The camera matches the game: orthographic, looking along glTF -Z (Blender +Y), +X to the right.
Characters face +X, so the camera sees their right (weapon) side.

Run:
    blender -b --factory-startup -P tools/blender/render_preview.py -- [--set all|knight|loadouts|mounted|horse]
            [--humanoid app/public/assets/models/humanoid.glb] [--horse app/public/assets/models/horse.glb]
            [--out tools/blender/previews]
"""
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import bpy  # noqa: E402
import numpy as np  # noqa: E402
from mathutils import Vector  # noqa: E402

from lib import scene  # noqa: E402
from lib.materials import hex_to_linear  # noqa: E402

REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
CLIP_SECONDS = {}

DEFAULT_COLORS = {
    "Leather": "#6e4e33", "Skin": "#d9a882", "Hair": "#4a3322", "Wood": "#7a5a3a", "Cloth": "#b9ae98",
    "DarkMetal": "#3a3a40", "Horn": "#d9ceb4", "Glow": "#8b5cf6",
    "Coat": "#efeae0", "Mane": "#d8d2c6",
}

KNIGHT = dict(show=["Helm_Great", "Crest_Plume", "Armor_Plate", "Tabard_Front", "Weapon_Sword", "Shield_Kite", "Back_Cape"],
              colors={"Primary": "#e8e4da", "Secondary": "#c9a54a", "Metal": "#d5d8dc"})
BLACK_KNIGHT = dict(show=["Helm_Horned", "Armor_Plate", "Tabard_Front", "Weapon_Sword", "Shield_Heater", "Back_Cape"],
                    colors={"Primary": "#1f1d1f", "Secondary": "#7a1f1f", "Metal": "#3a3a3e"})
LOADOUTS = {
    "white-knight": KNIGHT,
    "black-knight": BLACK_KNIGHT,
    "archer": dict(show=["Helm_Hood", "Armor_Leather", "Offhand_Bow"], colors={"Primary": "#4f5b3a", "Secondary": "#8a7a5a", "Metal": "#9a9a9a"}),
    "wizard": dict(show=["Helm_WizardHat", "Armor_Robe", "Weapon_Staff", "Hair_Beard"],
                   colors={"Primary": "#2e2a4a", "Secondary": "#c9a54a", "Metal": "#9a9a9a", "Hair": "#cfcfcf"}),
    "witch": dict(show=["Helm_WitchHat", "Armor_Robe", "Armor_Rags", "Weapon_Staff", "Hair_Long"],
                  colors={"Primary": "#2a3a2a", "Secondary": "#6b5a3a", "Skin": "#a8b58a", "Hair": "#2a2a2a", "Glow": "#4ade80"}),
    "viking": dict(show=["Helm_Viking", "Armor_Fur", "Weapon_Axe", "Shield_Round", "Hair_Beard"],
                   colors={"Primary": "#6b4a2f", "Secondary": "#b08d57", "Metal": "#a0a0a0", "Hair": "#a0522d", "Leather": "#7a6a58"}),
    "zombie": dict(show=["Hair_Long", "Armor_Rags", "Weapon_Club"],
                   colors={"Primary": "#4a5a40", "Skin": "#8a9a78", "Hair": "#3a3a30", "Cloth": "#6a6a5a"}),
    "saracen": dict(show=["Helm_Turban", "Armor_Mail", "Armor_Robe_Chest", "Armor_Robe_Abdomen", "Armor_Robe_Skirt",
                          "Weapon_Scimitar", "Shield_Round", "Hair_Beard"],
                    colors={"Primary": "#4b6b3a", "Secondary": "#8b5a2b", "Metal": "#a7a59c", "Cloth": "#8b5a2b"}),
    "spearman": dict(show=["Helm_Nasal", "Armor_Mail", "Weapon_Spear", "Shield_Buckler"],
                     colors={"Primary": "#5c4a3a", "Secondary": "#8a7a5a", "Metal": "#9fa4ad"}),
    "bronze-knight": dict(show=["Helm_Nasal", "Crest_Feather", "Armor_Plate", "Tabard_Front", "Weapon_Sword", "Shield_Heater"],
                          colors={"Primary": "#8a5a2b", "Secondary": "#d2b48c", "Metal": "#b08d57"}),
    "emperor": dict(show=["Helm_Crown", "Crest_Plume", "Armor_Plate", "Tabard_Front", "Back_Cape", "Weapon_Sword", "Shield_Kite"],
                    colors={"Primary": "#4b2a5c", "Secondary": "#d4af37", "Metal": "#d9c27a"}),
    "deer-paladin": dict(show=["Helm_Great", "Crest_Antlers", "Armor_Plate", "Tabard_Front", "Weapon_Sword", "Shield_Heater"],
                         colors={"Primary": "#9c7a52", "Secondary": "#4a3520", "Metal": "#c8c8c8"}),
    "balkan": dict(show=["Helm_Spiked", "Armor_Mail", "Weapon_Dagger", "Hair_Short"],
                   colors={"Primary": "#7a3b2e", "Secondary": "#c0c4cc", "Metal": "#9fa4ad"}),
}


# ---------------------------------------------------------------------------------------------
def engine_setup(res_x, res_y):
    scn = bpy.context.scene
    for eng in ("BLENDER_EEVEE", "BLENDER_EEVEE_NEXT", "BLENDER_WORKBENCH"):
        try:
            scn.render.engine = eng
            break
        except TypeError:
            continue
    if scn.render.engine.startswith("BLENDER_EEVEE"):
        try:
            scn.eevee.taa_render_samples = 16
        except AttributeError:
            pass
    scn.render.resolution_x = res_x
    scn.render.resolution_y = res_y
    scn.render.resolution_percentage = 100
    scn.render.film_transparent = False
    scn.view_settings.view_transform = "Standard"
    scn.render.image_settings.file_format = "PNG"
    world = bpy.data.worlds.new("PreviewWorld")
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = (0.62, 0.64, 0.68, 1.0)
    bg.inputs["Strength"].default_value = 0.9
    scn.world = world


def add_lights():
    def sun(name, direction, strength, angle=12.0):
        data = bpy.data.lights.new(name, "SUN")
        data.energy = strength
        data.angle = math.radians(angle)
        obj = bpy.data.objects.new(name, data)
        bpy.context.scene.collection.objects.link(obj)
        obj.rotation_euler = Vector(direction).normalized().to_track_quat("-Z", "Y").to_euler()
        return obj
    sun("Key", (0.45, 0.75, -0.55), 3.2)
    sun("Fill", (-0.6, 0.3, -0.3), 0.8, 30)
    sun("Rim", (-0.2, -0.6, -0.4), 0.6, 30)


def add_camera(ortho, cx, cz):
    cam_data = bpy.data.cameras.new("PreviewCam")
    cam_data.type = "ORTHO"
    cam_data.ortho_scale = ortho
    cam_data.clip_start = 0.1
    cam_data.clip_end = 100
    cam = bpy.data.objects.new("PreviewCam", cam_data)
    bpy.context.scene.collection.objects.link(cam)
    cam.location = (cx, -30.0, cz)
    cam.rotation_euler = (math.radians(90), 0, 0)
    bpy.context.scene.camera = cam
    return cam


def add_ground():
    mesh = bpy.data.meshes.new("Ground")
    s, d = 30.0, 0.6
    verts = [(-s, -s, -d), (s, -s, -d), (s, s, -d), (-s, s, -d), (-s, -s, 0), (s, -s, 0), (s, s, 0), (-s, s, 0)]
    faces = [(0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)]
    mesh.from_pydata(verts, [], faces)
    mat = bpy.data.materials.new("GroundMat")
    mat.use_nodes = True
    mat.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (0.20, 0.16, 0.11, 1)
    mesh.materials.append(mat)
    obj = bpy.data.objects.new("Ground", mesh)
    bpy.context.scene.collection.objects.link(obj)


def add_label():
    curve = bpy.data.curves.new("Label", "FONT")
    curve.body = ""
    curve.size = 0.13
    curve.align_x = "LEFT"
    obj = bpy.data.objects.new("Label", curve)
    bpy.context.scene.collection.objects.link(obj)
    obj.rotation_euler = (math.radians(90), 0, 0)
    mat = bpy.data.materials.new("LabelMat")
    mat.use_nodes = True
    b = mat.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (0.02, 0.02, 0.03, 1)
    b.inputs["Roughness"].default_value = 1.0
    curve.materials.append(mat)
    return obj


# ---------------------------------------------------------------------------------------------
def import_glb(path):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=path)
    return [o for o in bpy.data.objects if o not in before]


def base_name(name):
    return name.split(".")[0] if "." in name and name.rsplit(".", 1)[1].isdigit() else name


def apply_loadout(objs, loadout):
    for o in objs:
        if o.type != "MESH":
            continue
        n = base_name(o.name)
        vis = n.startswith("Base_") or any(n.startswith(p) for p in loadout["show"])
        o.hide_render = not vis
        o.hide_viewport = not vis


def tint(objs, colors):
    """Re-tint materials used by `objs` (mimics the client's tint-by-material-name)."""
    seen = set()
    for o in objs:
        if o.type != "MESH":
            continue
        for slot in o.material_slots:
            m = slot.material
            if m is None or m in seen:
                continue
            seen.add(m)
            n = base_name(m.name)
            hexv = colors.get(n, DEFAULT_COLORS.get(n))
            if hexv is None:
                continue
            bsdf = m.node_tree.nodes.get("Principled BSDF")
            rgb = hex_to_linear(hexv)
            bsdf.inputs["Base Color"].default_value = (*rgb, 1)
            if n == "Glow":
                bsdf.inputs["Emission Color"].default_value = (*rgb, 1)
                bsdf.inputs["Emission Strength"].default_value = 3.0


def set_clip(objs, clip):
    act = bpy.data.actions.get(clip)
    if act is None:
        raise RuntimeError("clip %s not in file" % clip)
    for o in objs:
        ad = o.animation_data
        if ad is None:
            continue
        for t in ad.nla_tracks:
            t.mute = True
        ad.action = act
        slot = None
        for s in act.slots:
            if s.identifier[2:] == o.name or s.name_display == o.name:
                slot = s
        if slot is not None:
            ad.action_slot = slot


def set_frame(f):
    bpy.context.scene.frame_set(int(math.floor(f)), subframe=f - math.floor(f))


def render_tile(path):
    bpy.context.scene.render.filepath = path
    bpy.ops.render.render(write_still=True)
    img = bpy.data.images.load(path)
    w, h = img.size
    px = np.array(img.pixels[:], dtype=np.float32).reshape(h, w, 4)
    bpy.data.images.remove(img)
    return px


def save_sheet(tiles, cols, path):
    h, w = tiles[0].shape[:2]
    rows = (len(tiles) + cols - 1) // cols
    sheet = np.ones((rows * h, cols * w, 4), dtype=np.float32)
    sheet[..., :3] = 0.85
    for i, t in enumerate(tiles):
        r, c = divmod(i, cols)
        # image pixel rows are bottom-up: fill from the top of the sheet
        y0 = (rows - 1 - r) * h
        sheet[y0:y0 + h, c * w:(c + 1) * w] = t
    img = bpy.data.images.new(os.path.basename(path), cols * w, rows * h, alpha=True)
    img.pixels.foreach_set(sheet.ravel())
    img.filepath_raw = path
    img.file_format = "PNG"
    img.save()
    bpy.data.images.remove(img)
    print("[preview] wrote", path)


# ---------------------------------------------------------------------------------------------
def setup_stage(res, ortho, cx, cz):
    scene.reset()
    engine_setup(*res)
    add_lights()
    add_camera(ortho, cx, cz)
    add_ground()
    label = add_label()
    return label


def humanoid_sheets(hpath, outdir, which):
    import humanoid_clips as hc
    tmp = os.path.join(outdir, "_tiles")
    os.makedirs(tmp, exist_ok=True)
    groups = {
        "knight_locomotion": ["Idle", "Walk", "Run", "Jump", "Fall", "Land", "Dodge", "BlockRaise", "BlockHold"],
        "knight_attacks": ["AttackLight", "AttackHeavy", "Cast", "Shoot", "Throw"],
        "knight_reactions": ["Hit", "Stagger", "Stunned", "Death", "Victory"],
        "knight_mounted": ["MountedIdle", "MountedRide", "MountedAttackLight", "MountedAttackHeavy", "MountedBlock", "MountedHit", "FlyRide"],
    }
    if "knight" in which:
        label = setup_stage((300, 330), 2.9, 0.15, 1.05)
        objs = import_glb(hpath)
        apply_loadout(objs, KNIGHT)
        tint(objs, KNIGHT["colors"])
        label.location = (-1.2, -2.0, 2.3)
        for gname, clip_names in groups.items():
            tiles = []
            cols = 6
            for clip in clip_names:
                set_clip(objs, clip)
                frames = hc.preview_frames(clip)
                row = []
                for f in frames:
                    label.data.body = "%s %.1f" % (clip, f)
                    set_frame(f)
                    row.append(render_tile(os.path.join(tmp, "t.png")))
                while len(row) % cols:
                    row.append(np.full_like(row[0], 0.85))
                tiles.extend(row)
            save_sheet(tiles, cols, os.path.join(outdir, gname + ".png"))

    if "loadouts" in which:
        label = setup_stage((300, 360), 3.2, 0.15, 1.2)
        objs = import_glb(hpath)
        label.location = (-1.2, -2.0, 2.55)
        tiles = []
        poses = {"archer": [("Idle", 0), ("Shoot", 10.5), ("Shoot", 15)],
                 "wizard": [("Idle", 0), ("Cast", 10.5), ("Cast", 15)],
                 "witch": [("Idle", 0), ("Cast", 15), ("Walk", 7.5)]}
        for name, lo in LOADOUTS.items():
            apply_loadout(objs, lo)
            tint(objs, lo["colors"])
            for clip, f in poses.get(name, [("Idle", 0), ("AttackHeavy", 10.5), ("AttackHeavy", 15)]):
                set_clip(objs, clip)
                set_frame(f)
                label.data.body = "%s %s %g" % (name, clip, f)
                tiles.append(render_tile(os.path.join(tmp, "t.png")))
        save_sheet(tiles, 6, os.path.join(outdir, "loadouts.png"))


def horse_sheets(horse_path, hpath, outdir, which):
    tmp = os.path.join(outdir, "_tiles")
    os.makedirs(tmp, exist_ok=True)
    if "horse" in which:
        label = setup_stage((380, 330), 3.6, 0.0, 1.3)
        objs = import_glb(horse_path)
        tint(objs, {"Primary": "#3d5a80", "Secondary": "#dfe3e8", "Coat": "#efeae0", "Mane": "#d8d2c6", "Metal": "#c8c8c8"})
        label.location = (-1.7, -2.0, 2.68)
        tiles = []
        for clip, frames in (("Idle", [0, 30]), ("Walk", [0, 9, 18, 27]), ("Gallop", [0, 3, 6, 9, 12, 15]),
                             ("Rear", [0, 10, 20, 30]), ("Hit", [0, 4, 12]), ("Death", [0, 15, 30, 45])):
            set_clip(objs, clip)
            row = []
            for f in frames:
                set_frame(f)
                label.data.body = "%s %g" % (clip, f)
                row.append(render_tile(os.path.join(tmp, "t.png")))
            while len(row) % 6:
                row.append(np.full_like(row[0], 0.85))
            tiles.extend(row)
        save_sheet(tiles, 6, os.path.join(outdir, "horse.png"))

    if "mounted" in which:
        label = setup_stage((420, 400), 4.0, 0.0, 1.55)
        hobjs = import_glb(horse_path)
        tint(hobjs, {"Primary": "#3d5a80", "Secondary": "#c9a54a", "Coat": "#efeae0", "Mane": "#d8d2c6"})
        robjs = import_glb(hpath)
        apply_loadout(robjs, KNIGHT)
        tint(robjs, KNIGHT["colors"])
        saddle = next(o for o in hobjs if base_name(o.name) == "Saddle")
        root = next(o for o in robjs if base_name(o.name) == "Humanoid")
        root.parent = saddle
        root.matrix_parent_inverse.identity()
        root.location = (0, 0, 0)
        root.rotation_mode = "XYZ"
        root.rotation_euler = (0, 0, 0)
        root.rotation_quaternion = (1, 0, 0, 0)
        label.location = (-1.9, -3.0, 3.3)
        tiles = []
        combos = [("Idle", "MountedIdle", [0, 30]), ("Gallop", "MountedRide", [0, 4.5, 9, 13.5]),
                  ("Gallop", "MountedAttackLight", [0, 10.5, 15, 18]), ("Gallop", "MountedAttackHeavy", [0, 10.5, 15, 18]),
                  ("Walk", "MountedBlock", [0, 15]), ("Hit", "MountedHit", [0, 3]), ("Rear", "MountedIdle", [10, 20])]
        for hclip, rclip, frames in combos:
            set_clip(hobjs, hclip)
            set_clip(robjs, rclip)
            for f in frames:
                hf = f % (18 if hclip == "Gallop" else 1e9)
                set_frame(f)
                label.data.body = "%s+%s %g" % (hclip, rclip, f)
                tiles.append(render_tile(os.path.join(tmp, "t.png")))
        save_sheet(tiles, 4, os.path.join(outdir, "mounted.png"))


# ---------------------------------------------------------------------------------------------
# creatures / props (P5-11): generic clip × frame sheets
# ---------------------------------------------------------------------------------------------
GAME_YAW = 0.32   # client turns models this far towards the camera (actor-layer.tsx YAW)
VIEWS = [(0.0, "")]  # --views side|game|both
MODELS_DIR = os.path.join(REPO, "app/public/assets/models")

CREATURES = {
    # name: file, palette (client CREATURE_PALETTES), rows [(clip, frames)], tile res, ortho, centre (x, z), cols
    "hippogryph": dict(file="hippogryph.glb", palette={"Feathers": "#d8d0c0", "Coat": "#a07a50", "Beak": "#d9a63a",
                                                       "Eye": "#3a2a1a", "Leather": "#5a3d26"},
                       rows=[("Idle", [0, 30]), ("Fly", [0, 4, 8, 12, 16, 20]), ("Glide", [0, 30]),
                             ("Land", [0, 9, 15, 19, 25, 30]), ("Hit", [0, 3, 12])],
                       res=(380, 340), ortho=5.0, center=(0.0, 1.9), cols=6),
    "troll": dict(file="troll.glb", palette={"Skin": "#4d5a2e", "Primary": "#3e4a26", "Cloth": "#5a4a30", "Wood": "#5a4030",
                                             "Hair": "#2e3a1e"},
                  rows=[("Idle", [0, 30]), ("Walk", [0, 9, 18, 27]), ("AttackLight", [0, 10.5, 13, 15, 18, 30]),
                        ("AttackHeavy", [0, 10.5, 13, 15, 18, 30]), ("BlockRaise", [0, 4.5]), ("BlockHold", [0, 15]),
                        ("Hit", [0, 3, 12]), ("Stagger", [0, 6, 12, 24]), ("Death", [0, 12, 24, 36]),
                        ("Victory", [0, 10, 20, 30]), ("Stunned", [0, 15])],
                  res=(340, 340), ortho=6.6, center=(1.0, 2.2), cols=6),
    "wolf": dict(file="wolf.glb", palette={"Coat": "#6e6a64", "Mane": "#4a4642", "Eye": "#e0c060"},
                 rows=[("Idle", [0, 30]), ("Run", [0, 3, 6, 9, 12]), ("Attack", [0, 10.5, 13, 15, 18, 30]),
                       ("Hit", [0, 3, 12]), ("Death", [0, 8, 16, 30])],
                 res=(300, 220), ortho=2.4, center=(0.25, 0.6), cols=6),
    "boar": dict(file="boar.glb", palette={"Coat": "#5a4030", "Mane": "#2e2018", "Horn": "#e8dcc0"},
                 rows=[("Idle", [0, 30]), ("Run", [0, 3, 6, 9, 12]), ("Attack", [0, 10.5, 13, 15, 18, 30]),
                       ("Hit", [0, 3, 12]), ("Death", [0, 8, 16, 30])],
                 res=(300, 220), ortho=2.4, center=(0.25, 0.6), cols=6),
    "bird": dict(file="bird.glb", palette={"Feathers": "#2e2a26", "Beak": "#c9a227", "Eye": "#e0c060"},
                 rows=[("Flap", [0, 2, 4, 6, 8, 10]), ("Dive", [0, 4.5, 9, 13.5])],
                 res=(260, 240), ortho=1.9, center=(0.0, 0.45), cols=6),
    "haunted-tree": dict(file="haunted-tree.glb", palette={"Wood": "#4a3a2e", "Glow": "#4ade80"},
                         rows=[("Rise", [0, 8, 16, 22, 30]), ("Idle", [0, 30]), ("Swipe", [0, 10.5, 13, 15, 18, 30]),
                               ("Death", [0, 8, 16, 30])],
                         res=(330, 380), ortho=6.8, center=(0.6, 2.4), cols=6),
}


def import_root(objs):
    return next(o for o in objs if o.parent is None and o.type == "EMPTY")


def creature_sheets(outdir, which, hpath):
    tmp = os.path.join(outdir, "_tiles")
    os.makedirs(tmp, exist_ok=True)
    for name, cfg in CREATURES.items():
        if name not in which:
            continue
        path = os.path.join(MODELS_DIR, cfg["file"])
        if not os.path.exists(path):
            print("[preview] skip %s (missing)" % path)
            continue
        for yaw, suffix in VIEWS:
            cx, cz = cfg["center"]
            label = setup_stage(cfg["res"], cfg["ortho"], cx, cz)
            objs = import_glb(path)
            tint(objs, cfg["palette"])
            root = import_root(objs)
            root.rotation_mode = "XYZ"
            root.rotation_euler = (0, 0, -yaw)
            rx, ry = cfg["res"]
            half_w = cfg["ortho"] / 2 * min(1.0, rx / ry)
            half_h = cfg["ortho"] / 2 * min(1.0, ry / rx)
            label.location = (cx - half_w * 0.95, -6.0, cz + half_h * 0.86)
            label.data.size = cfg["ortho"] * 0.045
            tiles = []
            for clip, frames in cfg["rows"]:
                set_clip(objs, clip)
                row = []
                for f in frames:
                    set_frame(f)
                    label.data.body = "%s %g" % (clip, f)
                    row.append(render_tile(os.path.join(tmp, "t.png")))
                while len(row) % cfg["cols"]:
                    row.append(np.full_like(row[0], 0.85))
                tiles.extend(row)
            save_sheet(tiles, cfg["cols"], os.path.join(outdir, name + suffix + ".png"))

    if "hippogryph_mounted" in which:
        cfg = CREATURES["hippogryph"]
        for yaw, suffix in VIEWS:
            label = setup_stage((400, 380), 6.0, 0.0, 2.1)
            hobjs = import_glb(os.path.join(MODELS_DIR, cfg["file"]))
            tint(hobjs, cfg["palette"])
            robjs = import_glb(hpath)
            apply_loadout(robjs, KNIGHT)
            tint(robjs, KNIGHT["colors"])
            mroot = import_root(hobjs)
            mroot.rotation_mode = "XYZ"
            mroot.rotation_euler = (0, 0, -yaw)
            saddle = next(o for o in hobjs if base_name(o.name) == "Saddle")
            root = next(o for o in robjs if base_name(o.name) == "Humanoid")
            root.parent = saddle
            root.matrix_parent_inverse.identity()
            root.location = (0, 0, 0)
            root.rotation_mode = "XYZ"
            root.rotation_euler = (0, 0, 0)
            label.location = (-2.85, -6.0, 3.9)
            label.data.size = 0.25
            tiles = []
            combos = [("Fly", "FlyRide", [0, 4, 8, 12, 16, 20]), ("Glide", "FlyRide", [0, 30]),
                      ("Idle", "FlyRide", [0]), ("Hit", "MountedHit", [3]),
                      ("Fly", "MountedAttackHeavy", [10.5, 15])]
            for mclip, rclip, frames in combos:
                set_clip(hobjs, mclip)
                set_clip(robjs, rclip)
                for f in frames:
                    set_frame(f)
                    label.data.body = "%s+%s %g" % (mclip, rclip, f)
                    tiles.append(render_tile(os.path.join(tmp, "t.png")))
            save_sheet(tiles, 4, os.path.join(outdir, "hippogryph_mounted" + suffix + ".png"))


def static_sheets(outdir, which):
    """props.glb: one tile per root node; ship.glb: side view + game-yaw view."""
    tmp = os.path.join(outdir, "_tiles")
    os.makedirs(tmp, exist_ok=True)
    if "props" in which and os.path.exists(os.path.join(MODELS_DIR, "props.glb")):
        scene.reset()
        objs = import_glb(os.path.join(MODELS_DIR, "props.glb"))
        roots = sorted(base_name(o.name) for o in objs if o.parent is None)
        tiles = []
        for yaw in (0.0, 0.55):
            for rname in roots:
                label = setup_stage((300, 300), 1.0, 0.0, 0.0)
                objs = import_glb(os.path.join(MODELS_DIR, "props.glb"))
                keep = next(o for o in objs if o.parent is None and base_name(o.name) == rname)
                desc = set()
                stack = [keep]
                while stack:
                    o = stack.pop()
                    desc.add(o)
                    stack.extend(o.children)
                for o in objs:
                    if o not in desc:
                        o.hide_render = True
                bpy.context.view_layer.update()
                keep.rotation_mode = "XYZ"
                keep.rotation_euler = (0, 0, -yaw)
                bpy.context.view_layer.update()
                pts = [o.matrix_world @ Vector(c) for o in desc if o.type == "MESH" for c in o.bound_box]
                lo = Vector((min(p.x for p in pts), 0, min(p.z for p in pts)))
                hi = Vector((max(p.x for p in pts), 0, max(p.z for p in pts)))
                size = max(hi.x - lo.x, hi.z - lo.z) * 1.35 + 0.1
                cam = bpy.context.scene.camera
                cam.data.ortho_scale = size
                cam.location = ((lo.x + hi.x) / 2, -30, (lo.z + hi.z) / 2)
                bpy.data.objects["Ground"].location.z = min(lo.z, 0.0) - 0.0005
                label.data.size = size * 0.05
                label.location = (cam.location.x - size * 0.47, -10, cam.location.z + size * 0.42)
                label.data.body = "%s  %.2f x %.2f m" % (rname, hi.x - lo.x, hi.z - lo.z)
                tiles.append(render_tile(os.path.join(tmp, "t.png")))
        while len(tiles) % 7:
            tiles.append(np.full_like(tiles[0], 0.85))
        save_sheet(tiles, 7, os.path.join(outdir, "props.png"))
    if "ship" in which and os.path.exists(os.path.join(MODELS_DIR, "ship.glb")):
        tiles = []
        for yaw in (0.0, 0.35):
            label = setup_stage((900, 760), 19.0, 0.3, 5.9)
            objs = import_glb(os.path.join(MODELS_DIR, "ship.glb"))
            tint(objs, {"Primary": "#7a2e24"})
            root = import_root(objs)
            root.rotation_mode = "XYZ"
            root.rotation_euler = (0, 0, -yaw)
            bpy.data.objects["Ground"].location.z = -1.2
            label.data.size = 0.5
            label.location = (-8.9, -20, 13.3)
            label.data.body = "ship yaw %.2f" % yaw
            tiles.append(render_tile(os.path.join(tmp, "t.png")))
        save_sheet(tiles, 2, os.path.join(outdir, "ship.png"))


ALL_SETS = {"knight", "loadouts", "mounted", "horse", "hippogryph", "hippogryph_mounted", "troll", "wolf", "boar",
            "bird", "haunted-tree", "props", "ship"}


def main():
    args = scene.script_args()
    opts = {"--set": "all", "--humanoid": os.path.join(REPO, "app/public/assets/models/humanoid.glb"),
            "--horse": os.path.join(REPO, "app/public/assets/models/horse.glb"), "--out": os.path.join(HERE, "previews")}
    for i in range(0, len(args) - 1, 2):
        opts[args[i]] = args[i + 1]
    which = ALL_SETS if opts["--set"] == "all" else set(opts["--set"].split(","))
    views = opts.get("--views", "both")
    VIEWS[:] = ([(0.0, "")] if views in ("side", "both") else []) + ([(GAME_YAW, "_game")] if views in ("game", "both") else [])
    os.makedirs(opts["--out"], exist_ok=True)
    humanoid_sheets(opts["--humanoid"], opts["--out"], which)
    if os.path.exists(opts["--horse"]):
        horse_sheets(opts["--horse"], opts["--humanoid"], opts["--out"], which)
    creature_sheets(opts["--out"], which, opts["--humanoid"])
    static_sheets(opts["--out"], which)


if __name__ == "__main__":
    main()
