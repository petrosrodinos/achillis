"""GLB export with the pipeline's fixed settings."""
import os

import bpy

from . import gltf


def export_glb(path, draco=True, animation_mode="NLA_TRACKS", retime=None):
    """Export the whole scene to an optimised .glb.

    - Draco mesh compression, transforms applied, +Y up
    - every object exported (hidden ones too: use_visible=False) — keep all variants visible
    - one glTF animation per clip (NLA track name), force-sampled at the scene fps (30)
    - no skins/morphs/cameras/lights/textures
    - `retime` = {clip: seconds} for clips whose duration is not a whole number of frames
    """
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    # Node TRS in the file must be the REST pose, not whatever the stacked NLA tracks evaluate to.
    # Disable NLA evaluation (tracks are still exported one by one) and restore rest transforms.
    for obj in bpy.context.scene.objects:
        ad = obj.animation_data
        if ad is not None:
            ad.use_nla = False
            ad.action = None
        if "rest_loc" in obj:
            obj.location = tuple(obj["rest_loc"])
            obj.rotation_euler = tuple(obj["rest_rot"])
    bpy.context.view_layer.update()
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format="GLB",
        use_selection=False,
        use_visible=False,
        use_renderable=False,
        export_yup=True,
        export_apply=True,
        export_texcoords=False,
        export_normals=True,
        export_materials="EXPORT",
        export_image_format="NONE",
        export_cameras=False,
        export_lights=False,
        export_extras=False,
        export_skins=False,
        export_morph=False,
        export_animations=True,
        export_animation_mode=animation_mode,
        export_force_sampling=True,
        export_frame_step=1,
        export_anim_slide_to_zero=False,
        export_optimize_animation_size=False,
        export_optimize_animation_keep_anim_object=True,
        export_draco_mesh_compression_enable=draco,
        export_draco_mesh_compression_level=10,
        export_draco_position_quantization=14,
        export_draco_normal_quantization=10,
    )
    if retime:
        gltf.retime_animations(path, retime)
    return report(path)


def report(path):
    doc, binchunk = gltf.read_glb(path)
    tris, per_mesh = gltf.count_triangles(doc)
    info = {
        "path": path,
        "bytes": os.path.getsize(path),
        "triangles": tris,
        "nodes": len(doc.get("nodes", [])),
        "meshes": len(doc.get("meshes", [])),
        "materials": [m.get("name") for m in doc.get("materials", [])],
        "animations": gltf.animation_durations(doc, binchunk),
        "skins": len(doc.get("skins", [])),
        "per_mesh": per_mesh,
    }
    print("[export] %s  %.1f KB  %d tris  %d nodes  %d anims  skins=%d" % (
        path, info["bytes"] / 1024, tris, info["nodes"], len(info["animations"]), info["skins"]))
    return info
