"""Build app/public/assets/models/humanoid.glb (shared rig for knights, paladins, enemies, wizard, witch).

Run:
    blender -b --factory-startup -P tools/blender/build_humanoid.py -- app/public/assets/models/humanoid.glb
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from lib import anim, export, geom, materials, scene  # noqa: E402
from lib.rig import Rig  # noqa: E402

import humanoid_clips as clips  # noqa: E402
import humanoid_parts as parts  # noqa: E402
from humanoid_rig import HAND_CENTER_R, JOINTS, LOC_JOINTS, SOCKET_HEAD  # noqa: E402

MATERIALS = ["Primary", "Secondary", "Metal", "DarkMetal", "Leather", "Skin", "Hair", "Wood", "Cloth", "Glow", "Horn"]
ROOT = "Humanoid"


def build(with_clips=True):
    scene.reset()
    mats = materials.library(MATERIALS)
    rig = Rig(ROOT)
    for name, head, parent in JOINTS:
        rig.joint(name, head, parent)
    rig.socket("Socket_Head", SOCKET_HEAD, "J_Head")
    rig.socket("Socket_Projectile", HAND_CENTER_R, "J_Hand_R")
    parts.set_rig(rig)
    tris = 0
    for name, g, joint, attach_pose in parts.all_parts():
        obj = geom.to_object(name, g, mats)
        rig.attach(obj, joint, attach_pose)
        tris += g.tri_count()
    print("[humanoid] parts built, ~%d triangles" % tris)
    if with_clips:
        joints = {n: rig.joints[n] for n, _, _ in JOINTS}
        for name, secs, builder, cyclic in clips.CLIPS:
            anim.bake_clip(name, clips.baked_frames(secs), builder(), joints, loc_joints=LOC_JOINTS, cyclic=cyclic)
    return rig


def main():
    args = scene.script_args()
    out = args[0] if args else os.path.join(os.path.dirname(__file__), "..", "..", "app", "public", "assets", "models", "humanoid.glb")
    build()
    retime = {name: secs for name, secs, _, _ in clips.CLIPS if abs(secs * 30 - round(secs * 30)) > 1e-6}
    export.export_glb(os.path.abspath(out), retime=retime)


if __name__ == "__main__":
    main()
