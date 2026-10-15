"""Humanoid animation clips (docs/contracts.md §4.1).

Attack-type clips (†) are 30 frames (1.0 s) with fixed phase keys:
    0 → 10.5 anticipation (eases out into a held wind-up)
    10.5 → 15 swing (accelerates into the hit)
    15 → 18 impact (contact pose, slight follow-through)
    18 → 30 recovery (back to guard)
Mounted clips put the pelvis at the rider origin (= horse `Saddle` node, the seat surface).
"""
import math

from humanoid_rig import ANKLE_Z, HIP_Z, pose
from humanoid_parts import GUARD_ARM_L, SHOOT_ARM_L
from lib.anim import Key

A_ANT, A_SWING, A_IMP, A_END = 10.5, 15.0, 18.0, 30.0

# --------------------------------------------------------------------------------------------
# base stances (kwargs for pose())
# --------------------------------------------------------------------------------------------
GUARD = dict(
    hips=(0.0, 0.0, -0.05), hr=4, spine=3, chest=4, head=-9,
    armL=GUARD_ARM_L, armR=("abs", 8, -62, -58), splayArmR=14,
    legL=("ik", 0.20, ANKLE_Z, 0), legR=("ik", -0.17, ANKLE_Z, 0), splayL=3, splayR=3,
    cape=(6, 4),
)

BLOCK = dict(
    hips=(-0.02, 0.0, -0.11), hr=9, spine=4, chest=8, head=-14,
    armL=("abs", -62, -96, 0), armR=("abs", 28, -55, -105), splayArmR=16,
    legL=("ik", 0.27, ANKLE_Z, 0), legR=("ik", -0.27, ANKLE_Z, 0), splayL=4, splayR=4,
    cape=(10, 6),
)

MOUNT_HIPS = (0.0, 0.0, -HIP_Z + 0.10)   # pelvis 10 cm above the saddle seat
MOUNT_LEGS = dict(legL=("fk", -62, 2, 12), legR=("fk", -62, 2, 12), splayL=24, splayR=24)
MOUNT = dict(
    hips=MOUNT_HIPS, hr=-2, spine=2, chest=3, head=-3,
    armL=GUARD_ARM_L, armR=("abs", 0, -58, -62), splayArmR=14,
    cape=(14, 8), **MOUNT_LEGS,
)


def P(base, **over):
    kw = dict(base)
    kw.update(over)
    return pose(**kw)


def K(frame, base, interp="BEZIER", **over):
    return Key(frame, P(base, **over), interp)


# --------------------------------------------------------------------------------------------
# locomotion
# --------------------------------------------------------------------------------------------

def idle():
    return [K(0, GUARD), K(30, GUARD, hips=(0, 0, -0.065), chest=7, head=-11, cape=(8, 6),
                          armR=("abs", 10, -60, -55), armL=("abs", -23, -98, 0)), K(60, GUARD)]


def walk():
    W = dict(GUARD, hr=6, cape=(10, 6))

    def contact(front, back, f, arm_sw):
        legs = {("leg" + front): ("ik", 0.25, ANKLE_Z + 0.01, -14), ("leg" + back): ("ik", -0.23, ANKLE_Z + 0.03, 22)}
        return K(f, W, hips=(0, 0, -0.065), **legs, armR=("abs", 8 + arm_sw, -62, -58), cape=(12, 8))

    def passing(stance, swing, f, arm_sw):
        legs = {("leg" + stance): ("ik", 0.0, ANKLE_Z, 0), ("leg" + swing): ("ik", 0.03, ANKLE_Z + 0.13, 12)}
        return K(f, W, hips=(0, 0, -0.02), **legs, armR=("abs", 8 + arm_sw, -64, -58), cape=(8, 4))

    return [contact("L", "R", 0, 14), passing("L", "R", 7.5, 0), contact("R", "L", 15, -10),
            passing("R", "L", 22.5, 0), contact("L", "R", 30, 14)]


def run():
    R = dict(GUARD, hr=13, spine=4, chest=8, head=-22, armL=("abs", -40, -110, 0), cape=(38, 18))

    def contact(front, back, f, sw):
        legs = {("leg" + front): ("ik", 0.30, ANKLE_Z + 0.01, -10), ("leg" + back): ("ik", -0.30, ANKLE_Z + 0.32, 55)}
        return K(f, R, hips=(0.02, 0, -0.06), **legs, armR=("abs", 35 * sw, -70 - 20 * sw, -60),
                 armL=("abs", -40 - 18 * sw, -110, 0), cape=(34, 16))

    def flight(back, front, f, sw):
        legs = {("leg" + back): ("ik", -0.40, ANKLE_Z + 0.16, 40), ("leg" + front): ("ik", 0.24, ANKLE_Z + 0.28, -5)}
        return K(f, R, hips=(0.02, 0, 0.0), **legs, armR=("abs", 15 * sw, -75, -60), cape=(44, 22))

    return [contact("L", "R", 0, -1), flight("L", "R", 4.5, -1), contact("R", "L", 9, 1), flight("R", "L", 13.5, 1),
            contact("L", "R", 18, -1)]


AIR = dict(GUARD, hips=(0, 0, 0.0), hr=-2, chest=-4, head=-4,
           legL=("fk", -62, 8, 25), legR=("fk", -18, 52, 50),
           armL=("abs", -70, -120, 0), armR=("abs", -110, -150, -100), cape=(70, 30))


def jump():
    return [
        K(0, GUARD),
        K(3, GUARD, "EASE_IN", hips=(0, 0, -0.22), hr=18, chest=10, head=-24,
          legL=("ik", 0.18, ANKLE_Z, 0), legR=("ik", -0.15, ANKLE_Z, 0), armR=("abs", 45, -40, -40),
          armL=("abs", 20, -80, 0), cape=(4, 2)),
        K(6, GUARD, "EASE_OUT", hips=(0, 0, 0.05), hr=-4, chest=-4, head=-2,
          legL=("fk", -8, 8, 45), legR=("fk", 14, 22, 50), armR=("abs", -140, -165, -110),
          armL=("abs", -90, -140, 0), cape=(30, 10)),
        K(12, AIR),
    ]


def fall():
    a = dict(AIR, legL=("fk", -45, 0, 25), legR=("fk", -5, 35, 45), armR=("abs", -120, -150, -95),
             armL=("abs", -80, -130, 0), cape=(95, 40))
    b = dict(a, legL=("fk", -40, 8, 25), legR=("fk", 0, 40, 45), armR=("abs", -130, -160, -100),
             armL=("abs", -88, -136, 0), cape=(105, 55))
    return [K(0, a), K(7.5, b), K(15, a)]


def land():
    return [
        K(0, AIR, "EASE_IN", legL=("fk", -30, -10, 20), legR=("fk", -5, 10, 25)),
        K(2.5, GUARD, "EASE_OUT", hips=(0, 0, -0.26), hr=20, chest=12, head=-28,
          legL=("ik", 0.20, ANKLE_Z, 0), legR=("ik", -0.16, ANKLE_Z, 0), armR=("abs", 20, -35, -20),
          armL=("abs", -10, -80, 0), cape=(-10, -6)),
        K(8, GUARD),
    ]


def dodge():
    tuck = dict(spine=30, chest=35, head=30, legL=("rel", -125, 135, 20), legR=("rel", -115, 125, 20),
                armL=("rel", -50, -70, 0), armR=("rel", -45, -95, 10), cape_world=False)
    # final key = guard pose with the pelvis one full turn further (same orientation, continuous roll)
    end = P(GUARD)
    hx, hy, hz = end["J_Hips"]["r"]
    end["J_Hips"]["r"] = (hx, hy + 360.0, hz)
    return [
        K(0, GUARD),
        K(2, GUARD, "LINEAR", hips=(0.04, 0, -0.26), hr=40, spine=15, chest=20, head=10,
          legL=("ik", 0.25, ANKLE_Z, 10), legR=("ik", -0.15, ANKLE_Z + 0.05, 40), armR=("abs", -40, -110, -40),
          cape=(20, 10), cape_world=False),
        K(5, dict(GUARD, **tuck), "LINEAR", hips=(0.0, 0, -0.22), hr=140, cape=(-30, -20)),
        K(8, dict(GUARD, **tuck), "LINEAR", hips=(0.0, 0, -0.28), hr=240, cape=(-40, -20)),
        K(11, dict(GUARD, **dict(tuck, legL=("rel", -100, 110, 10), legR=("rel", -80, 100, 10))), "EASE_OUT",
          hips=(0.0, 0, -0.24), hr=330, cape=(-10, 0)),
        Key(15, end),
    ]


# --------------------------------------------------------------------------------------------
# defence
# --------------------------------------------------------------------------------------------

def block_raise():
    return [K(0, GUARD, "EASE_OUT"), K(5, BLOCK)]


def block_hold():
    return [K(0, BLOCK), K(15, BLOCK, hips=(-0.02, 0, -0.125), chest=10, armL=("abs", -64, -97, 0)), K(30, BLOCK)]


# --------------------------------------------------------------------------------------------
# attacks (†)
# --------------------------------------------------------------------------------------------

def attack(windup, impact, follow, hold_frac=0.85):
    """Standard 4-phase attack: guard → wind-up (held) → swing → impact → recovery."""
    near = dict(windup)
    keys = [
        K(0, GUARD, "EASE_OUT"),
        K(A_ANT * hold_frac, near, "BEZIER"),
        K(A_ANT, windup, "EASE_IN"),
        K(A_SWING, impact, "EASE_OUT"),
        K(A_IMP, follow, "BEZIER"),
        K(A_END, GUARD),
    ]
    return keys


def attack_light():
    wind = dict(GUARD, hips=(-0.04, 0, -0.07), hr=-5, spine=-4, chest=-8, twist=-28, head=6,
                armR=("abs", -158, -228, -205), armL=("abs", -10, -105, 0), splayArmR=20,
                legL=("ik", 0.22, ANKLE_Z, 0), legR=("ik", -0.24, ANKLE_Z, 0), cape=(14, 8))
    wind_in = dict(wind, armR=("abs", -150, -218, -195), twist=-24)
    imp = dict(GUARD, hips=(0.10, 0, -0.13), hr=16, spine=6, chest=12, twist=24, head=-26,
               armR=("abs", -88, -96, 18), armL=("abs", 5, -70, 0), splayArmR=10,
               legL=("ik", 0.42, ANKLE_Z, 0), legR=("ik", -0.22, ANKLE_Z + 0.03, 28), cape=(26, 14))
    fol = dict(imp, armR=("abs", -70, -74, 36), hips=(0.11, 0, -0.14), chest=14, twist=28)
    keys = attack(wind, imp, fol)
    keys[1] = K(A_ANT * 0.8, wind_in, "BEZIER")
    return keys


def attack_heavy():
    wind = dict(GUARD, hips=(-0.07, 0, -0.01), hr=-12, spine=-7, chest=-10, twist=-10, head=16,
                armR=("abs", -200, -238, -245), armL=("abs", -80, -104, 0), splayArmL=8, splayArmR=8,
                legL=("ik", 0.24, ANKLE_Z + 0.02, -8), legR=("ik", -0.26, ANKLE_Z, 0), cape=(18, 10))
    wind_in = dict(wind, armR=("abs", -190, -228, -232), armL=("abs", -72, -102, 0), hr=-9)
    imp = dict(GUARD, hips=(0.14, 0, -0.24), hr=30, spine=10, chest=16, twist=10, head=-42,
               armR=("abs", -70, -76, 30), armL=("abs", -35, -95, 0), splayArmL=8, splayArmR=6,
               legL=("ik", 0.50, ANKLE_Z, 0), legR=("ik", -0.30, ANKLE_Z + 0.03, 30), cape=(34, 20))
    fol = dict(imp, armR=("abs", -60, -62, 44), hips=(0.15, 0, -0.26), chest=18)
    keys = attack(wind, imp, fol)
    keys[1] = K(A_ANT * 0.75, wind_in, "BEZIER")
    return keys


def cast():
    wind = dict(GUARD, hips=(-0.03, 0, -0.10), hr=-6, chest=-10, head=4, twist=-14,
                armR=("abs", 45, -40, -115), armL=("abs", -25, -150, 0),
                legL=("ik", 0.22, ANKLE_Z, 0), legR=("ik", -0.24, ANKLE_Z, 0), cape=(10, 6))
    imp = dict(GUARD, hips=(0.08, 0, -0.10), hr=12, chest=10, twist=16, head=-20,
               armR=("abs", -105, -112, -78), armL=("abs", -92, -96, 0),
               legL=("ik", 0.36, ANKLE_Z, 0), legR=("ik", -0.24, ANKLE_Z + 0.02, 20), cape=(28, 16))
    fol = dict(imp, armR=("abs", -100, -108, -72), hips=(0.09, 0, -0.11))
    return attack(wind, imp, fol)


def shoot():
    draw = dict(GUARD, hips=(0, 0, -0.06), hr=2, chest=-2, twist=-6, head=-4,
                armL=SHOOT_ARM_L, armR=("abs", 86, -86, -45), splayArmR=4, splayArmL=4,
                legL=("ik", 0.24, ANKLE_Z, 0), legR=("ik", -0.22, ANKLE_Z, 0), cape=(8, 5))
    aim = dict(draw, armR=("abs", 80, -90, -45))
    rel = dict(draw, armR=("abs", 112, 30, 20), armL=("abs", -92, -94, 0), chest=-4, twist=-8, cape=(12, 8))
    fol = dict(rel, armR=("abs", 108, 45, 30))
    keys = [K(0, GUARD, "EASE_OUT"), K(7, aim, "BEZIER"), K(A_ANT, draw, "EASE_IN"), K(A_SWING, rel, "EASE_OUT"),
            K(A_IMP, fol, "BEZIER"), K(A_END, GUARD)]
    return keys


def throw():
    wind = dict(GUARD, hips=(-0.06, 0, -0.06), hr=-12, spine=-6, chest=-10, twist=-30, head=12,
                armR=("abs", 98, 96, -12), armL=("abs", -105, -100, 0), splayArmR=18,
                legL=("ik", 0.30, ANKLE_Z, 0), legR=("ik", -0.30, ANKLE_Z, 0), cape=(12, 6))
    imp = dict(GUARD, hips=(0.10, 0, -0.10), hr=18, spine=6, chest=15, twist=26, head=-28,
               armR=("abs", -122, -112, -22), armL=("abs", 20, -40, 0), splayArmR=12,
               legL=("ik", 0.42, ANKLE_Z, 0), legR=("ik", -0.26, ANKLE_Z + 0.04, 35), cape=(28, 16))
    fol = dict(imp, armR=("abs", -78, -70, 12), chest=18)
    return attack(wind, imp, fol)


# --------------------------------------------------------------------------------------------
# reactions
# --------------------------------------------------------------------------------------------

def hit():
    rec = dict(GUARD, hips=(-0.06, 0, -0.07), hr=-12, chest=-14, head=-18, twist=-8,
               armR=("abs", 32, -18, -40), armL=("abs", -5, -70, 0), cape=(-4, -2))
    return [K(0, GUARD, "EASE_OUT"), K(3, rec, "BEZIER"), K(12, GUARD)]


def stagger():
    rec = dict(GUARD, hips=(-0.10, 0, -0.08), hr=-20, chest=-18, head=-22, twist=-10,
               armR=("abs", 55, 10, -30), armL=("abs", 30, -30, 0), cape=(-6, -4))
    step = dict(rec, hips=(-0.18, 0, -0.04), hr=-12, legL=("ik", 0.05, ANKLE_Z + 0.12, 10),
                legR=("ik", -0.45, ANKLE_Z + 0.02, -10), armR=("abs", 70, 30, -20), armL=("abs", 45, -10, 0), cape=(2, 0))
    catch = dict(GUARD, hips=(-0.14, 0, -0.16), hr=12, chest=10, head=-20,
                 legL=("ik", 0.12, ANKLE_Z, 0), legR=("ik", -0.42, ANKLE_Z, 0), armR=("abs", 20, -40, -20),
                 armL=("abs", -20, -80, 0), cape=(20, 10))
    return [K(0, GUARD, "EASE_OUT"), K(4, rec), K(10, step), K(16, catch), K(24, GUARD)]


def stunned():
    base = dict(GUARD, hips=(0, 0, -0.08), hr=6, spine=6, chest=12, head=10,
                armR=("abs", 6, -14, 15), armL=("abs", -6, -45, 0), splayArmR=10, splayArmL=10,
                legL=("ik", 0.14, ANKLE_Z, 0), legR=("ik", -0.12, ANKLE_Z, 0), cape=(2, 2))
    return [K(0, base, headx=10, head=14, hips=(0.02, 0, -0.08)),
            K(7.5, base, headx=0, head=22, hips=(0.0, 0, -0.09), chest_x=3),
            K(15, base, headx=-10, head=14, hips=(-0.02, 0, -0.08)),
            K(22.5, base, headx=0, head=6, hips=(0.0, 0, -0.07), chest_x=-3),
            K(30, base, headx=10, head=14, hips=(0.02, 0, -0.08))]


def death():
    rec = dict(GUARD, hips=(-0.06, 0, -0.08), hr=-16, chest=-16, head=-24, twist=-10,
               armR=("abs", 45, 0, -30), armL=("abs", 25, -40, 0))
    buckle = dict(GUARD, hips=(-0.12, 0, -0.34), hr=-14, chest=-10, head=-12,
                  legL=("ik", 0.10, ANKLE_Z, 0), legR=("ik", -0.08, ANKLE_Z, 0),
                  armR=("abs", 30, -10, 10), armL=("abs", 10, -50, 0), cape=(-10, -5))
    falling = dict(GUARD, hips=(-0.30, 0, -0.62), hr=-62, spine=-6, chest=-6, head=-14,
                   legL=("rel", -40, 30, 10), legR=("rel", -15, 10, 10),
                   armR=("abs", -175, -190, -150), armL=("abs", -140, -170, 0), cape=(-50, -30))
    lying = dict(GUARD, hips=(-0.40, 0, -HIP_Z + 0.20), hr=-90, spine=0, chest=0, head=-6, twist=0,
                 legL=("rel", 6, -4, 10), legR=("rel", -4, 2, 10), splayL=7, splayR=5,
                 armR=("abs", 75, 70, 150), armL=("abs", 62, 60, 0), splayArmR=24, splayArmL=20, cape=(-90, 0))
    bounce = dict(lying, hips=(-0.40, 0, -HIP_Z + 0.25), hr=-84, head=4, armR=("abs", 60, 50, 120))
    return [K(0, GUARD, "EASE_OUT"), K(4, rec), K(11, buckle, "EASE_IN"), K(20, falling, "EASE_IN"),
            K(26, lying, "EASE_OUT"), K(30, bounce, "EASE_IN"), K(36, lying)]


def victory():
    v = dict(GUARD, hips=(0, 0, -0.03), hr=0, spine=-3, chest=-6, head=-8,
             armR=("abs", -172, -176, -100), armL=("abs", -10, -60, 0), splayArmR=18, splayArmL=14,
             legL=("ik", 0.18, ANKLE_Z, 0), legR=("ik", -0.18, ANKLE_Z, 0), cape=(10, 6))
    v2 = dict(v, hips=(0, 0, -0.05), armR=("abs", -165, -170, -94), chest=-3, head=-4, cape=(14, 9))
    return [K(0, v), K(30, v2), K(60, v)]


# --------------------------------------------------------------------------------------------
# mounted
# --------------------------------------------------------------------------------------------

def m_idle():
    return [K(0, MOUNT), K(30, MOUNT, hips=(0, 0, MOUNT_HIPS[2] - 0.01), chest=5, head=-5,
                          armR=("abs", 2, -56, -60)), K(60, MOUNT)]


def m_ride():
    R = dict(MOUNT, hr=6, spine=4, chest=8, head=-18, armR=("abs", -25, -85, -55), cape=(36, 18))
    low = dict(R, hips=(0.0, 0, MOUNT_HIPS[2] - 0.01), legL=("fk", -60, 6, 15), legR=("fk", -60, 6, 15), cape=(30, 14))
    high = dict(R, hips=(0.0, 0, MOUNT_HIPS[2] + 0.05), hr=2, chest=6, head=-14, legL=("fk", -66, -4, 8),
                legR=("fk", -66, -4, 8), armR=("abs", -32, -92, -58), armL=("abs", -30, -104, 0), cape=(42, 24))
    return [K(0, low), K(9, high), K(18, low)]


def m_attack_light():
    wind = dict(MOUNT, hr=-6, chest=-10, twist=-28, head=8, armR=("abs", -160, -228, -205), splayArmR=20,
                armL=("abs", -12, -105, 0), cape=(18, 10))
    imp = dict(MOUNT, hr=12, spine=6, chest=14, twist=24, head=-28, armR=("abs", -62, -68, 58), splayArmR=12,
               armL=("abs", 5, -70, 0), cape=(30, 16))
    fol = dict(imp, armR=("abs", -48, -52, 72), chest=16)
    k = attack(wind, imp, fol)
    k[0] = K(0, MOUNT, "EASE_OUT")
    k[-1] = K(A_END, MOUNT)
    return k


def m_attack_heavy():
    stand = dict(MOUNT_LEGS, legL=("fk", -40, 8, 15), legR=("fk", -40, 8, 15))
    wind = dict(MOUNT, **stand)
    wind.update(hips=(-0.03, 0, MOUNT_HIPS[2] + 0.16), hr=-12, spine=-6, chest=-10, head=16,
                armR=("abs", -200, -238, -245), armL=("abs", -80, -104, 0), cape=(24, 14))
    imp = dict(MOUNT, hips=(0.08, 0, MOUNT_HIPS[2] + 0.02), hr=24, spine=10, chest=18, head=-46,
               armR=("abs", -52, -56, 72), armL=("abs", -50, -85, 0), cape=(36, 20))
    fol = dict(imp, armR=("abs", -40, -42, 86))
    k = attack(wind, imp, fol)
    k[0] = K(0, MOUNT, "EASE_OUT")
    k[-1] = K(A_END, MOUNT)
    return k


def m_block():
    b = dict(MOUNT, hr=4, chest=8, head=-12, armL=("abs", -62, -96, 0), armR=("abs", 28, -55, -105), cape=(16, 10))
    return [K(0, b), K(15, b, chest=10, armL=("abs", -64, -97, 0)), K(30, b)]


def m_hit():
    rec = dict(MOUNT, hr=-14, chest=-14, head=-18, twist=-8, armR=("abs", 32, -18, -40), armL=("abs", -5, -70, 0))
    return [K(0, MOUNT, "EASE_OUT"), K(3, rec), K(12, MOUNT)]


def fly_ride():
    F = dict(MOUNT, hr=26, spine=10, chest=14, head=-48,
             legL=("fk", -78, 40, 60), legR=("fk", -78, 40, 60), splayL=26, splayR=26,
             armR=("abs", -55, -85, -30), armL=("abs", -50, -92, 0), cape=(78, 20))
    up = dict(F, hips=(0, 0, MOUNT_HIPS[2] + 0.04), chest=12, cape=(70, 30))
    return [K(0, F), K(12, up), K(24, F)]


# name: (seconds, builder, cyclic, baked_frames)
CLIPS = [
    ("Idle", 2.0, idle, True),
    ("Walk", 1.0, walk, True),
    ("Run", 0.6, run, True),
    ("Jump", 0.4, jump, False),
    ("Fall", 0.5, fall, True),
    ("Land", 0.25, land, False),
    ("Dodge", 0.5, dodge, False),
    ("BlockRaise", 0.15, block_raise, False),
    ("BlockHold", 1.0, block_hold, True),
    ("AttackLight", 1.0, attack_light, False),
    ("AttackHeavy", 1.0, attack_heavy, False),
    ("Cast", 1.0, cast, False),
    ("Shoot", 1.0, shoot, False),
    ("Throw", 1.0, throw, False),
    ("Hit", 0.4, hit, False),
    ("Stagger", 0.8, stagger, False),
    ("Stunned", 1.0, stunned, True),
    ("Death", 1.2, death, False),
    ("Victory", 2.0, victory, True),
    ("MountedIdle", 2.0, m_idle, True),
    ("MountedRide", 0.6, m_ride, True),
    ("MountedAttackLight", 1.0, m_attack_light, False),
    ("MountedAttackHeavy", 1.0, m_attack_heavy, False),
    ("MountedBlock", 1.0, m_block, True),
    ("MountedHit", 0.4, m_hit, False),
    ("FlyRide", 0.8, fly_ride, True),
]


def baked_frames(seconds):
    return int(math.ceil(seconds * 30 - 1e-6))


def preview_frames(name):
    """Representative frames for previews (phase boundaries for attacks)."""
    secs = dict((c[0], c[1]) for c in CLIPS)[name]
    end = baked_frames(secs)
    if name in ("AttackLight", "AttackHeavy", "Cast", "Shoot", "Throw", "MountedAttackLight", "MountedAttackHeavy"):
        return [0, 10.5, 13, 15, 18, 30]
    if name == "Death":
        return [0, 11, 20, 26, 36]
    if name == "Dodge":
        return [0, 2, 5, 8, 11, 15]
    if name in ("Walk", "Run"):
        return [0, end / 4, end / 2, 3 * end / 4]
    return sorted(set([0, end / 2, end]))
