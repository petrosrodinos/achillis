"""Rigid-segment rigs.

Production path: `Rig` — a hierarchy of animated EMPTIES (one per joint) with object-level
animation. Meshes are plain children of the joint empties, so the glTF export contains only
node TRS animation (no skins, no joints, no vertex weights) — exactly what the client's
"bake hierarchy + instanced parts" renderer expects.

All joints have identity rest rotation (world-aligned axes), so in the side view:
    rotation about Y (euler[1]) = sagittal swing, positive = clockwise as seen by the game camera
    (camera on -Y looking +Y, +X = screen right):
        upward segment (spine/head): + leans forward
        hanging segment (arm/leg):   + swings backward, - swings forward
    rotation about X = lateral splay (+ moves a hanging segment towards +Y / the left side)
    rotation about Z = twist

Alternative: `build_armature` / `attach_to_bone` give a bone-based rig with rigid
`parent_type='BONE'` attachment and the correct parent-inverse matrices.
"""
import math

import bpy
from mathutils import Euler, Matrix, Vector

from . import scene


def _euler_deg(r):
    return Euler(tuple(math.radians(a) for a in r), "XYZ")


class Rig:
    def __init__(self, root_name, root_size=0.25):
        self.root = scene.empty(root_name, size=root_size, display="ARROWS")
        self.joints = {}
        self.rest = {}       # joint -> rest world position (Vector)
        self.parent = {}     # joint -> parent joint name or None
        self.order = []

    def joint(self, name, head, parent=None, size=0.06):
        head = Vector(head)
        pobj = self.joints[parent] if parent else self.root
        rel = head - (self.rest[parent] if parent else Vector())
        obj = scene.empty(name, rel, parent=pobj, size=size)
        self.joints[name] = obj
        self.rest[name] = head
        self.parent[name] = parent
        self.order.append(name)
        return obj

    def socket(self, name, head, parent):
        """Non-animated child empty (sockets / attachment points)."""
        head = Vector(head)
        obj = scene.empty(name, head - self.rest[parent], parent=self.joints[parent], size=0.04, display="SPHERE")
        return obj

    # -- forward kinematics --------------------------------------------------------------
    def local_matrix(self, name, pose=None):
        pose = pose or {}
        p = self.parent[name]
        rel = self.rest[name] - (self.rest[p] if p else Vector())
        st = pose.get(name, {})
        loc = rel + Vector(st.get("l", (0, 0, 0)))
        rot = _euler_deg(st.get("r", (0, 0, 0)))
        return Matrix.Translation(loc) @ rot.to_matrix().to_4x4()

    def world_matrix(self, name, pose=None):
        m = Matrix.Identity(4)
        chain = []
        j = name
        while j:
            chain.append(j)
            j = self.parent[j]
        for j in reversed(chain):
            m = m @ self.local_matrix(j, pose)
        return m

    def world_point(self, name, local=(0, 0, 0), pose=None):
        return self.world_matrix(name, pose) @ Vector(local)

    # -- attachment ----------------------------------------------------------------------
    def attach(self, obj, joint, pose=None):
        """Rigidly parent mesh `obj` (built in world space for `pose`, default rest) to a joint."""
        m = self.world_matrix(joint, pose)
        obj.data.transform(m.inverted())
        obj.parent = self.joints[joint]
        obj.matrix_parent_inverse = Matrix.Identity(4)
        obj.location = (0, 0, 0)
        obj.rotation_euler = (0, 0, 0)
        return obj


# ---------------------------------------------------------------------------------------------
# Bone-based alternative
# ---------------------------------------------------------------------------------------------

def build_armature(name, bones):
    """bones: list of (bone_name, head, tail, parent_name|None). Returns the armature object.

    Tip: make every bone point along world +Y with roll 0 (tail = head + (0, L, 0)) so bone-local
    axes equal world axes and pose rotations match the `Rig` conventions above.
    """
    arm_data = bpy.data.armatures.new(name)
    arm = bpy.data.objects.new(name, arm_data)
    scene.link(arm)
    bpy.context.view_layer.objects.active = arm
    bpy.ops.object.mode_set(mode="EDIT")
    for bname, head, tail, parent in bones:
        eb = arm_data.edit_bones.new(bname)
        eb.head, eb.tail, eb.roll = head, tail, 0.0
        if parent:
            eb.parent = arm_data.edit_bones[parent]
    bpy.ops.object.mode_set(mode="OBJECT")
    for pb in arm.pose.bones:
        pb.rotation_mode = "XYZ"
    return arm


def attach_to_bone(obj, arm, bone_name):
    """Rigidly parent `obj` (in its current world placement) to a bone (parent_type='BONE').

    Blender evaluates a bone parent relative to the bone TAIL, so the parent-inverse must be the
    inverse of armature_world @ bone_rest @ T(0, length, 0) to keep the object where it is.
    """
    world = obj.matrix_world.copy()
    bone = arm.data.bones[bone_name]
    obj.parent = arm
    obj.parent_type = "BONE"
    obj.parent_bone = bone_name
    parent_m = arm.matrix_world @ bone.matrix_local @ Matrix.Translation((0, bone.length, 0))
    obj.matrix_parent_inverse = parent_m.inverted()
    obj.matrix_world = world
    return obj


# ---------------------------------------------------------------------------------------------
# Planar 2-bone IK (sagittal plane, Rig angle convention)
# ---------------------------------------------------------------------------------------------

def dir_angle(dx, dz):
    """Rig angle (deg) of a hanging segment pointing along (dx, dz): 0 = down, -90 = +X."""
    return math.degrees(math.atan2(-dx, -dz))


def ik2(root_xz, target_xz, l1, l2, bend_forward=True):
    """Return absolute (upper, lower) segment angles reaching target from root.

    bend_forward=True puts the middle joint towards +X (human knee, horse front knee);
    False bends it backwards (horse hock).
    """
    dx = target_xz[0] - root_xz[0]
    dz = target_xz[1] - root_xz[1]
    d = math.hypot(dx, dz)
    d = min(max(d, abs(l1 - l2) + 1e-4), (l1 + l2) * 0.9995)
    base = dir_angle(dx, dz)
    a = math.degrees(math.acos(max(-1, min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)))))
    b = math.degrees(math.acos(max(-1, min(1, (l2 * l2 + d * d - l1 * l1) / (2 * l2 * d)))))
    if bend_forward:
        return base - a, base + b
    return base + a, base - b
