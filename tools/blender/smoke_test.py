"""Pipeline smoke test: build a stylised shield in bpy and export an optimised .glb.

Run: blender -b -P tools/blender/smoke_test.py -- <output.glb>
"""
import sys
import bpy

out = sys.argv[sys.argv.index("--") + 1]

bpy.ops.wm.read_factory_settings(use_empty=True)


def material(name, rgb):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*rgb, 1)
    bsdf.inputs["Roughness"].default_value = 0.6
    return m


bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.5, depth=0.08)
shield = bpy.context.active_object
shield.name = "Shield"
shield.rotation_euler[0] = 1.5708
shield.data.materials.append(material("Iron", (0.55, 0.55, 0.58)))

bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, radius=0.12, location=(0, -0.06, 0))
boss = bpy.context.active_object
boss.name = "ShieldBoss"
boss.data.materials.append(material("Bronze", (0.62, 0.42, 0.2)))

bpy.ops.export_scene.gltf(
    filepath=out,
    export_format="GLB",
    export_apply=True,
    export_draco_mesh_compression_enable=True,
)
print("EXPORTED", out)
