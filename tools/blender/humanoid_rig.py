"""Humanoid joint layout + pose builder shared by build_humanoid.py and humanoid_clips.py.

Blender space: +X forward, +Z up, +Y = character's LEFT. (glTF: +X forward, +Y up, +Z = right.)
All joints are empties with identity rest rotation. Angles are degrees about Y in the rig
convention (see lib/rig.py): for a hanging segment 0 = straight down, -90 = pointing forward,
-180 = straight up, +90 = pointing backward.

Pose builder arguments use ABSOLUTE sagittal angles for limbs (easier to author):
    armR=(upper, forearm, blade)  blade: 0 = weapon points forward, -90 = up, +90 = down
    armL=(upper, forearm, hand_rel)
    legL/legR=("ik", ankle_x, ankle_z, foot)   foot: 0 = flat, + = toes down
              ("fk", thigh, shin, foot)  absolute
              ("rel", thigh, shin, foot) relative to parent joint
"""
import math

from lib.rig import ik2

HIP_Z = 0.98
THIGH_LEN = 0.42
SHIN_LEN = 0.41
ANKLE_Z = 0.10
WEAPON_GRIP_ANGLE = 45.0  # rest blade direction: 45° below forward (between forward & along forearm)

JOINTS = [
    ("J_Hips", (0.0, 0.0, HIP_Z), None),
    ("J_Spine", (0.0, 0.0, 1.08), "J_Hips"),
    ("J_Chest", (0.0, 0.0, 1.24), "J_Spine"),
    ("J_Head", (0.0, 0.0, 1.52), "J_Chest"),
    ("J_UpperArm_L", (0.0, 0.25, 1.45), "J_Chest"),
    ("J_Forearm_L", (0.0, 0.265, 1.16), "J_UpperArm_L"),
    ("J_Hand_L", (0.0, 0.275, 0.90), "J_Forearm_L"),
    ("J_UpperArm_R", (0.0, -0.25, 1.45), "J_Chest"),
    ("J_Forearm_R", (0.0, -0.265, 1.16), "J_UpperArm_R"),
    ("J_Hand_R", (0.0, -0.275, 0.90), "J_Forearm_R"),
    ("J_Thigh_L", (0.0, 0.11, HIP_Z - 0.05), "J_Hips"),
    ("J_Shin_L", (0.0, 0.115, HIP_Z - 0.05 - THIGH_LEN), "J_Thigh_L"),
    ("J_Foot_L", (0.0, 0.12, ANKLE_Z), "J_Shin_L"),
    ("J_Thigh_R", (0.0, -0.11, HIP_Z - 0.05), "J_Hips"),
    ("J_Shin_R", (0.0, -0.115, HIP_Z - 0.05 - THIGH_LEN), "J_Thigh_R"),
    ("J_Foot_R", (0.0, -0.12, ANKLE_Z), "J_Shin_R"),
    ("J_Cape", (-0.15, 0.0, 1.50), "J_Chest"),
    ("J_Cape_2", (-0.17, 0.0, 1.03), "J_Cape"),
    ("J_Tabard", (0.19, 0.0, 1.11), "J_Hips"),
]
JOINT_NAMES = [j[0] for j in JOINTS]
LOC_JOINTS = ("J_Hips",)

HAND_CENTER_R = (0.012, -0.28, 0.835)
HAND_CENTER_L = (0.012, 0.28, 0.835)
SOCKET_HEAD = (0.0, 0.0, 1.86)


def _leg(spec, side, hx, hz, hr):
    hipx = hx - 0.05 * math.sin(math.radians(hr))
    hipz = hz - 0.05 * math.cos(math.radians(hr))
    kind = spec[0]
    if kind == "ik":
        _, ax, az, foot = spec
        t, s = ik2((hipx, hipz), (ax, az), THIGH_LEN, SHIN_LEN, bend_forward=True)
        return t - hr, s - t, foot - s
    if kind == "fk":
        _, t, s, foot = spec
        return t - hr, s - t, foot - s
    _, t, s, f = spec
    return t, s, f


def pose(hips=(0.0, 0.0, 0.0), hr=0.0, hrx=0.0, hrz=0.0, spine=0.0, chest=0.0, twist=0.0, chest_x=0.0,
         head=0.0, headx=0.0, headz=0.0,
         armL=("rel", 0.0, 0.0, 0.0), armR=("rel", 0.0, 0.0, 0.0),
         splayArmL=8.0, splayArmR=8.0, twistArmL=0.0, twistArmR=0.0,
         legL=("ik", 0.0, ANKLE_Z, 0.0), legR=("ik", 0.0, ANKLE_Z, 0.0),
         splayL=0.0, splayR=0.0, cape=(4.0, 3.0), cape_world=True, tabard=None):
    """Return {joint: {"r": (x,y,z), "l": (dx,dy,dz)}} for one keyframe."""
    p = {}
    p["J_Hips"] = {"r": (hrx, hr, hrz), "l": tuple(hips)}
    p["J_Spine"] = {"r": (0.0, spine, twist * 0.4)}
    p["J_Chest"] = {"r": (chest_x, chest, twist * 0.6)}
    p["J_Head"] = {"r": (headx, head, headz - twist * 0.5)}
    chest_abs = hr + spine + chest

    def arm(spec, side, splay, tw):
        kind = spec[0]
        if kind == "rel":
            u, f, h = spec[1:]
        else:
            ua, fa, third = spec[1:]
            u = ua - chest_abs
            f = fa - ua
            if side == "R":
                h = (third - WEAPON_GRIP_ANGLE) - fa
            else:
                h = third
        sx = splay if side == "L" else -splay
        p["J_UpperArm_" + side] = {"r": (sx, u, tw)}
        p["J_Forearm_" + side] = {"r": (0.0, f, 0.0)}
        p["J_Hand_" + side] = {"r": (0.0, h, 0.0)}

    arm(armL, "L", splayArmL, twistArmL)
    arm(armR, "R", splayArmR, twistArmR)

    hx, hz = hips[0], HIP_Z + hips[2]
    tl, sl, fl = _leg(legL, "L", hx, hz, hr)
    tr, sr, fr = _leg(legR, "R", hx, hz, hr)
    p["J_Thigh_L"] = {"r": (splayL, tl, 0.0)}
    p["J_Shin_L"] = {"r": (0.0, sl, 0.0)}
    p["J_Foot_L"] = {"r": (0.0, fl, 0.0)}
    p["J_Thigh_R"] = {"r": (-splayR, tr, 0.0)}
    p["J_Shin_R"] = {"r": (0.0, sr, 0.0)}
    p["J_Foot_R"] = {"r": (0.0, fr, 0.0)}
    # cape angle is given in WORLD terms (it hangs with gravity) unless cape_world=False
    p["J_Cape"] = {"r": (0.0, cape[0] - (chest_abs if cape_world else 0.0), 0.0)}
    p["J_Cape_2"] = {"r": (0.0, cape[1], 0.0)}
    if tabard is None:
        # front flap follows whichever thigh is further forward, so knees never punch through it
        fwd = min(tl, tr, 0.0)
        tabard = fwd * 0.9
    p["J_Tabard"] = {"r": (0.0, tabard, 0.0)}
    return p
