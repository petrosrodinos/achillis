"""Keyframe / clip helpers.

A clip = one Blender Action (named exactly like the clip) with one slot per animated object.
Every animated object gets an NLA track named after the clip whose strip plays that action
slot. Exporting with `export_animation_mode='NLA_TRACKS'` then writes exactly one glTF
animation per clip, merging all objects' tracks of the same name.

Pose format (per keyframe):
    {joint_name: {"r": (rx, ry, rz) degrees, "l": (dx, dy, dz) metres offset from rest}}
Joints missing from a pose are keyed at rest, so every clip drives every joint (no stale
transforms when the client cross-fades between clips).
"""
import math

import bpy

FPS = 30

# interpolation presets: name -> (interpolation, easing)
INTERP = {
    "BEZIER": ("BEZIER", "AUTO"),
    "LINEAR": ("LINEAR", "AUTO"),
    "CONSTANT": ("CONSTANT", "AUTO"),
    "EASE_IN": ("CUBIC", "EASE_IN"),        # accelerate into the next key (swings)
    "EASE_OUT": ("CUBIC", "EASE_OUT"),      # decelerate into the next key (wind-ups)
    "EASE_IN_OUT": ("SINE", "EASE_IN_OUT"),
    "QUAD_IN": ("QUAD", "EASE_IN"),
    "QUAD_OUT": ("QUAD", "EASE_OUT"),
    "BACK_OUT": ("BACK", "EASE_OUT"),       # small overshoot settle
    "EXPO_OUT": ("EXPO", "EASE_OUT"),
}


class Key:
    """A pose at a frame; `interp` applies to the segment *leaving* this key."""

    def __init__(self, frame, pose, interp="BEZIER"):
        self.frame = frame
        self.pose = pose
        self.interp = interp


def seconds(s):
    return s * FPS


def bake_clip(name, end_frame, keys, joints, loc_joints=(), cyclic=False):
    """Create one Action + per-object NLA tracks for a clip.

    keys       — list of Key (or (frame, pose[, interp]) tuples), any order
    joints     — {joint_name: object} to animate (rotation_euler always keyed)
    loc_joints — joint names whose location is also keyed (offset from rest)
    """
    keys = sorted((k if isinstance(k, Key) else Key(*k) for k in keys), key=lambda k: k.frame)
    action = bpy.data.actions.new(name)
    action.use_frame_range = True
    action.frame_start = 0
    action.frame_end = end_frame
    action.use_cyclic = cyclic
    action.use_fake_user = True

    # cyclic padding keys so auto handles are continuous across the loop seam
    pad = []
    if cyclic and len(keys) >= 3:
        pad = [Key(keys[-2].frame - end_frame, keys[-2].pose, keys[-2].interp),
               Key(keys[1].frame + end_frame, keys[1].pose, keys[1].interp)]
    all_keys = sorted(keys + pad, key=lambda k: k.frame)

    for jname, obj in joints.items():
        ad = obj.animation_data or obj.animation_data_create()
        ad.action = action
        rest_loc = tuple(obj["rest_loc"]) if "rest_loc" in obj else tuple(obj.location)
        channels = [("rotation_euler", lambda st: [math.radians(a) for a in st.get("r", (0, 0, 0))])]
        if jname in loc_joints:
            channels.append(("location", lambda st, rl=rest_loc: [rl[i] + st.get("l", (0, 0, 0))[i] for i in range(3)]))
        for path, getter in channels:
            for idx in range(3):
                fc = action.fcurve_ensure_for_datablock(obj, path, index=idx, group_name=jname)
                fc.keyframe_points.add(len(all_keys))
                for kp, k in zip(fc.keyframe_points, all_keys):
                    val = getter(k.pose.get(jname, {}))[idx]
                    kp.co = (k.frame, val)
                    interp, easing = INTERP[k.interp]
                    kp.interpolation = interp
                    kp.easing = easing
                    kp.handle_left_type = "AUTO_CLAMPED"
                    kp.handle_right_type = "AUTO_CLAMPED"
                fc.update()
        slot = ad.action_slot
        ad.action = None
        track = ad.nla_tracks.new()
        track.name = name
        strip = track.strips.new(name, 0, action)
        strip.action_slot = slot
        strip.action_frame_start = 0
        strip.action_frame_end = end_frame
        track.mute = False
    return action


def lerp_pose(a, b, t):
    """Blend two poses (component-wise on 'r' and 'l')."""
    out = {}
    for j in set(a) | set(b):
        sa, sb = a.get(j, {}), b.get(j, {})
        st = {}
        for ch in ("r", "l"):
            va, vb = sa.get(ch, (0, 0, 0)), sb.get(ch, (0, 0, 0))
            st[ch] = tuple(x + (y - x) * t for x, y in zip(va, vb))
        out[j] = st
    return out


def add_pose(a, b):
    """Additive layering: b's channels are added on top of a."""
    out = {j: dict(v) for j, v in a.items()}
    for j, sb in b.items():
        sa = out.setdefault(j, {})
        for ch in ("r", "l"):
            if ch in sb:
                va = sa.get(ch, (0, 0, 0))
                sa[ch] = tuple(x + y for x, y in zip(va, sb[ch]))
    return out
