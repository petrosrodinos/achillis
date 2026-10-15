"""Scene setup and CLI helpers."""
import sys

import bpy

FPS = 30


def reset(fps=FPS):
    """Start from an empty factory scene with metric units and the pipeline frame rate."""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scn = bpy.context.scene
    scn.render.fps = fps
    scn.render.fps_base = 1.0
    scn.unit_settings.system = "METRIC"
    scn.unit_settings.scale_length = 1.0
    scn.frame_start = 0
    scn.frame_end = 60
    return scn


def script_args():
    """Arguments after `--` on the Blender command line."""
    if "--" in sys.argv:
        return sys.argv[sys.argv.index("--") + 1:]
    return []


def link(obj, collection=None):
    (collection or bpy.context.scene.collection).objects.link(obj)
    return obj


def empty(name, location=(0, 0, 0), parent=None, size=0.05, display="PLAIN_AXES"):
    obj = bpy.data.objects.new(name, None)
    obj.empty_display_type = display
    obj.empty_display_size = size
    obj.location = location
    obj.rotation_mode = "XYZ"
    obj["rest_loc"] = tuple(location)
    obj["rest_rot"] = (0.0, 0.0, 0.0)
    link(obj)
    if parent is not None:
        obj.parent = parent
    return obj
