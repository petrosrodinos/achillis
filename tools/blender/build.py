"""Build every model, validate, and optionally render previews.

Run (any Blender 4.4+/5.x, headless):
    blender -b --factory-startup -P tools/blender/build.py -- [--only humanoid,horse,troll,...] [--preview] [--no-validate]

Each asset is built in its own Blender subprocess so every build starts from a clean scene.
"""
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
MODELS = os.path.join(REPO, "app", "public", "assets", "models")

ASSETS = {   # name: (script, output, extra args)
    "humanoid": ("build_humanoid.py", "humanoid.glb", []),
    "horse": ("build_horse.py", "horse.glb", []),
    "hippogryph": ("build_hippogryph.py", "hippogryph.glb", []),
    "troll": ("build_troll.py", "troll.glb", []),
    "wolf": ("build_beast.py", "wolf.glb", ["--kind", "wolf"]),
    "boar": ("build_beast.py", "boar.glb", ["--kind", "boar"]),
    "bird": ("build_bird.py", "bird.glb", []),
    "haunted-tree": ("build_tree.py", "haunted-tree.glb", []),
    "ship": ("build_ship.py", "ship.glb", []),
    "props": ("build_props.py", "props.glb", []),
}


def blender():
    import bpy
    return bpy.app.binary_path


def run(script, *args):
    cmd = [blender(), "-b", "--factory-startup", "-P", os.path.join(HERE, script), "--", *args]
    print("[build] $", " ".join(cmd))
    res = subprocess.run(cmd)
    if res.returncode != 0:
        raise SystemExit("[build] %s failed (%d)" % (script, res.returncode))


def main():
    args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    only = None
    if "--only" in args:
        only = args[args.index("--only") + 1].split(",")
    built = []
    for name, (script, out, extra) in ASSETS.items():
        if only and name not in only:
            continue
        run(script, os.path.join(MODELS, out), *extra)
        built.append(os.path.join(MODELS, out))
    if "--no-validate" not in args:
        run("validate.py", *built)
    if "--preview" in args:
        run("render_preview.py", "--set", "all")


if __name__ == "__main__":
    main()
