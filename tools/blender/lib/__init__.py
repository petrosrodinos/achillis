"""Shared helpers for the White Knight Blender asset pipeline.

Import from build scripts after putting `tools/blender` on sys.path:

    import os, sys
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from lib import scene, materials, geom, rig, anim, export

Coordinate conventions (Blender space, converted to glTF +Y-up on export):
    +X  = forward (characters face +X in both Blender and glTF)
    +Z  = up (becomes glTF +Y)
    -Y  = character's right side (becomes glTF +Z, i.e. towards the game camera)
"""
